import express from 'express'
import cors from 'cors'
import { db } from './database'
import './init-db'
import authRoutes from './routes/auth'
import recordRoutes from './routes/records'
import medicationRoutes from './routes/medications'
import familyRoutes from './routes/family'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/medications', medicationRoutes)
app.use('/api/family', familyRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
