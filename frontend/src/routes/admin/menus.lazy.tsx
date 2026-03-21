import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Switch, Chip, TextField, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMenus, createMenu, updateMenu, deleteMenu, setRecommended, setDiscount, setSoldOut } from '@/api/menus';
import { getCategories } from '@/api/categories';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MenuFormDialog } from '@/components/admin/MenuFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { CreateMenuForm, Menu } from '@/types';

export const Route = createLazyFileRoute('/admin/menus')({ component: MenuManagementPage });

function MenuManagementPage() {
  const storeId = 1;
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [discountEdit, setDiscountEdit] = useState<{ id: number; rate: string } | null>(null);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const { data: menus = [] } = useQuery({ queryKey: ['menus', storeId, 'all'], queryFn: () => getAllMenus(storeId) });
  const { data: categories = [] } = useQuery({ queryKey: ['categories', storeId, true], queryFn: () => getCategories(storeId, true) });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['menus'] });

  const createMut = useMutation({ mutationFn: (d: CreateMenuForm) => createMenu(d), onSuccess: () => { invalidate(); setFormOpen(false); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateMenuForm> }) => updateMenu(id, data), onSuccess: () => { invalidate(); setEditMenu(null); } });
  const recommendMut = useMutation({ mutationFn: ({ id, v }: { id: number; v: boolean }) => setRecommended(id, v), onSuccess: invalidate });
  const soldOutMut = useMutation({ mutationFn: ({ id, v }: { id: number; v: boolean }) => setSoldOut(id, v), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id: number) => deleteMenu(id), onSuccess: invalidate });

  const handleSubmit = (data: CreateMenuForm) => {
    if (editMenu) updateMut.mutate({ id: editMenu.id, data });
    else createMut.mutate(data);
  };

  const handleDiscountSave = async (id: number, rate: string) => {
    const r = Number(rate);
    if (r < 0 || r > 99) { setSnack({ msg: '할인율은 0~99%', severity: 'error' }); return; }
    await setDiscount(id, r);
    invalidate();
    setDiscountEdit(null);
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || '-';

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">메뉴 관리</Typography>
        <Button variant="contained" onClick={() => { setEditMenu(null); setFormOpen(true); }} data-testid="add-menu">메뉴 등록</Button>
      </Box>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>메뉴명</TableCell><TableCell>카테고리</TableCell><TableCell>가격</TableCell>
              <TableCell>추천</TableCell><TableCell>할인</TableCell><TableCell>품절</TableCell><TableCell>상태</TableCell><TableCell align="right">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((m) => (
              <TableRow key={m.id} sx={{ opacity: m.isActive ? 1 : 0.5 }}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{getCategoryName(m.categoryId)}</TableCell>
                <TableCell>{m.price.toLocaleString()}원</TableCell>
                <TableCell><Switch size="small" checked={m.isRecommended} onChange={(_, v) => recommendMut.mutate({ id: m.id, v })} data-testid={`rec-${m.id}`} /></TableCell>
                <TableCell>
                  {discountEdit?.id === m.id ? (
                    <TextField size="small" sx={{ width: 60 }} value={discountEdit.rate} onChange={(e) => setDiscountEdit({ id: m.id, rate: e.target.value })} onBlur={() => handleDiscountSave(m.id, discountEdit.rate)} onKeyDown={(e) => e.key === 'Enter' && handleDiscountSave(m.id, discountEdit.rate)} autoFocus />
                  ) : (
                    <Chip label={`${m.discountRate}%`} size="small" onClick={() => setDiscountEdit({ id: m.id, rate: String(m.discountRate) })} />
                  )}
                </TableCell>
                <TableCell><Switch size="small" checked={m.isSoldOut} onChange={(_, v) => soldOutMut.mutate({ id: m.id, v })} data-testid={`soldout-${m.id}`} /></TableCell>
                <TableCell><Chip label={m.isActive ? '활성' : '삭제됨'} size="small" color={m.isActive ? 'success' : 'default'} /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => { setEditMenu(m); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                  {m.isActive && <IconButton size="small" onClick={() => setDeleteId(m.id)} data-testid={`delete-menu-${m.id}`}><DeleteIcon fontSize="small" /></IconButton>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {formOpen && (
        <MenuFormDialog
          open={formOpen} categories={categories.filter((c) => !c.isHidden)}
          initial={editMenu ? { name: editMenu.name, price: editMenu.price, description: editMenu.description || '', categoryId: editMenu.categoryId, imageUrl: editMenu.imageUrl || '' } : undefined}
          onSubmit={handleSubmit} onClose={() => { setFormOpen(false); setEditMenu(null); }}
        />
      )}
      <ConfirmDialog open={!!deleteId} title="메뉴 삭제" message="이 메뉴를 삭제(비활성화)하시겠습니까?" onConfirm={() => { if (deleteId) deleteMut.mutate(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack(null)}><Alert severity={snack?.severity} variant="filled">{snack?.msg}</Alert></Snackbar>
    </AdminLayout>
  );
}
