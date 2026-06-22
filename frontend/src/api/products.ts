import api from './client'
import type { Product, ProductRequest } from '../types'

export const productApi = {
  getAll: () => api.get<Product[]>('/products').then((r) => r.data),
  getById: (id: number) => api.get<Product>(`/products/${id}`).then((r) => r.data),
  create: (data: ProductRequest) => api.post<Product>('/products', data).then((r) => r.data),
  update: (id: number, data: ProductRequest) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/products/${id}`),
}
