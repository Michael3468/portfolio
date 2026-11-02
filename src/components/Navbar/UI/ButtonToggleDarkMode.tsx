import { useEffect } from 'react';

import { useDarkModeStore } from '@/store/darkModeStore';

import moon from './moon.svg';
import sun from './sun.svg';

import './ButtonToggleDarkMode.css';

export default function ButtonToggleDarkMode() {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const setDarkMode = useDarkModeStore((state) => state.setDarkMode);

  const toggleDarkMode = () => {
    setDarkMode(darkMode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Класс стоит на <html>: inline-скрипт в index.html ставит его до отрисовки
    document.documentElement.classList.toggle('dark', darkMode === 'dark');
  }, [darkMode]);

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
