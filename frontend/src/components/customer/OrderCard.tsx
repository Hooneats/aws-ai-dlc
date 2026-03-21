import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { Order } from '@/types';

interface Props { order: Order; isCustomer?: boolean; }

export function OrderCard({ order, isCustomer }: Props) {
  const statusLabel = isCustomer ? '주문완료' : { PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료', CANCELLED: '취소' }[order.status];
  const statusBg = isCustomer ? '#34c759' : { PENDING: '#ff9f0a', PREPARING: '#0071e3', COMPLETED: '#34c759', CANCELLED: '#ff3b30' }[order.status];

  return (
    <Card sx={{ mb: 2, border: '1px solid rgba(0,0,0,0.06)' }} data-testid={`order-card-${order.id}`}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: '0.95rem' }}>주문 #{order.id}</Typography>
            <Typography variant="caption" sx={{ color: '#86868b' }}>{new Date(order.createdAt).toLocaleTimeString('ko-KR')}</Typography>
          </Box>
          <Chip label={statusLabel} size="small" sx={{ bgcolor: statusBg, color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
        </Box>
        {order.items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#1d1d1f' }}>{item.menuName} × {item.quantity}</Typography>
            <Typography variant="body2" sx={{ color: '#86868b' }}>{(item.unitPrice * item.quantity).toLocaleString()}원</Typography>
          </Box>
        ))}
        {order.memo && <Typography variant="caption" sx={{ color: '#86868b', mt: 1, display: 'block' }}>📝 {order.memo}</Typography>}
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.06)', mt: 1.5, pt: 1, textAlign: 'right' }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: '1rem' }}>{order.totalAmount.toLocaleString()}원</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
