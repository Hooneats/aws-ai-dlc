import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import type { Order } from '@/types';

interface Props { open: boolean; pendingOrders: Order[]; onClose: () => void; onSettle: () => void; }

export function SettleDialog({ open, pendingOrders, onClose, onSettle }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>테이블 정산</DialogTitle>
      <DialogContent>
        {pendingOrders.length > 0 ? (
          <>
            <Typography color="error" gutterBottom>미완료 주문이 있습니다. 먼저 처리해주세요.</Typography>
            <List dense>
              {pendingOrders.map((o) => (
                <ListItem key={o.id}>
                  <ListItemText primary={`주문 #${o.id}`} secondary={`${o.totalAmount.toLocaleString()}원`} />
                  <Chip label={o.status} size="small" color="warning" />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography>정산을 진행하시겠습니까? 모든 주문이 이력으로 이동되고 세션이 종료됩니다.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={onSettle} disabled={pendingOrders.length > 0} data-testid="settle-confirm">정산</Button>
      </DialogActions>
    </Dialog>
  );
}
