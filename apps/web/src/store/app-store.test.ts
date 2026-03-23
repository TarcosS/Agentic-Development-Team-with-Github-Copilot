import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './app-store';

// Reset the store before each test to guarantee isolation.
beforeEach(() => {
  useStore.getState().reset();
});

describe('useStore – initial state', () => {
  it('has the correct default values', () => {
    const state = useStore.getState();

    expect(state.title).toBe('My App');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.count).toBe(0);
  });
});

describe('useStore – setTitle', () => {
  it('updates the title', () => {
    useStore.getState().setTitle('Hello World');

    expect(useStore.getState().title).toBe('Hello World');
  });
});

describe('useStore – setLoading', () => {
  it('sets isLoading to true', () => {
    useStore.getState().setLoading(true);

    expect(useStore.getState().isLoading).toBe(true);
  });

  it('sets isLoading back to false', () => {
    useStore.getState().setLoading(true);
    useStore.getState().setLoading(false);

    expect(useStore.getState().isLoading).toBe(false);
  });
});

describe('useStore – setError', () => {
  it('stores an error message', () => {
    useStore.getState().setError('Something went wrong');

    expect(useStore.getState().error).toBe('Something went wrong');
  });

  it('clears the error when set to null', () => {
    useStore.getState().setError('oops');
    useStore.getState().setError(null);

    expect(useStore.getState().error).toBeNull();
  });
});

describe('useStore – increment / decrement', () => {
  it('increments the counter by 1', () => {
    useStore.getState().increment();

    expect(useStore.getState().count).toBe(1);
  });

  it('increments the counter multiple times', () => {
    useStore.getState().increment();
    useStore.getState().increment();
    useStore.getState().increment();

    expect(useStore.getState().count).toBe(3);
  });

  it('decrements the counter by 1', () => {
    useStore.getState().increment();
    useStore.getState().decrement();

    expect(useStore.getState().count).toBe(0);
  });

  it('allows negative counter values', () => {
    useStore.getState().decrement();

    expect(useStore.getState().count).toBe(-1);
  });
});

describe('useStore – reset', () => {
  it('restores all state to initial values', () => {
    useStore.getState().setTitle('Changed');
    useStore.getState().setLoading(true);
    useStore.getState().setError('err');
    useStore.getState().increment();

    useStore.getState().reset();

    const state = useStore.getState();
    expect(state.title).toBe('My App');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.count).toBe(0);
  });
});

describe('useStore – subscribeWithSelector', () => {
  it('fires a selector subscription when the subscribed slice changes', () => {
    const received: number[] = [];

    const unsubscribe = useStore.subscribe(
      (state) => state.count,
      (count) => received.push(count)
    );

    useStore.getState().increment();
    useStore.getState().increment();

    unsubscribe();

    // Further mutations should NOT trigger the callback after unsubscribe
    useStore.getState().increment();

    expect(received).toEqual([1, 2]);
  });

  it('does NOT fire the subscription when an unrelated slice changes', () => {
    const received: number[] = [];

    const unsubscribe = useStore.subscribe(
      (state) => state.count,
      (count) => received.push(count)
    );

    useStore.getState().setTitle('New Title');

    unsubscribe();

    expect(received).toHaveLength(0);
  });
});
