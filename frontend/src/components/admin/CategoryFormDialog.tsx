import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { CreateCategoryForm } from '@/types';

interface Props { open: boolean; initial?: Partial<CreateCategoryForm>; onSubmit: (data: CreateCategoryForm) => void; onClose: () => void; }

export function CategoryFormDialog({ open, initial, onSubmit, onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCategoryForm>({ defaultValues: initial });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{initial ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="카테고리명" {...register('name', { required: '필수' })} error={!!errors.name} data-testid="cat-form-name" />
          <TextField label="순서" type="number" {...register('sortOrder', { required: '필수', min: 0 })} error={!!errors.sortOrder} data-testid="cat-form-order" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" data-testid="cat-form-submit">저장</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
