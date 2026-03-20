import { List, ListItemButton, Typography, Box } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  selectedId: number | 'recommended';
  onSelect: (id: number | 'recommended') => void;
}

export function CategorySidebar({ categories, selectedId, onSelect }: Props) {
  return (
    <List sx={{
      width: 100, minWidth: 100, overflowY: 'auto', py: 1.5, bgcolor: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px)', borderRight: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      <ListItemButton
        selected={selectedId === 'recommended'}
        onClick={() => onSelect('recommended')}
        data-testid="category-recommended"
        sx={{
          flexDirection: 'column', alignItems: 'center', py: 1.5, mx: 0.75, borderRadius: 3, mb: 0.5,
          '&.Mui-selected': { bgcolor: '#0071e3', color: '#fff', '&:hover': { bgcolor: '#0077ed' } },
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 22, mb: 0.25, color: selectedId === 'recommended' ? '#fff' : '#ff9f0a' }} />
        <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem', color: selectedId === 'recommended' ? '#fff' : 'text.primary' }}>추천</Typography>
      </ListItemButton>
      {categories.map((c) => (
        <ListItemButton
          key={c.id} selected={selectedId === c.id}
          onClick={() => onSelect(c.id)}
          data-testid={`category-${c.id}`}
          sx={{
            flexDirection: 'column', alignItems: 'center', py: 1.5, mx: 0.75, borderRadius: 3, mb: 0.5,
            '&.Mui-selected': { bgcolor: '#0071e3', color: '#fff', '&:hover': { bgcolor: '#0077ed' } },
          }}
        >
          <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.7rem', color: selectedId === c.id ? '#fff' : 'text.primary' }}>{c.name}</Typography>
        </ListItemButton>
      ))}
    </List>
  );
}
