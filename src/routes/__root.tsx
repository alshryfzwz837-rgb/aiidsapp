import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LangProvider } from '@/lib/i18n'
import { DemoStreamProvider } from '@/lib/demoStream'

import '../styles.css'

const siteName = 'AI-IDS 6.0 — منصة كشف التسلل بالذكاء الاصطناعي'
const siteDescription =
  'AI-IDS 6.0 — Yemen Cyber Defense & AI Intrusion Detection Platform. منصة مركز عمليات أمنية لكشف التسلل والاستجابة بالذكاء الاصطناعي — الجمهورية اليمنية.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#020B18' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Tajawal:wght@400;500;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="glass mx-auto mt-16 max-w-md p-8 text-center">
      <p className="mono text-4xl font-bold text-cyan-bright">404</p>
      <p className="mt-2 text-ink-2">الصفحة غير موجودة · Page not found</p>
      <Link to="/" className="mt-5 inline-block rounded-md border border-cyan/50 px-4 py-2 text-sm font-bold text-cyan-bright hover:bg-cyan/10">
        العودة إلى لوحة التحكم
      </Link>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        <LangProvider>
          <DemoStreamProvider>
            <AppShell>{children}</AppShell>
          </DemoStreamProvider>
        </LangProvider>
        <Scripts />
      </body>
    </html>
  )
}
