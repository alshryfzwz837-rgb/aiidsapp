import { Activity, ArrowDown, ArrowUp, BadgeCheck, BrainCircuit, Gauge, ShieldAlert, ShieldCheck, Timer } from 'lucide-react'
import { kpis } from '@/lib/fixtures'
import { useLang } from '@/lib/i18n'

const TONES: Record<string, { c: string; icon: typeof Activity }> = {
  cyan: { c: '#00D9FF', icon: Activity },
  red: { c: '#EF4444', icon: ShieldAlert },
  blue: { c: '#3B82F6', icon: BrainCircuit },
  violet: { c: '#8B5CF6', icon: ShieldCheck },
  green: { c: '#10B981', icon: Timer },
  amber: { c: '#F59E0B', icon: BadgeCheck },
}

export function KpiCards() {
  const { t } = useLang()
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k) => {
        const tone = TONES[k.tone]
        const Icon = tone.icon
        const changeColor = k.good ? '#00E676' : '#FF1744'
        const Arrow = k.up ? ArrowUp : ArrowDown
        return (
          <article
            key={k.key}
            className="glass glass-hover relative overflow-hidden p-3.5"
            style={{ borderColor: `${tone.c}40` }}
            aria-label={t(k.title, k.titleEn)}
          >
            <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${tone.c}, transparent)` }} aria-hidden />
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[12.5px] font-bold leading-snug text-ink-2">{t(k.title, k.titleEn)}</h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tone.c}1a`, boxShadow: `0 0 14px ${tone.c}33` }}>
                <Icon className="h-[18px] w-[18px]" style={{ color: tone.c }} aria-hidden />
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="ltr text-[28px] font-extrabold leading-none text-ink">{k.value}</span>
              {'unit' in k && <span className="text-[13px] text-ink-2">{t(k.unit, k.unitEn)}</span>}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
              {'isStatus' in k ? (
                <span className="flex items-center gap-1 font-bold text-warn">
                  <Gauge className="h-3.5 w-3.5" aria-hidden />
                  <span className="ltr">{k.change}</span>
                </span>
              ) : (
                <span className="flex items-center gap-0.5 font-bold" style={{ color: changeColor }}>
                  <Arrow className="h-3.5 w-3.5" aria-label={k.up ? t('ارتفاع', 'up') : t('انخفاض', 'down')} />
                  <span className="ltr">{k.change}</span>
                </span>
              )}
              <span className="truncate text-ink-3">{t(k.subtitle, k.subtitleEn)}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
