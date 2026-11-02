import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { DarkMode } from '@/shared/types';

/** Ключ localStorage, под которым хранится выбранная тема. */
export const DARK_MODE_STORAGE_KEY = 'darkMode';

const isDarkMode = (value: unknown): value is DarkMode => value === 'light' || value === 'dark';

/**
 * Определяет начальную тему: сохранённый выбор пользователя, а если его нет
 * или хранилище недоступно — тёмную тему по умолчанию.
 *
 * Логика дублируется в inline-скрипте `index.html`, который выставляет класс до отрисовки
 * (иначе была бы вспышка неверной темы). При изменении здесь обновите и скрипт.
 *
 * @returns Текущая тема оформления.
 */
export const DEFAULT_DARK_MODE: DarkMode = 'dark';

export const getInitialDarkMode = (): DarkMode => {
  try {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (isDarkMode(saved)) {
      return saved;
    }
  } catch {
    // localStorage недоступен — используем тему по умолчанию
  }
  return DEFAULT_DARK_MODE;
};

type DarkModeState = {
  darkMode: DarkMode;
};

type DarkModeStore = DarkModeState & {
  setDarkMode: (darkMode: DarkMode) => void;
};

/**
 * Хранилище темы для persist-middleware. Тема лежит в localStorage простой строкой
 * `'light'` / `'dark'`, а не JSON-объектом persist: так её читает inline-скрипт в `index.html`.
 * Некорректные значения и ошибки доступа к localStorage игнорируются.
 */
const darkModeStorage: PersistStorage<DarkModeState> = {
  getItem: (name) => {
    try {
      const saved = localStorage.getItem(name);
      return isDarkMode(saved) ? { state: { darkMode: saved }, version: 0 } : null;
    } catch (error) {
      console.error('getItem error: ' + error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value.state.darkMode);
    } catch (error) {
      // localStorage недоступен или заполнен — тема останется только в памяти
      console.error('setItem error: ' + error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      // localStorage недоступен — удалять нечего
      console.error('removeItem error: ' + error);
    }
  },
};

/**
 * Единственный источник правды о теме оформления. Выбор пользователя сохраняется
 * в localStorage автоматически при каждом изменении через `setDarkMode`.
 */
export const useDarkModeStore = create<DarkModeStore>()(
  persist(
    (set) => ({
      darkMode: getInitialDarkMode(),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: DARK_MODE_STORAGE_KEY,
      storage: darkModeStorage,
      partialize: (state) => ({ darkMode: state.darkMode }),
    },
  ),
);
