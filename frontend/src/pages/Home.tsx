import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/utils/api'
import TrendChart from '@/components/TrendChart'
import AbnormalBadge from '@/components/AbnormalBadge'
import { HealthRecord, HealthSummary } from '@/types'
import { FileText, AlertTriangle, Clock, TrendingUp } from 'lucide-react'

export default function Home() {
  const [summary, setSummary] = useState<HealthSummary | null>(null)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, recordsRes] = await Promise.all([
          api.get('/records/summary'),
          api.get('/records')
        ])
        setSummary(summaryRes.data)
        setRecords(recordsRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  const latest = summary?.latestRecord

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">健康概览</h1>
        <Link to="/records" className="text-sm text-red-500 hover:text-red-600">查看全部</Link>
      </div>

      {/* Latest record summary */}
      {latest && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              最近体检（{new Date(latest.date).toLocaleDateString('zh-CN')}）
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latest.systolic && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">收缩压</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.systolic}
                  <span className="text-sm font-normal text-gray-500 ml-1">mmHg</span>
                  <AbnormalBadge value={latest.systolic} type="systolic" />
                </p>
              </div>
            )}
            {latest.diastolic && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">舒张压</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.diastolic}
                  <span className="text-sm font-normal text-gray-500 ml-1">mmHg</span>
                  <AbnormalBadge value={latest.diastolic} type="diastolic" />
                </p>
              </div>
            )}
            {latest.bloodSugar && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">血糖</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.bloodSugar}
                  <span className="text-sm font-normal text-gray-500 ml-1">mmol/L</span>
                  <AbnormalBadge value={latest.bloodSugar} type="bloodSugar" />
                </p>
              </div>
            )}
            {latest.weight && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">体重</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.weight}
                  <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
                </p>
              </div>
            )}
            {latest.heartRate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">心率</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.heartRate}
                  <span className="text-sm font-normal text-gray-500 ml-1">次/分</span>
                  <AbnormalBadge value={latest.heartRate} type="heartRate" />
                </p>
              </div>
            )}
            {latest.cholesterol && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">胆固醇</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.cholesterol}
                  <span className="text-sm font-normal text-gray-500 ml-1">mmol/L</span>
                  <AbnormalBadge value={latest.cholesterol} type="cholesterol" />
                </p>
              </div>
            )}
            {latest.bodyFat && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">体脂率</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.bodyFat}
                  <span className="text-sm font-normal text-gray-500 ml-1">%</span>
                </p>
              </div>
            )}
            {latest.uricAcid && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">尿酸</p>
                <p className="text-xl font-bold text-gray-800">
                  {latest.uricAcid}
                  <span className="text-sm font-normal text-gray-500 ml-1">μmol/L</span>
                  <AbnormalBadge value={latest.uricAcid} type="uricAcid" />
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending review */}
      {summary && summary.pendingReview.length > 0 && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h2 className="text-lg font-semibold text-yellow-800 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            待复查项目
          </h2>
          <div className="flex flex-wrap gap-2">
            {summary.pendingReview.map((item, i) => (
              <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trend charts */}
      {records.length >= 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            趋势分析
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart records={records} field="systolic" label="收缩压" unit="mmHg" />
            <TrendChart records={records} field="diastolic" label="舒张压" unit="mmHg" color="#3b82f6" />
            <TrendChart records={records} field="bloodSugar" label="血糖" unit="mmol/L" color="#10b981" />
            <TrendChart records={records} field="weight" label="体重" unit="kg" color="#f59e0b" />
          </div>
        </div>
      )}

      {/* Medication reminders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            今日用药
          </h2>
          <Link to="/medications" className="text-sm text-red-500 hover:text-red-600">管理用药</Link>
        </div>
        <p className="text-gray-500 text-sm">请在用药提醒页面设置您的用药计划</p>
      </div>
    </div>
  )
}
