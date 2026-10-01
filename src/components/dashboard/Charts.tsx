import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartLine, ChartPie } from 'lucide-react'
import { Panel, DemoChip } from '@/components/ui'
import { threatDistribution, threatTotal } from '@/lib/fixtures'
import { useDemoStream } from '@/lib/demoStream'
import { useLang } from '@/lib/i18n'

const tooltipStyle = {
  background: 'rgba(6,17,31,0.96)',
  border: '1px solid rgba(6,182,212,0.45)',
  borderRadius: 8,
  color: '#F8FAFC',
  fontSize: 12,
  boxShadow: '0 0 20px rgba(6,182,212,0.15)',
}

export function ThreatDonut() {
  const { t } = useLang()
  const [active, setActive] = useState<number | null>(null)
  return (
    <Panel title={t('توزيع التهديدات حسب النوع', 'Threats by type')} icon={ChartPie} action={<DemoChip />} className="h-full">
      <div className="flex h-full flex-col items-center gap-3 sm:flex-row xl:flex-col 2xl:flex-row">
        <div className="relative h-[170px] w-[170px] shrink-0" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={threatDistribution}
                dataKey="value"
                nameKey={t('name', 'nameEn')}
                innerRadius={54}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
                animationDuration={900}
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {threatDistribution.map((d, i) => (
                  <Cell key={d.name} fill={d.color} opacity={active === null || active === i ? 1 : 0.35} style={{ filter: `drop-shadow(0 0 4px ${d.color}66)` }} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#F8FAFC' }} formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[30px] font-extrabold leading-none text-ink">{threatTotal}</span>
            <span className="text-[12px] text-ink-2">{t('تهديد', 'threats')}</span>
          </div>
        </div>
        <ul className="w-full space-y-1.5 text-[12.5px]">
          {threatDistribution.map((d, i) => (
            <li
              key={d.name}
              className={`flex items-center justify-between gap-2 rounded px-1.5 py-0.5 transition-colors ${active === i ? 'bg-white/5' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="flex items-center gap-2 text-ink-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} aria-hidden />
                {t(d.name, d.nameEn)}
              </span>
              <span className="ltr font-bold text-ink">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

export function EventTrend() {
  const { t } = useLang()
  const { trend } = useDemoStream()
  const series = [
    { key: 'total', label: t('الكل', 'All'), color: '#3B82F6' },
    { key: 'threats', label: t('التهديدات', 'Threats'), color: '#EF4444' },
    { key: 'processed', label: t('المعالجة', 'Processed'), color: '#10B981' },
  ]
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  return (
    <Panel
      title={t('اتجاه الأحداث الأمنية', 'Security event trend')}
      icon={ChartLine}
      className="h-full"
      action={
        <div className="flex items-center gap-2" role="group" aria-label={t('السلاسل', 'Series')}>
          {series.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={!hidden[s.key]}
              onClick={() => setHidden((h) => ({ ...h, [s.key]: !h[s.key] }))}
              className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11.5px] transition-opacity ${hidden[s.key] ? 'opacity-40' : ''}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden />
              {s.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-[220px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#123B61" strokeOpacity={0.5} strokeDasharray="3 4" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={{ stroke: '#123B61' }} ticks={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']} />
            <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#00D9FF', fontWeight: 700 }} cursor={{ stroke: '#06B6D4', strokeOpacity: 0.4 }} />
            {series.map((s) =>
              hidden[s.key] ? null : (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#grad-${s.key})`}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  animationDuration={700}
                />
              ),
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
