import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface Props { src: string | null; alt: string; height?: number; }

export function ImageWithFallback({ src, alt, height = 140 }: Props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const fullSrc = src ? (src.startsWith('http') ? src : `${apiUrl}/${src}`) : null;

  if (!fullSrc || error) {
    return (
      <Box sx={{
        height, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)',
      }}>
        <RestaurantIcon sx={{ fontSize: 40, color: '#c7c7cc' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ height, position: 'relative', overflow: 'hidden' }}>
      {!loaded && <Skeleton variant="rectangular" height={height} sx={{ bgcolor: '#f5f5f7' }} />}
      <img
        src={fullSrc} alt={alt} loading="lazy"
        onLoad={() => setLoaded(true)} onError={() => setError(true)}
        style={{ width: '100%', height, objectFit: 'cover', display: loaded ? 'block' : 'none' }}
      />
    </Box>
  );
}
