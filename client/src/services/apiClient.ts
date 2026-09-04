import axios from 'axios'
import type { ApiResponse } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('db_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload: ApiResponse<unknown> = {
      success: false,
      message: error.response?.data?.message || 'NETWORK ERROR // CONNECTION LOST',
    }
    return Promise.reject(payload)
  },
)

export const handleError = (error: unknown): string => {
  if (isApiError(error)) return error.message || 'UNKNOWN ERROR'
  return 'UNKNOWN ERROR'
}

export function isApiError(error: unknown): error is ApiResponse<unknown> {
  return typeof error === 'object' && error !== null && 'success' in error
}

export default api