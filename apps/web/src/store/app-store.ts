import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppStore, AppState } from './types';

// ============================================================================
// Initial State
// ============================================================================

const initialState: AppState = {
  title: 'My App',
  isLoading: false,
  error: null,
  count: 0,
};

// ============================================================================
// Store
// ============================================================================

/**
 * useAppStore – Zustand store for managing global application state.
 *
 * @example
 * ```typescript
 * // In a client component – use narrow selectors for performance
 * const title = useAppStore((state) => state.title);
 * const increment = useAppStore((state) => state.increment);
 *
 * // Subscribe to changes outside React
 * useAppStore.subscribe(
 *   (state) => state.count,
 *   (count) => console.log('Count changed:', count)
 * );
 * ```
 */
export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial state ──────────────────────────────────────────────────────
    ...initialState,

    // ── Simple setters ─────────────────────────────────────────────────────
    setTitle: (title) => set({ title }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // ── Counter actions ────────────────────────────────────────────────────
    increment: () => set({ count: get().count + 1 }),
    decrement: () => set({ count: get().count - 1 }),

    // ── Reset ──────────────────────────────────────────────────────────────
    reset: () => set(initialState),
  }))
);
