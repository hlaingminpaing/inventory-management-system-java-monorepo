import api from './client'
import type { Category, CategoryRequest } from '../types'

export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories').then((r) => r.data),
  getById: (id: number) => api.get<Category>(`/categories/${id}`).then((r) => r.data),
  create: (data: CategoryRequest) => api.post<Category>('/categories', data).then((r) => r.data),
}
