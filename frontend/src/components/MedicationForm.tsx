import { useState } from 'react'
import { Medication } from '@/types'

interface MedicationFormProps {
  onSubmit: (data: Partial<Medication>) => void
  onCancel: () => void
  initial?: Partial<Medication>
}

export default function MedicationForm({ onSubmit, onCancel, initial }: MedicationFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    dosage: initial?.dosage || '',
    frequency: initial?.frequency || '每天',
    time: initial?.time || '08:00',
    startDate: initial?.startDate || new Date().toISOString().split('T')[0],
    endDate: initial?.endDate || '',
    notes: initial?.notes || '',
    active: initial?.active !== false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...form,
      endDate: form.endDate || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑用药' : '新增用药提醒'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">药品名称</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">剂量</label>
          <input type="text" name="dosage" value={form.dosage} onChange={handleChange} placeholder="如：1片"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">频率</label>
          <select name="frequency" value={form.frequency} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option>每天</option>
            <option>隔天</option>
            <option>每周</option>
            <option>按需</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">服药时间</label>
          <input type="time" name="time" value={form.time} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">结束日期（可选）</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="active" checked={form.active} onChange={handleChange}
          className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
        <label className="text-sm text-gray-700">启用提醒</label>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          取消
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
          保存
        </button>
      </div>
    </form>
  )
}
