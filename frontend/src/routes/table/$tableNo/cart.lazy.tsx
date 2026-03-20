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
        <Typography variant="h6" gutterBottom>장바구니</Typography>
        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>장바구니가 비어있습니다</Typography>
        ) : (
          <>
            <Paper sx={{ p: 2 }}>
              {items.map((item) => (
                <CartItemRow key={item.menuId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              ))}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">총 {totalAmount.toLocaleString()}원</Typography>
              <Button variant="text" color="error" onClick={() => setClearOpen(true)} data-testid="cart-clear">비우기</Button>
            </Box>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => navigate({ to: `/table/${tableNo}/order` })} data-testid="cart-order">주문하기</Button>
          </>
        )}
      </Box>
      <ConfirmDialog open={clearOpen} title="장바구니 비우기" message="장바구니를 비우시겠습니까?" onConfirm={() => { clear(); setClearOpen(false); }} onCancel={() => setClearOpen(false)} />
    </CustomerLayout>
  );
}
