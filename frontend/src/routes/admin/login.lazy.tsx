import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { adminLogin } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { AdminLoginForm } from '@/types';
import { useState } from 'react';

export const Route = createLazyFileRoute('/admin/login')({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>();
  const [error, setError] = useState('');

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      setError('');
      const res = await adminLogin(data);
      setAdmin(res.accessToken, data.storeCode);
      navigate({ to: '/admin/dashboard' });
    } catch { setError('로그인에 실패했습니다.'); }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      <Paper sx={{ p: 5, maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1d1d1f', mb: 0.5 }}>관리자 로그인</Typography>
          <Typography variant="body2" sx={{ color: '#86868b' }}>테이블오더 관리 시스템</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="매장 코드" margin="normal" {...register('storeCode', { required: '필수' })} error={!!errors.storeCode} data-testid="admin-login-store-code" />
          <TextField fullWidth label="사용자명" margin="normal" {...register('username', { required: '필수' })} error={!!errors.username} data-testid="admin-login-username" />
          <TextField fullWidth label="비밀번호" type="password" margin="normal" {...register('password', { required: '필수' })} error={!!errors.password} data-testid="admin-login-password" />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, bgcolor: '#0071e3', '&:hover': { bgcolor: '#0077ed' } }} data-testid="admin-login-submit">로그인</Button>
        </form>
      </Paper>
    </Box>
  );
}
