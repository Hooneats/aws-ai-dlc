import { Button, ButtonGroup } from '@mui/material';
import type { Order, OrderStatus } from '@/types';

interface Props { order: Order; onStatusChange: (id: number, status: OrderStatus) => void; onCancel: (id: number) => void; }

export function OrderActionButtons({ order, onStatusChange, onCancel }: Props) {
  const { status } = order;
  return (
    <ButtonGroup size="small" sx={{ mt: 1 }}>
      {status === 'PENDING' && (
        <Button variant="contained" color="info" onClick={() => onStatusChange(order.id, 'PREPARING')} data-testid={`order-prepare-${order.id}`}>준비시작</Button>
      )}
      {status === 'PREPARING' && (
        <Button variant="contained" color="success" onClick={() => onStatusChange(order.id, 'COMPLETED')} data-testid={`order-complete-${order.id}`}>완료</Button>
      )}
      {(status === 'PENDING' || status === 'PREPARING') && (
        <Button variant="outlined" color="error" onClick={() => onCancel(order.id)} data-testid={`order-cancel-${order.id}`}>취소</Button>
      )}
    </ButtonGroup>
  );
}
