export interface Category {
  id: number
  name: string
  description: string
  productCount: number
}

export interface CategoryRequest {
  name: string
  description: string
}

export interface Product {
  id: number
  sku: string
  name: string
  quantity: number
  minimumStock: number
  price: number
  categoryId: number
  categoryName: string
  lowStock: boolean
}

export interface ProductRequest {
  sku: string
  name: string
  quantity: number
  minimumStock: number
  price: number
  categoryId: number
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT'

export interface InventoryTransaction {
  id: number
  productId: number
  productName: string
  productSku: string
  transactionType: TransactionType
  quantity: number
  createdAt: string
  notes: string
}

export interface TransactionRequest {
  productId: number
  transactionType: TransactionType
  quantity: number
  notes?: string
}

export interface DashboardData {
  totalProducts: number
  totalCategories: number
  lowStockCount: number
  totalTransactions: number
  lowStockProducts: Product[]
  recentTransactions: InventoryTransaction[]
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
