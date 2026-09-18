import { afterEach, describe, expect, it, vi } from 'vitest';

import detectDarkMode from './detectDarkMode';

/**
 * Создаёт мок для глобального объекта `window.matchMedia`.
 *
 * Мок возвращает объект с фиксированным значением `matches`, имитируя
 * системную цветовую схему («тёмная» при `matches: true`, «светлая» — при `false`).
 *
 * @param matches - Значение, которое мок возвращает как результат проверки медиазапроса.
 * @returns Функция-заглушка, совместимая по типу с `window.matchMedia`.
 */
const createMatchMediaMock = (matches: boolean) =>
  ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;

/**
 * Тесты для функции `detectDarkMode` — определения цветовой схемы системы.
 */
describe('detectDarkMode', () => {
  /**
   * После каждого теста сбрасывает все заглушки глобальных объектов,
   * установленные через `vi.stubGlobal`.
   */
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * Проверяет, что при тёмной цветовой схеме системы
   * функция `detectDarkMode` возвращает значение `'dark'`.
   */
  it('returns "dark" when the system prefers a dark color scheme', () => {
    vi.stubGlobal('matchMedia', createMatchMediaMock(true));

    expect(detectDarkMode()).toBe('dark');
  });

  /**
   * Проверяет, что при светлой цветовой схеме системы
   * функция `detectDarkMode` возвращает значение `'light'`.
   */
  it('returns "light" when the system prefers a light color scheme', () => {
    vi.stubGlobal('matchMedia', createMatchMediaMock(false));

    expect(detectDarkMode()).toBe('light');
  });
});
