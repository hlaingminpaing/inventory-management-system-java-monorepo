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
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  TablePagination,
} from '@mui/material'
import {
  Add as AddIcon,
  TrendingUp as InIcon,
  TrendingDown as OutIcon,
  Tune as AdjustIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { transactionApi } from '../api/transactions'
import { productApi } from '../api/products'
import type { TransactionRequest } from '../types'

function TransactionTypeBadge({ type }: { type: string }) {
  const config = {
    IN: { color: 'success' as const, icon: <InIcon fontSize="small" />, label: 'Stock In' },
    OUT: { color: 'error' as const, icon: <OutIcon fontSize="small" />, label: 'Stock Out' },
    ADJUSTMENT: { color: 'warning' as const, icon: <AdjustIcon fontSize="small" />, label: 'Adjustment' },
  }
  const c = config[type as keyof typeof config] || config.ADJUSTMENT
  return (
    <Chip icon={c.icon} label={c.label} color={c.color} size="small" sx={{ fontWeight: 600 }} />
  )
}

export default function TransactionsPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(20)

  const { data: txPage, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', page],
    queryFn: () => transactionApi.getAll(page, rowsPerPage),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionRequest>({
    defaultValues: {
      productId: 0,
      transactionType: 'IN',
      quantity: 1,
      notes: '',
    },
  })

  const mutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Transaction recorded successfully', { variant: 'success' })
      reset()
      setOpen(false)
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  const onSubmit = (data: TransactionRequest) => {
    mutation.mutate({
      ...data,
      productId: Number(data.productId),
      quantity: Number(data.quantity),
    })
  }

  if (txLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Inventory Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {txPage?.totalElements ?? 0} total transactions recorded
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          id="add-transaction-btn"
        >
          Record Transaction
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Date & Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txPage?.content?.map((tx) => (
                  <TableRow key={tx.id} hover sx={{ '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.04)' } }}>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        #{tx.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {tx.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tx.productSku}
                        size="small"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          color: 'primary.light',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TransactionTypeBadge type={tx.transactionType} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={
                          tx.transactionType === 'IN'
                            ? 'success.main'
                            : tx.transactionType === 'OUT'
                            ? 'error.main'
                            : 'warning.main'
                        }
                      >
                        {tx.transactionType === 'OUT' ? '-' : '+'}
                        {tx.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }} noWrap>
                        {tx.notes || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20]}
            component="div"
            count={txPage?.totalElements ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
          />
        </CardContent>
      </Card>

      {/* New Transaction Dialog */}
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
        <DialogTitle fontWeight={700}>Record New Transaction</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} id="transaction-form">
          <DialogContent>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Controller
                  name="productId"
                  control={control}
                  rules={{ required: 'Product is required', min: { value: 1, message: 'Select a product' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Product"
                      fullWidth
                      error={Boolean(errors.productId)}
                      helperText={errors.productId?.message}
                      id="tx-product"
                    >
                      <MenuItem value={0} disabled>Select a product</MenuItem>
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name} — Stock: {p.quantity}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="transactionType"
                  control={control}
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Transaction Type"
                      fullWidth
                      error={Boolean(errors.transactionType)}
                      helperText={errors.transactionType?.message}
                      id="tx-type"
                    >
                      <MenuItem value="IN">📥 Stock In</MenuItem>
                      <MenuItem value="OUT">📤 Stock Out</MenuItem>
                      <MenuItem value="ADJUSTMENT">🔧 Adjustment</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Min 1' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Quantity"
                      fullWidth
                      error={Boolean(errors.quantity)}
                      helperText={errors.quantity?.message}
                      id="tx-quantity"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes (optional)"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add a note about this transaction..."
                      id="tx-notes"
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
              id="submit-transaction-btn"
            >
              {mutation.isPending ? 'Recording...' : 'Record Transaction'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
