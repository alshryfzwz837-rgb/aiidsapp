import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/components/ModulePages'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})
