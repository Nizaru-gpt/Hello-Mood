export default function Mascot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect x="2" y="6" rx="14" width="60" height="52" fill="url(#g)" />
      <circle cx="24" cy="28" r="5" fill="#fff"/><circle cx="40" cy="28" r="5" fill="#fff"/>
      <circle cx="24" cy="28" r="2.2"/><circle cx="40" cy="28" r="2.2"/>
      <path d="M20 42q12 8 24 0" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M10 12q3 2 6 0M48 12q3 2 6 0" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}
