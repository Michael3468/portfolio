import { useEffect } from 'react';

import { useDarkModeStore } from '../../atoms/darkModeState';
import detectDarkMode from '../../hooks/detectDarkMode';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import moon from './moon.svg';
import sun from './sun.svg';

import './styles.css';

export type TDarkMode = 'light' | 'dark';

const BtnDarkMode = () => {
  const [darkMode, setDarkMode] = useLocalStorage<TDarkMode>('darkMode', detectDarkMode());
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
    <div className={darkMode === 'dark' ? btnActive : btnNormal} onClick={toggleDarkMode}>
      <img src={sun} alt="Light mode" className="dark-mode-btn__icon" />
      <img src={moon} alt="Dark mode" className="dark-mode-btn__icon" />
    </div>
  );
};

export default BtnDarkMode;
