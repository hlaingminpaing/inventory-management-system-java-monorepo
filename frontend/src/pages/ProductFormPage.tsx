import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Skeleton,
  Divider,
} from '@mui/material'
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { productApi } from '../api/products'
import { categoryApi } from '../api/categories'
import type { ProductRequest } from '../types'

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productApi.getById(Number(id)),
    enabled: isEdit,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductRequest>({
    defaultValues: {
      sku: '',
      name: '',
      quantity: 0,
      minimumStock: 10,
      price: 0,
      categoryId: 0,
    },
  })

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        name: product.name,
        quantity: product.quantity,
        minimumStock: product.minimumStock,
        price: product.price,
        categoryId: product.categoryId,
      })
    }
  }, [product, reset])

  const mutation = useMutation({
    mutationFn: (data: ProductRequest) =>
      isEdit ? productApi.update(Number(id), data) : productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar(
        isEdit ? 'Product updated successfully' : 'Product created successfully',
        { variant: 'success' }
      )
      navigate('/products')
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  const onSubmit = (data: ProductRequest) => {
    mutation.mutate({
      ...data,
      quantity: Number(data.quantity),
      minimumStock: Number(data.minimumStock),
      price: Number(data.price),
      categoryId: Number(data.categoryId),
    })
  }

  if ((isEdit && productLoading) || categoriesLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          variant="outlined"
          color="inherit"
          id="back-btn"
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? `Editing: ${product?.name}` : 'Fill in the product details below'}
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} id="product-form">
            <Grid container spacing={3}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={700} color="primary.light" mb={2}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="sku"
                  control={control}
                  rules={{
                    required: 'SKU is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SKU"
                      fullWidth
                      error={Boolean(errors.sku)}
                      helperText={errors.sku?.message}
                      placeholder="e.g., ELEC-001"
                      id="product-sku"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: 'Category is required', min: { value: 1, message: 'Select a category' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      fullWidth
                      error={Boolean(errors.categoryId)}
                      helperText={errors.categoryId?.message}
                      id="product-category"
                    >
                      <MenuItem value={0} disabled>
                        Select a category
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'Product name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name"
                      fullWidth
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      placeholder="e.g., Laptop Dell XPS 15"
                      id="product-name"
                    />
                  )}
                />
              </Grid>

              {/* Stock & Pricing */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary.light" mb={2}>
                  Stock & Pricing
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Min 0' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Current Quantity"
                      fullWidth
                      error={Boolean(errors.quantity)}
                      helperText={errors.quantity?.message}
                      id="product-quantity"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="minimumStock"
                  control={control}
                  rules={{
                    required: 'Minimum stock is required',
                    min: { value: 0, message: 'Min 0' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Minimum Stock Level"
                      fullWidth
                      error={Boolean(errors.minimumStock)}
                      helperText={errors.minimumStock?.message || 'Alert threshold'}
                      id="product-min-stock"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be > 0' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Unit Price (USD)"
                      fullWidth
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message}
                      inputProps={{ step: '0.01' }}
                      id="product-price"
                    />
                  )}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/products')}
                    id="cancel-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting || mutation.isPending}
                    id="save-product-btn"
                  >
                    {mutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
