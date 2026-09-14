import { create } from 'zustand';

import { TDarkMode } from '../types';

type DarkModeStore = {
  darkMode: TDarkMode;
  setDarkMode: (darkMode: TDarkMode) => void;
};

// Вместо Recoil-атома: recoil 0.7.7 несовместим с React 19
// (использует react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED).
export const useDarkModeStore = create<DarkModeStore>((set) => ({
  darkMode: 'dark' as TDarkMode,
  setDarkMode: (darkMode) => set({ darkMode }),
}));
