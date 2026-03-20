import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { tableLogin } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { TableSetupForm } from '@/types';
import { useState } from 'react';

export const Route = createLazyFileRoute('/table/setup')({ component: TableSetupPage });

function TableSetupPage() {
  const navigate = useNavigate();
  const setTable = useAuthStore((s) => s.setTable);
  const { register, handleSubmit, formState: { errors } } = useForm<TableSetupForm>();
  const [error, setError] = useState('');

  const onSubmit = async (data: TableSetupForm) => {
    try {
      setError('');
      const res = await tableLogin(data.storeCode, Number(data.tableNo));
      setTable(res.accessToken, data.storeCode, Number(data.tableNo), res.tableId, res.sessionId);
      navigate({ to: `/table/${data.tableNo}/menu` });
    } catch { setError('로그인에 실패했습니다. 매장 코드와 테이블 번호를 확인해주세요.'); }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f7', p: 2 }}>
      <Paper sx={{ p: 5, maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1d1d1f', mb: 0.5 }}>테이블 설정</Typography>
          <Typography variant="body2" sx={{ color: '#86868b' }}>매장 코드와 테이블 번호를 입력하세요</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="매장 코드" margin="normal" {...register('storeCode', { required: '매장 코드를 입력해주세요' })} error={!!errors.storeCode} helperText={errors.storeCode?.message} data-testid="table-setup-store-code" />
          <TextField fullWidth label="테이블 번호" type="number" margin="normal" {...register('tableNo', { required: '테이블 번호를 입력해주세요', min: { value: 1, message: '1 이상 입력' } })} error={!!errors.tableNo} helperText={errors.tableNo?.message} data-testid="table-setup-table-no" />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, bgcolor: '#0071e3', '&:hover': { bgcolor: '#0077ed' } }} data-testid="table-setup-submit">시작하기</Button>
        </form>
      </Paper>
    </Box>
  );
}
