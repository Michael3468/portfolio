import { create } from 'zustand';

import detectDarkMode from '@/hooks/detectDarkMode';
import { DarkMode } from '@/shared/types';

/** Ключ localStorage, под которым хранится выбранная тема. */
export const DARK_MODE_STORAGE_KEY = 'darkMode';

/**
 * Определяет начальную тему: сохранённый выбор пользователя, а если его нет
 * или хранилище недоступно — системную тему.
 *
 * Логика дублируется в inline-скрипте `index.html`, который выставляет класс до отрисовки
 * (иначе была бы вспышка неверной темы). При изменении здесь обновите и скрипт.
 *
 * @returns Текущая тема оформления.
 */
export const getInitialDarkMode = (): DarkMode => {
  try {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // localStorage недоступен — используем системную тему
  }
  return detectDarkMode();
};

type DarkModeStore = {
  darkMode: DarkMode;
  setDarkMode: (darkMode: DarkMode) => void;
};

// Вместо Recoil-атома: recoil 0.7.7 несовместим с React 19
// (использует react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED).
export const useDarkModeStore = create<DarkModeStore>((set) => ({
  darkMode: getInitialDarkMode(),
  setDarkMode: (darkMode) => set({ darkMode }),
}));
