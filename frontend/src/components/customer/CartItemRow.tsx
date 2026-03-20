import { Box, Typography, IconButton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { CartItem } from '@/types';

interface Props { item: CartItem; onQuantityChange: (menuId: number, qty: number) => void; onRemove: (menuId: number) => void; }

export function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: '0.5px solid rgba(0,0,0,0.08)' }} data-testid={`cart-item-${item.menuId}`}>
      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: '#1d1d1f' }}>{item.menuName}</Typography>
        <Typography variant="caption" sx={{ color: '#86868b' }}>{item.finalPrice.toLocaleString()}원</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f7', borderRadius: 980, px: 0.5 }}>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity - 1)} data-testid={`cart-minus-${item.menuId}`}
          sx={{ width: 32, height: 32, minWidth: 32, minHeight: 32, color: '#0071e3' }}
        ><RemoveRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 28, textAlign: 'center', color: '#1d1d1f' }}>{item.quantity}</Typography>
        <IconButton size="small" onClick={() => onQuantityChange(item.menuId, item.quantity + 1)} data-testid={`cart-plus-${item.menuId}`}
          sx={{ width: 32, height: 32, minWidth: 32, minHeight: 32, color: '#0071e3' }}
        ><AddRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
      </Box>
      <Typography variant="body2" fontWeight={600} sx={{ minWidth: 72, textAlign: 'right', color: '#1d1d1f' }}>{(item.finalPrice * item.quantity).toLocaleString()}원</Typography>
      <IconButton size="small" onClick={() => onRemove(item.menuId)} data-testid={`cart-remove-${item.menuId}`}
        sx={{ ml: 0.5, width: 32, height: 32, minWidth: 32, minHeight: 32, color: '#86868b', '&:hover': { color: '#ff3b30' } }}
      ><CloseRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
    </Box>
  );
}
