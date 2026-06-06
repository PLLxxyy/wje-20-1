import { useState } from 'react'
import { HealthRecord } from '@/types'

interface RecordFormProps {
  onSubmit: (data: Partial<HealthRecord>) => void
  onCancel: () => void
  initial?: Partial<HealthRecord>
}

export default function RecordForm({ onSubmit, onCancel, initial }: RecordFormProps) {
  const [form, setForm] = useState({
    date: initial?.date || new Date().toISOString().split('T')[0],
    systolic: initial?.systolic || '',
    diastolic: initial?.diastolic || '',
    bloodSugar: initial?.bloodSugar || '',
    weight: initial?.weight || '',
    bodyFat: initial?.bodyFat || '',
    heartRate: initial?.heartRate || '',
    cholesterol: initial?.cholesterol || '',
    uricAcid: initial?.uricAcid || '',
    notes: initial?.notes || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...form,
      systolic: form.systolic ? Number(form.systolic) : undefined,
      diastolic: form.diastolic ? Number(form.diastolic) : undefined,
      bloodSugar: form.bloodSugar ? Number(form.bloodSugar) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      bodyFat: form.bodyFat ? Number(form.bodyFat) : undefined,
      heartRate: form.heartRate ? Number(form.heartRate) : undefined,
      cholesterol: form.cholesterol ? Number(form.cholesterol) : undefined,
      uricAcid: form.uricAcid ? Number(form.uricAcid) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑记录' : '新增体检记录'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
          <input type="date" name="date" value={form.date} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">收缩压 (mmHg)</label>
          <input type="number" name="systolic" value={form.systolic} onChange={handleChange} placeholder="90-140"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">舒张压 (mmHg)</label>
          <input type="number" name="diastolic" value={form.diastolic} onChange={handleChange} placeholder="60-90"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">血糖 (mmol/L)</label>
          <input type="number" step="0.1" name="bloodSugar" value={form.bloodSugar} onChange={handleChange} placeholder="3.9-6.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
          <input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">体脂率 (%)</label>
          <input type="number" step="0.1" name="bodyFat" value={form.bodyFat} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">心率 (次/分)</label>
          <input type="number" name="heartRate" value={form.heartRate} onChange={handleChange} placeholder="60-100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">胆固醇 (mmol/L)</label>
          <input type="number" step="0.1" name="cholesterol" value={form.cholesterol} onChange={handleChange} placeholder="<5.2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">尿酸 (μmol/L)</label>
          <input type="number" name="uricAcid" value={form.uricAcid} onChange={handleChange} placeholder="<420"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
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
