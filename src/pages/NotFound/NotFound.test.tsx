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
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/');
  });

  /**
   * Проверяет, что переданное сообщение заменяет текст по умолчанию.
   */
  it('renders a custom message when provided', () => {
    render(
      <MemoryRouter>
        <NotFound message="Проект не найден" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Проект не найден')).toBeInTheDocument();
    expect(screen.queryByText('Страница не найдена')).not.toBeInTheDocument();
  });
});
