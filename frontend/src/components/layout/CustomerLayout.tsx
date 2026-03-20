import { type ReactNode } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useCartStore } from '@/stores/cartStore';
import { useTableSse } from '@/hooks/useSse';
import { useAuthStore } from '@/stores/authStore';

export function CustomerLayout({ children }: { children: ReactNode }) {
  const { tableNo } = useParams({ strict: false }) as { tableNo: string };
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.items.length);
  const tableId = useAuthStore((s) => s.tableId);
  useTableSse(tableId);

  const path = window.location.pathname;
  const value = path.includes('/cart') ? 1 : path.includes('/history') ? 2 : 0;

  return (
    <Box sx={{ pb: 8, minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      {children}
      <BottomNavigation
        value={value} showLabels
        sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, height: 64,
          bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderTop: '0.5px solid rgba(0,0,0,0.12)',
          '& .MuiBottomNavigationAction-root': { color: '#86868b', '&.Mui-selected': { color: '#0071e3' } },
          '& .MuiBottomNavigationAction-label': { fontSize: '0.65rem', fontWeight: 500, mt: 0.25, '&.Mui-selected': { fontSize: '0.65rem' } },
        }}
      >
        <BottomNavigationAction label="메뉴" icon={<RestaurantMenuIcon />} onClick={() => navigate({ to: `/table/${tableNo}/menu` })} data-testid="nav-menu" />
        <BottomNavigationAction label="장바구니" icon={<Badge badgeContent={itemCount} color="error"><ShoppingCartIcon /></Badge>} onClick={() => navigate({ to: `/table/${tableNo}/cart` })} data-testid="nav-cart" />
        <BottomNavigationAction label="주문내역" icon={<ReceiptLongIcon />} onClick={() => navigate({ to: `/table/${tableNo}/history` })} data-testid="nav-history" />
      </BottomNavigation>
    </Box>
  );
}
