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

const DRAWER_WIDTH = 220;
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
      <AppBar position="fixed" elevation={0} sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.12)', color: '#1d1d1f',
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>테이블오더 관리</Typography>
          <IconButton onClick={() => { clearAuth(); navigate({ to: '/admin/login' }); }} data-testid="admin-logout" sx={{ color: '#86868b' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', bgcolor: '#fbfbfd', borderRight: '0.5px solid rgba(0,0,0,0.08)' },
      }}>
        <Toolbar />
        <List sx={{ px: 1, pt: 1 }}>
          {MENU.map((m) => (
            <ListItemButton
              key={m.path} onClick={() => navigate({ to: m.path })}
              selected={window.location.pathname === m.path}
              sx={{
                borderRadius: 2.5, mb: 0.5,
                '&.Mui-selected': { bgcolor: 'rgba(0,113,227,0.08)', color: '#0071e3', '& .MuiListItemIcon-root': { color: '#0071e3' }, '&:hover': { bgcolor: 'rgba(0,113,227,0.12)' } },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#86868b' }}>{m.icon}</ListItemIcon>
              <ListItemText primary={m.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: '#f5f5f7', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
