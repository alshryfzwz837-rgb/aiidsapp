/**
 * Browser-side CSV dataset pre-check. Mirrors the validation the future
 * POST /api/train/csv endpoint performs, so users get instant feedback
 * before any training happens on the server.
 */
export interface CsvReport {
  ok: boolean
  errors: string[]
  warnings: string[]
  rows: number
  columns: string[]
  labelColumn: string | null
  numericColumns: string[]
  missingCells: number
  duplicateRows: number
  classDistribution: { cls: string; n: number }[]
}

export const MAX_CSV_BYTES = 50 * 1024 * 1024
const LABEL_CANDIDATES = ['label', 'class', 'attack', 'attack_cat', 'target', 'y']

function splitLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"'
        i++
      } else quoted = !quoted
    } else if (ch === ',' && !quoted) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

export function validateCsv(text: string, size: number): CsvReport {
  const errors: string[] = []
  const warnings: string[] = []
  const empty: CsvReport = { ok: false, errors, warnings, rows: 0, columns: [], labelColumn: null, numericColumns: [], missingCells: 0, duplicateRows: 0, classDistribution: [] }

  if (size > MAX_CSV_BYTES) {
    errors.push('الملف أكبر من الحد المسموح (50MB)')
    return empty
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length)
  if (lines.length < 2) {
    errors.push('ملف البيانات غير صالح: لا يحتوي على صفوف بيانات')
    return empty
  }
  const columns = splitLine(lines[0])
  if (columns.length < 2) {
    errors.push('ملف البيانات غير صالح: يلزم عمودان على الأقل')
    return { ...empty, columns }
  }
  const labelIdx = columns.findIndex((c) => LABEL_CANDIDATES.includes(c.toLowerCase()))
  if (labelIdx === -1) errors.push(`لم يتم العثور على عمود التصنيف (${LABEL_CANDIDATES.join(' / ')})`)

  const numeric = columns.map(() => true)
  const seen = new Set<string>()
  let duplicateRows = 0
  let missingCells = 0
  let badWidth = 0
  const dist = new Map<string, number>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (seen.has(line)) duplicateRows++
    else seen.add(line)
    const cells = splitLine(line)
    if (cells.length !== columns.length) {
      badWidth++
      continue
    }
    cells.forEach((v, j) => {
      if (v === '' || v.toLowerCase() === 'nan' || v.toLowerCase() === 'null') missingCells++
      else if (numeric[j] && Number.isNaN(Number(v))) numeric[j] = false
    })
    if (labelIdx >= 0) dist.set(cells[labelIdx], (dist.get(cells[labelIdx]) ?? 0) + 1)
  }

  const rows = lines.length - 1
  if (badWidth) errors.push(`${badWidth} صف بعدد أعمدة غير متطابق`)
  if (missingCells) warnings.push(`${missingCells} قيمة مفقودة — ستُعالج أثناء التنظيف`)
  if (duplicateRows) warnings.push(`${duplicateRows} صف مكرر — ستتم إزالته`)
  const numericColumns = columns.filter((_, j) => j !== labelIdx && numeric[j])
  const categorical = columns.filter((_, j) => j !== labelIdx && !numeric[j])
  if (categorical.length) warnings.push(`أعمدة نصية ستُرمَّز: ${categorical.slice(0, 6).join(', ')}${categorical.length > 6 ? '…' : ''}`)
  const classDistribution = [...dist.entries()].map(([cls, n]) => ({ cls, n })).sort((a, b) => b.n - a.n)
  if (labelIdx >= 0 && classDistribution.length < 2) errors.push('يلزم فئتان على الأقل في عمود التصنيف')
  if (classDistribution.length >= 2) {
    const ratio = classDistribution[0].n / classDistribution[classDistribution.length - 1].n
    if (ratio > 10) warnings.push(`عدم توازن بين الفئات (${ratio.toFixed(1)}:1) — سيتم تطبيق موازنة الفئات`)
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    rows,
    columns,
    labelColumn: labelIdx >= 0 ? columns[labelIdx] : null,
    numericColumns,
    missingCells,
    duplicateRows,
    classDistribution,
  }
}
