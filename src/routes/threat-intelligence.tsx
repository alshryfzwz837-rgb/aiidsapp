import { createFileRoute } from '@tanstack/react-router'
import { ThreatIntelPage } from '@/components/ModulePages'

export const Route = createFileRoute('/threat-intelligence')({
  component: ThreatIntelPage,
})
