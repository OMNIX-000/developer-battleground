import api from './apiClient'
import type { AuthResponse, ContactMessage, User } from '@/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', { email, password })
    return res.data.data
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/register', { name, email, password })
    return res.data.data
  },

  getToken(): string | null {
    return localStorage.getItem('db_token')
  },

  saveAuth(auth: AuthResponse): void {
    localStorage.setItem('db_token', auth.token)
    localStorage.setItem('db_user', JSON.stringify(auth.user))
  },

  clearAuth(): void {
    localStorage.removeItem('db_token')
    localStorage.removeItem('db_user')
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('db_user')
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },
}

export const adminService = {
  async getMessages(): Promise<ContactMessage[]> {
    const res = await api.get('/admin/messages')
    return res.data.data
  },

  async updateMessage(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    const res = await api.patch(`/admin/messages/${id}`, { status })
    return res.data.data
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/admin/messages/${id}`)
  },
}