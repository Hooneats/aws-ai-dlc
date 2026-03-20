import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { Order } from '@/types';

interface Props { order: Order; isCustomer?: boolean; }

export function OrderCard({ order, isCustomer }: Props) {
  const statusLabel = isCustomer ? '주문완료' : { PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료', CANCELLED: '취소' }[order.status];
  const statusColor = { PENDING: 'warning', PREPARING: 'info', COMPLETED: 'success', CANCELLED: 'error' }[order.status] as 'warning' | 'info' | 'success' | 'error';

  return (
    <Card sx={{ mb: 1.5 }} data-testid={`order-card-${order.id}`}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2">주문 #{order.id}</Typography>
          <Chip label={statusLabel} color={isCustomer ? 'success' : statusColor} size="small" />
        </Box>
        <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleTimeString('ko-KR')}</Typography>
        {order.items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="body2">{item.menuName} × {item.quantity}</Typography>
            <Typography variant="body2">{(item.unitPrice * item.quantity).toLocaleString()}원</Typography>
          </Box>
        ))}
        {order.memo && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>📝 {order.memo}</Typography>}
        <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1, pt: 0.5, textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="bold">{order.totalAmount.toLocaleString()}원</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
