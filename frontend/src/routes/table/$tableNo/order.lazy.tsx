import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Box, Typography, Button, Paper, TextField, Snackbar, Alert } from '@mui/material';
import { useCartStore } from '@/stores/cartStore';
import { createOrder } from '@/api/orders';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useState } from 'react';

export const Route = createLazyFileRoute('/table/$tableNo/order')({ component: OrderPage });

function OrderPage() {
  const { tableNo } = useParams({ from: '/table/$tableNo/order' });
  const navigate = useNavigate();
  const { items, totalAmount, clear } = useCartStore();
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      await createOrder({ items: items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })), memo: memo || undefined });
      clear();
      navigate({ to: `/table/${tableNo}/menu` });
    } catch { setError('주문에 실패했습니다. 다시 시도해주세요.'); }
    finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#86868b' }}>장바구니가 비어있습니다</Typography>
          <Button sx={{ mt: 2, color: '#0071e3' }} onClick={() => navigate({ to: `/table/${tableNo}/menu` })}>메뉴로 돌아가기</Button>
        </Box>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Box sx={{ p: 2.5, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>주문 확인</Typography>
        <Paper sx={{ p: 2.5 }}>
          {items.map((i) => (
            <Box key={i.menuId} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
              <Typography variant="body2" sx={{ color: '#424245' }}>{i.menuName} × {i.quantity}</Typography>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#424245' }}>{(i.finalPrice * i.quantity).toLocaleString()}원</Typography>
            </Box>
          ))}
          <Box sx={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', mt: 1.5, pt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={700} sx={{ color: '#1d1d1f' }}>합계</Typography>
            <Typography fontWeight={700} sx={{ color: '#1d1d1f' }}>{totalAmount.toLocaleString()}원</Typography>
          </Box>
        </Paper>
        <TextField fullWidth label="요청사항 (선택)" value={memo} onChange={(e) => setMemo(e.target.value)} margin="normal" placeholder="예: 덜 맵게, 얼음 빼주세요" data-testid="order-memo" />
        <Button variant="contained" fullWidth sx={{ mt: 2, py: 1.5, bgcolor: '#0071e3', fontSize: '1rem', fontWeight: 600, '&:hover': { bgcolor: '#0077ed' } }}
          onClick={handleOrder} disabled={loading} data-testid="order-confirm"
        >{loading ? '주문 중...' : `${totalAmount.toLocaleString()}원 주문하기`}</Button>
      </Box>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Snackbar>
    </CustomerLayout>
  );
}
