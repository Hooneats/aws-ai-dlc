import { Box, ButtonBase, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  selectedId: number | 'recommended';
  onSelect: (id: number | 'recommended') => void;
}

export function CategorySidebar({ categories, selectedId, onSelect }: Props) {
  return (
    <Box sx={{
      display: 'flex', gap: 1, px: 2, py: 1.5,
      overflowX: 'auto', flexShrink: 0,
      '&::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
    }}>
      <ButtonBase
        onClick={() => onSelect('recommended')}
        data-testid="category-recommended"
        sx={{
          px: 2, py: 1, borderRadius: 980, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 0.5,
          bgcolor: selectedId === 'recommended' ? '#1d1d1f' : 'rgba(0,0,0,0.04)',
          color: selectedId === 'recommended' ? '#fff' : '#1d1d1f',
          transition: 'all 0.2s ease',
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 16, color: selectedId === 'recommended' ? '#ffd60a' : '#86868b' }} />
        <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>추천</Typography>
      </ButtonBase>
      {categories.map((c) => (
        <ButtonBase
          key={c.id}
          onClick={() => onSelect(c.id)}
          data-testid={`category-${c.id}`}
          sx={{
            px: 2, py: 1, borderRadius: 980, flexShrink: 0,
            bgcolor: selectedId === c.id ? '#1d1d1f' : 'rgba(0,0,0,0.04)',
            color: selectedId === c.id ? '#fff' : '#1d1d1f',
            transition: 'all 0.2s ease',
          }}
        >
          <Typography variant="body2" fontWeight={selectedId === c.id ? 600 : 400} sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{c.name}</Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
