import { type ReactNode } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useAdminSse } from '@/hooks/useSse';

const DRAWER_WIDTH = 200;
const MENU = [
  { label: '대시보드', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { label: '테이블', icon: <TableBarIcon />, path: '/admin/tables' },
  { label: '메뉴', icon: <RestaurantMenuIcon />, path: '/admin/menus' },
  { label: '카테고리', icon: <CategoryIcon />, path: '/admin/categories' },
  { label: '통계', icon: <BarChartIcon />, path: '/admin/statistics' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  useAdminSse();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>테이블오더 관리</Typography>
          <IconButton color="inherit" onClick={() => { clearAuth(); navigate({ to: '/admin/login' }); }} data-testid="admin-logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {MENU.map((m) => (
            <ListItemButton key={m.path} onClick={() => navigate({ to: m.path })} selected={window.location.pathname === m.path}>
              <ListItemIcon>{m.icon}</ListItemIcon>
              <ListItemText primary={m.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
