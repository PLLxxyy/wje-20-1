import { useEffect, useState } from 'react'
import api from '@/utils/api'
import TrendChart from '@/components/TrendChart'
import { HealthRecord } from '@/types'
import { BarChart3 } from 'lucide-react'

interface YearlyStats {
  year: number
  recordCount: number
  avgWeight?: number
  avgBloodPressure?: number
  abnormalCount: number
}

export default function Statistics() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/records')
        setRecords(res.data)
        const statsRes = await api.get('/records/statistics/yearly')
        setYearlyStats(statsRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-red-500" />
        健康统计
      </h1>

      {/* Yearly summary cards */}
      {yearlyStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearlyStats.map(stat => (
            <div key={stat.year} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{stat.year}年</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">体检次数</span>
                  <span className="text-sm font-medium text-gray-800">{stat.recordCount} 次</span>
                </div>
                {stat.avgWeight && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">平均体重</span>
                    <span className="text-sm font-medium text-gray-800">{stat.avgWeight.toFixed(1)} kg</span>
                  </div>
                )}
                {stat.avgBloodPressure && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">平均收缩压</span>
                    <span className="text-sm font-medium text-gray-800">{stat.avgBloodPressure.toFixed(0)} mmHg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">异常指标</span>
                  <span className="text-sm font-medium text-yellow-600">{stat.abnormalCount} 项</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trend charts */}
      {records.length >= 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">趋势图表</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart records={records} field="systolic" label="收缩压" unit="mmHg" />
            <TrendChart records={records} field="diastolic" label="舒张压" unit="mmHg" color="#3b82f6" />
            <TrendChart records={records} field="bloodSugar" label="血糖" unit="mmol/L" color="#10b981" />
            <TrendChart records={records} field="weight" label="体重" unit="kg" color="#f59e0b" />
            <TrendChart records={records} field="heartRate" label="心率" unit="次/分" color="#8b5cf6" />
            <TrendChart records={records} field="cholesterol" label="胆固醇" unit="mmol/L" color="#ec4899" />
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>暂无统计数据</p>
          <p className="text-sm mt-1">添加体检记录后查看统计</p>
        </div>
      )}
    </div>
  )
}
