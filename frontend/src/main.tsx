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
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#ff9800' } },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 44, minWidth: 44 } } },
    MuiIconButton: { styleOverrides: { root: { minHeight: 44, minWidth: 44 } } },
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
