import { DarkMode } from '@/shared/types';

/**
 * Проверяет, включена ли системная тёмная тема.
 *
 * Если `matchMedia` недоступен (старые браузеры, окружения без DOM), считается,
 * что тёмная тема не включена.
 *
 * @returns `true`, если в операционной системе включена тёмная тема,
 * иначе — `false`.
 */
const isDarkModeEnabled = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Определяет текущую тему оформления на основе системных настроек.
 *
 * @returns Значение `DarkMode`: `'dark'`, если включена тёмная тема, иначе — `'light'`.
 */
const detectDarkMode = (): DarkMode => (isDarkModeEnabled() ? 'dark' : 'light');

export default detectDarkMode;
