import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Box, Typography, Button, Paper } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useCartStore } from '@/stores/cartStore';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { CartItemRow } from '@/components/customer/CartItemRow';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';

export const Route = createLazyFileRoute('/table/$tableNo/cart')({ component: CartPage });

function CartPage() {
  const { tableNo } = useParams({ from: '/table/$tableNo/cart' });
  const navigate = useNavigate();
  const { items, totalAmount, updateQuantity, removeItem, clear } = useCartStore();
  const [clearOpen, setClearOpen] = useState(false);

  return (
    <CustomerLayout>
      <Box sx={{ p: 2.5, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>장바구니</Typography>
        {items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: '#c7c7cc', mb: 1 }} />
            <Typography sx={{ color: '#86868b' }}>장바구니가 비어있습니다</Typography>
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 2.5 }}>
              {items.map((item) => (
                <CartItemRow key={item.menuId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              ))}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2.5, px: 0.5 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1d1d1f' }}>총 {totalAmount.toLocaleString()}원</Typography>
              <Button variant="text" onClick={() => setClearOpen(true)} data-testid="cart-clear"
                sx={{ color: '#ff3b30', fontWeight: 500, '&:hover': { bgcolor: 'rgba(255,59,48,0.04)' } }}
              >비우기</Button>
            </Box>
            <Button variant="contained" fullWidth sx={{ mt: 2, py: 1.5, bgcolor: '#0071e3', fontSize: '1rem', fontWeight: 600, '&:hover': { bgcolor: '#0077ed' } }}
              onClick={() => navigate({ to: `/table/${tableNo}/order` })} data-testid="cart-order"
            >주문하기</Button>
          </>
        )}
      </Box>
      <ConfirmDialog open={clearOpen} title="장바구니 비우기" message="장바구니를 비우시겠습니까?" onConfirm={() => { clear(); setClearOpen(false); }} onCancel={() => setClearOpen(false)} />
    </CustomerLayout>
  );
}
