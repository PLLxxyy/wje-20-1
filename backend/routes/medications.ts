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

router.use(authMiddleware)

router.get('/', (req: any, res) => {
  const meds = db.prepare(
    'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)
  res.json(meds.map((m: any) => ({
    id: m.id,
    userId: m.user_id,
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    time: m.time,
    startDate: m.start_date,
    endDate: m.end_date,
    notes: m.notes,
    active: !!m.active,
    createdAt: m.created_at
  })))
})

router.post('/', (req: any, res) => {
  const { name, dosage, frequency, time, startDate, endDate, notes, active } = req.body

  const result = db.prepare(`
    INSERT INTO medications (user_id, name, dosage, frequency, time, start_date, end_date, notes, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, name, dosage, frequency, time, startDate, endDate || null, notes, active !== false ? 1 : 0)

  const med: any = db.prepare('SELECT * FROM medications WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: med.id,
    userId: med.user_id,
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    time: med.time,
    startDate: med.start_date,
    endDate: med.end_date,
    notes: med.notes,
    active: !!med.active,
    createdAt: med.created_at
  })
})

router.put('/:id', (req: any, res) => {
  const { name, dosage, frequency, time, startDate, endDate, notes, active } = req.body

  db.prepare(`
    UPDATE medications SET
    name = ?, dosage = ?, frequency = ?, time = ?, start_date = ?, end_date = ?, notes = ?, active = ?
    WHERE id = ? AND user_id = ?
  `).run(name, dosage, frequency, time, startDate, endDate || null, notes, active !== false ? 1 : 0, req.params.id, req.userId)

  const med: any = db.prepare('SELECT * FROM medications WHERE id = ?').get(req.params.id)
  res.json({
    id: med.id,
    userId: med.user_id,
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    time: med.time,
    startDate: med.start_date,
    endDate: med.end_date,
    notes: med.notes,
    active: !!med.active,
    createdAt: med.created_at
  })
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM medications WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

export default router
