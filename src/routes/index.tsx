import { createFileRoute } from '@tanstack/react-router'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { EventTrend, ThreatDonut } from '@/components/dashboard/Charts'
import { ThreatMap } from '@/components/dashboard/ThreatMap'
import { CompliancePanel, HoneypotPanel, ModelPerformance, QuickStats, RecentEvents, SoarPanel, UebaPanel } from '@/components/dashboard/Panels'
import { YemenBadge } from '@/components/Brand'
import { DemoChip } from '@/components/ui'
import { useLang } from '@/lib/i18n'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

/*
 * Grid order note: in RTL the first grid item renders on the right, so each
 * row lists panels right-to-left to match the reference layout
 * (map → trend → donut puts the donut on the far left).
 */
function Dashboard() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('لوحة التحكم الأمنية', 'Security Control Dashboard')}</h1>
          <p className="mt-0.5 text-sm text-ink-2">{t('مراقبة وتحليل التهديدات في الوقت الفعلي', 'Real-time threat monitoring and analysis')}</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoChip label="Demo Mode · Synthetic Bootstrap Dataset" />
          <YemenBadge />
        </div>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="md:col-span-2 xl:col-span-5">
          <ThreatMap />
        </div>
        <div className="md:col-span-1 xl:col-span-4">
          <EventTrend />
        </div>
        <div className="md:col-span-1 xl:col-span-3">
          <ThreatDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <UebaPanel />
        </div>
        <div className="xl:col-span-4">
          <ModelPerformance />
        </div>
        <div className="md:col-span-2 xl:col-span-5">
          <RecentEvents />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <QuickStats />
        </div>
        <div className="xl:col-span-3">
          <CompliancePanel />
        </div>
        <div className="xl:col-span-3">
          <HoneypotPanel />
        </div>
        <div className="xl:col-span-3">
          <SoarPanel />
        </div>
      </div>
    </div>
  )
}
