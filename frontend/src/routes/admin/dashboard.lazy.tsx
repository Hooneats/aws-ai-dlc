import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '@/api/tables';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { TableList } from '@/components/admin/TableList';
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel';
import { ServiceCallAlert } from '@/components/admin/ServiceCallAlert';
import { useSseStore } from '@/stores/sseStore';

export const Route = createLazyFileRoute('/admin/dashboard')({ component: DashboardPage });

function DashboardPage() {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const { soundEnabled, toggleSound } = useSseStore();

  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    refetchInterval: 30000,
  });

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Tooltip title={soundEnabled ? '알림음 끄기' : '알림음 켜기'}>
            <IconButton onClick={toggleSound} data-testid="sound-toggle">
              {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <ServiceCallAlert />
        <Box sx={{ display: 'flex', flex: 1, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <TableList tables={tables} selectedId={selectedTableId} onSelect={setSelectedTableId} />
          <Box sx={{ flex: 1 }}>
            {selectedTableId ? <OrderDetailPanel tableId={selectedTableId} /> : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>테이블을 선택해주세요</Box>
            )}
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
