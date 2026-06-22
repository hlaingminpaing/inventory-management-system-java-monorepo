import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
} from '@mui/material'
import { Add as AddIcon, Category as CategoryIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { categoryApi } from '../api/categories'
import type { CategoryRequest } from '../types'

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryRequest>({
    defaultValues: { name: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Category created successfully', { variant: 'success' })
      reset()
      setOpen(false)
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load categories. Please ensure the backend is running.</Alert>
    )
  }

  const categoryColors = [
    '#6366f1', '#14b8a6', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6',
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {categories.length} product categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          id="add-category-btn"
        >
          Add Category
        </Button>
      </Box>

      {/* Category Cards */}
      <Grid container spacing={3}>
        {categories.map((category, idx) => {
          const color = categoryColors[idx % categoryColors.length]
          return (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px rgba(0,0,0,0.4)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
                        border: `1px solid ${color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CategoryIcon sx={{ color }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                          minHeight: 40,
                        }}
                      >
                        {category.description || 'No description provided'}
                      </Typography>
                      <Chip
                        label={`${category.productCount} product${category.productCount !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          bgcolor: `${color}22`,
                          color,
                          border: `1px solid ${color}44`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                  {/* Bottom accent line */}
                  <Box
                    sx={{
                      mt: 2.5,
                      height: 2,
                      borderRadius: 1,
                      background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Create Category Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#1e293b',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      >
        <DialogTitle fontWeight={700}>Create New Category</DialogTitle>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} id="category-form">
          <DialogContent>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'Category name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category Name"
                      fullWidth
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      placeholder="e.g., Electronics"
                      id="category-name"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description (optional)"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Brief description of this category..."
                      id="category-description"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              id="submit-category-btn"
            >
              {mutation.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
