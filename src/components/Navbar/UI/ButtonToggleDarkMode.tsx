import { useEffect } from 'react';

import { useDarkModeStore } from '../../../atoms/darkModeState';
import detectDarkMode from '../../../hooks/detectDarkMode';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { DarkMode } from '../../../shared/types';
import moon from './moon.svg';
import sun from './sun.svg';

import './ButtonToggleDarkMode.css';

export default function ButtonToggleDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage<DarkMode>('darkMode', detectDarkMode());
  const setDarkModeStore = useDarkModeStore((state) => state.setDarkMode);

  const toggleDarkMode = () => {
    setDarkMode((currentValue) => (currentValue === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (darkMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    setDarkModeStore(darkMode);
  }, [darkMode, setDarkModeStore]);

  useEffect(() => {
    const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const changeSiteColorMode = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? 'dark' : 'light';
      setDarkMode(newColorScheme);
    };

    systemColorScheme.addEventListener('change', changeSiteColorMode);
    return () => systemColorScheme.removeEventListener('change', changeSiteColorMode);
  }, [setDarkMode]);

  const btnNormal = 'dark-mode-btn';
  const btnActive = 'dark-mode-btn dark-mode-btn--active';

  return (
    <button
      type="button"
      className={darkMode === 'dark' ? btnActive : btnNormal}
      onClick={toggleDarkMode}
      aria-label="Переключить тему"
      aria-pressed={darkMode === 'dark'}
    >
      <img src={sun} alt="" aria-hidden="true" className="dark-mode-btn__icon" />
      <img src={moon} alt="" aria-hidden="true" className="dark-mode-btn__icon" />
    </button>
  );
}
