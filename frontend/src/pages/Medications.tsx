import { useEffect, useState } from 'react'
import api from '@/utils/api'
import MedicationForm from '@/components/MedicationForm'
import { Medication } from '@/types'
import { Plus, Trash2, Edit, Clock } from 'lucide-react'

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMedications = async () => {
    try {
      const res = await api.get('/medications')
      setMedications(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  const handleCreate = async (data: Partial<Medication>) => {
    await api.post('/medications', data)
    setShowForm(false)
    fetchMedications()
  }

  const handleUpdate = async (id: number, data: Partial<Medication>) => {
    await api.put(`/medications/${id}`, data)
    setEditingId(null)
    fetchMedications()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这个用药提醒吗？')) return
    await api.delete(`/medications/${id}`)
    fetchMedications()
  }

  const handleToggle = async (med: Medication) => {
    await api.put(`/medications/${med.id}`, { active: !med.active })
    fetchMedications()
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">用药提醒</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增用药
        </button>
      </div>

      {showForm && (
        <MedicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        {medications.map(med => (
          <div key={med.id} className={`bg-white rounded-lg border ${med.active ? 'border-gray-200' : 'border-gray-100 opacity-60'} p-6`}>
            {editingId === med.id ? (
              <MedicationForm
                onSubmit={(data) => handleUpdate(med.id, data)}
                onCancel={() => setEditingId(null)}
                initial={med}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${med.active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      <p className="text-sm text-gray-500">{med.dosage} · {med.frequency} · {med.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(med)}
                      className={`px-3 py-1 text-xs rounded-full ${med.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {med.active ? '已启用' : '已停用'}
                    </button>
                    <button
                      onClick={() => setEditingId(med.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {med.notes && (
                  <p className="text-sm text-gray-500 ml-13">{med.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  开始日期: {new Date(med.startDate).toLocaleDateString('zh-CN')}
                  {med.endDate && ` · 结束日期: ${new Date(med.endDate).toLocaleDateString('zh-CN')}`}
                </p>
              </>
            )}
          </div>
        ))}

        {medications.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>暂无用药提醒</p>
            <p className="text-sm mt-1">点击上方按钮添加用药计划</p>
          </div>
        )}
      </div>
    </div>
  )
}
