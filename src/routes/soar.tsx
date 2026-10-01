import { createFileRoute } from '@tanstack/react-router'
import { SoarPage } from '@/components/ModulePages'

export const Route = createFileRoute('/soar')({
  component: SoarPage,
})
