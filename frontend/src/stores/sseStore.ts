import { create } from 'zustand';

interface SseState {
  connected: boolean;
  soundEnabled: boolean;
  setConnected: (v: boolean) => void;
  toggleSound: () => void;
}

export const useSseStore = create<SseState>()((set) => ({
  connected: false,
  soundEnabled: true,
  setConnected: (connected) => set({ connected }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}));
