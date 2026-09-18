import { DarkMode } from '../shared/types';

/**
 * Проверяет, включена ли системная тёмная тема.
 *
 * @returns `true`, если в операционной системе включена тёмная тема,
 * иначе — `false`.
 */
const isDarkModeEnabled = (): boolean =>
  window?.matchMedia('(prefers-color-scheme: dark)')?.matches;

/**
 * Определяет текущую тему оформления на основе системных настроек.
 *
 * @returns Значение `DarkMode`: `'dark'`, если включена тёмная тема, иначе — `'light'`.
 */
const detectDarkMode = (): DarkMode => (isDarkModeEnabled() === true ? 'dark' : 'light');

export default detectDarkMode;
