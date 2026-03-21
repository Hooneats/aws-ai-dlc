import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 3, retryDelay: (i) => Math.min(1000 * 2 ** i, 30000), refetchOnWindowFocus: true },
    mutations: { retry: 0 },
  },
});

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }

const theme = createTheme({
  palette: {
    primary: { main: '#1d1d1f' },
    secondary: { main: '#0071e3' },
    background: { default: '#fbfbfd', paper: '#ffffff' },
    text: { primary: '#1d1d1f', secondary: '#6e6e73' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    h5: { fontWeight: 600, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle2: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 44, minWidth: 44, borderRadius: 980, textTransform: 'none', fontWeight: 500 } } },
    MuiIconButton: { styleOverrides: { root: { minHeight: 44, minWidth: 44 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 20, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16, boxShadow: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 980, fontWeight: 500 } } },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
