import { useState } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import {
  Ban,
  BellRing,
  Bot,
  BrainCircuit,
  Bug,
  ChevronLeft,
  Database,
  Eye,
  FileWarning,
  FingerprintPattern,
  HardDrive,
  Laptop,
  Lock,
  MapPin,
  Network,
  Play,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
  UserCheck,
  Zap,
} from 'lucide-react'
import { DemoChip, Ltr, Mono, Panel, StatusBadge } from '@/components/ui'
import { compliance, honeypot, models, quickStats, soarActions, ueba } from '@/lib/fixtures'
import { useDemoStream } from '@/lib/demoStream'
import { useLang } from '@/lib/i18n'

function MoreLink({ to }: { to: LinkProps['to'] }) {
  const { t } = useLang()
  return (
    <Link to={to} className="flex items-center gap-0.5 text-[11.5px] font-bold text-cyan hover:text-cyan-bright">
      {t('عرض الكل', 'View all')}
      <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" aria-hidden />
    </Link>
  )
}

export function RecentEvents() {
  const { t } = useLang()
  const { recent } = useDemoStream()
  return (
    <Panel title={t('أحدث الأحداث الأمنية', 'Recent security events')} icon={ShieldAlert} action={<MoreLink to="/events" />} className="h-full" bodyClassName="!p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-[12.5px]">
          <thead>
            <tr className="border-b border-line/60 text-[11.5px] text-ink-3">
              <th scope="col" className="px-4 py-2 text-start font-medium">{t('الوقت', 'Time')}</th>
              <th scope="col" className="px-2 py-2 text-start font-medium">{t('النوع', 'Type')}</th>
              <th scope="col" className="px-2 py-2 text-start font-medium">{t('المصدر', 'Source')}</th>
              <th scope="col" className="px-4 py-2 text-start font-medium">{t('الحالة', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((e) => (
              <tr key={e.id} className="border-b border-line/30 transition-colors last:border-0 hover:bg-cyan/5">
                <td className="px-4 py-2.5">
                  <Mono className="text-ink-2">{new Date(e.timestamp).toISOString().slice(11, 19)}</Mono>
                </td>
                <td className="px-2 py-2.5">
                  <Link to="/events" search={{ id: e.id }} className="ltr font-medium text-ink hover:text-cyan-bright">
                    {e.type}
                  </Link>
                </td>
                <td className="px-2 py-2.5">
                  <Mono className="text-cyan">{e.source}</Mono>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export function ModelPerformance() {
  const { t } = useLang()
  const icons = [Network, Zap, BrainCircuit, Server, Eye]
  return (
    <Panel title={t('نماذج الذكاء الاصطناعي', 'AI models')} icon={BrainCircuit} action={<MoreLink to="/models" />} className="h-full">
      <ul className="space-y-3">
        {models.map((m, i) => {
          const Icon = icons[i]
          return (
            <li key={m.id}>
              <div className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded" style={{ background: `${m.color}1f` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: m.color }} aria-hidden />
                  </span>
                  <Ltr className="font-medium text-ink">{m.name}</Ltr>
                </span>
                <Ltr className="font-bold text-ink">{m.accuracy.toFixed(1)}%</Ltr>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/60" role="progressbar" aria-valuenow={m.accuracy} aria-valuemin={0} aria-valuemax={100} aria-label={m.name}>
                <div
                  className="bar-grow h-full rounded-full"
                  style={{ width: `${m.accuracy}%`, background: `linear-gradient(90deg, ${m.color}88, ${m.color})`, boxShadow: `0 0 8px ${m.color}88`, animationDelay: `${i * 90}ms` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-3">
        <FileWarning className="h-3.5 w-3.5 text-warn" aria-hidden />
        {t('قيم توضيحية — تُستبدل بنتائج التقييم الفعلي من الخادم', 'Illustrative values — replaced by real backend evaluation')}
      </p>
    </Panel>
  )
}

export function RiskRing({ value, size = 104, color = '#EF4444' }: { value: number; size?: number; color?: string }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Risk score ${value}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#123B61" strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}aa)`, transition: 'stroke-dasharray 900ms ease' }}
      />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="#F8FAFC" fontSize={size / 4.4} fontWeight="800" fontFamily="Inter">
        {value}%
      </text>
      <text x="50%" y="68%" textAnchor="middle" fill="#94A3B8" fontSize={size / 10} fontFamily="Inter">
        RISK
      </text>
    </svg>
  )
}

export function UebaPanel() {
  const { t } = useLang()
  return (
    <Panel title={t('تحليل السلوك (UEBA)', 'Behavior analytics (UEBA)')} icon={FingerprintPattern} action={<MoreLink to="/ueba" />} className="h-full">
      <div className="flex items-center gap-4">
        <RiskRing value={ueba.score} />
        <div className="min-w-0 flex-1 space-y-1.5 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-2">
            <Mono className="text-[14px] font-bold text-ink">{ueba.user}</Mono>
            <span className="rounded border border-threat/50 bg-threat/15 px-1.5 py-0.5 text-[11px] font-bold text-threat">{t(ueba.riskLabel, 'High risk')}</span>
          </div>
          <p className="flex items-center gap-1.5 text-ink-2">
            <MapPin className="h-3.5 w-3.5 text-cyan" aria-hidden />
            {t(ueba.location, "Sana'a - Yemen")}
          </p>
          <p className="flex items-center gap-1.5 text-ink-2">
            <Laptop className="h-3.5 w-3.5 text-cyan" aria-hidden />
            <Ltr>{ueba.device}</Ltr>
          </p>
          <p className="flex items-start gap-1.5 text-warn">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t(ueba.reason, 'Login from an unfamiliar location')}
          </p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { l: t('عدد الأحداث', 'Events'), v: ueba.events, c: '#00D9FF' },
          { l: t('متوسط الثقة', 'Avg confidence'), v: `${ueba.avgConfidence}%`, c: '#10B981' },
          { l: t('الأحداث عالية الخطورة', 'High-risk events'), v: ueba.highRisk, c: '#EF4444' },
        ].map((x) => (
          <div key={x.l} className="rounded-md border border-line/70 bg-base/60 px-1 py-2">
            <dt className="text-[10.5px] leading-tight text-ink-3">{x.l}</dt>
            <dd className="ltr mt-1 text-[17px] font-extrabold" style={{ color: x.c }}>
              {x.v}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

export function SoarPanel() {
  const { t } = useLang()
  const [items, setItems] = useState(soarActions)
  const icons = [Ban, HardDrive, Lock, BellRing]
  const runDemo = () => {
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setItems((prev) => [
      { id: `sim-${Date.now()}`, action: 'حظر عنوان IP', actionEn: 'Block IP address', target: '91.240.118.3', time: now, status: 'simulated', result: 'تمت المحاكاة بنجاح' },
      ...prev.slice(0, 3),
    ])
  }
  return (
    <Panel
      title={t('الاستجابة الآلية (SOAR)', 'Automated response (SOAR)')}
      icon={Bot}
      className="h-full"
      action={
        <span className="ltr rounded border border-ok/50 bg-ok/10 px-1.5 py-0.5 text-[10px] font-bold text-ok-bright">Simulation Mode</span>
      }
    >
      <ul className="space-y-2">
        {items.map((a, i) => {
          const Icon = icons[i % icons.length]
          const pending = a.status === 'pending'
          return (
            <li key={a.id} className="flex items-center gap-2.5 rounded-md border border-line/50 bg-base/50 px-2.5 py-1.5">
              <Icon className={`h-4 w-4 shrink-0 ${pending ? 'text-warn' : 'text-ok-bright'}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-bold text-ink">{t(a.action, a.actionEn)}</p>
                <p className="truncate text-[11px] text-ink-3">
                  <Mono className="text-cyan">{a.target}</Mono> · {t(a.result, pending ? 'Awaiting admin approval' : 'Simulated')}
                </p>
              </div>
              <Mono className="text-[11px] text-ink-3">{a.time}</Mono>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={runDemo}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-cyan/40 py-1.5 text-[12px] font-bold text-cyan-bright transition-colors hover:bg-cyan/10"
      >
        <Play className="h-3.5 w-3.5" aria-hidden />
        {t('تشغيل محاكاة استجابة', 'Run response simulation')}
      </button>
    </Panel>
  )
}

export function HoneypotPanel() {
  const { t } = useLang()
  return (
    <Panel title={t('مصائد العسل (Honeypots)', 'Honeypots')} icon={Bug} action={<MoreLink to="/honeypots" />} className="h-full">
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: t('هجوم مكتشف', 'Attacks detected'), v: honeypot.detected, c: '#EF4444' },
          { l: t('جهاز مراقب', 'Monitored hosts'), v: honeypot.monitored, c: '#00D9FF' },
          { l: t('هجمات اليوم', 'Attacks today'), v: honeypot.today, c: '#F59E0B' },
        ].map((x) => (
          <div key={x.l} className="rounded-md border border-line/70 bg-base/60 py-2">
            <dd className="ltr text-[20px] font-extrabold" style={{ color: x.c }}>
              {x.v}
            </dd>
            <dt className="text-[10.5px] text-ink-3">{x.l}</dt>
          </div>
        ))}
      </dl>
      <ul className="mt-3 space-y-1.5 text-[12px]">
        {honeypot.recent.map((h) => (
          <li key={h.type} className="flex items-center justify-between gap-2 border-b border-line/30 pb-1.5 last:border-0">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-threat blink" aria-hidden />
              <Ltr className="text-ink">{h.type}</Ltr>
            </span>
            <Mono className="text-[11px] text-ink-3">{h.time}</Mono>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function CompliancePanel() {
  const { t } = useLang()
  return (
    <Panel title={t('الامتثال والمعايير', 'Compliance')} icon={ShieldCheck} action={<MoreLink to="/compliance" />} className="h-full">
      <ul className="space-y-2.5">
        {compliance.map((c) => {
          const color = c.score >= 90 ? '#10B981' : c.score >= 86 ? '#06B6D4' : '#F59E0B'
          return (
            <li key={c.name}>
              <div className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="text-ink">
                  {c.projectReference ? (
                    <span title={t('ليس معياراً رسمياً — مرجع داخلي للمشروع', 'Not an official standard — internal project reference')}>
                      {t('الأمن السيبراني اليمني', 'Yemen Security Baseline')}
                      <span className="ms-1 text-[10px] text-warn">({t(c.nameAr!, 'project reference')})</span>
                    </span>
                  ) : (
                    <Ltr>{c.name}</Ltr>
                  )}
                </span>
                <Ltr className="font-bold" >
                  <span style={{ color }}>{c.score}%</span>
                </Ltr>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line/60">
                <div className="bar-grow h-full rounded-full" style={{ width: `${c.score}%`, background: color }} />
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export function QuickStats() {
  const { t } = useLang()
  const icons = { accounts: Users, active: UserCheck, devices: Laptop, monitored: Eye, dbs: Database, assets: Server } as const
  return (
    <Panel title={t('إحصائيات سريعة', 'Quick stats')} icon={Zap} className="h-full">
      <dl className="grid grid-cols-2 gap-2">
        {quickStats.map((s) => {
          const Icon = icons[s.key as keyof typeof icons]
          return (
            <div key={s.key} className="flex items-center gap-2.5 rounded-md border border-line/60 bg-base/50 px-2.5 py-2">
              <Icon className="h-4 w-4 shrink-0 text-cyan" aria-hidden />
              <div className="min-w-0">
                <dd className="ltr text-[16px] font-extrabold leading-tight text-ink">{s.value}</dd>
                <dt className="truncate text-[10.5px] text-ink-3">{t(s.label, s.labelEn)}</dt>
              </div>
            </div>
          )
        })}
      </dl>
      <div className="mt-2 flex justify-end">
        <DemoChip />
      </div>
    </Panel>
  )
}
