import { createFileRoute } from '@tanstack/react-router'
import { UebaPage } from '@/components/ModulePages'

export const Route = createFileRoute('/ueba')({
  component: UebaPage,
})
