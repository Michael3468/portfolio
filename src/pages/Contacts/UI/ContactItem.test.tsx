import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ContactItem as ContactItemData } from '../Contacts.types';
import ContactItem from './ContactItem';

/**
 * Вспомогательная функция для создания тестовых данных элемента контакта.
 *
 * @param item - Данные элемента контакта.
 * @returns Объект типа `ContactItem` для рендера компонента.
 */
const createItem = (overrides: Partial<ContactItemData>): ContactItemData => ({
  id: 'location',
  title: 'Location',
  ...overrides,
});

/**
 * Набор тестов для элемента списка контактов страницы «Контакты».
 * Проверяет рендеринг текста, ссылки и применение стилей.
 */
describe('ContactItem', () => {
  /**
   * Проверяет, что компонент рендерит заголовок секции.
   */
  it('renders the section title', () => {
    render(<ContactItem item={createItem({ title: 'Location' })} />);

    expect(screen.getByRole('heading', { name: 'Location' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что компонент рендерит текст контакта
   * (используется, например, для местоположения).
   */
  it('renders the text of the contact', () => {
    render(
      <ContactItem
        item={createItem({ id: 'location', title: 'Location', text: 'St. Petersburg, Russia' })}
      />,
    );

    expect(screen.getByText('St. Petersburg, Russia')).toBeInTheDocument();
  });

  /**
   * Проверяет, что компонент рендерит ссылку без обёртки в абзац,
   * когда флаг `wrapInParagraph` не задан.
   */
  it('renders the link without wrapping it into a paragraph', () => {
    render(
      <ContactItem
        item={createItem({
          id: 'telegram',
          title: 'Telegram',
          link: { href: 'https://t.me/mikhail3468', label: 'Click to send message' },
        })}
      />,
    );

    const link = screen.getByRole('link', { name: 'Click to send message' });
    expect(link).toHaveAttribute('href', 'https://t.me/mikhail3468');
    expect(link.closest('p')).toBeNull();
  });

  /**
   * Проверяет, что ссылка оборачивается в абзац `<p>`,
   * когда флаг `wrapInParagraph` установлен.
   */
  it('wraps the link into a paragraph when wrapInParagraph is true', () => {
    render(
      <ContactItem
        item={createItem({
          id: 'email',
          title: 'Email',
          link: {
            href: 'mailto:mikhail3468@yandex.ru',
            label: 'Click to send message',
            wrapInParagraph: true,
          },
        })}
      />,
    );

    const link = screen.getByRole('link', { name: 'Click to send message' });
    expect(link.closest('p')).not.toBeNull();
  });

  /**
   * Проверяет, что класс `text-shadow` применяется к заголовку
   * только для контактов, помеченных флагом `withTextShadow`.
   */
  it('applies the text-shadow class only when withTextShadow is set', () => {
    const { rerender } = render(
      <ContactItem
        item={createItem({
          id: 'telegram',
          title: 'Telegram',
          link: { href: 'https://t.me/mikhail3468', label: 'Click to send message' },
          withTextShadow: true,
        })}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Telegram' })).toHaveClass('text-shadow');

    rerender(
      <ContactItem
        item={createItem({
          id: 'telegram',
          title: 'Telegram',
          link: { href: 'https://t.me/mikhail3468', label: 'Click to send message' },
        })}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Telegram' })).not.toHaveClass('text-shadow');
  });
});
