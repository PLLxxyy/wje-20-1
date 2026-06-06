import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import AbnormalBadge from '@/components/AbnormalBadge'
import { HealthRecord, FamilyMember } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function FamilyRecordDetail() {
  const { memberId, recordId } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState<HealthRecord | null>(null)
  const [member, setMember] = useState<FamilyMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordRes, familyRes] = await Promise.all([
          api.get(`/family/${memberId}/records/${recordId}`),
          api.get('/family')
        ])
        setRecord(recordRes.data)
        const memberInfo = familyRes.data.find((m: FamilyMember) => m.memberId === Number(memberId))
        setMember(memberInfo || null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [memberId, recordId])

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>
  if (!record) return <div className="text-center py-20 text-gray-500">记录不存在</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/family/${memberId}/records`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </button>
          {member && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{member.memberName}</span>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {member.relation}
              </span>
            </div>
          )}
        </div>
        <div className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          只读
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {new Date(record.date).toLocaleDateString('zh-CN')} 体检记录
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {record.systolic && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">收缩压</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.systolic}
                <span className="text-sm font-normal text-gray-500 ml-1">mmHg</span>
                <AbnormalBadge value={record.systolic} type="systolic" />
              </p>
            </div>
          )}
          {record.diastolic && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">舒张压</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.diastolic}
                <span className="text-sm font-normal text-gray-500 ml-1">mmHg</span>
                <AbnormalBadge value={record.diastolic} type="diastolic" />
              </p>
            </div>
          )}
          {record.bloodSugar && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">血糖</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.bloodSugar}
                <span className="text-sm font-normal text-gray-500 ml-1">mmol/L</span>
                <AbnormalBadge value={record.bloodSugar} type="bloodSugar" />
              </p>
            </div>
          )}
          {record.weight && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">体重</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.weight}
                <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
              </p>
            </div>
          )}
          {record.heartRate && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">心率</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.heartRate}
                <span className="text-sm font-normal text-gray-500 ml-1">次/分</span>
                <AbnormalBadge value={record.heartRate} type="heartRate" />
              </p>
            </div>
          )}
          {record.cholesterol && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">胆固醇</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.cholesterol}
                <span className="text-sm font-normal text-gray-500 ml-1">mmol/L</span>
                <AbnormalBadge value={record.cholesterol} type="cholesterol" />
              </p>
            </div>
          )}
          {record.bodyFat && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">体脂率</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.bodyFat}
                <span className="text-sm font-normal text-gray-500 ml-1">%</span>
              </p>
            </div>
          )}
          {record.uricAcid && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">尿酸</p>
              <p className="text-2xl font-bold text-gray-800">
                {record.uricAcid}
                <span className="text-sm font-normal text-gray-500 ml-1">μmol/L</span>
                <AbnormalBadge value={record.uricAcid} type="uricAcid" />
              </p>
            </div>
          )}
        </div>

        {record.notes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">备注</p>
            <p className="text-sm text-gray-600">{record.notes}</p>
          </div>
        )}

        {record.reportImage && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">体检报告</p>
            <img src={record.reportImage} alt="体检报告" className="max-w-md rounded-lg border" />
          </div>
        )}
      </div>
    </div>
  )
}
