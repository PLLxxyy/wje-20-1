import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import { HealthRecord } from '@/types'

export function useHealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/records')
      setRecords(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createRecord = async (data: Partial<HealthRecord>) => {
    const res = await api.post('/records', data)
    setRecords(prev => [res.data, ...prev])
    return res.data
  }

  const updateRecord = async (id: number, data: Partial<HealthRecord>) => {
    const res = await api.put(`/records/${id}`, data)
    setRecords(prev => prev.map(r => r.id === id ? res.data : r))
    return res.data
  }

  const deleteRecord = async (id: number) => {
    await api.delete(`/records/${id}`)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  return { records, loading, fetchRecords, createRecord, updateRecord, deleteRecord }
}
