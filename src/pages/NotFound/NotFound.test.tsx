import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import NotFound from './NotFound';

/**
 * Тесты страницы 404.
 *
 * Проверяют код ошибки, текст по умолчанию, пользовательское сообщение
 * и ссылку на главную страницу.
 */
describe('NotFound page', () => {
  /**
   * Проверяет, что страница выводит код 404, текст по умолчанию
   * и ссылку на главную.
   */
  it('renders 404 heading, default message and home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });

  /**
   * Проверяет, что переданное сообщение заменяет текст по умолчанию.
   */
  it('renders a custom message when provided', () => {
    render(
      <MemoryRouter>
        <NotFound message="Project not found" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Project not found')).toBeInTheDocument();
    expect(screen.queryByText('Page not found')).not.toBeInTheDocument();
  });
});
