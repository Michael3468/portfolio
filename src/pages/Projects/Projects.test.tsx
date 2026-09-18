import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Projects from './Projects';

/**
 * Тесты страницы «Проекты».
 *
 * Проверяют корректность отображения секций проектов и тестовых заданий,
 * а также наличие ссылок на страницы деталей проектов.
 */
describe('Projects page', () => {
  /**
   * Проверяет, что на странице отображаются обе секции второго уровня
   * с заголовками «Projects» и «Test Tasks».
   */
  it('renders the projects and test tasks sections', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings).toHaveLength(2);
    expect(sectionHeadings[0]).toHaveTextContent('Projects');
    expect(sectionHeadings[1]).toHaveTextContent('Test Tasks');
  });

  /**
   * Проверяет, что карточки проектов являются ссылками на страницы
   * их деталей с корректными маршрутами /project/15 и /project/29.
   */
  it('renders project cards linking to their detail pages', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    const reactLandingLinks = screen.getAllByRole('link', { name: /React Landing/ });
    expect(reactLandingLinks.length).toBeGreaterThan(0);
    expect(reactLandingLinks.some((link) => link.getAttribute('href') === '/project/15')).toBe(
      true,
    );
    expect(reactLandingLinks.some((link) => link.getAttribute('href') === '/project/29')).toBe(
      true,
    );
  });
});
