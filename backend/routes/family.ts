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
  const members = db.prepare(`
    SELECT fm.id, fm.user_id, fm.member_id, fm.relation, fm.created_at, u.name as member_name
    FROM family_members fm
    JOIN users u ON fm.member_id = u.id
    WHERE fm.user_id = ?
    ORDER BY fm.created_at DESC
  `).all(req.userId)

  res.json(members.map((m: any) => ({
    id: m.id,
    userId: m.user_id,
    memberId: m.member_id,
    memberName: m.member_name,
    relation: m.relation,
    createdAt: m.created_at
  })))
})

router.post('/', (req: any, res) => {
  const { username, relation } = req.body
  if (!username || !relation) {
    return res.status(400).json({ error: '请填写用户名和关系' })
  }

  const member: any = db.prepare('SELECT id, name FROM users WHERE username = ?').get(username)
  if (!member) {
    return res.status(404).json({ error: '用户不存在' })
  }

  if (member.id === req.userId) {
    return res.status(400).json({ error: '不能绑定自己' })
  }

  const existing: any = db.prepare(
    'SELECT id FROM family_members WHERE user_id = ? AND member_id = ?'
  ).get(req.userId, member.id)

  if (existing) {
    return res.status(400).json({ error: '已绑定该家人' })
  }

  const result = db.prepare(
    'INSERT INTO family_members (user_id, member_id, relation) VALUES (?, ?, ?)'
  ).run(req.userId, member.id, relation)

  res.json({
    id: result.lastInsertRowid,
    userId: req.userId,
    memberId: member.id,
    memberName: member.name,
    relation,
    createdAt: new Date().toISOString()
  })
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM family_members WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

router.get('/:memberId/records', (req: any, res) => {
  const member: any = db.prepare(`
    SELECT id FROM family_members
    WHERE user_id = ? AND member_id = ?
  `).get(req.userId, req.params.memberId)

  if (!member) {
    return res.status(403).json({ error: '无权查看该家人的健康数据' })
  }

  const records = db.prepare(`
    SELECT * FROM health_records
    WHERE user_id = ?
    ORDER BY date DESC
  `).all(req.params.memberId)

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

router.get('/:memberId/records/:recordId', (req: any, res) => {
  const member: any = db.prepare(`
    SELECT id FROM family_members
    WHERE user_id = ? AND member_id = ?
  `).get(req.userId, req.params.memberId)

  if (!member) {
    return res.status(403).json({ error: '无权查看该家人的健康数据' })
  }

  const record: any = db.prepare(`
    SELECT * FROM health_records
    WHERE id = ? AND user_id = ?
  `).get(req.params.recordId, req.params.memberId)

  if (!record) {
    return res.status(404).json({ error: '记录不存在' })
  }

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

export default router
