import api from './apiClient'
import type { Achievement } from '@/types'

export const achievementService = {
  async getAll(): Promise<Achievement[]> {
    const res = await api.get('/achievements')
    return res.data.data
  },

  async create(achievement: Omit<Achievement, '_id' | 'createdAt'>): Promise<Achievement> {
    const res = await api.post('/achievements', achievement)
    return res.data.data
  },

  async update(id: string, achievement: Partial<Achievement>): Promise<Achievement> {
    const res = await api.put(`/achievements/${id}`, achievement)
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/achievements/${id}`)
  },
}