import { describe, it, expect, vi, afterEach } from "vitest";

// Helpers to simulate browser / SSR environment by patching globalThis.
function simulateBrowser() {
  const mockLocation = { href: "https://example.com/page" };
  const mockNavigator = { userAgent: "test-agent" };
  const mockDocument = { title: "Test Document" };

  const resizeListeners: Array<() => void> = [];
  const mockWindow = {
    location: mockLocation,
    navigator: mockNavigator,
    document: mockDocument,
    addEventListener: vi.fn((event: string, handler: () => void) => {
      if (event === "resize") resizeListeners.push(handler);
    }),
    removeEventListener: vi.fn((event: string, handler: () => void) => {
      if (event === "resize") {
        const idx = resizeListeners.indexOf(handler);
        if (idx !== -1) resizeListeners.splice(idx, 1);
      }
    }),
    _triggerResize: () => resizeListeners.forEach((h) => h()),
  };

  Object.defineProperty(globalThis, "window", {
    value: mockWindow,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: mockNavigator,
    writable: true,
    configurable: true,
  });

  return mockWindow;
}

function simulateSSR() {
  // Delete browser globals from globalThis to simulate a server-side runtime.
  const g = globalThis as Record<string, unknown>;
  delete g["window"];
  delete g["document"];
  delete g["navigator"];
}

afterEach(() => {
  // Reset to SSR-like state after every test so tests don't bleed into each other.
  simulateSSR();
});

// ─── SSR-path tests ─────────────────────────────────────────────────────────

describe("SSR (no window) behavior", () => {
  it("isBrowser returns false when window is undefined", async () => {
    simulateSSR();
    const { isBrowser } = await import("./window-utils");
    expect(isBrowser()).toBe(false);
  });

  it("getWindow returns null during SSR", async () => {
    simulateSSR();
    const { getWindow } = await import("./window-utils");
    expect(getWindow()).toBeNull();
  });

  it("getDocument returns null during SSR", async () => {
    simulateSSR();
    const { getDocument } = await import("./window-utils");
    expect(getDocument()).toBeNull();
  });

  it("getNavigator returns null during SSR", async () => {
    simulateSSR();
    const { getNavigator } = await import("./window-utils");
    expect(getNavigator()).toBeNull();
  });

  it("getLocationHref returns null during SSR", async () => {
    simulateSSR();
    const { getLocationHref } = await import("./window-utils");
    expect(getLocationHref()).toBeNull();
  });

  it("onWindowResize returns a no-op function during SSR", async () => {
    simulateSSR();
    const { onWindowResize } = await import("./window-utils");
    const handler = vi.fn();
    const unsubscribe = onWindowResize(handler);
    // Calling the returned unsubscribe should not throw.
    expect(() => unsubscribe()).not.toThrow();
    // Handler was never called.
    expect(handler).not.toHaveBeenCalled();
  });
});

// ─── Browser-path tests ──────────────────────────────────────────────────────

describe("Browser (window present) behavior", () => {
  it("isBrowser returns true when window is defined", async () => {
    simulateBrowser();
    const { isBrowser } = await import("./window-utils");
    expect(isBrowser()).toBe(true);
  });

  it("getWindow returns the window object", async () => {
    const mock = simulateBrowser();
    const { getWindow } = await import("./window-utils");
    expect(getWindow()).toBe(mock);
  });

  it("getDocument returns the document object", async () => {
    const mock = simulateBrowser();
    const { getDocument } = await import("./window-utils");
    expect(getDocument()).toBe(mock.document);
  });

  it("getNavigator returns the navigator object", async () => {
    const mock = simulateBrowser();
    const { getNavigator } = await import("./window-utils");
    expect(getNavigator()).toBe(mock.navigator);
  });

  it("getLocationHref returns the current href", async () => {
    simulateBrowser();
    const { getLocationHref } = await import("./window-utils");
    expect(getLocationHref()).toBe("https://example.com/page");
  });

  it("onWindowResize registers and unregisters the handler", async () => {
    const mock = simulateBrowser();
    const { onWindowResize } = await import("./window-utils");
    const handler = vi.fn();
    const unsubscribe = onWindowResize(handler);

    expect(mock.addEventListener).toHaveBeenCalledWith("resize", handler);

    unsubscribe();
    expect(mock.removeEventListener).toHaveBeenCalledWith("resize", handler);
  });
});
