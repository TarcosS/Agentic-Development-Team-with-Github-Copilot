'use client';

import { useStore } from '@/src/store';

export default function HomePage() {
  // Narrow selectors – each one only re-renders when its slice changes.
  const title = useStore((state) => state.title);
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const reset = useStore((state) => state.reset);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'inherit' }}>
        <h1>{title}</h1>

        <p style={{ fontSize: '1.25rem', margin: '1rem 0' }}>
          Counter: <strong>{count}</strong>
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={decrement}>−</button>
          <button onClick={increment}>+</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </main>
  );
}
