import type { ReportFormData } from '@/lib';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QueuedReport {
  id: string;
  payload: ReportFormData;
  createdAt: string;
  retries: number;
}

interface OfflineState {
  queue: QueuedReport[];
  isSyncing: boolean;
  enqueue: (payload: ReportFormData) => void;
  dequeue: (id: string) => void;
  incrementRetry: (id: string) => void;
  setIsSyncing: (value: boolean) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      queue: [],
      isSyncing: false,

      enqueue: (payload) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              payload,
              createdAt: new Date().toISOString(),
              retries: 0,
            },
          ],
        })),

      dequeue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),

      incrementRetry: (id) =>
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, retries: item.retries + 1 } : item
          ),
        })),

      setIsSyncing: (value) => set({ isSyncing: value }),
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: 'offline-queue',
    }
  )
);
