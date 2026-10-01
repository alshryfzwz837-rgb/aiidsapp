import { createFileRoute } from '@tanstack/react-router'
import { HoneypotsPage } from '@/components/ModulePages'

export const Route = createFileRoute('/honeypots')({
  component: HoneypotsPage,
})
