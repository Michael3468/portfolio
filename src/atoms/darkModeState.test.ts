import { beforeEach, describe, expect, it } from 'vitest';

import { useDarkModeStore } from './darkModeState';

describe('darkModeState store', () => {
  beforeEach(() => {
    useDarkModeStore.setState({ darkMode: 'dark' });
  });

  it('has dark mode as the initial value', () => {
    expect(useDarkModeStore.getState().darkMode).toBe('dark');
  });

  it('setDarkMode switches the theme to light and back to dark', () => {
    useDarkModeStore.getState().setDarkMode('light');
    expect(useDarkModeStore.getState().darkMode).toBe('light');

    useDarkModeStore.getState().setDarkMode('dark');
    expect(useDarkModeStore.getState().darkMode).toBe('dark');
  });
});
