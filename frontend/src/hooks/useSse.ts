import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useSseStore } from '@/stores/sseStore';
import { useCartStore } from '@/stores/cartStore';
import { useSound } from './useSound';

export function useAdminSse() {
  const token = useAuthStore((s) => s.token);
  const setConnected = useSseStore((s) => s.setConnected);
  const soundEnabled = useSseStore((s) => s.soundEnabled);
  const qc = useQueryClient();
  const { playBeep } = useSound();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!token) return;
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/sse/admin?token=${token}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.addEventListener('new-order', () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['tables'] });
      if (soundEnabled) playBeep();
    });
    es.addEventListener('order-status', () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    });
    es.addEventListener('order-updated', () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    });
    es.addEventListener('order-deleted', () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['tables'] });
    });
    es.addEventListener('service-call', () => {
      qc.invalidateQueries({ queryKey: ['serviceCalls'] });
      if (soundEnabled) playBeep();
    });

    return () => { es.close(); setConnected(false); };
  }, [token, soundEnabled, qc, setConnected, playBeep]);
}

export function useTableSse(tableId: number | null) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    if (!token || !tableId) return;
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/sse/table/${tableId}?token=${token}`;
    const es = new EventSource(url);

    es.addEventListener('order-status', () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    });
    es.addEventListener('session-end', () => {
      clearCart();
      qc.invalidateQueries({ queryKey: ['orders'] });
    });

    return () => es.close();
  }, [token, tableId, qc, clearCart]);
}
