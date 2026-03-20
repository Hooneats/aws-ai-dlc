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
    <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'grey.50' }}>
      {children}
      <BottomNavigation
        value={value} showLabels
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <BottomNavigationAction
          label="메뉴" icon={<RestaurantMenuIcon />}
          onClick={() => navigate({ to: `/table/${tableNo}/menu` })}
          data-testid="nav-menu"
        />
        <BottomNavigationAction
          label="장바구니"
          icon={<Badge badgeContent={itemCount} color="error"><ShoppingCartIcon /></Badge>}
          onClick={() => navigate({ to: `/table/${tableNo}/cart` })}
          data-testid="nav-cart"
        />
        <BottomNavigationAction
          label="주문내역" icon={<ReceiptLongIcon />}
          onClick={() => navigate({ to: `/table/${tableNo}/history` })}
          data-testid="nav-history"
        />
      </BottomNavigation>
    </Box>
  );
}
