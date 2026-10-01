import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, RotateCcw, Search, ShieldAlert, X } from 'lucide-react'
import { DemoChip, Mono, PageHeader, SeverityBadge, StatusBadge } from '@/components/ui'
import { events, eventTypeOptions, severityLabels, statusLabels, type EventStatus, type SecurityEvent, type Severity } from '@/lib/fixtures'
import { useLang } from '@/lib/i18n'

interface EventsSearch {
  q?: string
  id?: string
}

export const Route = createFileRoute('/events')({
  validateSearch: (s: Record<string, unknown>): EventsSearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    id: typeof s.id === 'string' && s.id ? s.id : undefined,
  }),
  component: EventsPage,
})

const PAGE = 12

const selectCls =
  'h-9 rounded-md border border-line bg-surface/80 px-2.5 text-[12.5px] text-ink focus:border-cyan focus:outline-none'

function EventsPage() {
  const { t } = useLang()
  const { q = '', id } = Route.useSearch()
  const navigate = useNavigate({ from: '/events' })

  const [query, setQuery] = useState(q)
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [status, setStatus] = useState<EventStatus | ''>('')
  const [type, setType] = useState('')
  const [ip, setIp] = useState('')
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => setQuery(q), [q])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return events.filter((e) => {
      if (severity && e.severity !== severity) return false
      if (status && e.status !== status) return false
      if (type && e.type !== type) return false
      if (ip && !e.source.includes(ip.trim())) return false
      if (date && !e.timestamp.startsWith(date)) return false
      if (needle) {
        const hay = `${e.type} ${e.typeAr} ${e.source} ${e.destination} ${e.protocol} ${e.prediction} ${e.id}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [query, severity, status, type, ip, date])

  useEffect(() => setPage(1), [query, severity, status, type, ip, date])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE)
  const selected = id ? events.find((e) => e.id === id) ?? null : null

  const reset = () => {
    setQuery('')
    setSeverity('')
    setStatus('')
    setType('')
    setIp('')
    setDate('')
    navigate({ search: {} })
  }

  const open = (e: SecurityEvent) => navigate({ search: (s) => ({ ...s, id: e.id }) })
  const close = () => navigate({ search: (s) => ({ ...s, id: undefined }) })

  return (
    <div className="mx-auto max-w-[1680px]">
      <PageHeader title={t('الأحداث الأمنية', 'Security events')} subtitle={t('سجل الأحداث المستقبلة من Zeek و Suricata ومصائد العسل', 'Events ingested from Zeek, Suricata and honeypots')}>
        <DemoChip label="Demo Mode · Synthetic events" />
      </PageHeader>

      <section className="glass mb-4 p-3" aria-label={t('عوامل التصفية', 'Filters')}>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-cyan" aria-hidden />
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('بحث بالنوع، العنوان، البروتوكول، المعرّف...', 'Search type, IP, protocol, ID...')}
              aria-label={t('بحث', 'Search')}
              className={`${selectCls} w-full ps-8`}
            />
          </div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity | '')} className={selectCls} aria-label={t('الخطورة', 'Severity')}>
            <option value="">{t('كل مستويات الخطورة', 'All severities')}</option>
            {(Object.keys(severityLabels) as Severity[]).map((s) => (
              <option key={s} value={s}>
                {s} — {t(severityLabels[s].ar, severityLabels[s].en)}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls} aria-label={t('نوع التهديد', 'Threat type')}>
            <option value="">{t('كل الأنواع', 'All types')}</option>
            {eventTypeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus | '')} className={selectCls} aria-label={t('الحالة', 'Status')}>
            <option value="">{t('كل الحالات', 'All statuses')}</option>
            {(Object.keys(statusLabels) as EventStatus[]).map((s) => (
              <option key={s} value={s}>
                {t(statusLabels[s].ar, statusLabels[s].en)}
              </option>
            ))}
          </select>
          <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder={t('عنوان المصدر IP', 'Source IP')} aria-label={t('عنوان المصدر', 'Source IP')} className={`${selectCls} mono w-[150px]`} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={t('التاريخ', 'Date')} className={`${selectCls} [color-scheme:dark]`} />
          <button type="button" onClick={reset} className="flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-[12.5px] text-ink-2 hover:border-cyan/60 hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            {t('إعادة تعيين', 'Reset')}
          </button>
        </div>
      </section>

      <section className="glass overflow-hidden" aria-label={t('جدول الأحداث', 'Events table')}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[12.5px]">
            <thead>
              <tr className="border-b border-line text-[11.5px] text-ink-3">
                {[t('الوقت', 'Time'), t('النوع', 'Type'), t('المصدر', 'Source'), t('الوجهة', 'Destination'), t('البروتوكول', 'Protocol'), t('الخطورة', 'Severity'), t('الثقة', 'Confidence'), t('النموذج', 'Model'), t('الحالة', 'Status')].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2.5 text-start font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr
                  key={e.id}
                  tabIndex={0}
                  onClick={() => open(e)}
                  onKeyDown={(ev) => ev.key === 'Enter' && open(e)}
                  className="cursor-pointer border-b border-line/30 transition-colors hover:bg-cyan/5 focus:bg-cyan/10 focus:outline-none"
                  aria-label={`${e.type} ${e.source}`}
                >
                  <td className="px-3 py-2.5">
                    <Mono className="text-ink-2">{e.timestamp.slice(0, 10)} {e.timestamp.slice(11, 19)}</Mono>
                  </td>
                  <td className="ltr px-3 py-2.5 font-medium text-ink">{e.type}</td>
                  <td className="px-3 py-2.5">
                    <Mono className="text-cyan">{e.source}</Mono>
                  </td>
                  <td className="px-3 py-2.5">
                    <Mono className="text-ink-2">
                      {e.destination}:{e.port}
                    </Mono>
                  </td>
                  <td className="ltr px-3 py-2.5 text-ink-2">{e.protocol}</td>
                  <td className="px-3 py-2.5">
                    <SeverityBadge severity={e.severity} />
                  </td>
                  <td className="ltr px-3 py-2.5 font-bold text-ink">{e.confidence}%</td>
                  <td className="ltr px-3 py-2.5 text-ink-2">{e.model}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-12 text-center text-ink-3">
                    {t('لا توجد أحداث مطابقة لعوامل التصفية', 'No events match the current filters')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2.5 text-[12px] text-ink-2" aria-label={t('ترقيم الصفحات', 'Pagination')}>
          <span>
            {t('عدد النتائج', 'Results')}: <span className="ltr font-bold text-ink">{filtered.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded border border-line p-1.5 hover:border-cyan/60 disabled:opacity-30" aria-label={t('الصفحة السابقة', 'Previous page')}>
              <ChevronRight className="h-4 w-4 ltr:rotate-180" />
            </button>
            <span className="ltr px-2">
              {page} / {pages}
            </span>
            <button type="button" disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="rounded border border-line p-1.5 hover:border-cyan/60 disabled:opacity-30" aria-label={t('الصفحة التالية', 'Next page')}>
              <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
            </button>
          </div>
        </nav>
      </section>

      {selected && <EventDrawer event={selected} onClose={close} />}
    </div>
  )
}

function EventDrawer({ event: e, onClose }: { event: SecurityEvent; onClose: () => void }) {
  const { t } = useLang()
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between gap-3 border-b border-line/30 py-2 text-[12.5px]">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-end text-ink">{value}</dd>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('تفاصيل الحدث', 'Event details')}>
      <button type="button" className="absolute inset-0 bg-body/70 backdrop-blur-sm" onClick={onClose} aria-label={t('إغلاق', 'Close')} />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-[460px] flex-col border-s border-line bg-base shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="flex items-center gap-2 font-bold">
            <ShieldAlert className="h-4 w-4 text-threat" aria-hidden />
            <span className="ltr">{e.type}</span>
          </h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-ink-2 hover:text-ink" aria-label={t('إغلاق', 'Close')} autoFocus>
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <SeverityBadge severity={e.severity} />
            <StatusBadge status={e.status} />
            <DemoChip />
          </div>
          <dl>
            {row('ID', <Mono className="text-[11px] text-ink-2">{e.id}</Mono>)}
            {row(t('الوقت', 'Timestamp'), <Mono>{e.timestamp}</Mono>)}
            {row(t('المصدر', 'Source'), <Mono className="text-cyan">{e.source}</Mono>)}
            {row(t('الوجهة', 'Destination'), <Mono>{e.destination}</Mono>)}
            {row(t('البروتوكول / المنفذ', 'Protocol / port'), <Mono>{e.protocol} / {e.port}</Mono>)}
            {row(t('المستشعر', 'Sensor'), <span className="ltr">{e.sensor}</span>)}
            {row(t('التنبؤ', 'Prediction'), <span className="ltr font-bold">{e.prediction}</span>)}
            {row(t('الثقة', 'Confidence'), <span className="ltr font-bold">{e.confidence}%</span>)}
            {row(t('النموذج', 'Model'), <span className="ltr">{e.model}</span>)}
            {row(t('الاستجابة', 'Response'), e.response)}
            {row(t('تطابق IOC', 'IOC match'), e.iocMatch ? <Mono className="text-threat">{e.iocMatch}</Mono> : <span className="text-ink-3">{t('لا يوجد', 'None')}</span>)}
            {row(t('درجة UEBA', 'UEBA score'), <span className="ltr font-bold" style={{ color: e.uebaScore > 70 ? '#EF4444' : e.uebaScore > 40 ? '#F59E0B' : '#10B981' }}>{e.uebaScore}%</span>)}
          </dl>

          <h3 className="mt-5 mb-2 text-[13px] font-bold text-cyan-bright">{t('الخصائص المُطبَّعة', 'Normalized features')}</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(e.features).map(([k, v]) => (
              <div key={k} className="rounded border border-line/50 bg-surface/60 px-2 py-1.5">
                <div className="mono text-[10.5px] text-ink-3">{k}</div>
                <div className="mono text-[12.5px] text-ink">{v}</div>
              </div>
            ))}
          </div>

          <h3 className="mt-5 mb-2 text-[13px] font-bold text-cyan-bright">{t('سجل التدقيق', 'Audit trail')}</h3>
          <ol className="space-y-2 border-s border-line ps-4">
            {e.audit.map((a, i) => (
              <li key={i} className="relative text-[12px]">
                <span className="absolute -start-[21px] top-1 h-2 w-2 rounded-full bg-cyan" aria-hidden />
                <Mono className="text-ink-3">{a.at}</Mono> <span className="ltr text-cyan">{a.actor}</span>
                <p className="text-ink-2">{a.action}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  )
}
