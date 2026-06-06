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

export default router
