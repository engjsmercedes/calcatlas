export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="logo-gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#logo-gradient)" />
      <path
        d="M20 22.5h24.5c0 4.9-3.7 8.1-9.6 8.1H28v4.9h10.6c6.5 0 10.5 3.1 10.5 8.8H20v-5.1h17.1c3.2 0 5-1.2 5-3.4S40.3 32.4 37 32.4H20V22.5Z"
        fill="#f8fafc"
      />
    </svg>
  );
}
