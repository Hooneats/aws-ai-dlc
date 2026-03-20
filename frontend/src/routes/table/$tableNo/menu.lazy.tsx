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
  const storeId = 1; // 단일 매장
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
      <Box sx={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        <CategorySidebar categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress /></Box>
          ) : menus.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">메뉴가 없습니다</Typography>
          ) : (
            <MenuGrid menus={menus} onAddToCart={handleAddToCart} onServiceCall={handleServiceCall} isService={!!isServiceCategory} />
          )}
        </Box>
      </Box>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack?.severity} variant="filled">{snack?.msg}</Alert>
      </Snackbar>
    </CustomerLayout>
  );
}
