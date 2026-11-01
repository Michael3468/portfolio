import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getInitialDarkMode, useDarkModeStore } from './darkModeStore';

/**
 * Подменяет window.matchMedia так, чтобы системная тема была заданной.
 *
 * @param matches - `true`, если системная тема тёмная.
 */
const mockSystemDark = (matches: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
};

/**
 * Тесты стора темы и функции определения начальной темы.
 */
describe('darkModeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSystemDark(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что сохранённый выбор пользователя важнее системной темы.
   */
  it('uses the saved theme over the system theme', () => {
    mockSystemDark(true);
    localStorage.setItem('darkMode', 'light');

    expect(getInitialDarkMode()).toBe('light');
  });

  /**
   * Проверяет, что без сохранённого выбора используется системная тема.
   */
  it('falls back to the system theme when nothing is saved', () => {
    mockSystemDark(true);
    expect(getInitialDarkMode()).toBe('dark');

    mockSystemDark(false);
    expect(getInitialDarkMode()).toBe('light');
  });

  /**
   * Проверяет, что некорректное значение в хранилище игнорируется.
   */
  it('ignores an invalid saved value', () => {
    mockSystemDark(true);
    localStorage.setItem('darkMode', 'purple');

    expect(getInitialDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что недоступный localStorage не ломает определение темы.
   */
  it('falls back to the system theme when localStorage throws', () => {
    mockSystemDark(true);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    expect(getInitialDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что setDarkMode переключает тему в сторе.
   */
  it('setDarkMode switches the theme to light and back to dark', () => {
    useDarkModeStore.getState().setDarkMode('light');
    expect(useDarkModeStore.getState().darkMode).toBe('light');

    useDarkModeStore.getState().setDarkMode('dark');
    expect(useDarkModeStore.getState().darkMode).toBe('dark');
  });
});
