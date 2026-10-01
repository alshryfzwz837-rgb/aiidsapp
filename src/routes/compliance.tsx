import { createFileRoute } from '@tanstack/react-router'
import { CompliancePage } from '@/components/ModulePages'

export const Route = createFileRoute('/compliance')({
  component: CompliancePage,
})
