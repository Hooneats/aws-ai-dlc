import Grid from '@mui/material/Grid2';
import { MenuCard } from './MenuCard';
import type { Menu } from '@/types';

interface Props { menus: Menu[]; onAddToCart: (menu: Menu) => void; onServiceCall?: (menu: Menu) => void; isService?: boolean; }

export function MenuGrid({ menus, onAddToCart, onServiceCall, isService }: Props) {
  return (
    <Grid container spacing={1.5} sx={{ p: 1.5 }}>
      {menus.map((m) => (
        <Grid key={m.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <MenuCard menu={m} onAddToCart={onAddToCart} onServiceCall={onServiceCall} isService={isService} />
        </Grid>
      ))}
    </Grid>
  );
}
