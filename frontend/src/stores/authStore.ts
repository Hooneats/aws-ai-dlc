import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: 'admin' | 'table' | null;
  storeCode: string | null;
  storeId: number | null;
  tableId: number | null;
  tableNo: number | null;
  sessionId: string | null;
  setAdmin: (token: string, storeCode: string) => void;
  setTable: (token: string, storeCode: string, tableNo: number, tableId: number, sessionId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, role: null, storeCode: null, storeId: null,
      tableId: null, tableNo: null, sessionId: null,
      setAdmin: (token, storeCode) =>
        set({ token, role: 'admin', storeCode, tableId: null, tableNo: null, sessionId: null }),
      setTable: (token, storeCode, tableNo, tableId, sessionId) =>
        set({ token, role: 'table', storeCode, tableNo, tableId, sessionId }),
      clearAuth: () =>
        set({ token: null, role: null, storeCode: null, storeId: null, tableId: null, tableNo: null, sessionId: null }),
    }),
    { name: 'auth-storage' },
  ),
);
