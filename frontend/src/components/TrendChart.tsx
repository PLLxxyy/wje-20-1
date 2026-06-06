import { useMemo } from 'react'
import { HealthRecord } from '@/types'

interface TrendChartProps {
  records: HealthRecord[]
  field: keyof HealthRecord
  label: string
  unit: string
  color?: string
  min?: number
  max?: number
}

export default function TrendChart({ records, field, label, unit, color = '#ef4444', min, max }: TrendChartProps) {
  const data = useMemo(() => {
    return [...records]
      .filter(r => r[field] !== undefined && r[field] !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12)
  }, [records, field])

  if (data.length < 2) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">{label}趋势</h3>
        <p className="text-sm text-gray-400 text-center py-8">数据不足，至少需要2条记录</p>
      </div>
    )
  }

  const values = data.map(d => d[field] as number)
  const chartMin = min !== undefined ? min : Math.min(...values) * 0.9
  const chartMax = max !== undefined ? max : Math.max(...values) * 1.1
  const range = chartMax - chartMin || 1

  const width = 400
  const height = 160
  const padding = { top: 10, right: 10, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW
    const y = padding.top + chartH - ((d[field] as number - chartMin) / range) * chartH
    return { x, y, value: d[field] as number, date: d.date }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{label}趋势 ({unit})</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 200 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = padding.top + chartH * (1 - t)
          return (
            <g key={t}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                {(chartMin + range * t).toFixed(1)}
              </text>
            </g>
          )
        })}

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} />

        {/* Area under line */}
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`}
          fill={color}
          fillOpacity={0.1}
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="white" stroke={color} strokeWidth={2} />
            <text x={p.x} y={padding.top + chartH + 20} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {new Date(p.date).getMonth() + 1}/{new Date(p.date).getDate()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
