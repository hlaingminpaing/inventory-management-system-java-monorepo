import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  LinearProgress,
  Avatar,
} from '@mui/material'
import {
  Inventory2 as InventoryIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  SwapHoriz as TransactionIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Tune as AdjustIcon,
} from '@mui/icons-material'
import { dashboardApi } from '../api/dashboard'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  subtitle?: string
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px rgba(0,0,0,0.4)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
              border: `1px solid ${color}44`,
            }}
          >
            <Box sx={{ color }}>{icon}</Box>
          </Avatar>
        </Box>
        {/* Decorative gradient bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
          }}
        />
      </CardContent>
    </Card>
  )
}

function getTransactionIcon(type: string) {
  switch (type) {
    case 'IN':
      return <TrendingUpIcon fontSize="small" />
    case 'OUT':
      return <TrendingDownIcon fontSize="small" />
    default:
      return <AdjustIcon fontSize="small" />
  }
}

function getTransactionColor(type: string) {
  switch (type) {
    case 'IN':
      return 'success'
    case 'OUT':
      return 'error'
    default:
      return 'warning'
  }
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load dashboard data. Please ensure the backend is running.
      </Alert>
    )
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time overview of your warehouse inventory
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={data?.totalProducts ?? 0}
            icon={<InventoryIcon />}
            color="#6366f1"
            subtitle="Active inventory items"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Categories"
            value={data?.totalCategories ?? 0}
            icon={<CategoryIcon />}
            color="#14b8a6"
            subtitle="Product categories"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Alerts"
            value={data?.lowStockCount ?? 0}
            icon={<WarningIcon />}
            color="#f59e0b"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Transactions"
            value={data?.totalTransactions ?? 0}
            icon={<TransactionIcon />}
            color="#10b981"
            subtitle="All time records"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Low Stock Products */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <WarningIcon sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight={700}>
                  Low Stock Products
                </Typography>
                <Chip
                  label={data?.lowStockProducts?.length ?? 0}
                  size="small"
                  color="warning"
                  sx={{ ml: 'auto', fontWeight: 700 }}
                />
              </Box>
              {data?.lowStockProducts?.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">All products are well stocked!</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {data?.lowStockProducts?.slice(0, 6).map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {product.sku} • {product.categoryName}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              (product.quantity / Math.max(product.minimumStock, 1)) * 100,
                              100
                            )}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: 'rgba(245, 158, 11, 0.2)',
                              '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' },
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight={700} color="warning.main">
                          {product.quantity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          / {product.minimumStock} min
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TransactionIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700}>
                  Recent Transactions
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.recentTransactions?.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                              {tx.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tx.productSku}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTransactionIcon(tx.transactionType)}
                            label={tx.transactionType}
                            color={getTransactionColor(tx.transactionType) as 'success' | 'error' | 'warning'}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={600}>
                            {tx.transactionType === 'OUT' ? '-' : '+'}
                            {tx.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" color="text.secondary">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
