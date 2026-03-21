import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/categories';
import { getMenus, getRecommended } from '@/api/menus';
import { createServiceCall } from '@/api/serviceCalls';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { CategorySidebar } from '@/components/customer/CategorySidebar';
import { MenuGrid } from '@/components/customer/MenuGrid';
import type { Menu } from '@/types';

export const Route = createLazyFileRoute('/table/$tableNo/menu')({ component: MenuPage });

function MenuPage() {
  const storeId = 1;
  const [selectedCategory, setSelectedCategory] = useState<number | 'recommended'>('recommended');
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', storeId], queryFn: () => getCategories(storeId), staleTime: 5 * 60 * 1000, enabled: !!token,
  });

  const isServiceCategory = typeof selectedCategory === 'number' && categories.find((c) => c.id === selectedCategory)?.isServiceCategory;

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['menus', storeId, selectedCategory],
    queryFn: () => selectedCategory === 'recommended' ? getRecommended(storeId) : getMenus(storeId, selectedCategory),
    staleTime: 60 * 1000, enabled: !!token,
  });

  const handleAddToCart = (menu: Menu) => {
    addItem(menu);
    setSnack({ msg: `${menu.name} 담김`, severity: 'success' });
  };

  const handleServiceCall = async (menu: Menu) => {
    try {
      await createServiceCall(menu.id);
      setSnack({ msg: `${menu.name} 요청 완료`, severity: 'success' });
    } catch { setSnack({ msg: '요청에 실패했습니다', severity: 'error' }); }
  };

  return (
    <CustomerLayout>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(251,251,253,0.72)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="h5" sx={{ px: 2, pt: 2, pb: 0.5, fontSize: '1.5rem' }}>메뉴</Typography>
        <CategorySidebar categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
      </Box>
      <Box sx={{ overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress size={32} sx={{ color: '#86868b' }} /></Box>
        ) : menus.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: '#86868b' }}>메뉴가 없습니다</Typography>
        ) : (
          <MenuGrid menus={menus} onAddToCart={handleAddToCart} onServiceCall={handleServiceCall} isService={!!isServiceCategory} />
        )}
      </Box>
      <Snackbar open={!!snack} autoHideDuration={1500} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack?.severity} variant="filled" sx={{ borderRadius: 980, fontWeight: 500, '&.MuiAlert-filledSuccess': { bgcolor: '#1d1d1f' } }}>{snack?.msg}</Alert>
      </Snackbar>
    </CustomerLayout>
  );
}
