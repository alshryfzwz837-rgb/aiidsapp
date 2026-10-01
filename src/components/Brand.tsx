import { useLang } from '@/lib/i18n'

/** Custom AI-IDS shield: neural-network "brain" circuitry inside a cyan shield */
export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="AI-IDS shield logo">
      <defs>
        <linearGradient id="lg-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00D9FF" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <filter id="lg-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M32 3 L56 12 V30 C56 45 45.5 55.5 32 61 C18.5 55.5 8 45 8 30 V12 Z"
        fill="rgba(6,182,212,0.08)"
        stroke="url(#lg-shield)"
        strokeWidth="2.6"
        filter="url(#lg-glow)"
      />
      <path d="M32 9 L50 16 V30 C50 41.5 42.5 49.8 32 54.5" fill="none" stroke="rgba(0,217,255,0.25)" strokeWidth="1" />
      <g stroke="url(#lg-shield)" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M32 18 V46" />
        <path d="M32 22 C26 18 19 22 20 29 C16 32 18 39 24 39 C25 44 30 45 32 43" />
        <path d="M32 22 C38 18 45 22 44 29 C48 32 46 39 40 39 C39 44 34 45 32 43" />
        <path d="M24 29 H28 L30 32" />
        <path d="M40 29 H36 L34 32" />
        <path d="M24 35 H29" />
        <path d="M40 35 H35" />
      </g>
      <g fill="#00E676">
        <circle cx="24" cy="29" r="1.8" />
        <circle cx="40" cy="29" r="1.8" />
        <circle cx="24" cy="35" r="1.5" />
        <circle cx="40" cy="35" r="1.5" />
      </g>
      <g fill="#00D9FF">
        <circle cx="32" cy="18" r="2" />
        <circle cx="32" cy="46" r="2" />
        <circle cx="30" cy="32" r="1.4" />
        <circle cx="34" cy="32" r="1.4" />
      </g>
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={compact ? 36 : 46} />
      <div className="leading-tight">
        <div className="ltr flex items-baseline gap-1.5 font-extrabold">
          <span className="text-[19px] tracking-wide text-ink">AI-IDS</span>
          <span className="text-[15px] text-cyan-bright">6.0</span>
        </div>
        {!compact && (
          <p className="ltr text-[9.5px] leading-snug text-ink-2">
            {t('AI-Powered Intrusion Detection & Response', 'AI-Powered Intrusion Detection & Response')}
          </p>
        )}
      </div>
    </div>
  )
}

/** Flag of the Republic of Yemen — red / white / black horizontal tricolour */
export function YemenFlag({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-white/20`} role="img" aria-label="علم الجمهورية اليمنية">
      <rect width="30" height="6.67" fill="#CE1126" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#000000" />
    </svg>
  )
}

export function YemenBadge() {
  const { t } = useLang()
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface/70 px-2.5 py-1 text-[13px] font-bold text-ink">
      <YemenFlag />
      {t('الجمهورية اليمنية', 'Republic of Yemen')}
    </span>
  )
}
