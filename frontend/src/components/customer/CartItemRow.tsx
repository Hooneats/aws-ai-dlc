import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CartItem } from '@/types';

interface Props { item: CartItem; onQuantityChange: (menuId: number, qty: number) => void; onRemove: (menuId: number) => void; }

export function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'divider' }} data-testid={`cart-item-${item.menuId}`}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight="bold">{item.menuName}</Typography>
        <Typography variant="caption" color="text.secondary">{item.finalPrice.toLocaleString()}원</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity - 1)} data-testid={`cart-minus-${item.menuId}`}><RemoveIcon fontSize="small" /></IconButton>
        <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity + 1)} data-testid={`cart-plus-${item.menuId}`}><AddIcon fontSize="small" /></IconButton>
      </Box>
      <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 70, textAlign: 'right' }}>{(item.finalPrice * item.quantity).toLocaleString()}원</Typography>
      <IconButton size="small" onClick={() => onRemove(item.menuId)} data-testid={`cart-remove-${item.menuId}`}><DeleteIcon fontSize="small" /></IconButton>
    </Box>
  );
}
