/** Decorative cargo/passenger ship illustration for landing hero */
export default function ShipIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Ship</title>
      {/* Soft glow */}
      <ellipse cx="240" cy="300" rx="180" ry="40" fill="white" fillOpacity="0.08" />

      {/* Water / waves */}
      <path
        d="M20 320 C80 300, 120 340, 180 320 C240 300, 280 340, 340 320 C400 300, 440 330, 470 315 L470 400 L20 400 Z"
        fill="white"
        fillOpacity="0.12"
      />
      <path
        d="M30 345 C90 328, 130 360, 190 345 C250 330, 290 365, 350 348 C410 330, 450 355, 470 345 L470 410 L30 410 Z"
        fill="white"
        fillOpacity="0.1"
      />
      <path
        d="M40 370 C100 358, 140 385, 200 372 C260 360, 300 390, 360 375 C420 360, 450 380, 470 372 L470 420 L40 420 Z"
        fill="white"
        fillOpacity="0.08"
      />

      {/* Hull */}
      <path
        d="M70 250 L100 195 H390 L420 250 C410 275, 380 290, 240 290 C100 290, 80 275, 70 250 Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Hull stripe */}
      <path
        d="M78 250 H412 C405 268, 380 278, 240 278 C100 278, 85 268, 78 250 Z"
        fill="#006A4E"
        fillOpacity="0.85"
      />
      {/* Hull bottom edge */}
      <path
        d="M85 268 C100 282, 140 288, 240 288 C340 288, 390 282, 405 268"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* Superstructure base */}
      <rect x="150" y="145" width="200" height="50" rx="6" fill="white" fillOpacity="0.95" />
      {/* Bridge */}
      <rect x="200" y="100" width="100" height="50" rx="5" fill="white" fillOpacity="0.95" />
      {/* Bridge top */}
      <rect x="220" y="78" width="60" height="28" rx="4" fill="white" fillOpacity="0.9" />

      {/* Funnel */}
      <rect x="300" y="55" width="28" height="90" rx="4" fill="white" fillOpacity="0.95" />
      <rect x="300" y="55" width="28" height="18" rx="3" fill="#C4A35A" />
      {/* Smoke */}
      <circle cx="318" cy="40" r="10" fill="white" fillOpacity="0.25" />
      <circle cx="332" cy="28" r="14" fill="white" fillOpacity="0.18" />
      <circle cx="348" cy="18" r="12" fill="white" fillOpacity="0.12" />

      {/* Mast */}
      <rect x="175" y="70" width="5" height="75" fill="white" fillOpacity="0.85" />
      <path d="M180 75 L230 95 L180 95 Z" fill="white" fillOpacity="0.35" />

      {/* Windows - bridge */}
      <rect x="210" y="112" width="18" height="14" rx="2" fill="#004D38" fillOpacity="0.55" />
      <rect x="235" y="112" width="18" height="14" rx="2" fill="#004D38" fillOpacity="0.55" />
      <rect x="260" y="112" width="18" height="14" rx="2" fill="#004D38" fillOpacity="0.55" />

      {/* Windows - deck */}
      <rect x="170" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="195" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="220" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="245" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="270" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="295" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />
      <rect x="320" y="160" width="16" height="12" rx="2" fill="#004D38" fillOpacity="0.45" />

      {/* Anchor icon on bow */}
      <circle cx="115" cy="220" r="12" stroke="#004D38" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <path
        d="M115 210 V228 M108 220 H122 M109 228 Q115 235 121 228"
        stroke="#004D38"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Life rings */}
      <circle cx="360" cy="210" r="9" stroke="#F42A41" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="360" cy="210" r="4" fill="white" fillOpacity="0.5" />

      {/* Waterline sparkle */}
      <path d="M130 300 Q160 292 190 300" stroke="white" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      <path d="M250 305 Q290 295 330 305" stroke="white" strokeOpacity="0.3" strokeWidth="2" fill="none" />
    </svg>
  );
}
