import { create } from 'zustand';

import { DarkMode } from '../shared/types';

type DarkModeStore = {
  darkMode: DarkMode;
  setDarkMode: (darkMode: DarkMode) => void;
};

// Вместо Recoil-атома: recoil 0.7.7 несовместим с React 19
// (использует react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED).
export const useDarkModeStore = create<DarkModeStore>((set) => ({
  darkMode: 'dark' as DarkMode,
  setDarkMode: (darkMode) => set({ darkMode }),
}));
