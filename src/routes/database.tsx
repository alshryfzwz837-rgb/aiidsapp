import { createFileRoute } from '@tanstack/react-router'
import { DatabasePage } from '@/components/ModulePages'

export const Route = createFileRoute('/database')({
  component: DatabasePage,
})
