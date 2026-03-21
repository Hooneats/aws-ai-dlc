import { Box, Typography, IconButton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { CartItem } from '@/types';

interface Props { item: CartItem; onQuantityChange: (menuId: number, qty: number) => void; onRemove: (menuId: number) => void; }

export function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }} data-testid={`cart-item-${item.menuId}`}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={600}>{item.menuName}</Typography>
        <Typography variant="caption" sx={{ color: '#86868b' }}>{item.finalPrice.toLocaleString()}원</Typography>
      </Box>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 980, px: 0.5, py: 0.25,
      }}>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity - 1)} data-testid={`cart-minus-${item.menuId}`} sx={{ p: 0.5 }}>
          <RemoveRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity + 1)} data-testid={`cart-plus-${item.menuId}`} sx={{ p: 0.5 }}>
          <AddRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Typography variant="body2" fontWeight={600} sx={{ minWidth: 70, textAlign: 'right' }}>{(item.finalPrice * item.quantity).toLocaleString()}원</Typography>
      <IconButton size="small" onClick={() => onRemove(item.menuId)} data-testid={`cart-remove-${item.menuId}`} sx={{ ml: 0.5, color: '#86868b' }}>
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
