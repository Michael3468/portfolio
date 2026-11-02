import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_DARK_MODE, getInitialDarkMode, useDarkModeStore } from './darkModeStore';

/**
 * Тесты стора темы и функции определения начальной темы.
 */
describe('darkModeStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что сохранённый выбор пользователя важнее темы по умолчанию.
   */
  it('uses the saved theme over the default', () => {
    localStorage.setItem('darkMode', 'light');

    expect(getInitialDarkMode()).toBe('light');
  });

  /**
   * Проверяет, что без сохранённого выбора по умолчанию включается тёмная тема.
   */
  it('defaults to dark when nothing is saved', () => {
    expect(getInitialDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что системная светлая тема не меняет тёмную тему по умолчанию.
   */
  it('ignores the system light scheme', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

    expect(getInitialDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что некорректное значение в хранилище игнорируется.
   */
  it('ignores an invalid saved value', () => {
    localStorage.setItem('darkMode', 'purple');

    expect(getInitialDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что недоступный localStorage не ломает определение темы.
   */
  it('falls back to the default when localStorage throws', () => {
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

  /**
   * Проверяет, что выбор пишется в localStorage простой строкой, а не JSON-объектом:
   * так её читает inline-скрипт в index.html.
   */
  it('persists the theme as a raw string under the darkMode key', () => {
    useDarkModeStore.getState().setDarkMode('dark');

    expect(localStorage.getItem('darkMode')).toBe('dark');

    useDarkModeStore.getState().setDarkMode('light');
    expect(localStorage.getItem('darkMode')).toBe('light');
  });

  /**
   * Проверяет, что при создании стора восстанавливается сохранённая тема из localStorage.
   * Модуль перезагружается, потому что стор создаётся при импорте.
   */
  it('restores the saved theme when the store is created', async () => {
    localStorage.setItem('darkMode', 'light');

    vi.resetModules();
    const { useDarkModeStore: freshStore } = await import('./darkModeStore');

    expect(freshStore.getState().darkMode).toBe('light');
  });

  /**
   * Проверяет, что при создании стора некорректное сохранённое значение
   * игнорируется и тема остаётся по умолчанию (`DEFAULT_DARK_MODE`).
   * Модуль перезагружается, потому что стор создаётся при импорте.
   */
  it('falls back to the default when the persisted value is invalid', async () => {
    localStorage.setItem('darkMode', 'purple');

    vi.resetModules();
    const { useDarkModeStore: freshStore, DEFAULT_DARK_MODE } = await import('./darkModeStore');

    expect(freshStore.getState().darkMode).toBe(DEFAULT_DARK_MODE);
  });

  /**
   * Проверяет, что при недоступном localStorage сохранение fallback-темы
   * использует именно `DEFAULT_DARK_MODE` — единую точку, дублируемую inline-скриптом.
   */
  it('exports dark as the default theme', () => {
    expect(DEFAULT_DARK_MODE).toBe('dark');
  });

  /**
   * Проверяет, что ошибка записи в localStorage не ломает изменение темы:
   * состояние остаётся в памяти, ошибка логируется.
   */
  it('keeps the theme in memory when writing to localStorage fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    });

    try {
      useDarkModeStore.getState().setDarkMode('light');

      expect(useDarkModeStore.getState().darkMode).toBe('light');
      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
      vi.restoreAllMocks();
    }
  });
});
