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

  const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.03)', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.1)' }, '&.Mui-focused fieldset': { borderColor: '#0071e3' } } };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2, bgcolor: '#fbfbfd' }}>
      <Paper sx={{ p: 5, maxWidth: 400, width: '100%', border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 0.5, fontSize: '1.6rem' }}>테이블 주문</Typography>
        <Typography sx={{ textAlign: 'center', color: '#86868b', mb: 4, fontSize: '0.9rem' }}>매장 코드와 테이블 번호를 입력해주세요</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="매장 코드" margin="normal" {...register('storeCode', { required: '매장 코드를 입력해주세요' })} error={!!errors.storeCode} helperText={errors.storeCode?.message} data-testid="table-setup-store-code" sx={inputSx} />
          <TextField fullWidth label="테이블 번호" type="number" margin="normal" {...register('tableNo', { required: '테이블 번호를 입력해주세요', min: { value: 1, message: '1 이상 입력' } })} error={!!errors.tableNo} helperText={errors.tableNo?.message} data-testid="table-setup-table-no" sx={inputSx} />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth data-testid="table-setup-submit" sx={{ mt: 3, py: 1.5, bgcolor: '#0071e3', fontSize: '1rem', fontWeight: 600, '&:hover': { bgcolor: '#0077ed' } }}>시작하기</Button>
        </form>
      </Paper>
    </Box>
  );
}
