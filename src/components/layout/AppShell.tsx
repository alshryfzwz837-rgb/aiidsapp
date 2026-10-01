import { Link, useNavigate, useRouterState, type LinkProps } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  BookCheck,
  BrainCircuit,
  Bug,
  Database,
  FileText,
  FingerprintPattern,
  Home,
  Menu,
  Radar,
  Search,
  Settings,
  ShieldAlert,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Logo, YemenFlag } from '@/components/Brand'
import { DemoChip } from '@/components/ui'
import { useLang } from '@/lib/i18n'
import { REFRESH_MS, useDemoStream } from '@/lib/demoStream'
import { systemStatus } from '@/lib/fixtures'

export const NAV: { to: NonNullable<LinkProps['to']>; ar: string; en: string; icon: LucideIcon }[] = [
  { to: '/', ar: 'الرئيسية', en: 'Dashboard', icon: Home },
  { to: '/events', ar: 'الأحداث الأمنية', en: 'Security Events', icon: ShieldAlert },
  { to: '/models', ar: 'نماذج الذكاء الاصطناعي', en: 'AI Models', icon: BrainCircuit },
  { to: '/ueba', ar: 'تحليل السلوك (UEBA)', en: 'Behavior Analytics (UEBA)', icon: FingerprintPattern },
  { to: '/soar', ar: 'الاستجابة الآلية (SOAR)', en: 'Automated Response (SOAR)', icon: Workflow },
  { to: '/threat-intelligence', ar: 'الاستخبارات التهديدية', en: 'Threat Intelligence', icon: Radar },
  { to: '/honeypots', ar: 'مصائد العسل (Honeypots)', en: 'Honeypots', icon: Bug },
  { to: '/compliance', ar: 'الامتثال والمعايير', en: 'Compliance', icon: BookCheck },
  { to: '/users', ar: 'إدارة المستخدمين', en: 'User Management', icon: Users },
  { to: '/reports', ar: 'التقارير', en: 'Reports', icon: FileText },
  { to: '/database', ar: 'قواعد البيانات', en: 'Databases', icon: Database },
  { to: '/settings', ar: 'الإعدادات', en: 'Settings', icon: Settings },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLang()
  const path = useRouterState({ select: (s) => s.location.pathname })
  return (
    <nav aria-label={t('التنقل الرئيسي', 'Main navigation')} className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-4">
        <Logo />
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV.map((item) => {
          const active = item.to === '/' ? path === '/' : path.startsWith(item.to)
          const Icon = item.icon
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-md border-s-[3px] px-3 py-2 text-[13.5px] transition-all duration-200 ${
                  active
                    ? 'border-cyan bg-cyan/15 font-bold text-ink shadow-[0_0_16px_rgba(6,182,212,0.18)]'
                    : 'border-transparent text-ink-2 hover:bg-cyan/5 hover:text-ink hover:shadow-[0_0_12px_rgba(6,182,212,0.12)]'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-cyan-bright' : 'text-ink-3 group-hover:text-cyan'}`} aria-hidden />
                <span className="truncate">{t(item.ar, item.en)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="m-3 rounded-lg border border-line bg-base/80 p-3 text-center">
        <div className="flex items-center justify-center gap-2 text-[13px] font-bold">
          <YemenFlag className="h-4 w-6" />
          {t('الجمهورية اليمنية', 'Republic of Yemen')}
        </div>
        <p className="mt-1 text-[11px] text-ink-3">{t('الأمن السيبراني لمستقبل آمن', 'Cybersecurity for a safer future')}</p>
      </div>
    </nav>
  )
}

function Clock() {
  const { lang } = useLang()
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const locale = lang === 'ar' ? 'ar-YE-u-nu-latn' : 'en-GB'
  return (
    <div className="hidden text-center leading-tight lg:block" aria-live="off">
      <div className="text-[12px] text-ink-2">
        {now ? now.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Aden' }) : '—'}
      </div>
      <div className="mono text-[14px] font-bold text-cyan-bright">
        {now ? now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Aden' }) : '--:--:--'}
      </div>
    </div>
  )
}

const NOTIFICATIONS = [
  { ar: 'هجوم DDoS مكتشف من 185.199.110.12', en: 'DDoS detected from 185.199.110.12', time: '14:21' },
  { ar: 'عزل الجهاز WS-SANAA-17 بانتظار الموافقة', en: 'Host isolation WS-SANAA-17 awaiting approval', time: '14:26' },
  { ar: 'درجة خطر user-104 تجاوزت 80%', en: 'user-104 risk score exceeded 80%', time: '14:30' },
]

function Header({ onMenu }: { onMenu: () => void }) {
  const { t, lang, setLang } = useLang()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<'notif' | 'profile' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-[65px] items-center gap-3 border-b border-line bg-base/85 px-3 backdrop-blur-md md:px-5">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-md border border-line p-2 text-ink-2 hover:text-ink lg:hidden"
        aria-label={t('فتح القائمة', 'Open menu')}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 whitespace-nowrap text-[13px]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok-bright opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok-bright" />
        </span>
        <span className="hidden text-ink sm:inline">{t('النظام يعمل بشكل طبيعي', 'System operating normally')}</span>
      </div>

      <Clock />

      <div className="hidden items-center gap-1.5 whitespace-nowrap text-[12.5px] font-bold xl:flex">
        <YemenFlag />
        {t('الجمهورية اليمنية', 'Republic of Yemen')}
      </div>

      <div className="ms-auto flex items-center gap-2" ref={ref}>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            navigate({ to: '/events', search: { q: q.trim() || undefined } })
          }}
          className="relative hidden md:block"
        >
          <label htmlFor="global-search" className="sr-only">
            {t('بحث', 'Search')}
          </label>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input
            id="global-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('البحث في الأحداث، الأنماط، أو المؤشرات...', 'Search events, patterns or indicators...')}
            className="h-9 w-[240px] rounded-md border border-line bg-surface/80 ps-9 pe-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-cyan focus:outline-none xl:w-[330px]"
          />
        </form>

        <div className="flex overflow-hidden rounded-md border border-line text-[12px] font-bold" role="group" aria-label={t('اللغة', 'Language')}>
          {(['ar', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`ltr px-2.5 py-1.5 transition-colors ${lang === l ? 'bg-cyan/20 text-cyan-bright' : 'text-ink-3 hover:text-ink'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === 'notif' ? null : 'notif')}
            className="relative rounded-md border border-line p-2 text-ink-2 hover:border-cyan/60 hover:text-ink"
            aria-label={t('الإشعارات (3 جديدة)', 'Notifications (3 new)')}
            aria-expanded={open === 'notif'}
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="ltr absolute -top-1.5 -end-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,23,68,0.6)]">
              3
            </span>
          </button>
          {open === 'notif' && (
            <div className="glass absolute end-0 top-12 z-40 w-80 p-2" role="menu">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[13px] font-bold">{t('الإشعارات', 'Notifications')}</span>
                <DemoChip />
              </div>
              {NOTIFICATIONS.map((n) => (
                <Link
                  key={n.time}
                  to="/events"
                  onClick={() => setOpen(null)}
                  className="block rounded-md px-2 py-2 text-[12.5px] text-ink-2 hover:bg-cyan/10 hover:text-ink"
                  role="menuitem"
                >
                  <span className="mono me-2 text-[11px] text-cyan">{n.time}</span>
                  {t(n.ar, n.en)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === 'profile' ? null : 'profile')}
            className="flex items-center gap-2 rounded-md border border-transparent px-1 py-1 hover:border-line"
            aria-label={t('قائمة المستخدم', 'User menu')}
            aria-expanded={open === 'profile'}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-ok text-[13px] font-extrabold text-body ring-2 ring-cyan/40">
              A
            </span>
            <span className="hidden text-start leading-tight sm:block">
              <span className="ltr block text-[13px] font-bold">admin</span>
              <span className="block text-[11px] text-ink-3">{t('مدير النظام', 'System Administrator')}</span>
            </span>
          </button>
          {open === 'profile' && (
            <div className="glass absolute end-0 top-12 z-40 w-56 p-2" role="menu">
              <Link to="/settings" onClick={() => setOpen(null)} className="block rounded-md px-3 py-2 text-[13px] hover:bg-cyan/10" role="menuitem">
                {t('الإعدادات', 'Settings')}
              </Link>
              <Link to="/users" onClick={() => setOpen(null)} className="block rounded-md px-3 py-2 text-[13px] hover:bg-cyan/10" role="menuitem">
                {t('إدارة المستخدمين', 'User management')}
              </Link>
              <p className="border-t border-line px-3 pt-2 text-[11px] text-ink-3">
                {t('تسجيل الدخول والصلاحيات (RBAC) ضمن المرحلة 3', 'Login & RBAC arrive in milestone 3')}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const { t } = useLang()
  const { lastUpdate } = useDemoStream()
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line bg-base/85 px-4 py-2.5 text-[12px] text-ink-2 md:px-5">
      <div className="flex items-center gap-2">
        <span className="ltr font-extrabold text-ink">AI-IDS 6.0</span>
        <span className="text-ink-3">|</span>
        <span>{t('الأمن السيبراني لمستقبل آمن', 'Cybersecurity for a safer future')}</span>
      </div>
      <div className="flex items-center gap-2 font-bold text-ink">
        <YemenFlag />
        {t('الجمهورية اليمنية', 'Republic of Yemen')}
      </div>
      <ul className="ltr flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="System status">
        {systemStatus.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? 'bg-ok-bright' : 'bg-warn'}`} aria-hidden />
            {s.label}: <span className={s.ok ? 'text-ok-bright' : 'text-warn'}>{s.value}</span>
          </li>
        ))}
        <li>
          <DemoChip label="Demo Mode" />
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <span>{t(`التحديث تلقائي كل ${REFRESH_MS / 1000} ثانية`, `Auto-refresh every ${REFRESH_MS / 1000}s`)}</span>
        {lastUpdate && <span className="mono text-cyan">{lastUpdate.toLocaleTimeString('en-GB', { hour12: false })}</span>}
      </div>
    </footer>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  const [drawer, setDrawer] = useState(false)
  const path = useRouterState({ select: (s) => s.location.pathname })
  useEffect(() => setDrawer(false), [path])

  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar — sits on the right in RTL because it is first in flow */}
      <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 border-e border-line bg-base/95 lg:block">
        <Sidebar />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('القائمة', 'Menu')}>
          <button type="button" className="absolute inset-0 bg-body/70 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-label={t('إغلاق القائمة', 'Close menu')} />
          <aside className="absolute inset-y-0 start-0 w-[260px] border-e border-line bg-base">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="absolute end-2 top-2 z-10 rounded p-1.5 text-ink-2 hover:text-ink"
              aria-label={t('إغلاق القائمة', 'Close menu')}
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setDrawer(true)} />
        <main className="min-w-0 flex-1 p-3 md:p-5">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
