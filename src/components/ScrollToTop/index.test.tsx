import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ScrollToTop from './index';

/**
 * Набор тестов для компонента ScrollToTop.
 *
 * Проверяет, что при монтировании компонента страница прокручивается вверх,
 * а также что повторная прокрутка происходит при смене маршрута.
 */
describe('ScrollToTop', () => {
  /**
   * После каждого теста восстанавливает все моки, созданные через vi.spyOn.
   */
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что при монтировании компонента вызывается window.scrollTo(0, 0).
   */
  it('scrolls to the top on mount', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  /**
   * Проверяет, что при смене маршрута (переход по ссылке)
   * прокрутка к началу страницы выполняется повторно.
   */
  it('scrolls to the top again when the route changes', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Link to="/about">About</Link>} />
          <Route path="/about" element={<div>About page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(scrollToSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 0);
  });
});
