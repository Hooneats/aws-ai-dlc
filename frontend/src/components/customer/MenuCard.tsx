import { Card, CardContent, CardActionArea, Typography, Box, Chip } from '@mui/material';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { calcFinalPrice } from '@/utils/price';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import type { Menu } from '@/types';

interface Props { menu: Menu; onAddToCart?: (menu: Menu) => void; onServiceCall?: (menu: Menu) => void; isService?: boolean; }

export function MenuCard({ menu, onAddToCart, onServiceCall, isService }: Props) {
  const finalPrice = calcFinalPrice(menu);
  const disabled = menu.isSoldOut || !menu.isActive;

  const handleClick = () => {
    if (disabled) return;
    if (isService) onServiceCall?.(menu);
    else onAddToCart?.(menu);
  };

  return (
    <Card
      data-testid={`menu-card-${menu.id}`}
      sx={{
        position: 'relative',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': disabled ? {} : { transform: 'scale(1.02)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
        overflow: 'visible',
      }}
    >
      <CardActionArea disabled={disabled} onClick={handleClick} sx={{ borderRadius: 'inherit' }}>
        <ImageWithFallback src={menu.imageUrl} alt={menu.name} />
        {menu.isSoldOut && (
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip label="품절" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
        )}
        {menu.discountRate > 0 && !menu.isSoldOut && (
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip label={`${menu.discountRate}% OFF`} size="small" sx={{ bgcolor: '#ff3b30', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
        )}
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', lineHeight: 1.3 }} noWrap>{menu.name}</Typography>
          {menu.description && (
            <Typography variant="caption" sx={{ color: '#86868b', display: 'block', mt: 0.3, lineHeight: 1.3 }} noWrap>{menu.description}</Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box>
              {menu.discountRate > 0 ? (
                <>
                  <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#d2d2d7', mr: 0.5 }}>{menu.price.toLocaleString()}원</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#ff3b30' }}>{finalPrice.toLocaleString()}원</Typography>
                </>
              ) : (
                <Typography variant="body2" fontWeight={700}>{menu.price.toLocaleString()}원</Typography>
              )}
            </Box>
            {!disabled && (
              isService
                ? <NotificationsActiveRoundedIcon sx={{ color: '#0071e3', fontSize: 28 }} data-testid={`service-call-${menu.id}`} />
                : <AddCircleRoundedIcon sx={{ color: '#0071e3', fontSize: 28 }} data-testid={`add-to-cart-${menu.id}`} />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
