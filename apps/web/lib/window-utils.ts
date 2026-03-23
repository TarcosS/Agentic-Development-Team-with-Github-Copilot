/**
 * SSR-safe window utility helpers for Next.js App Router.
 *
 * All helpers guard against `window` being undefined so they are safe to
 * import from both Server Components and Client Components without causing
 * a runtime crash during server-side rendering.
 */

/** Returns `true` only when executing in a browser environment. */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Returns the global `Window` object, or `null` during SSR. */
export function getWindow(): Window | null {
  return isBrowser() ? window : null;
}

/** Returns `document`, or `null` during SSR. */
export function getDocument(): Document | null {
  return isBrowser() ? document : null;
}

/** Returns `navigator`, or `null` during SSR. */
export function getNavigator(): Navigator | null {
  return isBrowser() ? navigator : null;
}

/**
 * Returns `window.location.href`, or `null` during SSR.
 * Use this instead of accessing `window.location.href` directly to avoid
 * server-side reference errors.
 */
export function getLocationHref(): string | null {
  return isBrowser() ? window.location.href : null;
}

/**
 * Attaches a `resize` event listener to the window.
 *
 * Returns an unsubscribe function that removes the listener when called.
 * During SSR (no `window` available) this is a no-op and returns a no-op
 * unsubscribe function, so callers do not need to guard against SSR themselves.
 *
 * @example
 * const unsubscribe = onWindowResize(() => console.log('resized'));
 * // later:
 * unsubscribe();
 */
export function onWindowResize(handler: () => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}
