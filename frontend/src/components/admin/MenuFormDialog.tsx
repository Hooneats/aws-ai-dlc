import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { CreateMenuForm, Category } from '@/types';
import { uploadImage } from '@/api/upload';
import { useState } from 'react';

interface Props { open: boolean; categories: Category[]; initial?: Partial<CreateMenuForm>; onSubmit: (data: CreateMenuForm) => void; onClose: () => void; }

export function MenuFormDialog({ open, categories, initial, onSubmit, onClose }: Props) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateMenuForm>({ defaultValues: initial });
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setValue('imageUrl', res.imageUrl);
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{initial ? '메뉴 수정' : '메뉴 등록'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="메뉴명" {...register('name', { required: '필수' })} error={!!errors.name} helperText={errors.name?.message} data-testid="menu-form-name" />
          <TextField label="가격" type="number" {...register('price', { required: '필수', min: { value: 1, message: '1 이상' } })} error={!!errors.price} helperText={errors.price?.message} data-testid="menu-form-price" />
          <TextField label="설명" multiline rows={2} {...register('description')} data-testid="menu-form-desc" />
          <TextField select label="카테고리" defaultValue={initial?.categoryId || ''} {...register('categoryId', { required: '필수' })} error={!!errors.categoryId} data-testid="menu-form-category">
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <Button variant="outlined" component="label" disabled={uploading} data-testid="menu-form-image">
            {uploading ? '업로드 중...' : '이미지 선택'}
            <input type="file" hidden accept="image/jpeg,image/png,image/gif" onChange={handleFile} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" data-testid="menu-form-submit">저장</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
