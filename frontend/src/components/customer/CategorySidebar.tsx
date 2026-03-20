import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  selectedId: number | 'recommended';
  onSelect: (id: number | 'recommended') => void;
}

export function CategorySidebar({ categories, selectedId, onSelect }: Props) {
  return (
    <List sx={{ width: 120, minWidth: 120, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto' }}>
      <ListItemButton selected={selectedId === 'recommended'} onClick={() => onSelect('recommended')} data-testid="category-recommended">
        <StarIcon sx={{ mr: 0.5, fontSize: 18, color: 'warning.main' }} />
        <ListItemText primary={<Typography variant="body2" fontWeight="bold">추천</Typography>} />
      </ListItemButton>
      {categories.map((c) => (
        <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => onSelect(c.id)} data-testid={`category-${c.id}`}>
          <ListItemText primary={<Typography variant="body2">{c.name}</Typography>} />
        </ListItemButton>
      ))}
    </List>
  );
}
