/**
 * Тесты страницы «Контакты».
 *
 * Проверяют рендеринг заголовка страницы, открытых ссылок на Telegram и Email,
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
   * Проверяет, что на странице отображаются открытые ссылки на Telegram
   * (https://t.me/mikhail3468) и Email (mikhail3468@yandex.ru).
   */
  it('renders the Telegram and Email links with visible addresses', () => {
    render(<Contacts />);

    expect(screen.getByRole('link', { name: 'https://t.me/mikhail3468' })).toHaveAttribute(
      'href',
      'https://t.me/mikhail3468',
    );
    expect(screen.getByRole('link', { name: 'mikhail3468@yandex.ru' })).toHaveAttribute(
      'href',
      'mailto:mikhail3468@yandex.ru',
    );
  });

  /**
   * Проверяет, что вместо заголовка «Location» отображается иконка геометки,
   * а местоположение рендерится в одной строке с ней.
   */
  it('renders the location icon instead of the Location title', () => {
    render(<Contacts />);

    const icon = screen.getByRole('img', { name: 'Location' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText(/Location:/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Location St. Petersburg, Russia' }),
    ).toContainElement(icon);
  });

  /**
   * Проверяет, что вместо заголовка «Telegram» отображается иконка самолётика,
   * а ссылка рендерится в одной строке с ней.
   */
  it('renders the telegram icon instead of the Telegram title', () => {
    render(<Contacts />);

    const icon = screen.getByRole('img', { name: 'Telegram' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText(/Telegram:/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Telegram https://t.me/mikhail3468' }),
    ).toContainElement(icon);
  });

  /**
   * Проверяет, что вместо заголовка «Email» отображается иконка конверта,
   * а ссылка рендерится в одной строке с ней.
   */
  it('renders the email icon instead of the Email title', () => {
    render(<Contacts />);

    const icon = screen.getByRole('img', { name: 'Email' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Email mikhail3468@yandex.ru' })).toContainElement(
      icon,
    );
  });

  /**
   * Проверяет, что заголовок контакта и его значение рендерятся в одной строке.
   */
  it('renders every contact title and value in one heading', () => {
    render(<Contacts />);

    expect(
      screen.getByRole('heading', { name: 'Location St. Petersburg, Russia' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Telegram / })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Email / })).toBeInTheDocument();
  });

  /**
   * Проверяет, что ссылки на контакты помечены `rel="nofollow"`,
   * чтобы поисковые системы не индексировали их.
   */
  it('marks the Telegram and Email links as nofollow', () => {
    render(<Contacts />);

    const telegramLink = screen.getByRole('link', { name: 'https://t.me/mikhail3468' });
    const emailLink = screen.getByRole('link', { name: 'mikhail3468@yandex.ru' });

    expect(telegramLink).toHaveAttribute('rel', 'nofollow');
    expect(emailLink).toHaveAttribute('rel', 'nofollow');
  });

  /**
   * Проверяет, что страница контактов закрыта от индексации поисковыми системами.
   */
  it('marks the page as noindex, nofollow', () => {
    render(<Contacts />);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });

  /**
   * Проверяет, что на странице отображаются секции «Telegram» и «Email».
   */
  it('renders the Telegram and Email section titles', () => {
    render(<Contacts />);

    expect(screen.getByRole('heading', { name: /^Telegram / })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Email / })).toBeInTheDocument();
  });
});
