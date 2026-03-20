import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Box, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/categories';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { CategoryFormDialog } from '@/components/admin/CategoryFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { CreateCategoryForm, Category } from '@/types';

export const Route = createLazyFileRoute('/admin/categories')({ component: CategoryManagementPage });

function CategoryManagementPage() {
  const storeId = 1;
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const { data: categories = [] } = useQuery({ queryKey: ['categories', storeId, true], queryFn: () => getCategories(storeId, true) });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

  const createMut = useMutation({ mutationFn: (d: CreateCategoryForm) => createCategory(d.name, d.sortOrder), onSuccess: () => { invalidate(); setFormOpen(false); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateCategoryForm> }) => updateCategory(id, data), onSuccess: () => { invalidate(); setEditCat(null); setFormOpen(false); } });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => { invalidate(); setSnack({ msg: '삭제됨 (메뉴는 기타로 이동)', severity: 'success' }); },
    onError: () => setSnack({ msg: '삭제할 수 없는 카테고리입니다', severity: 'error' }),
  });

  const handleSubmit = (data: CreateCategoryForm) => {
    if (editCat) updateMut.mutate({ id: editCat.id, data });
    else createMut.mutate(data);
  };

  const canDelete = (c: Category) => !c.isDefault && !c.isServiceCategory;

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">카테고리 관리</Typography>
        <Button variant="contained" onClick={() => { setEditCat(null); setFormOpen(true); }} data-testid="add-category">추가</Button>
      </Box>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>이름</TableCell><TableCell>순서</TableCell><TableCell>유형</TableCell><TableCell align="right">액션</TableCell></TableRow></TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.sortOrder}</TableCell>
                <TableCell>
                  {c.isDefault && <Chip label="기본" size="small" />}
                  {c.isServiceCategory && <Chip label="서비스" size="small" color="info" />}
                  {c.isHidden && <Chip label="숨김" size="small" variant="outlined" />}
                </TableCell>
                <TableCell align="right">
                  {!c.isDefault && <IconButton size="small" onClick={() => { setEditCat(c); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>}
                  {canDelete(c) && <IconButton size="small" onClick={() => setDeleteId(c.id)} data-testid={`delete-cat-${c.id}`}><DeleteIcon fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {formOpen && <CategoryFormDialog open={formOpen} initial={editCat ? { name: editCat.name, sortOrder: editCat.sortOrder } : undefined} onSubmit={handleSubmit} onClose={() => { setFormOpen(false); setEditCat(null); }} />}
      <ConfirmDialog open={!!deleteId} title="카테고리 삭제" message="삭제 시 소속 메뉴가 '기타' 카테고리로 이동됩니다. 계속하시겠습니까?" onConfirm={() => { if (deleteId) deleteMut.mutate(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack(null)}><Alert severity={snack?.severity} variant="filled">{snack?.msg}</Alert></Snackbar>
    </AdminLayout>
  );
}
