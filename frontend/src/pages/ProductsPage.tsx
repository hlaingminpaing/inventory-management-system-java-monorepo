import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { productApi } from '../api/products'
import type { Product } from '../types'

export default function ProductsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Product deleted successfully', { variant: 'success' })
      setDeleteId(null)
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
      setDeleteId(null)
    },
  })

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load products. Please ensure the backend is running.</Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} items in inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/new')}
          id="add-product-btn"
        >
          Add Product
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, SKU, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              id="product-search"
            />
          </Box>

          {/* Table */}
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <InventoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Min Stock</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((product: Product) => (
                    <TableRow
                      key={product.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.05)' },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={product.sku}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            color: 'primary.light',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.categoryName}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(20, 184, 166, 0.1)',
                            color: 'secondary.light',
                            border: '1px solid rgba(20, 184, 166, 0.2)',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={product.lowStock ? 'warning.main' : 'text.primary'}
                        >
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {product.minimumStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {formatCurrency(product.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {product.lowStock ? (
                          <Chip
                            icon={<WarningIcon />}
                            label="Low Stock"
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Chip
                            label="In Stock"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/products/${product.id}/edit`)}
                              id={`edit-product-${product.id}`}
                              sx={{ color: 'primary.light', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteId(product.id)}
                              id={`delete-product-${product.id}`}
                              sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.15)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            background: '#1e293b',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          },
        }}
      >
        <DialogTitle fontWeight={700}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this product? This action cannot be undone and will also
            remove all associated transaction history.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            id="confirm-delete-btn"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
