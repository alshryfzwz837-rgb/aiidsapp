import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '@/components/ModulePages'

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})
