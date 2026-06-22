import api from './client'
import type { InventoryTransaction, TransactionRequest, PageResponse } from '../types'

export const transactionApi = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageResponse<InventoryTransaction>>(`/transactions?page=${page}&size=${size}`)
      .then((r) => r.data),
  create: (data: TransactionRequest) =>
    api.post<InventoryTransaction>('/transactions', data).then((r) => r.data),
}
