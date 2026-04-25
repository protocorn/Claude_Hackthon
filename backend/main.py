from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import json
import re
import traceback
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TerpMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not set. Copy .env.example to .env and add your key.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")


def extract_json(text: str) -> dict:
    """Robustly extract JSON from model output, handling markdown fences."""
    text = text.strip()
    # Strip ```json ... ``` or ``` ... ``` fences
    text = re.sub(r"^```(?:json)?\s*\n?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\n?```\s*$", "", text)
    # Find first { ... } block if extra prose leaked in
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        text = match.group(0)
    return json.loads(text)


def call_model(prompt: str) -> dict:
    response = model.generate_content(prompt)
    raw = response.text
    print("=== RAW MODEL RESPONSE ===")
    print(raw[:500])
    print("==========================")
    return extract_json(raw)


# ── Request Models ────────────────────────────────────────────────────────────

class JournalRequest(BaseModel):
    entry: str
    past_themes: List[str] = []


class MoodEntry(BaseModel):
    date: str
    score: int
    note: Optional[str] = ""


class MoodAnalysisRequest(BaseModel):
    history: List[MoodEntry]


class WellnessRequest(BaseModel):
    mood_score: int
    themes: List[str] = []
    recent_note: Optional[str] = ""


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "TerpMind"}


@app.post("/api/journal")
async def analyze_journal(request: JournalRequest):
    past_context = (
        f"Emotional themes from past entries: {', '.join(request.past_themes)}"
        if request.past_themes
        else "This is their first journal entry."
    )

    prompt = f"""You are TerpMind, a warm and caring mental wellness companion for UMD students.
A student just wrote a journal entry. You are their trusted friend who genuinely listens — not a therapist, not a clinical tool.

Journal entry:
\"\"\"{request.entry}\"\"\"

{past_context}

Your job:
1. Write a reflection that feels like a real friend texting back — warm, specific, NOT generic. Reference what they actually wrote.
2. Identify 2-3 emotional themes as short, human phrases (e.g. "feeling overwhelmed", "missing connection", "exam pressure", "self-doubt") — NEVER use clinical terms like "suicidal ideation", "emotional distress", or "depression". Use everyday language.
3. Write one gentle insight — a small reframe or observation that feels supportive, not preachy.

Return ONLY a valid JSON object with NO extra text or markdown:
{{
  "reflection": "2-3 warm, conversational sentences. Sound like a caring friend, not a wellness app. Be specific to what they wrote.",
  "themes": ["feeling overwhelmed", "missing home", "exam pressure"],
  "insight": "One gentle, human observation. Start with 'I noticed...' or 'It sounds like...' or 'Sometimes when we...'",
  "crisis": false,
  "crisis_reason": ""
}}

Set "crisis" to true ONLY if the entry clearly expresses intent to harm themselves or end their life. In that case still respond warmly in the reflection — just flag it.
NEVER use clinical or diagnostic language anywhere in your response."""

    try:
        result = call_model(prompt)
        result.setdefault("crisis", False)
        result.setdefault("themes", [])
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@app.post("/api/mood/analyze")
async def analyze_mood(request: MoodAnalysisRequest):
    if not request.history:
        return {
            "trend": "no_data",
            "insight": "Start tracking your mood daily — patterns usually emerge after 3-5 entries.",
            "pattern": "",
        }

    history_lines = "\n".join(
        f"- {item.date}: {item.score}/10{f' — {item.note}' if item.note else ''}"
        for item in request.history
    )

    prompt = f"""You are TerpMind analyzing a UMD student's mood history.
Mood scale: 1 = very low, 10 = excellent.

History:
{history_lines}

Return ONLY a valid JSON object with NO extra text or markdown:
{{
  "trend": "improving",
  "insight": "2 specific sentences about their pattern. Mention actual scores or notes.",
  "pattern": "One sentence about a time-based pattern, or empty string if data is too sparse."
}}

The "trend" field must be exactly one of: improving, declining, stable, mixed."""

    try:
        return call_model(prompt)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@app.post("/api/wellness")
async def get_wellness_actions(request: WellnessRequest):
    score = request.mood_score
    themes_str = ", ".join(request.themes) if request.themes else "general stress"

    if score <= 3:
        focus = "calming grounding and breathing techniques"
    elif score <= 6:
        focus = "light movement, social connection, or academic support"
    else:
        focus = "energy-channeling activities and social engagement"

    prompt = f"""You are TerpMind recommending wellness micro-interventions for a UMD student.

Current mood: {score}/10
Emotional themes: {themes_str}
Recent note: {request.recent_note or "none"}
Recommended focus: {focus}

Return ONLY a valid JSON object with NO extra text or markdown:
{{
  "actions": [
    {{
      "title": "Short title (max 5 words)",
      "duration": "X minutes",
      "category": "breathing",
      "emoji": "🌬️",
      "description": "One sentence — why this helps for their specific situation.",
      "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }},
    {{
      "title": "Short title (max 5 words)",
      "duration": "X minutes",
      "category": "movement",
      "emoji": "🚶",
      "description": "One sentence — why this helps.",
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }},
    {{
      "title": "Short title (max 5 words)",
      "duration": "X minutes",
      "category": "grounding",
      "emoji": "🌿",
      "description": "One sentence — why this helps.",
      "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }}
  ]
}}

Category must be one of: breathing, movement, grounding, social, academic.
Reference UMD campus locations where natural (McKeldin Mall, The Stamp, etc.)."""

    try:
        return call_model(prompt)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
