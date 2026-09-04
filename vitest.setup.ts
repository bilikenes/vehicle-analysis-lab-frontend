import "@testing-library/jest-dom/vitest";

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      addEventListener: () => undefined,
      addListener: () => undefined,
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => undefined,
      removeListener: () => undefined,
    }),
  });
}

if (!globalThis.IntersectionObserver) {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly scrollMargin = "0px";
    readonly thresholds = [0];

    disconnect() {}
    observe(target: Element) {
      this.callback(
        [
          {
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target,
            time: 0,
          },
        ],
        this,
      );
    }
    takeRecords() {
      return [];
    }
    unobserve() {}

    constructor(private readonly callback: IntersectionObserverCallback) {}
  }

  globalThis.IntersectionObserver = IntersectionObserverMock;
}
