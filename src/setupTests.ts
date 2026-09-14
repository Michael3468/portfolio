import '@testing-library/jest-dom/vitest';

// jsdom не реализует window.matchMedia — мокаем для компонентов тёмной темы
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom не реализует window.scrollTo — используется в ScrollToTop
window.scrollTo = () => {};
