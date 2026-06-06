import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import { HealthRecord, FamilyMember } from '@/types'
import AbnormalBadge from '@/components/AbnormalBadge'
import { ArrowLeft, FileText } from 'lucide-react'

export default function FamilyRecords() {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [member, setMember] = useState<FamilyMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, familyRes] = await Promise.all([
          api.get(`/family/${memberId}/records`),
          api.get('/family')
        ])
        setRecords(recordsRes.data)
        const memberInfo = familyRes.data.find((m: FamilyMember) => m.memberId === Number(memberId))
        setMember(memberInfo || null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [memberId])

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/family')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {member ? `${member.memberName}的体检记录` : '家人的体检记录'}
          </h1>
          {member && (
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {member.relation}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {new Date(record.date).toLocaleDateString('zh-CN')}
              </h3>
              <Link
                to={`/family/${memberId}/records/${record.id}`}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {record.systolic && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">收缩压</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.systolic} mmHg
                    <AbnormalBadge value={record.systolic} type="systolic" />
                  </p>
                </div>
              )}
              {record.diastolic && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">舒张压</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.diastolic} mmHg
                    <AbnormalBadge value={record.diastolic} type="diastolic" />
                  </p>
                </div>
              )}
              {record.bloodSugar && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">血糖</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.bloodSugar} mmol/L
                    <AbnormalBadge value={record.bloodSugar} type="bloodSugar" />
                  </p>
                </div>
              )}
              {record.weight && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">体重</p>
                  <p className="text-lg font-semibold text-gray-800">{record.weight} kg</p>
                </div>
              )}
              {record.heartRate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">心率</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.heartRate} 次/分
                    <AbnormalBadge value={record.heartRate} type="heartRate" />
                  </p>
                </div>
              )}
              {record.cholesterol && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">胆固醇</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.cholesterol} mmol/L
                    <AbnormalBadge value={record.cholesterol} type="cholesterol" />
                  </p>
                </div>
              )}
              {record.bodyFat && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">体脂率</p>
                  <p className="text-lg font-semibold text-gray-800">{record.bodyFat}%</p>
                </div>
              )}
              {record.uricAcid && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">尿酸</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {record.uricAcid} μmol/L
                    <AbnormalBadge value={record.uricAcid} type="uricAcid" />
                  </p>
                </div>
              )}
            </div>

            {record.notes && (
              <p className="mt-3 text-sm text-gray-500">{record.notes}</p>
            )}
          </div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>暂无体检记录</p>
            <p className="text-sm mt-1">该家人还没有上传体检记录</p>
          </div>
        )}
      </div>
    </div>
  )
}
