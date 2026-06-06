import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import RecordForm from '@/components/RecordForm'
import AbnormalBadge from '@/components/AbnormalBadge'
import { HealthRecord } from '@/types'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function RecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState<HealthRecord | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/records/${id}`)
        setRecord(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchRecord()
  }, [id])

  const handleUpdate = async (data: Partial<HealthRecord>) => {
    const res = await api.put(`/records/${id}`, data)
    setRecord(res.data)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('确定删除这条记录吗？')) return
    await api.delete(`/records/${id}`)
    navigate('/records')
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>
  if (!record) return <div className="text-center py-20 text-gray-500">记录不存在</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/records')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            {editing ? '取消编辑' : '编辑'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>
      </div>

      {editing ? (
        <RecordForm
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          initial={record}
        />
      ) : (
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
      )}
    </div>
  )
}
