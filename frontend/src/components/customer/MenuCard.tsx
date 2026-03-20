import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { calcFinalPrice } from '@/utils/price';
import type { Menu } from '@/types';

interface Props { menu: Menu; onAddToCart?: (menu: Menu) => void; onServiceCall?: (menu: Menu) => void; isService?: boolean; }

export function MenuCard({ menu, onAddToCart, onServiceCall, isService }: Props) {
  const finalPrice = calcFinalPrice(menu);
  const disabled = menu.isSoldOut || !menu.isActive;

  return (
    <Card
      data-testid={`menu-card-${menu.id}`}
      sx={{
        position: 'relative', opacity: disabled ? 0.5 : 1,
        overflow: 'hidden', border: 'none',
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ImageWithFallback src={menu.imageUrl} alt={menu.name} height={130} />
        {menu.isSoldOut && (
          <Chip label="품절" size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', height: 22 }} />
        )}
        {menu.discountRate > 0 && !menu.isSoldOut && (
          <Chip label={`${menu.discountRate}%`} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#ff3b30', color: '#fff', fontSize: '0.65rem', height: 22, fontWeight: 700 }} />
        )}
      </Box>
      <CardContent sx={{ pb: '4px !important', pt: 1.5, px: 1.5 }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.85rem', color: '#1d1d1f' }}>{menu.name}</Typography>
        {menu.description && <Typography variant="caption" sx={{ color: '#86868b', display: 'block', mt: 0.25, fontSize: '0.7rem' }} noWrap>{menu.description}</Typography>}
        <Box sx={{ mt: 0.75 }}>
          {menu.discountRate > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#86868b' }}>{menu.price.toLocaleString()}원</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#ff3b30' }}>{finalPrice.toLocaleString()}원</Typography>
            </Box>
          ) : (
            <Typography variant="body2" fontWeight={600} sx={{ color: '#1d1d1f' }}>{menu.price.toLocaleString()}원</Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0.5 }}>
        {isService ? (
          <Button size="small" fullWidth variant="outlined" disabled={disabled} onClick={() => onServiceCall?.(menu)} data-testid={`service-call-${menu.id}`}
            sx={{ borderColor: '#0071e3', color: '#0071e3', fontSize: '0.8rem', py: 0.5, '&:hover': { borderColor: '#0077ed', bgcolor: 'rgba(0,113,227,0.04)' } }}
          >요청하기</Button>
        ) : (
          <Button size="small" fullWidth variant="contained" disabled={disabled} onClick={() => onAddToCart?.(menu)} data-testid={`add-to-cart-${menu.id}`}
            startIcon={<AddRoundedIcon sx={{ fontSize: '16px !important' }} />}
            sx={{ bgcolor: '#0071e3', fontSize: '0.8rem', py: 0.5, '&:hover': { bgcolor: '#0077ed' } }}
          >담기</Button>
        )}
      </CardActions>
    </Card>
  );
}
