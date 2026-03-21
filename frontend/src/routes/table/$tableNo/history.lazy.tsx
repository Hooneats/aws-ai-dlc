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
        <Typography variant="h5" sx={{ mb: 2, fontSize: '1.5rem' }}>주문 내역</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress size={32} sx={{ color: '#86868b' }} /></Box>
        ) : visibleOrders.length === 0 ? (
          <Typography sx={{ py: 8, textAlign: 'center', color: '#86868b', fontSize: '1rem' }}>주문 내역이 없습니다</Typography>
        ) : (
          visibleOrders.map((order) => <OrderCard key={order.id} order={order} isCustomer />)
        )}
      </Box>
    </CustomerLayout>
  );
}
