import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductFormPage from './pages/ProductFormPage'
import TransactionsPage from './pages/TransactionsPage'
import CategoriesPage from './pages/CategoriesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>
    </Routes>
  )
}
