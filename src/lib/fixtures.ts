/**
 * AI-IDS 6.0 — DEMO / SYNTHETIC FIXTURES
 *
 * Every number in the UI comes from this single module until the backend
 * milestones in PLAN.md replace it with real API data. Nothing here is a
 * real attack, a real benchmark, or a real measurement — the UI labels all
 * of it as "Demo Mode" / "Synthetic Bootstrap Dataset".
 */

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type EventStatus = 'detected' | 'blocked' | 'processing'

export interface SecurityEvent {
  id: string
  timestamp: string // ISO
  type: string
  typeAr: string
  source: string
  destination: string
  protocol: string
  port: number
  severity: Severity
  confidence: number
  prediction: string
  model: string
  status: EventStatus
  response: string
  iocMatch: string | null
  uebaScore: number
  sensor: 'Zeek' | 'Suricata' | 'Honeypot'
  features: Record<string, number | string>
  audit: { at: string; actor: string; action: string }[]
  createdAt: string
  updatedAt: string
}

export const DATA_MODE = {
  mode: 'demo' as const,
  datasetLabel: 'Synthetic Bootstrap Dataset',
}

export const kpis = [
  { key: 'events', title: 'إجمالي الأحداث', titleEn: 'Total events', value: '2,847', change: '18%', up: true, good: true, subtitle: 'مقارنة بالساعة السابقة', subtitleEn: 'vs previous hour', tone: 'cyan' },
  { key: 'threats', title: 'تهديدات مكتشفة', titleEn: 'Threats detected', value: '86', change: '32%', up: true, good: false, subtitle: 'مقارنة بالساعة السابقة', subtitleEn: 'vs previous hour', tone: 'red' },
  { key: 'accuracy', title: 'دقة نماذج الذكاء الاصطناعي', titleEn: 'AI model accuracy', value: '97.8%', change: '2.6%', up: true, good: true, subtitle: 'بيانات تجريبية — غير مُقيَّمة', subtitleEn: 'Demo value — not evaluated', tone: 'blue' },
  { key: 'contained', title: 'هجمات تم احتواؤها', titleEn: 'Attacks contained', value: '12', change: '140%', up: true, good: true, subtitle: 'محاكاة SOAR', subtitleEn: 'SOAR simulation', tone: 'violet' },
  { key: 'mttr', title: 'متوسط وقت الاستجابة', titleEn: 'Mean response time', value: '2.3', unit: 'ثانية', unitEn: 's', change: '78%', up: false, good: true, subtitle: 'مقارنة بالساعة السابقة', subtitleEn: 'vs previous hour', tone: 'green' },
  { key: 'compliance', title: 'معايير الامتثال النشطة', titleEn: 'Active compliance frameworks', value: '5', change: '100%', up: true, good: true, subtitle: 'حالة التغطية', subtitleEn: 'Coverage status', tone: 'amber', isStatus: true },
] as const

export const threatDistribution = [
  { name: 'محاولات اختراق', nameEn: 'Intrusion attempts', value: 38, color: '#EF4444' },
  { name: 'برمجيات خبيثة', nameEn: 'Malware', value: 24, color: '#F59E0B' },
  { name: 'هجمات DDoS', nameEn: 'DDoS attacks', value: 16, color: '#8B5CF6' },
  { name: 'وصول غير مصرح', nameEn: 'Unauthorized access', value: 9, color: '#3B82F6' },
  { name: 'اكتشافات شذوذ', nameEn: 'Anomalies', value: 8, color: '#06B6D4' },
  { name: 'أخرى', nameEn: 'Other', value: 5, color: '#64748B' },
]

export const threatTotal = 86

export function buildTrend(seed = 0) {
  const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
  const base = [120, 95, 80, 110, 190, 260, 300, 340, 310, 280, 230, 170, 140]
  return hours.map((h, i) => {
    const wobble = Math.round(Math.sin(i * 1.7 + seed) * 18)
    const total = base[i] + wobble
    const threats = Math.round(total * (0.12 + ((i * 7 + seed) % 5) * 0.015))
    const processed = Math.round(total * 0.78 + Math.cos(i + seed) * 10)
    return { time: h, total, threats, processed }
  })
}

export interface MapPoint {
  id: string
  country: string
  countryEn: string
  city: string
  cityEn: string
  coords: [number, number] // [lon, lat]
  count: number
  latest: string
  risk: Severity
  yemen?: boolean
}

export const mapPoints: MapPoint[] = [
  { id: 'sanaa', country: 'اليمن', countryEn: 'Yemen', city: 'صنعاء', cityEn: "Sana'a", coords: [44.21, 15.35], count: 4, latest: 'SSH Brute Force', risk: 'HIGH', yemen: true },
  { id: 'aden', country: 'اليمن', countryEn: 'Yemen', city: 'عدن', cityEn: 'Aden', coords: [45.03, 12.79], count: 2, latest: 'Port Scan', risk: 'MEDIUM', yemen: true },
  { id: 'taiz', country: 'اليمن', countryEn: 'Yemen', city: 'تعز', cityEn: 'Taiz', coords: [44.02, 13.58], count: 2, latest: 'Unauthorized Access', risk: 'HIGH', yemen: true },
  { id: 'usa', country: 'الولايات المتحدة', countryEn: 'United States', city: 'فرجينيا', cityEn: 'Virginia', coords: [-77.4, 38.9], count: 7, latest: 'DDoS Attack', risk: 'CRITICAL' },
  { id: 'china', country: 'الصين', countryEn: 'China', city: 'بكين', cityEn: 'Beijing', coords: [116.4, 39.9], count: 6, latest: 'Malware', risk: 'HIGH' },
  { id: 'europe', country: 'أوروبا', countryEn: 'Europe', city: 'فرانكفورت', cityEn: 'Frankfurt', coords: [8.68, 50.11], count: 5, latest: 'Web Shell', risk: 'MEDIUM' },
  { id: 'me', country: 'الشرق الأوسط', countryEn: 'Middle East', city: 'القاهرة', cityEn: 'Cairo', coords: [31.24, 30.04], count: 4, latest: 'Phishing Domain', risk: 'MEDIUM' },
  { id: 'other1', country: 'دول أخرى', countryEn: 'Other', city: 'ساو باولو', cityEn: 'São Paulo', coords: [-46.63, -23.55], count: 3, latest: 'Port Scan', risk: 'LOW' },
  { id: 'other2', country: 'دول أخرى', countryEn: 'Other', city: 'موسكو', cityEn: 'Moscow', coords: [37.62, 55.75], count: 3, latest: 'Credential Stuffing', risk: 'HIGH' },
]

export const countryRanking = [
  { name: 'اليمن', nameEn: 'Yemen', count: 8, yemen: true },
  { name: 'الولايات المتحدة', nameEn: 'United States', count: 7 },
  { name: 'الصين', nameEn: 'China', count: 6 },
  { name: 'أوروبا', nameEn: 'Europe', count: 5 },
  { name: 'دول أخرى', nameEn: 'Other', count: 10 },
]

export const models = [
  { id: 'rf', name: 'Random Forest', kind: 'classifier', accuracy: 97.8, precision: 97.5, recall: 97.1, f1: 97.3, rocAuc: 99.2, inferenceMs: 1.8, trainingSec: 42, version: '6.0.3', trained: '2025-09-26', status: 'ready', color: '#10B981' },
  { id: 'gb', name: 'Gradient Boosting', kind: 'classifier', accuracy: 97.4, precision: 97.0, recall: 96.8, f1: 96.9, rocAuc: 99.0, inferenceMs: 2.4, trainingSec: 118, version: '6.0.3', trained: '2025-09-26', status: 'ready', color: '#06B6D4' },
  { id: 'lr', name: 'Logistic Regression', kind: 'classifier', accuracy: 96.9, precision: 96.2, recall: 96.0, f1: 96.1, rocAuc: 98.4, inferenceMs: 0.3, trainingSec: 6, version: '6.0.3', trained: '2025-09-26', status: 'ready', color: '#3B82F6' },
  { id: 'svm', name: 'SVM', kind: 'classifier', accuracy: 96.2, precision: 95.9, recall: 95.4, f1: 95.6, rocAuc: 98.1, inferenceMs: 3.1, trainingSec: 204, version: '6.0.3', trained: '2025-09-26', status: 'ready', color: '#8B5CF6' },
  { id: 'if', name: 'Isolation Forest', kind: 'anomaly', accuracy: 95.6, precision: 93.8, recall: 94.9, f1: 94.3, rocAuc: 97.2, inferenceMs: 1.1, trainingSec: 15, version: '6.0.3', trained: '2025-09-26', status: 'ready', color: '#F59E0B' },
]

export const modelClasses = ['Normal', 'DoS', 'Probe', 'BruteForce', 'Malware']

// rows = actual, cols = predicted (synthetic)
export const confusionMatrices: Record<string, number[][]> = {
  rf: [[1912, 8, 5, 3, 2], [6, 604, 4, 1, 0], [9, 3, 388, 2, 1], [4, 0, 3, 211, 2], [3, 1, 2, 1, 146]],
  gb: [[1905, 10, 7, 5, 3], [8, 599, 6, 2, 0], [10, 4, 384, 4, 1], [5, 1, 4, 208, 2], [4, 1, 2, 2, 144]],
  lr: [[1896, 14, 10, 7, 3], [11, 594, 7, 3, 0], [12, 6, 379, 5, 1], [7, 2, 5, 204, 2], [5, 2, 3, 2, 141]],
  svm: [[1889, 16, 13, 9, 3], [13, 590, 8, 4, 0], [14, 7, 376, 5, 1], [8, 2, 6, 202, 2], [6, 2, 3, 3, 139]],
  if: [[1874, 56], [42, 1428]],
}

export const featureImportance = [
  { feature: 'failed_attempts', value: 0.19 },
  { feature: 'dst_port', value: 0.15 },
  { feature: 'byte_rate', value: 0.13 },
  { feature: 'packet_rate', value: 0.11 },
  { feature: 'unique_destinations', value: 0.1 },
  { feature: 'duration', value: 0.08 },
  { feature: 'src_bytes', value: 0.07 },
  { feature: 'connection_state', value: 0.06 },
  { feature: 'dst_bytes', value: 0.05 },
  { feature: 'service', value: 0.04 },
]

export const trainingPipeline = [
  'Dataset', 'Cleaning', 'Missing values', 'Encoding', 'Feature selection', 'Train/Test split', 'Class balancing', 'Training', 'Evaluation', 'Persistence',
]

export const datasetInfo = {
  name: 'Synthetic Bootstrap Dataset',
  version: 'bootstrap-0.1',
  source: 'Generated locally for UI development',
  records: 5000,
  features: 14,
  split: '80 / 20 stratified',
  seed: 42,
  classDistribution: [
    { cls: 'Normal', n: 1930 }, { cls: 'DoS', n: 615 }, { cls: 'Probe', n: 403 }, { cls: 'BruteForce', n: 220 }, { cls: 'Malware', n: 153 },
  ],
}

export const ueba = {
  user: 'user-104',
  risk: 'HIGH' as Severity,
  riskLabel: 'خطر عالي',
  location: 'صنعاء - اليمن',
  device: 'Windows 10',
  reason: 'تسجيل دخول من موقع غير مألوف',
  events: 23,
  avgConfidence: 87,
  highRisk: 7,
  score: 82,
}

export const uebaEntities = [
  { user: 'user-104', score: 82, location: 'صنعاء', device: 'Windows 10', anomaly: 'موقع غير مألوف' },
  { user: 'svc-backup', score: 67, location: 'عدن', device: 'Ubuntu 22.04', anomaly: 'وقت غير معتاد' },
  { user: 'user-071', score: 54, location: 'تعز', device: 'macOS 14', anomaly: 'تكرار مرتفع' },
  { user: 'admin-02', score: 31, location: 'صنعاء', device: 'Windows 11', anomaly: 'ضمن المعدل' },
]

export const soarActions = [
  { id: 's1', action: 'حظر عنوان IP', actionEn: 'Block IP address', target: '185.199.110.12', time: '14:29:02', status: 'simulated', result: 'تمت المحاكاة بنجاح' },
  { id: 's2', action: 'عزل الجهاز', actionEn: 'Isolate host', target: 'WS-SANAA-17', time: '14:26:11', status: 'pending', result: 'بانتظار موافقة المسؤول' },
  { id: 's3', action: 'إضافة إلى القائمة السوداء', actionEn: 'Add to blocklist', target: '203.0.113.5', time: '14:13:40', status: 'simulated', result: 'تمت المحاكاة بنجاح' },
  { id: 's4', action: 'إرسال تنبيه SOC', actionEn: 'Send SOC alert', target: 'SOC-Tier1', time: '14:12:09', status: 'simulated', result: 'أُرسل التنبيه (محاكاة)' },
]

export const honeypot = {
  detected: 48,
  monitored: 12,
  today: 3,
  recent: [
    { type: 'SSH Brute Force', sensor: 'hp-ssh-01', time: '14:22:40', src: '45.83.64.7' },
    { type: 'Web Shell', sensor: 'hp-web-02', time: '13:57:12', src: '198.51.100.23' },
    { type: 'Malware Dropper', sensor: 'hp-smb-01', time: '12:41:05', src: '203.0.113.88' },
  ],
}

export const compliance = [
  { name: 'ISO 27001', score: 92 },
  { name: 'NIST CSF', score: 88 },
  { name: 'CIS Controls', score: 85 },
  { name: 'PCI DSS', score: 90 },
  { name: 'Yemen Security Baseline', nameAr: 'معيار داخلي للمشروع', score: 87, projectReference: true },
]

export const quickStats = [
  { key: 'accounts', label: 'إجمالي الحسابات', labelEn: 'Total accounts', value: '8,421' },
  { key: 'active', label: 'المستخدمون النشطون', labelEn: 'Active users', value: '242' },
  { key: 'devices', label: 'الأجهزة المتصلة', labelEn: 'Connected devices', value: '15' },
  { key: 'monitored', label: 'الأحداث المراقبة', labelEn: 'Monitored events', value: '87' },
  { key: 'dbs', label: 'قواعد البيانات', labelEn: 'Databases', value: '6' },
  { key: 'assets', label: 'الأصول المتكاملة', labelEn: 'Integrated assets', value: '4' },
]

export const iocs = [
  { indicator: '185.199.110.12', type: 'IP', source: 'Honeypot hp-web-02', confidence: 90, firstSeen: '2025-09-24', lastSeen: '2025-09-27', status: 'active', description: 'مصدر هجمات DDoS متكررة' },
  { indicator: 'update-secure-login.xyz', type: 'Domain', source: 'Analyst', confidence: 80, firstSeen: '2025-09-20', lastSeen: '2025-09-27', status: 'active', description: 'نطاق تصيّد' },
  { indicator: 'e3b0c44298fc1c149afbf4c8996fb924', type: 'Hash', source: 'Suricata', confidence: 75, firstSeen: '2025-09-18', lastSeen: '2025-09-25', status: 'active', description: 'ملف Dropper' },
  { indicator: 'http://198.51.100.23/shell.php', type: 'URL', source: 'Honeypot hp-web-02', confidence: 85, firstSeen: '2025-09-26', lastSeen: '2025-09-27', status: 'active', description: 'Web shell' },
  { indicator: 'billing@invoice-alerts.test', type: 'Email', source: 'Analyst', confidence: 60, firstSeen: '2025-09-10', lastSeen: '2025-09-19', status: 'expired', description: 'مرسل رسائل تصيّد' },
]

/* ---------------- Security events ---------------- */

const TYPES: { type: string; typeAr: string; proto: string; port: number; prediction: string }[] = [
  { type: 'SSH Brute Force', typeAr: 'تخمين كلمات مرور SSH', proto: 'TCP', port: 22, prediction: 'BruteForce' },
  { type: 'Malware', typeAr: 'برمجية خبيثة', proto: 'TCP', port: 445, prediction: 'Malware' },
  { type: 'DDoS Attack', typeAr: 'هجوم حجب خدمة', proto: 'UDP', port: 53, prediction: 'DoS' },
  { type: 'Unauthorized Access', typeAr: 'وصول غير مصرح', proto: 'TCP', port: 3389, prediction: 'BruteForce' },
  { type: 'Port Scan', typeAr: 'فحص منافذ', proto: 'TCP', port: 0, prediction: 'Probe' },
  { type: 'Web Shell', typeAr: 'Web Shell', proto: 'HTTP', port: 80, prediction: 'Malware' },
  { type: 'SQL Injection', typeAr: 'حقن SQL', proto: 'HTTP', port: 443, prediction: 'Malware' },
  { type: 'Anomalous Traffic', typeAr: 'حركة شاذة', proto: 'TCP', port: 8080, prediction: 'Anomaly' },
]
const SOURCES = ['192.168.1.45', '10.0.0.23', '185.199.110.12', '172.16.5.10', '203.0.113.5', '45.83.64.7', '198.51.100.23', '10.0.4.77', '192.168.20.9', '91.240.118.3']
const DESTS = ['10.0.0.5', '10.0.0.12', '192.168.1.1', '10.0.2.30', '172.16.0.8']
const STATUSES: EventStatus[] = ['detected', 'blocked', 'processing']
const SEVS: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const MODEL_NAMES = ['Random Forest', 'Gradient Boosting', 'Ensemble', 'Isolation Forest']
const RESPONSES = ['حظر عنوان IP (محاكاة)', 'إرسال تنبيه SOC', 'عزل الجهاز (بانتظار الموافقة)', 'مراقبة فقط']

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function makeId(i: number) {
  const h = (n: number, len: number) => Math.floor(rand(n) * 16 ** len).toString(16).padStart(len, '0')
  return `${h(i + 1, 8)}-${h(i + 2, 4)}-4${h(i + 3, 3)}-a${h(i + 4, 3)}-${h(i + 5, 6)}${h(i + 6, 6)}`
}

export function makeEvent(i: number, at: Date): SecurityEvent {
  const t = TYPES[Math.floor(rand(i * 3) * TYPES.length)]
  const sev = SEVS[Math.floor(rand(i * 5) * SEVS.length)]
  const status = STATUSES[Math.floor(rand(i * 7) * STATUSES.length)]
  const src = SOURCES[Math.floor(rand(i * 11) * SOURCES.length)]
  const iso = at.toISOString()
  const confidence = Math.round(70 + rand(i * 13) * 29)
  const port = t.port || Math.floor(1 + rand(i * 17) * 65000)
  return {
    id: makeId(i),
    timestamp: iso,
    type: t.type,
    typeAr: t.typeAr,
    source: src,
    destination: DESTS[Math.floor(rand(i * 19) * DESTS.length)],
    protocol: t.proto,
    port,
    severity: sev,
    confidence,
    prediction: t.prediction,
    model: MODEL_NAMES[Math.floor(rand(i * 23) * MODEL_NAMES.length)],
    status,
    response: RESPONSES[Math.floor(rand(i * 29) * RESPONSES.length)],
    iocMatch: rand(i * 31) > 0.7 ? src : null,
    uebaScore: Math.round(rand(i * 37) * 100),
    sensor: (['Zeek', 'Suricata', 'Honeypot'] as const)[Math.floor(rand(i * 41) * 3)],
    features: {
      duration: +(rand(i * 43) * 40).toFixed(2),
      src_bytes: Math.floor(rand(i * 47) * 90000),
      dst_bytes: Math.floor(rand(i * 53) * 40000),
      src_packets: Math.floor(rand(i * 59) * 900),
      dst_packets: Math.floor(rand(i * 61) * 600),
      dst_port: port,
      protocol: t.proto,
      connection_state: ['SF', 'S0', 'REJ', 'RSTO'][Math.floor(rand(i * 67) * 4)],
      failed_attempts: Math.floor(rand(i * 71) * 60),
      packet_rate: +(rand(i * 73) * 500).toFixed(1),
      byte_rate: +(rand(i * 79) * 12000).toFixed(1),
      unique_destinations: Math.floor(rand(i * 83) * 40),
    },
    audit: [
      { at: `${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())}:${pad(at.getUTCSeconds())}`, actor: 'ingestion', action: `استقبال الحدث من ${t.proto === 'HTTP' ? 'Suricata' : 'Zeek'}` },
      { at: '+0.4s', actor: 'ml-engine', action: `تصنيف: ${t.prediction} (${confidence}%)` },
      { at: '+0.9s', actor: 'soar-sim', action: 'تشغيل كتيب الاستجابة في وضع المحاكاة' },
    ],
    createdAt: iso,
    updatedAt: iso,
  }
}

// Five headline events from the reference design, then generated history
const HEADLINE = [
  { time: '14:28:17', type: 'SSH Brute Force', src: '192.168.1.45', status: 'detected' as EventStatus, sev: 'HIGH' as Severity },
  { time: '14:25:03', type: 'Malware', src: '10.0.0.23', status: 'blocked' as EventStatus, sev: 'CRITICAL' as Severity },
  { time: '14:21:56', type: 'DDoS Attack', src: '185.199.110.12', status: 'detected' as EventStatus, sev: 'CRITICAL' as Severity },
  { time: '14:18:32', type: 'Unauthorized Access', src: '172.16.5.10', status: 'processing' as EventStatus, sev: 'HIGH' as Severity },
  { time: '14:12:07', type: 'Port Scan', src: '203.0.113.5', status: 'blocked' as EventStatus, sev: 'MEDIUM' as Severity },
]

function buildEvents(): SecurityEvent[] {
  const out: SecurityEvent[] = HEADLINE.map((h, i) => {
    const [hh, mm, ss] = h.time.split(':').map(Number)
    const e = makeEvent(1000 + i, new Date(Date.UTC(2025, 8, 27, hh, mm, ss)))
    const t = TYPES.find((x) => x.type === h.type)!
    return { ...e, type: t.type, typeAr: t.typeAr, protocol: t.proto, prediction: t.prediction, source: h.src, status: h.status, severity: h.sev }
  })
  let cursor = Date.UTC(2025, 8, 27, 14, 10, 0)
  for (let i = 0; i < 115; i++) {
    cursor -= Math.floor(60_000 + rand(i * 97) * 900_000)
    out.push(makeEvent(i, new Date(cursor)))
  }
  return out
}

export const events: SecurityEvent[] = buildEvents()

export const eventTypeOptions = TYPES.map((t) => t.type)

export const statusLabels: Record<EventStatus, { ar: string; en: string; color: string }> = {
  detected: { ar: 'مكتشفة', en: 'Detected', color: '#EF4444' },
  blocked: { ar: 'محظورة', en: 'Blocked', color: '#10B981' },
  processing: { ar: 'قيد المعالجة', en: 'Processing', color: '#F59E0B' },
}

export const severityLabels: Record<Severity, { ar: string; en: string; color: string }> = {
  LOW: { ar: 'منخفضة', en: 'Low', color: '#06B6D4' },
  MEDIUM: { ar: 'متوسطة', en: 'Medium', color: '#F59E0B' },
  HIGH: { ar: 'عالية', en: 'High', color: '#EF4444' },
  CRITICAL: { ar: 'حرجة', en: 'Critical', color: '#FF1744' },
}

// Honest status: the API/database/ML milestones in PLAN.md are not wired yet
export const systemStatus = [
  { key: 'api', label: 'API', value: 'Demo', ok: false },
  { key: 'db', label: 'Database', value: 'Fixtures', ok: false },
  { key: 'model', label: 'Model Engine', value: 'Demo', ok: false },
  { key: 'ids', label: 'IDS Ingestion', value: 'Pending', ok: false },
]
