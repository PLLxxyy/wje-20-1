import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { FamilyMember } from '@/types'
import { Users, Plus, Trash2, User } from 'lucide-react'

export default function Family() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [username, setUsername] = useState('')
  const [relation, setRelation] = useState('父母')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMembers = async () => {
    try {
      const res = await api.get('/family')
      setMembers(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/family', { username, relation })
      setShowAdd(false)
      setUsername('')
      fetchMembers()
    } catch (err: any) {
      setError(err.response?.data?.error || '添加失败')
    }
  }

  const handleRemove = async (id: number) => {
    if (!confirm('确定移除这位家人吗？')) return
    await api.delete(`/family/${id}`)
    fetchMembers()
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">家人管理</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          绑定家人
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">绑定家人账号</h3>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">家人用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关系</label>
              <select
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option>父母</option>
                <option>配偶</option>
                <option>子女</option>
                <option>兄弟姐妹</option>
                <option>其他</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              绑定
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{member.memberName}</h3>
                  <p className="text-sm text-gray-500">{member.relation}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(member.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无绑定的家人</p>
          <p className="text-sm mt-1">绑定家人后可以查看他们的健康数据</p>
        </div>
      )}
    </div>
  )
}
