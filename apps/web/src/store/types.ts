// ============================================================================
// App Store Types
// ============================================================================

/**
 * AppState – the state shape for the application store.
 */
export interface AppState {
  /** Human-readable title surfaced in the UI */
  title: string;
  /** Whether a background operation is in progress */
  isLoading: boolean;
  /** Last error message, or null when no error exists */
  error: string | null;
  /** Running count for demonstrating store mutations */
  count: number;
}

/**
 * AppActions – actions that can be performed on the application store.
 */
export interface AppActions {
  /** Replace the current title */
  setTitle: (title: string) => void;
  /** Replace the loading flag */
  setLoading: (loading: boolean) => void;
  /** Replace the error message */
  setError: (error: string | null) => void;
  /** Increment the counter by 1 */
  increment: () => void;
  /** Decrement the counter by 1 */
  decrement: () => void;
  /** Reset the entire store to its initial state */
  reset: () => void;
}

/**
 * AppStore – combined store type (state + actions).
 */
export type AppStore = AppState & AppActions;
