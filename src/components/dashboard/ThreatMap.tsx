import { useMemo, useState } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import world from 'world-atlas/countries-110m.json'
import { Globe, X } from 'lucide-react'
import { Panel, DemoChip, SeverityBadge } from '@/components/ui'
import { YemenFlag } from '@/components/Brand'
import { countryRanking, mapPoints, severityLabels, type MapPoint } from '@/lib/fixtures'
import { useLang } from '@/lib/i18n'

const W = 560
const H = 290
const YEMEN_ID = '887'

const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>
const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>
const land = { ...countries, features: countries.features.filter((f) => f.id !== '010') }

export function ThreatMap() {
  const { t } = useLang()
  const [selected, setSelected] = useState<MapPoint | null>(null)

  const { projection, paths } = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [4, 4],
        [W - 4, H - 4],
      ],
      land,
    )
    const gen = geoPath(projection)
    return { projection, paths: land.features.map((f) => ({ id: String(f.id), name: f.properties.name, d: gen(f) ?? '' })) }
  }, [])

  const max = Math.max(...countryRanking.map((c) => c.count))

  return (
    <Panel title={t('خريطة التهديدات الجغرافية', 'Geographical threat map')} icon={Globe} action={<DemoChip label={t('محاكاة', 'Simulated')} />} className="h-full">
      <div className="flex h-full flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t('خريطة العالم مع مؤشرات التهديدات', 'World map with threat markers')}>
            <defs>
              <radialGradient id="marker-glow">
                <stop offset="0%" stopColor="#FF1744" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF1744" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g>
              {paths.map((p) => (
                <path
                  key={p.id + p.name}
                  d={p.d}
                  fill={p.id === YEMEN_ID ? 'rgba(239,68,68,0.55)' : '#0C2238'}
                  stroke={p.id === YEMEN_ID ? '#FF1744' : '#1A4A74'}
                  strokeWidth={p.id === YEMEN_ID ? 1.2 : 0.4}
                  style={p.id === YEMEN_ID ? { filter: 'drop-shadow(0 0 6px rgba(255,23,68,0.9))' } : undefined}
                >
                  <title>{p.id === YEMEN_ID ? t('اليمن', 'Yemen') : p.name}</title>
                </path>
              ))}
            </g>
            {mapPoints.map((m) => {
              const xy = projection(m.coords)
              if (!xy) return null
              const [x, y] = xy
              const color = severityLabels[m.risk].color
              const isSel = selected?.id === m.id
              return (
                <g
                  key={m.id}
                  transform={`translate(${x},${y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t(m.city, m.cityEn)} — ${m.count}`}
                  className="cursor-pointer focus:outline-none"
                  onClick={() => setSelected(isSel ? null : m)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelected(isSel ? null : m)
                    }
                  }}
                >
                  <circle r={m.yemen ? 9 : 7} fill="url(#marker-glow)" />
                  <circle r="3" fill="none" stroke={color} strokeWidth="1.2" className="pulse-ring" />
                  <circle r={m.yemen ? 3 : 2.4} fill={m.yemen ? '#FF1744' : color} stroke={isSel ? '#fff' : 'none'} strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {selected && (
            <div className="glass absolute bottom-1 left-1 w-[210px] p-3 text-[12px]" dir={t('rtl', 'ltr')} role="dialog" aria-label={t(selected.city, selected.cityEn)}>
              <button type="button" onClick={() => setSelected(null)} className="absolute end-1.5 top-1.5 text-ink-3 hover:text-ink" aria-label={t('إغلاق', 'Close')}>
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="flex items-center gap-1.5 font-bold text-ink">
                {selected.yemen && <YemenFlag className="h-3 w-4" />}
                {t(selected.country, selected.countryEn)} · {t(selected.city, selected.cityEn)}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-y-1 text-ink-2">
                <dt>{t('عدد التهديدات', 'Threats')}</dt>
                <dd className="ltr text-end font-bold text-ink">{selected.count}</dd>
                <dt>{t('آخر حدث', 'Latest')}</dt>
                <dd className="ltr text-end text-ink">{selected.latest}</dd>
                <dt>{t('مستوى الخطر', 'Risk')}</dt>
                <dd className="text-end">
                  <SeverityBadge severity={selected.risk} />
                </dd>
              </dl>
            </div>
          )}
        </div>

        <ol className="w-full shrink-0 space-y-2 text-[12.5px] sm:w-[128px]" aria-label={t('ترتيب الدول', 'Country ranking')}>
          {countryRanking.map((c) => (
            <li key={c.name}>
              <div className="flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1.5 ${c.yemen ? 'font-bold text-ink' : 'text-ink-2'}`}>
                  {c.yemen && <YemenFlag className="h-2.5 w-3.5" />}
                  {t(c.name, c.nameEn)}
                </span>
                <span className="ltr font-bold text-ink">{c.count}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-line/60">
                <div className="bar-grow h-full rounded-full" style={{ width: `${(c.count / max) * 100}%`, background: c.yemen ? '#FF1744' : '#EF4444', opacity: c.yemen ? 1 : 0.7 }} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  )
}
