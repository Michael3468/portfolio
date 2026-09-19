/**
 * Тесты страницы «Контакты».
 *
 * Проверяют рендеринг заголовка страницы, наличие ссылок на Telegram и Email,
 * а также заголовки соответствующих секций.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Contacts from './Contacts';

/**
 * Набор тестов для страницы «Контакты».
 */
describe('Contacts page', () => {
  /**
   * Проверяет, что страница рендерит заголовок первого уровня с текстом «Contacts».
   */
  it('renders the heading', () => {
    render(<Contacts />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contacts');
  });

  /**
   * Проверяет, что на странице отображаются две ссылки для отправки сообщения:
   * одна ведёт на Telegram (https://t.me/mikhail3468), другая — на Email
   * (mailto:mikhail3468@yandex.ru).
   */
  it('renders the Telegram and Email links', () => {
    render(<Contacts />);

    const links = screen.getAllByRole('link', { name: 'Click to send message' });
    expect(links).toHaveLength(2);
    expect(links.some((link) => link.getAttribute('href') === 'https://t.me/mikhail3468')).toBe(
      true,
    );
    expect(links.some((link) => link.getAttribute('href') === 'mailto:mikhail3468@yandex.ru')).toBe(
      true,
    );
  });

  /**
   * Проверяет, что на странице отображаются заголовки секций «Telegram» и «Email».
   */
  it('renders the Telegram and Email section titles', () => {
    render(<Contacts />);

    expect(screen.getByRole('heading', { name: 'Telegram' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Email' })).toBeInTheDocument();
  });
});
