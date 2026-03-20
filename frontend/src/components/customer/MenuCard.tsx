import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { calcFinalPrice } from '@/utils/price';
import type { Menu } from '@/types';

interface Props { menu: Menu; onAddToCart?: (menu: Menu) => void; onServiceCall?: (menu: Menu) => void; isService?: boolean; }

export function MenuCard({ menu, onAddToCart, onServiceCall, isService }: Props) {
  const finalPrice = calcFinalPrice(menu);
  const disabled = menu.isSoldOut || !menu.isActive;

  return (
    <Card sx={{ position: 'relative', opacity: disabled ? 0.6 : 1 }} data-testid={`menu-card-${menu.id}`}>
      <ImageWithFallback src={menu.imageUrl} alt={menu.name} />
      {menu.isSoldOut && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Chip label="품절" color="error" size="small" />
        </Box>
      )}
      {menu.discountRate > 0 && !menu.isSoldOut && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Chip label={`${menu.discountRate}%`} color="secondary" size="small" />
        </Box>
      )}
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle2" noWrap>{menu.name}</Typography>
        {menu.description && <Typography variant="caption" color="text.secondary" noWrap>{menu.description}</Typography>}
        <Box sx={{ mt: 0.5 }}>
          {menu.discountRate > 0 ? (
            <>
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled', mr: 1 }}>{menu.price.toLocaleString()}원</Typography>
              <Typography variant="body2" fontWeight="bold" color="error">{finalPrice.toLocaleString()}원</Typography>
            </>
          ) : (
            <Typography variant="body2" fontWeight="bold">{menu.price.toLocaleString()}원</Typography>
          )}
        </Box>
      </CardContent>
      <CardActions>
        {isService ? (
          <Button size="small" fullWidth variant="outlined" disabled={disabled} onClick={() => onServiceCall?.(menu)} data-testid={`service-call-${menu.id}`}>요청하기</Button>
        ) : (
          <Button size="small" fullWidth variant="contained" disabled={disabled} onClick={() => onAddToCart?.(menu)} data-testid={`add-to-cart-${menu.id}`}>담기</Button>
        )}
      </CardActions>
    </Card>
  );
}
