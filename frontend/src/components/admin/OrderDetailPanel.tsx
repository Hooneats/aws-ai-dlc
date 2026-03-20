import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrdersByTable, updateOrderStatus, cancelOrder, deleteOrderItem } from '@/api/orders';
import { OrderCard } from '@/components/customer/OrderCard';
import { OrderActionButtons } from './OrderActionButtons';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';
import type { OrderStatus } from '@/types';

interface Props { tableId: number; }

export function OrderDetailPanel({ tableId }: Props) {
  const qc = useQueryClient();
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: number; itemId?: number } | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'table', tableId],
    queryFn: () => getOrdersByTable(tableId),
    enabled: !!tableId,
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  const cancelMut = useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  const deleteItemMut = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => deleteOrderItem(orderId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'cancel') cancelMut.mutate(confirmAction.id);
    if (confirmAction.type === 'deleteItem' && confirmAction.itemId) deleteItemMut.mutate({ orderId: confirmAction.id, itemId: confirmAction.itemId });
    setConfirmAction(null);
  };

  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (orders.length === 0) return <Typography sx={{ p: 4 }} color="text.secondary">주문이 없습니다</Typography>;

  return (
    <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
      {orders.map((order) => (
        <Box key={order.id} sx={{ mb: 2 }}>
          <OrderCard order={order} />
          {order.items.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
              <Typography variant="caption" sx={{ flex: 1 }}>{item.menuName} × {item.quantity}</Typography>
              {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                <IconButton size="small" onClick={() => setConfirmAction({ type: 'deleteItem', id: order.id, itemId: item.id })} data-testid={`delete-item-${item.id}`}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          <OrderActionButtons
            order={order}
            onStatusChange={(id, status) => statusMut.mutate({ id, status })}
            onCancel={(id) => setConfirmAction({ type: 'cancel', id })}
          />
        </Box>
      ))}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'cancel' ? '주문 취소' : '항목 삭제'}
        message={confirmAction?.type === 'cancel' ? '이 주문을 취소하시겠습니까?' : '이 항목을 삭제하시겠습니까?'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </Box>
  );
}
