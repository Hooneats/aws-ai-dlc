import { Box, Typography, Chip, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingServiceCalls, confirmServiceCall, completeServiceCall } from '@/api/serviceCalls';

export function ServiceCallAlert() {
  const qc = useQueryClient();
  const { data: calls = [] } = useQuery({
    queryKey: ['serviceCalls', 'pending'],
    queryFn: getPendingServiceCalls,
    refetchInterval: 10000,
  });

  const confirmMut = useMutation({ mutationFn: confirmServiceCall, onSuccess: () => qc.invalidateQueries({ queryKey: ['serviceCalls'] }) });
  const completeMut = useMutation({ mutationFn: completeServiceCall, onSuccess: () => qc.invalidateQueries({ queryKey: ['serviceCalls'] }) });

  if (calls.length === 0) return null;

  return (
    <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>🔔 서비스 호출 ({calls.length})</Typography>
      {calls.map((c) => (
        <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
          <Chip label={`테이블 ${c.tableNo}`} size="small" />
          <Typography variant="body2" sx={{ flex: 1 }}>{c.menuName}</Typography>
          <Chip label={c.status} size="small" color={c.status === 'PENDING' ? 'warning' : 'info'} />
          {c.status === 'PENDING' && (
            <IconButton size="small" onClick={() => confirmMut.mutate(c.id)} data-testid={`sc-confirm-${c.id}`}><CheckIcon fontSize="small" /></IconButton>
          )}
          {c.status === 'CONFIRMED' && (
            <IconButton size="small" onClick={() => completeMut.mutate(c.id)} data-testid={`sc-complete-${c.id}`}><DoneAllIcon fontSize="small" /></IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
