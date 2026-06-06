import { Router } from 'express'
import { db } from '../database'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'pdd-166-secret-key'

function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未登录' })
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }
}

function isAbnormal(value: number, type: string): boolean {
  switch (type) {
    case 'systolic': return value > 140 || value < 90
    case 'diastolic': return value > 90 || value < 60
    case 'bloodSugar': return value > 6.1 || value < 3.9
    case 'heartRate': return value > 100 || value < 60
    case 'cholesterol': return value > 5.2
    case 'uricAcid': return value > 420
    default: return false
  }
}

router.use(authMiddleware)

router.get('/', (req: any, res) => {
  const records = db.prepare(
    'SELECT * FROM health_records WHERE user_id = ? ORDER BY date DESC'
  ).all(req.userId)
  res.json(records.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    date: r.date,
    systolic: r.systolic,
    diastolic: r.diastolic,
    bloodSugar: r.blood_sugar,
    weight: r.weight,
    bodyFat: r.body_fat,
    heartRate: r.heart_rate,
    cholesterol: r.cholesterol,
    uricAcid: r.uric_acid,
    notes: r.notes,
    reportImage: r.report_image,
    createdAt: r.created_at
  })))
})

router.get('/summary', (req: any, res) => {
  const record: any = db.prepare(
    'SELECT * FROM health_records WHERE user_id = ? ORDER BY date DESC LIMIT 1'
  ).get(req.userId)

  const pendingReview: string[] = []
  if (record) {
    if (record.systolic && isAbnormal(record.systolic, 'systolic')) pendingReview.push('收缩压')
    if (record.diastolic && isAbnormal(record.diastolic, 'diastolic')) pendingReview.push('舒张压')
    if (record.blood_sugar && isAbnormal(record.blood_sugar, 'bloodSugar')) pendingReview.push('血糖')
    if (record.heart_rate && isAbnormal(record.heart_rate, 'heartRate')) pendingReview.push('心率')
    if (record.cholesterol && isAbnormal(record.cholesterol, 'cholesterol')) pendingReview.push('胆固醇')
    if (record.uric_acid && isAbnormal(record.uric_acid, 'uricAcid')) pendingReview.push('尿酸')
  }

  const abnormalCount = pendingReview.length

  res.json({
    latestRecord: record ? {
      id: record.id,
      userId: record.user_id,
      date: record.date,
      systolic: record.systolic,
      diastolic: record.diastolic,
      bloodSugar: record.blood_sugar,
      weight: record.weight,
      bodyFat: record.body_fat,
      heartRate: record.heart_rate,
      cholesterol: record.cholesterol,
      uricAcid: record.uric_acid,
      notes: record.notes,
      reportImage: record.report_image,
      createdAt: record.created_at
    } : undefined,
    abnormalCount,
    pendingReview
  })
})

router.get('/statistics/yearly', (req: any, res) => {
  const records: any[] = db.prepare(
    'SELECT * FROM health_records WHERE user_id = ? ORDER BY date DESC'
  ).all(req.userId)

  const byYear: Record<number, any[]> = {}
  records.forEach(r => {
    const year = new Date(r.date).getFullYear()
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(r)
  })

  const stats = Object.entries(byYear).map(([year, rs]) => {
    const weights = rs.filter((r: any) => r.weight).map((r: any) => r.weight)
    const systolics = rs.filter((r: any) => r.systolic).map((r: any) => r.systolic)
    let abnormalCount = 0
    rs.forEach((r: any) => {
      if (r.systolic && isAbnormal(r.systolic, 'systolic')) abnormalCount++
      if (r.diastolic && isAbnormal(r.diastolic, 'diastolic')) abnormalCount++
      if (r.blood_sugar && isAbnormal(r.blood_sugar, 'bloodSugar')) abnormalCount++
      if (r.heart_rate && isAbnormal(r.heart_rate, 'heartRate')) abnormalCount++
      if (r.cholesterol && isAbnormal(r.cholesterol, 'cholesterol')) abnormalCount++
      if (r.uric_acid && isAbnormal(r.uric_acid, 'uricAcid')) abnormalCount++
    })

    return {
      year: Number(year),
      recordCount: rs.length,
      avgWeight: weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : undefined,
      avgBloodPressure: systolics.length > 0 ? systolics.reduce((a, b) => a + b, 0) / systolics.length : undefined,
      abnormalCount
    }
  })

  res.json(stats)
})

router.get('/:id', (req: any, res) => {
  const record: any = db.prepare(
    'SELECT * FROM health_records WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId)

  if (!record) return res.status(404).json({ error: '记录不存在' })

  res.json({
    id: record.id,
    userId: record.user_id,
    date: record.date,
    systolic: record.systolic,
    diastolic: record.diastolic,
    bloodSugar: record.blood_sugar,
    weight: record.weight,
    bodyFat: record.body_fat,
    heartRate: record.heart_rate,
    cholesterol: record.cholesterol,
    uricAcid: record.uric_acid,
    notes: record.notes,
    reportImage: record.report_image,
    createdAt: record.created_at
  })
})

router.post('/', (req: any, res) => {
  const {
    date, systolic, diastolic, bloodSugar, weight,
    bodyFat, heartRate, cholesterol, uricAcid, notes, reportImage
  } = req.body

  const result = db.prepare(`
    INSERT INTO health_records
    (user_id, date, systolic, diastolic, blood_sugar, weight, body_fat, heart_rate, cholesterol, uric_acid, notes, report_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, date, systolic, diastolic, bloodSugar, weight, bodyFat, heartRate, cholesterol, uricAcid, notes, reportImage)

  const record: any = db.prepare('SELECT * FROM health_records WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: record.id,
    userId: record.user_id,
    date: record.date,
    systolic: record.systolic,
    diastolic: record.diastolic,
    bloodSugar: record.blood_sugar,
    weight: record.weight,
    bodyFat: record.body_fat,
    heartRate: record.heart_rate,
    cholesterol: record.cholesterol,
    uricAcid: record.uric_acid,
    notes: record.notes,
    reportImage: record.report_image,
    createdAt: record.created_at
  })
})

router.put('/:id', (req: any, res) => {
  const {
    date, systolic, diastolic, bloodSugar, weight,
    bodyFat, heartRate, cholesterol, uricAcid, notes, reportImage
  } = req.body

  db.prepare(`
    UPDATE health_records SET
    date = ?, systolic = ?, diastolic = ?, blood_sugar = ?, weight = ?,
    body_fat = ?, heart_rate = ?, cholesterol = ?, uric_acid = ?, notes = ?, report_image = ?
    WHERE id = ? AND user_id = ?
  `).run(date, systolic, diastolic, bloodSugar, weight, bodyFat, heartRate, cholesterol, uricAcid, notes, reportImage, req.params.id, req.userId)

  const record: any = db.prepare('SELECT * FROM health_records WHERE id = ?').get(req.params.id)
  res.json({
    id: record.id,
    userId: record.user_id,
    date: record.date,
    systolic: record.systolic,
    diastolic: record.diastolic,
    bloodSugar: record.blood_sugar,
    weight: record.weight,
    bodyFat: record.body_fat,
    heartRate: record.heart_rate,
    cholesterol: record.cholesterol,
    uricAcid: record.uric_acid,
    notes: record.notes,
    reportImage: record.report_image,
    createdAt: record.created_at
  })
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM health_records WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

export default router
