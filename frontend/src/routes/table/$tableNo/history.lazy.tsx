import { createLazyFileRoute } from '@tanstack/react-router';
import { Box, Typography, CircularProgress } from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
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
      <Box sx={{ p: 2.5, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>주문 내역</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress sx={{ color: '#0071e3' }} /></Box>
        ) : visibleOrders.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <ReceiptLongOutlinedIcon sx={{ fontSize: 48, color: '#c7c7cc', mb: 1 }} />
            <Typography sx={{ color: '#86868b' }}>주문 내역이 없습니다</Typography>
          </Box>
        ) : (
          visibleOrders.map((order) => <OrderCard key={order.id} order={order} isCustomer />)
        )}
      </Box>
    </CustomerLayout>
  );
}
