import type { LucideIcon } from 'lucide-react'
import { FlaskConical } from 'lucide-react'
import { severityLabels, statusLabels, type EventStatus, type Severity } from '@/lib/fixtures'
import { useLang } from '@/lib/i18n'

export function Panel({
  title,
  icon: Icon,
  action,
  children,
  className = '',
  bodyClassName = '',
}: {
  title: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={`glass glass-hover flex min-w-0 flex-col ${className}`} aria-label={title}>
      <header className="flex items-center justify-between gap-2 border-b border-line/60 px-4 py-2.5">
        <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink">
          {Icon && <Icon className="h-4 w-4 text-cyan-bright" aria-hidden />}
          {title}
        </h2>
        {action}
      </header>
      <div className={`min-h-0 flex-1 p-4 ${bodyClassName}`}>{children}</div>
    </section>
  )
}

export function StatusBadge({ status }: { status: EventStatus }) {
  const { t } = useLang()
  const s = statusLabels[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-bold"
      style={{ color: s.color, background: `${s.color}1f`, border: `1px solid ${s.color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
      {t(s.ar, s.en)}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useLang()
  const s = severityLabels[severity]
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold"
      style={{ color: s.color, background: `${s.color}1a`, border: `1px solid ${s.color}4d` }}
    >
      <span className="ltr text-[10px] tracking-wide">{severity}</span>
      <span className="opacity-80">· {t(s.ar, s.en)}</span>
    </span>
  )
}

export function DemoChip({ label }: { label?: string }) {
  const { t } = useLang()
  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] font-bold text-warn"
      title={t('بيانات تجريبية اصطناعية — ليست هجمات حقيقية', 'Synthetic demo data — not real attacks')}
    >
      <FlaskConical className="h-3 w-3" aria-hidden />
      {label ?? t('بيانات تجريبية', 'Demo')}
    </span>
  )
}

export function Ltr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`ltr ${className}`}>{children}</span>
}

export function Mono({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`mono ${className}`}>{children}</span>
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-extrabold text-ink md:text-2xl">{title}</h1>
        <p className="mt-0.5 text-sm text-ink-2">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
