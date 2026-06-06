import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHealthRecords } from '@/hooks/useHealthRecords'
import RecordForm from '@/components/RecordForm'
import AbnormalBadge from '@/components/AbnormalBadge'
import { Plus, Trash2, Edit } from 'lucide-react'

export default function Records() {
  const { records, loading, createRecord, deleteRecord } = useHealthRecords()
  const [showForm, setShowForm] = useState(false)

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">体检记录</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增记录
        </button>
      </div>

      {showForm && (
        <RecordForm
          onSubmit={async (data) => {
            await createRecord(data)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {new Date(record.date).toLocaleDateString('zh-CN')}
              </h3>
              <div className="flex items-center gap-2">
                <Link
                  to={`/records/${record.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm('确定删除这条记录吗？')) {
                      deleteRecord(record.id)
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
            <p className="text-sm mt-1">点击上方按钮添加第一条记录</p>
          </div>
        )}
      </div>
    </div>
  )
}
