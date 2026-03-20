import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { Order } from '@/types';

interface Props { order: Order; isCustomer?: boolean; }

const STATUS = { PENDING: { label: '대기중', color: '#ff9f0a', bg: '#fff8ec' }, PREPARING: { label: '준비중', color: '#0071e3', bg: '#edf4ff' }, COMPLETED: { label: '완료', color: '#30d158', bg: '#edfcf2' }, CANCELLED: { label: '취소', color: '#86868b', bg: '#f5f5f7' } };

export function OrderCard({ order, isCustomer }: Props) {
  const s = isCustomer ? { label: '주문완료', color: '#30d158', bg: '#edfcf2' } : STATUS[order.status];

  return (
    <Card sx={{ mb: 1.5, '&:hover': { transform: 'none' } }} data-testid={`order-card-${order.id}`}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1d1d1f' }}>주문 #{order.id}</Typography>
          <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem', height: 24 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#86868b' }}>{new Date(order.createdAt).toLocaleTimeString('ko-KR')}</Typography>
        {order.items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
            <Typography variant="body2" sx={{ color: '#424245' }}>{item.menuName} × {item.quantity}</Typography>
            <Typography variant="body2" sx={{ color: '#424245' }}>{(item.unitPrice * item.quantity).toLocaleString()}원</Typography>
          </Box>
        ))}
        {order.memo && <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#86868b' }}>📝 {order.memo}</Typography>}
        <Box sx={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', mt: 1.5, pt: 1, textAlign: 'right' }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: '#1d1d1f' }}>{order.totalAmount.toLocaleString()}원</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
