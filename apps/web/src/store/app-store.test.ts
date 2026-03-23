import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './app-store';

// Reset the store before each test to guarantee isolation.
beforeEach(() => {
  useAppStore.getState().reset();
});

describe('useAppStore – initial state', () => {
  it('has the correct default values', () => {
    const state = useAppStore.getState();

    expect(state.title).toBe('My App');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.count).toBe(0);
  });
});

describe('useAppStore – setTitle', () => {
  it('updates the title', () => {
    useAppStore.getState().setTitle('Hello World');

    expect(useAppStore.getState().title).toBe('Hello World');
  });
});

describe('useAppStore – setLoading', () => {
  it('sets isLoading to true', () => {
    useAppStore.getState().setLoading(true);

    expect(useAppStore.getState().isLoading).toBe(true);
  });

  it('sets isLoading back to false', () => {
    useAppStore.getState().setLoading(true);
    useAppStore.getState().setLoading(false);

    expect(useAppStore.getState().isLoading).toBe(false);
  });
});

describe('useAppStore – setError', () => {
  it('stores an error message', () => {
    useAppStore.getState().setError('Something went wrong');

    expect(useAppStore.getState().error).toBe('Something went wrong');
  });

  it('clears the error when set to null', () => {
    useAppStore.getState().setError('oops');
    useAppStore.getState().setError(null);

    expect(useAppStore.getState().error).toBeNull();
  });
});

describe('useAppStore – increment / decrement', () => {
  it('increments the counter by 1', () => {
    useAppStore.getState().increment();

    expect(useAppStore.getState().count).toBe(1);
  });

  it('increments the counter multiple times', () => {
    useAppStore.getState().increment();
    useAppStore.getState().increment();
    useAppStore.getState().increment();

    expect(useAppStore.getState().count).toBe(3);
  });

  it('decrements the counter by 1', () => {
    useAppStore.getState().increment();
    useAppStore.getState().decrement();

    expect(useAppStore.getState().count).toBe(0);
  });

  it('allows negative counter values', () => {
    useAppStore.getState().decrement();

    expect(useAppStore.getState().count).toBe(-1);
  });
});

describe('useAppStore – reset', () => {
  it('restores all state to initial values', () => {
    useAppStore.getState().setTitle('Changed');
    useAppStore.getState().setLoading(true);
    useAppStore.getState().setError('err');
    useAppStore.getState().increment();

    useAppStore.getState().reset();

    const state = useAppStore.getState();
    expect(state.title).toBe('My App');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.count).toBe(0);
  });
});

describe('useAppStore – subscribeWithSelector', () => {
  it('fires a selector subscription when the subscribed slice changes', () => {
    const received: number[] = [];

    const unsubscribe = useAppStore.subscribe(
      (state) => state.count,
      (count) => received.push(count)
    );

    useAppStore.getState().increment();
    useAppStore.getState().increment();

    unsubscribe();

    // Further mutations should NOT trigger the callback after unsubscribe
    useAppStore.getState().increment();

    expect(received).toEqual([1, 2]);
  });

  it('does NOT fire the subscription when an unrelated slice changes', () => {
    const received: number[] = [];

    const unsubscribe = useAppStore.subscribe(
      (state) => state.count,
      (count) => received.push(count)
    );

    useAppStore.getState().setTitle('New Title');

    unsubscribe();

    expect(received).toHaveLength(0);
  });
});
