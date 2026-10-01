import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, BrainCircuit, CheckCircle2, ChartColumn, FileSpreadsheet, Grid3x3, ListChecks, Upload, Workflow, XCircle } from 'lucide-react'
import { DemoChip, Ltr, Mono, PageHeader, Panel } from '@/components/ui'
import { confusionMatrices, datasetInfo, featureImportance, modelClasses, models, trainingPipeline } from '@/lib/fixtures'
import { MAX_CSV_BYTES, validateCsv, type CsvReport } from '@/lib/csvValidator'
import { useLang } from '@/lib/i18n'

export const Route = createFileRoute('/models')({
  component: ModelsPage,
})

function classificationReport(m: number[][], labels: string[]) {
  const total = m.flat().reduce((a, b) => a + b, 0)
  return labels.map((cls, i) => {
    const tp = m[i][i]
    const fp = m.reduce((s, row, r) => (r === i ? s : s + row[i]), 0)
    const fn = m[i].reduce((s, v, c) => (c === i ? s : s + v), 0)
    const precision = tp / (tp + fp || 1)
    const recall = tp / (tp + fn || 1)
    const f1 = (2 * precision * recall) / (precision + recall || 1)
    return { cls, precision, recall, f1, support: m[i].reduce((a, b) => a + b, 0), share: m[i].reduce((a, b) => a + b, 0) / total }
  })
}

function ModelsPage() {
  const { t } = useLang()
  const [sel, setSel] = useState(models[0].id)
  const model = models.find((m) => m.id === sel)!
  const matrix = confusionMatrices[sel]
  const labels = model.kind === 'anomaly' ? ['Normal', 'Anomaly'] : modelClasses
  const report = useMemo(() => classificationReport(matrix, labels), [matrix, labels])
  const maxCell = Math.max(...matrix.flat())

  return (
    <div className="mx-auto max-w-[1680px] space-y-4">
      <PageHeader title={t('نماذج الذكاء الاصطناعي', 'AI models')} subtitle={t('أداء النماذج، التقييم، وخط تدريب البيانات', 'Model performance, evaluation and training pipeline')}>
        <DemoChip label={`Demo metrics · ${datasetInfo.name}`} />
      </PageHeader>

      <div role="note" className="flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/10 px-4 py-2.5 text-[12.5px] text-warn">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t(
          'المقاييس المعروضة توضيحية ومولَّدة لبيانات تجريبية اصطناعية. لا تُعرض كنتائج علمية إلا بعد التدريب والتقييم الفعلي على مجموعة بيانات حقيقية عبر الخادم.',
          'Metrics shown are illustrative, generated for a synthetic demo dataset. They must not be presented as scientific results until real training and evaluation run on a real dataset.',
        )}
      </div>

      <Panel title={t('مقارنة النماذج', 'Model comparison')} icon={BrainCircuit} bodyClassName="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-[12.5px]">
            <thead>
              <tr className="border-b border-line text-[11.5px] text-ink-3">
                {[t('النموذج', 'Model'), t('النوع', 'Kind'), t('الإصدار', 'Version'), t('تاريخ التدريب', 'Trained'), 'Accuracy', 'Precision', 'Recall', 'F1', 'ROC-AUC', t('زمن الاستدلال', 'Inference'), t('زمن التدريب', 'Training'), t('الحالة', 'Status')].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2.5 text-start font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSel(m.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setSel(m.id)}
                  tabIndex={0}
                  aria-selected={sel === m.id}
                  className={`cursor-pointer border-b border-line/30 transition-colors hover:bg-cyan/5 ${sel === m.id ? 'bg-cyan/10' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} aria-hidden />
                      <Ltr className="font-bold text-ink">{m.name}</Ltr>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">{m.kind === 'anomaly' ? t('كشف الشذوذ', 'Anomaly') : t('تصنيف', 'Classifier')}</td>
                  <td className="px-3 py-2.5"><Mono className="text-ink-2">{m.version}</Mono></td>
                  <td className="px-3 py-2.5"><Mono className="text-ink-2">{m.trained}</Mono></td>
                  {[m.accuracy, m.precision, m.recall, m.f1, m.rocAuc].map((v, i) => (
                    <td key={i} className="ltr px-3 py-2.5 font-bold text-ink">{v.toFixed(1)}%</td>
                  ))}
                  <td className="px-3 py-2.5"><Mono className="text-ink-2">{m.inferenceMs} ms</Mono></td>
                  <td className="px-3 py-2.5"><Mono className="text-ink-2">{m.trainingSec} s</Mono></td>
                  <td className="px-3 py-2.5">
                    <span className="ltr rounded border border-ok/40 bg-ok/10 px-1.5 py-0.5 text-[11px] font-bold text-ok-bright">demo-ready</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Panel title={`${t('مصفوفة الالتباس', 'Confusion matrix')} — ${model.name}`} icon={Grid3x3} className="h-full">
            <div className="overflow-x-auto" dir="ltr">
              <table className="mx-auto text-[11.5px]">
                <thead>
                  <tr>
                    <th className="p-1 text-[10px] font-normal text-ink-3">actual ↓ / pred →</th>
                    {labels.map((l) => (
                      <th key={l} className="mono p-1 font-medium text-ink-2">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, r) => (
                    <tr key={r}>
                      <th className="mono p-1 text-end font-medium text-ink-2">{labels[r]}</th>
                      {row.map((v, c) => {
                        const diag = r === c
                        const alpha = Math.max(0.08, Math.sqrt(v / maxCell))
                        return (
                          <td
                            key={c}
                            className="mono h-11 min-w-[54px] rounded p-1 text-center font-bold"
                            style={{
                              background: diag ? `rgba(16,185,129,${alpha * 0.8})` : v > 0 ? `rgba(239,68,68,${Math.min(0.7, 0.12 + v / 40)})` : 'rgba(18,59,97,0.25)',
                              color: '#F8FAFC',
                            }}
                          >
                            {v}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel title={t('تقرير التصنيف', 'Classification report')} icon={ListChecks} className="h-full" bodyClassName="!p-0">
            <table className="ltr w-full text-[12px]">
              <thead>
                <tr className="border-b border-line text-[11px] text-ink-3">
                  {['class', 'precision', 'recall', 'f1-score', 'support'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="mono">
                {report.map((r) => (
                  <tr key={r.cls} className="border-b border-line/30">
                    <td className="px-3 py-2 text-ink">{r.cls}</td>
                    <td className="px-3 py-2 text-ink-2">{r.precision.toFixed(3)}</td>
                    <td className="px-3 py-2 text-ink-2">{r.recall.toFixed(3)}</td>
                    <td className="px-3 py-2 font-bold text-cyan-bright">{r.f1.toFixed(3)}</td>
                    <td className="px-3 py-2 text-ink-2">{r.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel title={t('أهمية الخصائص', 'Feature importance')} icon={ChartColumn} className="h-full">
            {model.id === 'rf' || model.id === 'gb' ? (
              <div className="h-[260px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical" margin={{ left: 30, right: 8, top: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#123B61" strokeOpacity={0.4} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: '#94A3B8' }} width={110} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#06111F', border: '1px solid #06B6D4', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(6,182,212,0.08)' }} />
                    <Bar dataKey="value" fill={model.color} radius={[0, 3, 3, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-10 text-center text-[12.5px] text-ink-3">
                {t('أهمية الخصائص غير مدعومة أصلياً لهذا النموذج', 'Native feature importance is not supported for this model')}
              </p>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel title={t('خط التدريب ومجموعة البيانات', 'Training pipeline & dataset')} icon={Workflow} className="h-full">
            <ol className="ltr flex flex-wrap items-center gap-1.5 text-[11.5px]">
              {trainingPipeline.map((s, i) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className="rounded border border-cyan/40 bg-cyan/10 px-2 py-1 font-medium text-cyan-bright">{s}</span>
                  {i < trainingPipeline.length - 1 && <span className="text-ink-3">→</span>}
                </li>
              ))}
            </ol>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[12.5px] md:grid-cols-3">
              {[
                [t('مجموعة البيانات', 'Dataset'), datasetInfo.name],
                [t('الإصدار', 'Version'), datasetInfo.version],
                [t('المصدر', 'Source'), datasetInfo.source],
                [t('عدد السجلات', 'Records'), datasetInfo.records.toLocaleString('en')],
                [t('عدد الخصائص', 'Features'), String(datasetInfo.features)],
                [t('التقسيم', 'Train/Test split'), datasetInfo.split],
                [t('البذرة العشوائية', 'Random seed'), String(datasetInfo.seed)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] text-ink-3">{k}</dt>
                  <dd className="ltr font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-4 mb-2 text-[12px] font-bold text-ink-2">{t('توزيع الفئات', 'Class distribution')}</h3>
            <ClassBars data={datasetInfo.classDistribution} />
          </Panel>
        </div>
        <div className="xl:col-span-5">
          <CsvValidatorPanel />
        </div>
      </div>
    </div>
  )
}

function ClassBars({ data }: { data: { cls: string; n: number }[] }) {
  const max = Math.max(...data.map((d) => d.n))
  return (
    <ul className="space-y-1.5">
      {data.slice(0, 8).map((d) => (
        <li key={d.cls} className="ltr grid grid-cols-[110px_1fr_56px] items-center gap-2 text-[11.5px]">
          <span className="mono truncate text-ink-2">{d.cls}</span>
          <span className="h-2 overflow-hidden rounded-full bg-line/60">
            <span className="bar-grow block h-full rounded-full bg-cyan" style={{ width: `${(d.n / max) * 100}%` }} />
          </span>
          <span className="mono text-end text-ink">{d.n}</span>
        </li>
      ))}
    </ul>
  )
}

function CsvValidatorPanel() {
  const { t } = useLang()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [report, setReport] = useState<CsvReport | null>(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)

  const handle = async (f: File | undefined) => {
    if (!f) return
    setFile(f)
    setReport(null)
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setReport({ ok: false, errors: ['ملف البيانات غير صالح: يجب أن يكون بصيغة CSV'], warnings: [], rows: 0, columns: [], labelColumn: null, numericColumns: [], missingCells: 0, duplicateRows: 0, classDistribution: [] })
      return
    }
    if (f.size > MAX_CSV_BYTES) {
      setReport(validateCsv('', f.size))
      return
    }
    setBusy(true)
    const text = await f.text()
    setReport(validateCsv(text, f.size))
    setBusy(false)
  }

  return (
    <Panel title={t('رفع مجموعة بيانات CSV للتحقق', 'Upload CSV dataset for validation')} icon={FileSpreadsheet} className="h-full">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          handle(e.dataTransfer.files[0])
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${drag ? 'border-cyan bg-cyan/10' : 'border-line hover:border-cyan/60'}`}
      >
        <Upload className="h-7 w-7 text-cyan" aria-hidden />
        <span className="text-[13px] font-bold text-ink">{t('اسحب ملف CSV هنا أو انقر للاختيار', 'Drop a CSV here or click to choose')}</span>
        <span className="text-[11px] text-ink-3">{t('الحد الأقصى 50MB — يتم الفحص داخل المتصفح فقط', 'Max 50MB — checked in your browser only')}</span>
      </button>
      <input ref={input} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handle(e.target.files?.[0])} aria-label={t('اختيار ملف CSV', 'Choose CSV file')} />

      {busy && <p className="mt-3 text-[12px] text-ink-2">{t('جارٍ فحص الملف...', 'Checking file...')}</p>}

      {report && file && (
        <div className="mt-3 space-y-2 text-[12px]">
          <p className={`flex items-center gap-1.5 font-bold ${report.ok ? 'text-ok-bright' : 'text-threat'}`}>
            {report.ok ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <XCircle className="h-4 w-4" aria-hidden />}
            <Ltr>{file.name}</Ltr> — {report.ok ? t('الملف صالح للتدريب', 'Dataset is valid for training') : t('ملف البيانات غير صالح', 'Invalid dataset')}
          </p>
          {report.columns.length > 0 && (
            <dl className="grid grid-cols-2 gap-1.5">
              {[
                [t('الصفوف', 'Rows'), report.rows.toLocaleString('en')],
                [t('الأعمدة', 'Columns'), report.columns.length],
                [t('عمود التصنيف', 'Label column'), report.labelColumn ?? '—'],
                [t('أعمدة رقمية', 'Numeric columns'), report.numericColumns.length],
                [t('قيم مفقودة', 'Missing cells'), report.missingCells],
                [t('صفوف مكررة', 'Duplicate rows'), report.duplicateRows],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded border border-line/50 bg-base/50 px-2 py-1">
                  <dt className="text-[10.5px] text-ink-3">{k}</dt>
                  <dd className="mono text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {report.errors.map((e) => (
            <p key={e} className="flex items-start gap-1.5 text-threat">
              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {e}
            </p>
          ))}
          {report.warnings.map((w) => (
            <p key={w} className="flex items-start gap-1.5 text-warn">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {w}
            </p>
          ))}
          {report.classDistribution.length > 0 && <ClassBars data={report.classDistribution} />}
          {report.ok && (
            <p className="rounded border border-cyan/30 bg-cyan/5 px-2.5 py-2 text-ink-2">
              {t('التدريب الفعلي وحفظ النماذج عبر POST /api/train/csv يُفعَّل في مرحلة محرك التعلم الآلي (المرحلة 4).', 'Real training and model persistence via POST /api/train/csv is enabled in the ML-engine milestone (milestone 4).')}
            </p>
          )}
        </div>
      )}
    </Panel>
  )
}
