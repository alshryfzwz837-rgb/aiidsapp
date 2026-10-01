import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/components/ModulePages'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})
