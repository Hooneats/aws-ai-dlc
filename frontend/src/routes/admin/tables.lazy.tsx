import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, createTable, deleteTable, settleTable, getTableHistory } from '@/api/tables';
import { getOrdersByTable } from '@/api/orders';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SettleDialog } from '@/components/admin/SettleDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Order, OrderHistory } from '@/types';

export const Route = createLazyFileRoute('/admin/tables')({ component: TableManagementPage });

function TableManagementPage() {
  const qc = useQueryClient();
  const [newTableNo, setNewTableNo] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [settleId, setSettleId] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [historyTableId, setHistoryTableId] = useState<number | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const { data: tables = [] } = useQuery({ queryKey: ['tables'], queryFn: getTables });

  const createMut = useMutation({
    mutationFn: () => createTable(Number(newTableNo)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables'] }); setNewTableNo(''); setSnack({ msg: '테이블 추가됨', severity: 'success' }); },
    onError: () => setSnack({ msg: '추가 실패 (중복 번호 확인)', severity: 'error' }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables'] }); setSnack({ msg: '삭제됨', severity: 'success' }); },
    onError: () => setSnack({ msg: '활성 세션이 있는 테이블은 삭제할 수 없습니다', severity: 'error' }),
  });

  const settleMut = useMutation({
    mutationFn: (id: number) => settleTable(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables'] }); setSettleId(null); setSnack({ msg: '정산 완료', severity: 'success' }); },
    onError: () => setSnack({ msg: '정산 실패', severity: 'error' }),
  });

  const handleSettleClick = async (tableId: number) => {
    const orders = await getOrdersByTable(tableId);
    const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING');
    setPendingOrders(pending);
    setSettleId(tableId);
  };

  const handleHistoryClick = async (tableId: number) => {
    const h = await getTableHistory(tableId);
    setHistory(h);
    setHistoryTableId(tableId);
  };

  return (
    <AdminLayout>
      <Typography variant="h6" gutterBottom>테이블 관리</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField size="small" label="테이블 번호" type="number" value={newTableNo} onChange={(e) => setNewTableNo(e.target.value)} data-testid="new-table-no" />
        <Button variant="contained" onClick={() => createMut.mutate()} disabled={!newTableNo} data-testid="add-table">추가</Button>
      </Box>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>번호</TableCell><TableCell>상태</TableCell><TableCell align="right">액션</TableCell></TableRow></TableHead>
          <TableBody>
            {tables.map((t) => (
              <TableRow key={t.id}>
                <TableCell>테이블 {t.tableNo}</TableCell>
                <TableCell><Chip label={t.sessionId ? '영업중' : '비활성'} size="small" color={t.sessionId ? 'success' : 'default'} /></TableCell>
                <TableCell align="right">
                  {t.sessionId && <IconButton size="small" onClick={() => handleSettleClick(t.id)} data-testid={`settle-${t.tableNo}`}><PointOfSaleIcon fontSize="small" /></IconButton>}
                  <Button size="small" onClick={() => handleHistoryClick(t.id)}>이력</Button>
                  <IconButton size="small" onClick={() => setDeleteId(t.id)} data-testid={`delete-table-${t.tableNo}`}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {historyTableId && history.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>과거 주문 이력</Typography>
          {history.map((h) => (
            <Box key={h.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption">{new Date(h.settledAt).toLocaleString('ko-KR')} | {h.totalAmount.toLocaleString()}원</Typography>
              {h.items.map((item) => (
                <Typography key={item.id} variant="body2" sx={{ pl: 1 }}>{item.menuName} × {item.quantity}</Typography>
              ))}
            </Box>
          ))}
        </Paper>
      )}

      <ConfirmDialog open={!!deleteId} title="테이블 삭제" message="이 테이블을 삭제하시겠습니까?" onConfirm={() => { if (deleteId) deleteMut.mutate(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
      {settleId && <SettleDialog open={!!settleId} pendingOrders={pendingOrders} onClose={() => setSettleId(null)} onSettle={() => settleMut.mutate(settleId)} />}
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack(null)}><Alert severity={snack?.severity} variant="filled">{snack?.msg}</Alert></Snackbar>
    </AdminLayout>
  );
}
