import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Chip,
  alpha,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Inventory2 as InventoryIcon,
  SwapHoriz as TransactionIcon,
  Category as CategoryIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Warehouse as WarehouseIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

const DRAWER_WIDTH = 260

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/products', label: 'Products', icon: <InventoryIcon /> },
  { path: '/transactions', label: 'Transactions', icon: <TransactionIcon /> },
  { path: '/categories', label: 'Categories', icon: <CategoryIcon /> },
]

export default function Layout() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 72,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : 72,
            overflowX: 'hidden',
            transition: 'width 0.3s ease',
            background: 'linear-gradient(180deg, #0a0f1e 0%, #0f172a 100%)',
            borderRight: '1px solid rgba(99, 102, 241, 0.15)',
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 2.5,
            gap: 1.5,
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <WarehouseIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          {open && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
                InventoryOS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Warehouse Platform
              </Typography>
            </Box>
          )}
        </Box>

        {/* Navigation */}
        <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path)
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!open ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 1.2,
                      background: active
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)'
                        : 'transparent',
                      border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      '&:hover': {
                        background: alpha('#6366f1', 0.12),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: active ? 'primary.light' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                          color: active ? 'primary.light' : 'text.secondary',
                        }}
                      />
                    )}
                    {open && active && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>

        {/* Bottom user section */}
        {open && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                WM
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Warehouse Manager
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@inventory.com
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'rgba(10, 15, 30, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.light' } }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Chip
              label="v1.0.0"
              size="small"
              sx={{
                bgcolor: alpha('#6366f1', 0.15),
                color: 'primary.light',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />

            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.light' } }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.light' } }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              WM
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.05) 0%, transparent 60%)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
