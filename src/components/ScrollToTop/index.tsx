import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент автоматически прокручивает страницу в самое начало
 * при каждом изменении текущего пути (pathname) в React Router.
 *
 * Использует хук `useLocation` для отслеживания маршрута и хук
 * `useEffect` для вызова `window.scrollTo(0, 0)` при его изменении.
 * Ничего не рендерит, поэтому возвращает `null`.
 *
 * @returns {null} Всегда возвращает `null`.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
