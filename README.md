# 🐢 TerpMind

> A mental wellness companion built for UMD students.

TerpMind meets students where they are — through a daily journal, mood tracker, and personalized wellness actions — powered by Gemini AI. A built-in safety layer surfaces UMD crisis resources the moment a student might need them.

---

## Features

| Feature | Description |
|---|---|
| **Daily Journal** | Write freely. Gemini reflects it back with empathy, identifies emotional themes, and offers a gentle insight. |
| **Mood Tracker** | Log your mood (1–10) daily. See your emotional map as a chart and get AI-powered trend analysis. |
| **Wellness Actions** | 3 personalized micro-interventions (breathing, movement, grounding) matched to your current mood + journal themes. |
| **Crisis Safety Layer** | Instant access to UMD Counseling Center, Campus Police, Crisis Text Line, and 988. Always one tap away. |

---

## Tech Stack

- **Frontend**: React 19 + Vite + Recharts + Lucide icons
- **Backend**: Python FastAPI + Google Gemini 1.5 Flash
- **Storage**: localStorage (no database needed for demo)

---

## Setup

### 1. Backend

```powershell
cd backend

# Copy env file and add your Gemini API key
Copy-Item .env.example .env
# Edit .env: set GEMINI_API_KEY=your_key_here

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## UMD Crisis Resources

| Resource | Contact |
|---|---|
| UMD Counseling Center | (301) 314-7651 |
| UMD Campus Police | (301) 405-3333 |
| Crisis Text Line | Text HOME to 741741 |
| 988 Suicide & Crisis Lifeline | Call or text 988 |

---

*Built with ❤️ at a UMD hackathon. Fear the Turtle. 🐢*
