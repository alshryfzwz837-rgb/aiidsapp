import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookCheck,
  Bug,
  Database,
  Download,
  FileJson,
  FileText,
  FingerprintPattern,
  KeyRound,
  Plus,
  Printer,
  Radar,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Table2,
  Users,
  Workflow,
} from 'lucide-react'
import { DemoChip, Ltr, Mono, PageHeader, Panel } from '@/components/ui'
import { CompliancePanel, HoneypotPanel, RiskRing, SoarPanel, UebaPanel } from '@/components/dashboard/Panels'
import { compliance, events, honeypot, iocs as seedIocs, models, soarActions, uebaEntities } from '@/lib/fixtures'
import { useLang } from '@/lib/i18n'

const inputCls = 'h-9 w-full rounded-md border border-line bg-surface/80 px-2.5 text-[12.5px] text-ink focus:border-cyan focus:outline-none'
const btnCls = 'inline-flex items-center justify-center gap-1.5 rounded-md border border-cyan/40 px-3 py-1.5 text-[12.5px] font-bold text-cyan-bright transition-colors hover:bg-cyan/10'

function MilestoneNote({ n, ar, en }: { n: number; ar: string; en: string }) {
  const { t } = useLang()
  return (
    <p className="rounded-md border border-cyan/25 bg-cyan/5 px-3 py-2 text-[12px] text-ink-2">
      <span className="font-bold text-cyan-bright">{t(`المرحلة ${n}`, `Milestone ${n}`)}:</span> {t(ar, en)}
    </p>
  )
}

/* ---------------- UEBA ---------------- */
export function UebaPage() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('تحليل سلوك المستخدمين والكيانات (UEBA)', 'User & Entity Behavior Analytics')} subtitle={t('خطوط الأساس، الانحراف، ودرجات الخطر', 'Baselines, deviation and risk scores')}>
        <DemoChip />
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <UebaPanel />
        </div>
        <div className="xl:col-span-8">
          <Panel title={t('الكيانات المراقبة', 'Monitored entities')} icon={FingerprintPattern} className="h-full" bodyClassName="!p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[11.5px] text-ink-3">
                    {[t('المستخدم', 'User'), t('درجة الخطر', 'Risk'), t('الموقع', 'Location'), t('الجهاز', 'Device'), t('الانحراف', 'Deviation')].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-start font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uebaEntities.map((u) => {
                    const c = u.score > 70 ? '#EF4444' : u.score > 45 ? '#F59E0B' : '#10B981'
                    return (
                      <tr key={u.user} className="border-b border-line/30 hover:bg-cyan/5">
                        <td className="px-4 py-2"><Mono className="font-bold text-ink">{u.user}</Mono></td>
                        <td className="px-4 py-2"><RiskRing value={u.score} size={52} color={c} /></td>
                        <td className="px-4 py-2 text-ink-2">{u.location}</td>
                        <td className="px-4 py-2"><Ltr className="text-ink-2">{u.device}</Ltr></td>
                        <td className="px-4 py-2" style={{ color: c }}>{u.anomaly}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
      <MilestoneNote n={5} ar="حساب خطوط الأساس الفعلية لكل مستخدم/عنوان/جهاز/موقع/وقت من سجل الأحداث المخزَّن." en="Real per-user/IP/device/location/time baselines computed from stored event history." />
    </div>
  )
}

/* ---------------- SOAR ---------------- */
const PLAYBOOKS = [
  { ar: 'احتواء هجوم تخمين كلمات المرور', en: 'Brute-force containment', steps: ['Detect', 'Block IP (sim)', 'Notify SOC'] },
  { ar: 'الاستجابة لبرمجية خبيثة', en: 'Malware response', steps: ['Detect', 'Isolate host (approval)', 'Hash → IOC', 'Notify SOC'] },
  { ar: 'تخفيف هجوم DDoS', en: 'DDoS mitigation', steps: ['Detect', 'Rate-limit (sim)', 'Blocklist', 'Escalate'] },
]

export function SoarPage() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('الاستجابة الآلية (SOAR)', 'Automated response (SOAR)')} subtitle={t('كتيبات الاستجابة — وضع المحاكاة افتراضياً', 'Response playbooks — simulation mode by default')} />
      <div role="note" className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/10 px-4 py-2.5 text-[12.5px] text-ok-bright">
        <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
        {t(
          'وضع المحاكاة مفعَّل: لا يتم تنفيذ أي حظر فعلي أو عزل أجهزة أو أوامر مدمِّرة. أي تكامل إنتاجي يتطلب موافقة صريحة من المسؤول.',
          'Simulation Mode is on: no real blocking, host isolation or destructive commands are executed. Production integrations require explicit admin approval.',
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <SoarPanel />
        </div>
        <div className="xl:col-span-7">
          <Panel title={t('كتيبات الاستجابة', 'Playbooks')} icon={Workflow} className="h-full">
            <ul className="space-y-3">
              {PLAYBOOKS.map((p) => (
                <li key={p.en} className="rounded-md border border-line/60 bg-base/50 p-3">
                  <p className="text-[13px] font-bold text-ink">{t(p.ar, p.en)}</p>
                  <ol className="ltr mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    {p.steps.map((s, i) => (
                      <li key={s} className="flex items-center gap-1.5">
                        <span className="rounded border border-cyan/30 bg-cyan/10 px-1.5 py-0.5 text-cyan-bright">{s}</span>
                        {i < p.steps.length - 1 && <span className="text-ink-3">→</span>}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Threat intelligence ---------------- */
const IOC_TYPES = ['IP', 'Domain', 'URL', 'Hash', 'Email', 'Other']

export function ThreatIntelPage() {
  const { t } = useLang()
  const [list, setList] = useState(seedIocs)
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ indicator: '', type: 'IP', confidence: 70, description: '' })
  const [error, setError] = useState('')
  const shown = filter ? list.filter((i) => i.type === filter) : list

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const v = form.indicator.trim()
    if (!v || v.length > 512) return setError(t('المؤشر مطلوب (حتى 512 حرفاً)', 'Indicator is required (max 512 chars)'))
    if (form.type === 'IP' && !/^(\d{1,3}\.){3}\d{1,3}$/.test(v) && !v.includes(':')) return setError(t('عنوان IP غير صالح', 'Invalid IP address'))
    if (list.some((i) => i.indicator === v)) return setError(t('المؤشر موجود مسبقاً', 'Indicator already exists'))
    const today = new Date().toISOString().slice(0, 10)
    setList([{ indicator: v, type: form.type, source: 'Analyst (local)', confidence: form.confidence, firstSeen: today, lastSeen: today, status: 'active', description: form.description }, ...list])
    setForm({ indicator: '', type: form.type, confidence: 70, description: '' })
    setError('')
  }

  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('الاستخبارات التهديدية', 'Threat intelligence')} subtitle={t('قاعدة مؤشرات الاختراق (IOC)', 'Indicators of Compromise database')}>
        <DemoChip />
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Panel
            title={t('مؤشرات الاختراق', 'Indicators')}
            icon={Radar}
            bodyClassName="!p-0"
            className="h-full"
            action={
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-8 rounded border border-line bg-surface px-2 text-[12px]" aria-label={t('تصفية حسب النوع', 'Filter by type')}>
                <option value="">{t('كل الأنواع', 'All types')}</option>
                {IOC_TYPES.map((x) => <option key={x}>{x}</option>)}
              </select>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[11.5px] text-ink-3">
                    {[t('المؤشر', 'Indicator'), t('النوع', 'Type'), t('المصدر', 'Source'), t('الثقة', 'Confidence'), t('أول ظهور', 'First seen'), t('آخر ظهور', 'Last seen'), t('الحالة', 'Status'), t('الوصف', 'Description')].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-start font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((i) => (
                    <tr key={i.indicator} className="border-b border-line/30 hover:bg-cyan/5">
                      <td className="max-w-[220px] truncate px-3 py-2"><Mono className="text-cyan">{i.indicator}</Mono></td>
                      <td className="ltr px-3 py-2 text-ink">{i.type}</td>
                      <td className="ltr px-3 py-2 text-ink-2">{i.source}</td>
                      <td className="ltr px-3 py-2 font-bold">{i.confidence}%</td>
                      <td className="px-3 py-2"><Mono className="text-ink-3">{i.firstSeen}</Mono></td>
                      <td className="px-3 py-2"><Mono className="text-ink-3">{i.lastSeen}</Mono></td>
                      <td className="px-3 py-2">
                        <span className={`ltr rounded px-1.5 py-0.5 text-[11px] font-bold ${i.status === 'active' ? 'bg-threat/15 text-threat' : 'bg-ink-3/20 text-ink-3'}`}>{i.status}</span>
                      </td>
                      <td className="px-3 py-2 text-ink-2">{i.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div className="xl:col-span-4">
          <Panel title={t('إضافة مؤشر', 'Add indicator')} icon={Plus} className="h-full">
            <form onSubmit={add} className="space-y-3 text-[12.5px]" noValidate>
              <label className="block">
                <span className="mb-1 block text-ink-2">{t('المؤشر', 'Indicator')}</span>
                <input value={form.indicator} onChange={(e) => setForm({ ...form, indicator: e.target.value })} className={`${inputCls} mono`} maxLength={512} required />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-ink-2">{t('النوع', 'Type')}</span>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                    {IOC_TYPES.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-ink-2">{t('الثقة', 'Confidence')} ({form.confidence}%)</span>
                  <input type="range" min={0} max={100} value={form.confidence} onChange={(e) => setForm({ ...form, confidence: +e.target.value })} className="mt-3 w-full accent-cyan" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-ink-2">{t('الوصف', 'Description')}</span>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={1000} className={`${inputCls} h-auto py-2`} />
              </label>
              {error && <p className="text-threat" role="alert">{error}</p>}
              <button type="submit" className={`${btnCls} w-full`}>
                <Plus className="h-4 w-4" aria-hidden />
                {t('إضافة', 'Add')}
              </button>
              <p className="text-[11px] text-ink-3">{t('تُحفظ الإضافات في هذه الجلسة فقط حتى تفعيل POST /api/iocs (المرحلة 2).', 'Additions last for this session only until POST /api/iocs ships (milestone 2).')}</p>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Honeypots ---------------- */
const SENSORS = [
  { id: 'hp-ssh-01', svc: 'SSH', port: 22, city: 'صنعاء', hits: 21 },
  { id: 'hp-web-02', svc: 'HTTP', port: 80, city: 'عدن', hits: 14 },
  { id: 'hp-smb-01', svc: 'SMB', port: 445, city: 'تعز', hits: 9 },
  { id: 'hp-rdp-01', svc: 'RDP', port: 3389, city: 'صنعاء', hits: 4 },
]

export function HoneypotsPage() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('مصائد العسل (Honeypots)', 'Honeypots')} subtitle={t('أجهزة خداعية لرصد المهاجمين', 'Decoy sensors for attacker telemetry')}>
        <DemoChip />
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <HoneypotPanel />
        </div>
        <div className="xl:col-span-7">
          <Panel title={t('المستشعرات', 'Sensors')} icon={Bug} className="h-full">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SENSORS.map((s) => (
                <li key={s.id} className="rounded-md border border-line/60 bg-base/50 p-3">
                  <div className="flex items-center justify-between">
                    <Mono className="font-bold text-ink">{s.id}</Mono>
                    <span className="flex items-center gap-1 text-[11px] text-ok-bright"><span className="h-1.5 w-1.5 rounded-full bg-ok-bright blink" />online</span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-2"><Ltr>{s.svc}:{s.port}</Ltr> · {s.city}</p>
                  <p className="mt-1 text-[12px] text-ink-3">{t('محاولات', 'Hits')}: <span className="ltr font-bold text-threat">{s.hits}</span></p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11.5px] text-ink-3">
              {t('إجمالي الهجمات المرصودة', 'Total attacks observed')}: <span className="ltr font-bold text-ink">{honeypot.detected}</span>
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Compliance ---------------- */
export function CompliancePage() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('الامتثال والمعايير', 'Compliance & standards')} subtitle={t('نسب تغطية الضوابط لكل إطار', 'Control coverage by framework')} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <CompliancePanel />
        </div>
        <div className="xl:col-span-7">
          <Panel title={t('ملاحظات منهجية', 'Methodology notes')} icon={BookCheck} className="h-full">
            <ul className="space-y-3 text-[12.5px] text-ink-2">
              {compliance.map((c) => (
                <li key={c.name} className="rounded-md border border-line/50 bg-base/50 p-3">
                  <p className="font-bold text-ink">{c.projectReference ? 'Yemen Security Baseline — Project Reference' : <Ltr>{c.name}</Ltr>}</p>
                  <p className="mt-1">
                    {c.projectReference
                      ? t('معيار داخلي للمشروع وليس معياراً وطنياً رسمياً. لا يُدمج أي معيار يمني رسمي إلا عند توفر مصدر موثوق.', 'An internal project baseline, not an official national standard. No official Yemeni standard is claimed unless an authoritative source is integrated.')
                      : t('تقدير تغطية توضيحي بناءً على ضوابط تجريبية.', 'Illustrative coverage estimate based on demo controls.')}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Users ---------------- */
const USERS = [
  { name: 'admin', role: 'Admin', last: '2025-09-27 14:02', status: 'active' },
  { name: 'analyst.sanaa', role: 'SOC Analyst', last: '2025-09-27 13:40', status: 'active' },
  { name: 'analyst.aden', role: 'SOC Analyst', last: '2025-09-26 22:15', status: 'active' },
  { name: 'auditor', role: 'Viewer', last: '2025-09-25 09:11', status: 'disabled' },
]
const PERMS = [
  { ar: 'الأحداث', en: 'Events', admin: true, analyst: true, viewer: 'read' },
  { ar: 'النماذج والتدريب', en: 'Models & training', admin: true, analyst: true, viewer: 'read' },
  { ar: 'UEBA', en: 'UEBA', admin: true, analyst: true, viewer: 'read' },
  { ar: 'محاكاة SOAR', en: 'SOAR simulation', admin: true, analyst: true, viewer: false },
  { ar: 'التقارير', en: 'Reports', admin: true, analyst: true, viewer: 'read' },
  { ar: 'المستخدمون والإعدادات', en: 'Users & settings', admin: true, analyst: false, viewer: false },
]

export function UsersPage() {
  const { t } = useLang()
  const cell = (v: boolean | string) => (v === true ? <span className="text-ok-bright">✓</span> : v === 'read' ? <span className="text-cyan">{t('قراءة', 'read')}</span> : <span className="text-ink-3">—</span>)
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('إدارة المستخدمين', 'User management')} subtitle={t('الأدوار والصلاحيات (RBAC)', 'Roles & permissions (RBAC)')}>
        <DemoChip />
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel title={t('المستخدمون', 'Users')} icon={Users} bodyClassName="!p-0" className="h-full">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-line text-[11.5px] text-ink-3">
                  {[t('المستخدم', 'User'), t('الدور', 'Role'), t('آخر دخول', 'Last login'), t('الحالة', 'Status')].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-start font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.name} className="border-b border-line/30">
                    <td className="px-4 py-2.5"><Mono className="text-ink">{u.name}</Mono></td>
                    <td className="ltr px-4 py-2.5 text-cyan">{u.role}</td>
                    <td className="px-4 py-2.5"><Mono className="text-ink-3">{u.last}</Mono></td>
                    <td className="ltr px-4 py-2.5 text-[11px] font-bold" style={{ color: u.status === 'active' ? '#10B981' : '#64748B' }}>{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
        <div className="xl:col-span-5">
          <Panel title={t('مصفوفة الصلاحيات', 'Permission matrix')} icon={KeyRound} bodyClassName="!p-0" className="h-full">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="ltr border-b border-line text-[11.5px] text-ink-3">
                  <th className="px-3 py-2.5 text-start font-medium" />
                  <th className="px-3 py-2.5 font-medium">Admin</th>
                  <th className="px-3 py-2.5 font-medium">SOC Analyst</th>
                  <th className="px-3 py-2.5 font-medium">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {PERMS.map((p) => (
                  <tr key={p.en} className="border-b border-line/30 text-center">
                    <td className="px-3 py-2 text-start text-ink-2">{t(p.ar, p.en)}</td>
                    <td className="px-3 py-2">{cell(p.admin)}</td>
                    <td className="px-3 py-2">{cell(p.analyst)}</td>
                    <td className="px-3 py-2">{cell(p.viewer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
      <MilestoneNote n={3} ar="تسجيل دخول محلي، تجزئة آمنة لكلمات المرور، وتطبيق الصلاحيات على كل مسار API." en="Local login, secure password hashing and RBAC enforced on every API route." />
    </div>
  )
}

/* ---------------- Reports ---------------- */
function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(typeof v === 'object' ? JSON.stringify(v) : v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
}

export function ReportsPage() {
  const { t } = useLang()
  const reports = useMemo(
    () => [
      { key: 'security', ar: 'الملخص الأمني', en: 'Security summary', rows: () => events.map(({ id, timestamp, type, source, destination, severity, status, confidence }) => ({ id, timestamp, type, source, destination, severity, status, confidence })) },
      { key: 'threats', ar: 'ملخص التهديدات', en: 'Threat summary', rows: () => Object.entries(events.reduce<Record<string, number>>((a, e) => ((a[e.type] = (a[e.type] ?? 0) + 1), a), {})).map(([type, count]) => ({ type, count })) },
      { key: 'models', ar: 'تقييم النماذج', en: 'Model evaluation', rows: () => models.map((m) => ({ ...m, note: 'DEMO — synthetic, not a real benchmark' })) },
      { key: 'ueba', ar: 'ملخص UEBA', en: 'UEBA summary', rows: () => uebaEntities },
      { key: 'soar', ar: 'إجراءات SOAR', en: 'SOAR actions', rows: () => soarActions },
      { key: 'iocs', ar: 'ملخص IOC', en: 'IOC summary', rows: () => seedIocs },
      { key: 'compliance', ar: 'ملخص الامتثال', en: 'Compliance summary', rows: () => compliance },
    ],
    [],
  )
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('التقارير', 'Reports')} subtitle={t('توليد وتصدير التقارير بصيغ CSV و JSON و PDF', 'Generate and export CSV, JSON and PDF reports')}>
        <DemoChip label="Demo data" />
      </PageHeader>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <article key={r.key} className="glass glass-hover p-4">
            <h2 className="flex items-center gap-2 text-[14px] font-bold">
              <FileText className="h-4 w-4 text-cyan-bright" aria-hidden />
              {t(r.ar, r.en)}
            </h2>
            <p className="mt-1 text-[12px] text-ink-3">
              {t('عدد السجلات', 'Records')}: <span className="ltr font-bold text-ink">{r.rows().length}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btnCls} onClick={() => download(`ai-ids-${r.key}.csv`, toCsv(r.rows() as Record<string, unknown>[]), 'text/csv;charset=utf-8')}>
                <Download className="h-3.5 w-3.5" aria-hidden /> CSV
              </button>
              <button type="button" className={btnCls} onClick={() => download(`ai-ids-${r.key}.json`, JSON.stringify({ report: r.en, mode: 'demo', generatedAt: new Date().toISOString(), rows: r.rows() }, null, 2), 'application/json')}>
                <FileJson className="h-3.5 w-3.5" aria-hidden /> JSON
              </button>
              <button type="button" className={btnCls} onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5" aria-hidden /> PDF
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Database ---------------- */
const TABLES = [
  ['users', 'حسابات المستخدمين والأدوار'],
  ['events', 'الأحداث الأمنية المُطبَّعة'],
  ['models', 'سجل النماذج وإصداراتها'],
  ['model_runs', 'عمليات التدريب والتقييم'],
  ['ueba_baselines', 'خطوط أساس السلوك'],
  ['iocs', 'مؤشرات الاختراق'],
  ['soar_actions', 'إجراءات الاستجابة (محاكاة)'],
  ['audit_logs', 'سجل التدقيق'],
  ['honeypot_events', 'أحداث مصائد العسل'],
  ['compliance_controls', 'ضوابط الامتثال'],
  ['system_settings', 'إعدادات النظام'],
]

export function DatabasePage() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('قواعد البيانات', 'Databases')} subtitle={t('مخطط البيانات المخطط للمنصة', 'Planned platform data schema')} />
      <div role="note" className="flex items-center gap-2 rounded-lg border border-warn/40 bg-warn/10 px-4 py-2.5 text-[12.5px] text-warn">
        <Database className="h-4 w-4 shrink-0" aria-hidden />
        {t('قاعدة البيانات غير متصلة بعد — الواجهة تعمل ببيانات تجريبية ثابتة.', 'Database not connected yet — the UI runs on static demo fixtures.')}
      </div>
      <Panel title={t('الجداول', 'Tables')} icon={Table2} bodyClassName="!p-0">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-[11.5px] text-ink-3">
              {[t('الجدول', 'Table'), t('الوصف', 'Description'), t('الحالة', 'Status')].map((h) => (
                <th key={h} className="px-4 py-2.5 text-start font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLES.map(([name, desc]) => (
              <tr key={name} className="border-b border-line/30">
                <td className="px-4 py-2.5"><Mono className="text-cyan">{name}</Mono></td>
                <td className="px-4 py-2.5 text-ink-2">{desc}</td>
                <td className="ltr px-4 py-2.5 text-[11px] font-bold text-warn">planned</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <MilestoneNote n={2} ar="إنشاء المخطط، الترحيلات، وربط كل لوحة بمسارات API حقيقية." en="Schema, migrations, and wiring every panel to real API routes." />
    </div>
  )
}

/* ---------------- Settings ---------------- */
interface SettingsState {
  refresh: number
  threshold: number
  logLevel: string
  apiBase: string
}
const DEFAULTS: SettingsState = { refresh: 30, threshold: 0.7, logLevel: 'INFO', apiBase: '/api' }

export function SettingsPage() {
  const { t, lang, setLang } = useLang()
  const [s, setS] = useState<SettingsState>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('aiids.settings')
      if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {
      /* ignore malformed local settings */
    }
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    window.localStorage.setItem('aiids.settings', JSON.stringify(s))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const field = (label: string, control: React.ReactNode, hint?: string) => (
    <label className="block text-[12.5px]">
      <span className="mb-1 block text-ink-2">{label}</span>
      {control}
      {hint && <span className="mt-1 block text-[11px] text-ink-3">{hint}</span>}
    </label>
  )

  return (
    <div className="mx-auto max-w-[1100px] space-y-4">
      <PageHeader title={t('الإعدادات', 'Settings')} subtitle={t('تفضيلات الواجهة ومعاملات الكشف', 'Interface preferences and detection parameters')} />
      <form onSubmit={save} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title={t('الواجهة', 'Interface')} icon={Settings}>
          <div className="space-y-3">
            {field(
              t('اللغة', 'Language'),
              <select value={lang} onChange={(e) => setLang(e.target.value as 'ar' | 'en')} className={inputCls}>
                <option value="ar">العربية (RTL)</option>
                <option value="en">English (LTR)</option>
              </select>,
            )}
            {field(t('السمة', 'Theme'), <select className={inputCls} value="dark" disabled><option value="dark">Dark SOC</option></select>, t('الهوية البصرية داكنة فقط', 'Dark identity only'))}
            {field(t('فترة التحديث (ثانية)', 'Refresh interval (s)'), <input type="number" min={10} max={300} value={s.refresh} onChange={(e) => setS({ ...s, refresh: +e.target.value })} className={inputCls} />)}
          </div>
        </Panel>
        <Panel title={t('الكشف والنظام', 'Detection & system')} icon={Server}>
          <div className="space-y-3">
            {field(t('عتبة الكشف', 'Detection threshold') + ` (${s.threshold.toFixed(2)})`, <input type="range" min={0.3} max={0.99} step={0.01} value={s.threshold} onChange={(e) => setS({ ...s, threshold: +e.target.value })} className="w-full accent-cyan" />)}
            {field(t('مستوى السجلات', 'Logging level'), <select value={s.logLevel} onChange={(e) => setS({ ...s, logLevel: e.target.value })} className={inputCls}>{['DEBUG', 'INFO', 'WARNING', 'ERROR'].map((l) => <option key={l}>{l}</option>)}</select>)}
            {field(t('عنوان API', 'API base URL'), <input value={s.apiBase} onChange={(e) => setS({ ...s, apiBase: e.target.value })} className={`${inputCls} mono`} />)}
            <div className="flex items-center justify-between rounded-md border border-ok/40 bg-ok/10 px-3 py-2 text-[12.5px]">
              <span className="text-ink">{t('وضع محاكاة SOAR', 'SOAR simulation mode')}</span>
              <span className="ltr font-bold text-ok-bright">ON · locked</span>
            </div>
            <dl className="ltr grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="rounded border border-line/50 px-2 py-1"><dt className="text-ink-3">Database</dt><dd className="text-warn">fixtures</dd></div>
              <div className="rounded border border-line/50 px-2 py-1"><dt className="text-ink-3">Model version</dt><dd className="text-ink">6.0.3-demo</dd></div>
            </dl>
          </div>
        </Panel>
        <div className="flex items-center gap-3 lg:col-span-2">
          <button type="submit" className={btnCls}>
            <Save className="h-4 w-4" aria-hidden />
            {t('حفظ الإعدادات', 'Save settings')}
          </button>
          {saved && <span className="text-[12.5px] text-ok-bright" role="status">{t('تم الحفظ محلياً', 'Saved locally')}</span>}
          <Link to="/" className="text-[12.5px] text-ink-3 hover:text-ink">{t('العودة إلى لوحة التحكم', 'Back to dashboard')}</Link>
        </div>
      </form>
    </div>
  )
}
