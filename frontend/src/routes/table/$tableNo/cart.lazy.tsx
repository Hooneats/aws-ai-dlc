import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Box, Typography, Button, Paper } from '@mui/material';
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
      <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, fontSize: '1.5rem' }}>장바구니</Typography>
        {items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#86868b', fontSize: '1rem' }}>장바구니가 비어있습니다</Typography>
            <Button onClick={() => navigate({ to: `/table/${tableNo}/menu` })} sx={{ mt: 2, color: '#0071e3' }}>메뉴 보러가기</Button>
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
              {items.map((item) => (
                <CartItemRow key={item.menuId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              ))}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 0.5 }}>
              <Typography variant="h6" fontWeight={700}>{totalAmount.toLocaleString()}원</Typography>
              <Button variant="text" onClick={() => setClearOpen(true)} data-testid="cart-clear" sx={{ color: '#86868b', fontSize: '0.8rem' }}>전체 삭제</Button>
            </Box>
            <Button
              variant="contained" fullWidth data-testid="cart-order"
              onClick={() => navigate({ to: `/table/${tableNo}/order` })}
              sx={{ mt: 2, py: 1.5, bgcolor: '#0071e3', fontSize: '1rem', fontWeight: 600, '&:hover': { bgcolor: '#0077ed' } }}
            >주문하기</Button>
          </>
        )}
      </Box>
      <ConfirmDialog open={clearOpen} title="장바구니 비우기" message="장바구니를 비우시겠습니까?" onConfirm={() => { clear(); setClearOpen(false); }} onCancel={() => setClearOpen(false)} />
    </CustomerLayout>
  );
}
