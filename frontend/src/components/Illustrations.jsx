export function JournalIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book body */}
      <rect x="20" y="18" width="70" height="84" rx="8" fill="#EDE9FE" />
      <rect x="20" y="18" width="12" height="84" rx="4" fill="#C4B5FD" />
      {/* Spine shadow */}
      <rect x="30" y="18" width="3" height="84" fill="#A78BFA" opacity="0.4" />
      {/* Lines */}
      <rect x="42" y="38" width="36" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="42" y="48" width="30" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="42" y="58" width="34" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="42" y="68" width="24" height="3" rx="1.5" fill="#A78BFA" />
      {/* Heart */}
      <path d="M75 30 C75 27.5 73 25 70.5 25 C69 25 67.8 25.8 67 27 C66.2 25.8 65 25 63.5 25 C61 25 59 27.5 59 30 C59 35 67 40 67 40 C67 40 75 35 75 30Z" fill="#7C3AED" opacity="0.8" />
      {/* Quill */}
      <path d="M80 22 Q95 10 100 8 Q90 20 85 38" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M85 38 L80 22" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function MoodIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart bars */}
      <rect x="15" y="75" width="14" height="25" rx="4" fill="#C4B5FD" />
      <rect x="35" y="60" width="14" height="40" rx="4" fill="#A78BFA" />
      <rect x="55" y="45" width="14" height="55" rx="4" fill="#7C3AED" />
      <rect x="75" y="30" width="14" height="70" rx="4" fill="#5B21B6" />
      <rect x="95" y="20" width="14" height="80" rx="4" fill="#4C1D95" />
      {/* Trend line */}
      <polyline points="22,73 42,58 62,43 82,28 102,18" stroke="#2DD4BF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dots on line */}
      <circle cx="22" cy="73" r="3.5" fill="#0D9488" />
      <circle cx="42" cy="58" r="3.5" fill="#0D9488" />
      <circle cx="62" cy="43" r="3.5" fill="#0D9488" />
      <circle cx="82" cy="28" r="3.5" fill="#0D9488" />
      <circle cx="102" cy="18" r="3.5" fill="#0D9488" />
      {/* Baseline */}
      <rect x="10" y="100" width="100" height="2.5" rx="1.25" fill="#E5E7EB" />
    </svg>
  )
}

export function WellnessIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Person meditating */}
      <circle cx="60" cy="28" r="14" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      <circle cx="60" cy="25" r="7" fill="#C4B5FD" />
      {/* Body */}
      <path d="M40 70 Q40 55 60 52 Q80 55 80 70" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      {/* Crossed legs */}
      <path d="M40 70 Q35 80 30 85" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 70 Q85 80 90 85" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 85 Q45 82 60 83 Q75 82 90 85" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms */}
      <path d="M42 60 Q30 65 28 72" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 60 Q90 65 92 72" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      {/* Sparkles */}
      <circle cx="20" cy="30" r="3" fill="#FFD520" />
      <circle cx="100" cy="25" r="2.5" fill="#2DD4BF" />
      <circle cx="15" cy="55" r="2" fill="#7C3AED" />
      <circle cx="105" cy="50" r="2" fill="#FFD520" />
      {/* Small stars */}
      <path d="M95 38 L96.5 34 L98 38 L102 39.5 L98 41 L96.5 45 L95 41 L91 39.5Z" fill="#2DD4BF" opacity="0.8" />
      <path d="M18 40 L19 37 L20 40 L23 41 L20 42 L19 45 L18 42 L15 41Z" fill="#FFD520" opacity="0.8" />
    </svg>
  )
}

export function HomeIllustration({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Moon */}
      <path d="M105 35 Q95 45 95 58 Q95 75 108 83 Q85 83 75 68 Q65 53 75 38 Q82 27 95 27 Q102 27 105 35Z" fill="rgba(255,255,255,0.25)" />
      {/* Stars */}
      <circle cx="30" cy="25" r="2.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="55" cy="15" r="1.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="115" cy="20" r="2" fill="rgba(255,255,255,0.6)" />
      <circle cx="20" cy="55" r="1.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="125" cy="50" r="2.5" fill="rgba(255,255,255,0.5)" />
      {/* Turtle shell */}
      <ellipse cx="70" cy="90" rx="32" ry="24" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <ellipse cx="70" cy="90" rx="20" ry="14" fill="rgba(255,255,255,0.15)" />
      {/* Shell pattern */}
      <ellipse cx="70" cy="82" rx="7" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <ellipse cx="58" cy="90" rx="6" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <ellipse cx="82" cy="90" rx="6" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <ellipse cx="70" cy="98" rx="7" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Head */}
      <circle cx="100" cy="78" r="10" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <circle cx="103" cy="75" r="2" fill="rgba(255,255,255,0.6)" />
      <path d="M97 81 Q100 84 103 81" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <ellipse cx="45" cy="100" rx="8" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" transform="rotate(-20 45 100)" />
      <ellipse cx="52" cy="112" rx="8" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" transform="rotate(10 52 112)" />
      <ellipse cx="88" cy="112" rx="8" ry="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" transform="rotate(-10 88 112)" />
    </svg>
  )
}
