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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom textAlign="center">관리자 로그인</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="매장 코드" margin="normal" {...register('storeCode', { required: '필수' })} error={!!errors.storeCode} data-testid="admin-login-store-code" />
          <TextField fullWidth label="사용자명" margin="normal" {...register('username', { required: '필수' })} error={!!errors.username} data-testid="admin-login-username" />
          <TextField fullWidth label="비밀번호" type="password" margin="normal" {...register('password', { required: '필수' })} error={!!errors.password} data-testid="admin-login-password" />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} data-testid="admin-login-submit">로그인</Button>
        </form>
      </Paper>
    </Box>
  );
}
