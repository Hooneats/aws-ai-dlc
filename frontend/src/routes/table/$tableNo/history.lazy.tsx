import { createLazyFileRoute } from '@tanstack/react-router';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getOrdersBySession } from '@/api/orders';
import { useAuthStore } from '@/stores/authStore';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { OrderCard } from '@/components/customer/OrderCard';

export const Route = createLazyFileRoute('/table/$tableNo/history')({ component: OrderHistoryPage });

function OrderHistoryPage() {
  const sessionId = useAuthStore((s) => s.sessionId);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'session', sessionId],
    queryFn: () => getOrdersBySession(sessionId!),
    enabled: !!sessionId, refetchInterval: 30000,
  });

  const visibleOrders = orders.filter((o) => o.status !== 'CANCELLED');

  return (
    <CustomerLayout>
      <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>주문 내역</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress /></Box>
        ) : visibleOrders.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>주문 내역이 없습니다</Typography>
        ) : (
          visibleOrders.map((order) => <OrderCard key={order.id} order={order} isCustomer />)
        )}
      </Box>
    </CustomerLayout>
  );
}
