import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Home from './Home';

/**
 * Тест страницы Home.
 *
 * Проверяет корректность рендера главной страницы: заголовок,
 * секции навыков и списки используемых технологий.
 */
describe('Home page', () => {
  /**
   * Проверяет, что на странице отображаются заголовок первого уровня
   * и секции навыков Frontend и Backend.
   */
  it('renders the header and the skills sections', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Backend' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что на странице отображаются списки технологий
   * фронтенда (TypeScript) и бэкенда (NodeJS).
   */
  it('renders the frontend and backend tech lists', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/NodeJS/i)).toBeInTheDocument();
  });
});
