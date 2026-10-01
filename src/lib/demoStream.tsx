import { createContext, useContext, useEffect, useState } from 'react'
import { buildTrend, events as seedEvents, makeEvent, type SecurityEvent } from './fixtures'

export const REFRESH_MS = 30_000

interface Stream {
  tick: number
  lastUpdate: Date | null
  trend: ReturnType<typeof buildTrend>
  recent: SecurityEvent[]
}

const Ctx = createContext<Stream>({ tick: 0, lastUpdate: null, trend: buildTrend(0), recent: seedEvents.slice(0, 5) })

/**
 * Synthetic "live" feed: every 30 s a new demo event is prepended and the
 * trend curve shifts slightly. Replaced by GET /api/stats + /api/events
 * polling (or WebSocket) in the backend milestones.
 */
export function DemoStreamProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [recent, setRecent] = useState<SecurityEvent[]>(seedEvents.slice(0, 5))

  useEffect(() => {
    setLastUpdate(new Date())
    const id = window.setInterval(() => {
      setTick((n) => {
        const next = n + 1
        setRecent((prev) => [makeEvent(5000 + next, new Date()), ...prev].slice(0, 5))
        return next
      })
      setLastUpdate(new Date())
    }, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  return <Ctx.Provider value={{ tick, lastUpdate, trend: buildTrend(tick * 0.6), recent }}>{children}</Ctx.Provider>
}

export const useDemoStream = () => useContext(Ctx)
