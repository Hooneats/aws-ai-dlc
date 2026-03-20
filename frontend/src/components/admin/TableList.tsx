import { List, ListItemButton, ListItemText, Typography, Badge, Box } from '@mui/material';
import type { TableEntity } from '@/types';

interface TableWithOrders extends TableEntity { orderCount?: number; totalAmount?: number; hasNew?: boolean; }
interface Props { tables: TableWithOrders[]; selectedId: number | null; onSelect: (id: number) => void; }

export function TableList({ tables, selectedId, onSelect }: Props) {
  const active = tables.filter((t) => t.sessionId);
  const inactive = tables.filter((t) => !t.sessionId);

  return (
    <Box sx={{ width: 220, minWidth: 220, borderRight: 1, borderColor: 'divider', overflowY: 'auto', height: '100%' }}>
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>영업 중 ({active.length})</Typography>
      <List dense disablePadding>
        {active.map((t) => (
          <ListItemButton key={t.id} selected={selectedId === t.id} onClick={() => onSelect(t.id)} data-testid={`table-item-${t.tableNo}`}>
            <ListItemText
              primary={<Badge color="error" variant="dot" invisible={!t.hasNew}><Typography variant="body2">테이블 {t.tableNo}</Typography></Badge>}
              secondary={t.totalAmount != null ? `${t.totalAmount.toLocaleString()}원` : undefined}
            />
          </ListItemButton>
        ))}
      </List>
      {inactive.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>비활성 ({inactive.length})</Typography>
          <List dense disablePadding>
            {inactive.map((t) => (
              <ListItemButton key={t.id} selected={selectedId === t.id} onClick={() => onSelect(t.id)} data-testid={`table-item-${t.tableNo}`} sx={{ opacity: 0.5 }}>
                <ListItemText primary={<Typography variant="body2">테이블 {t.tableNo}</Typography>} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
