import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ContactItem as ContactItemData } from '@/pages/Contacts/Contacts.types';

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

    expect(screen.getByRole('heading', { name: 'Location:' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что заголовок и текст контакта рендерятся в одной строке
   * (используется, например, для местоположения).
   */
  it('renders the title and text in one heading', () => {
    render(
      <ContactItem
        item={createItem({ id: 'location', title: 'Location', text: 'St. Petersburg, Russia' })}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Location: St. Petersburg, Russia' }),
    ).toBeInTheDocument();
  });

  /**
   * Проверяет, что при заданной иконке вместо текстового заголовка
   * рендерится SVG-геометка, а `title` становится её доступной подписью.
   */
  it('renders the location icon instead of the title when icon is set', () => {
    render(
      <ContactItem
        item={createItem({
          id: 'location',
          title: 'Location',
          icon: 'location',
          text: 'St. Petersburg, Russia',
        })}
      />,
    );

    const icon = screen.getByRole('img', { name: 'Location' });
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText(/Location:/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Location St. Petersburg, Russia' }),
    ).toContainElement(icon);
  });

  /**
   * Проверяет, что открытая ссылка рендерится в одной строке с заголовком,
   * без промежуточной подписи и обёртки в абзац.
   */
  it('renders the visible link next to the title', () => {
    render(
      <ContactItem
        item={createItem({
          id: 'telegram',
          title: 'Telegram',
          link: { href: 'https://t.me/mikhail3468', label: 'https://t.me/mikhail3468' },
        })}
      />,
    );

    const link = screen.getByRole('link', { name: 'https://t.me/mikhail3468' });
    expect(link).toHaveAttribute('href', 'https://t.me/mikhail3468');
    expect(link).toHaveAttribute('rel', 'nofollow');
    expect(link.closest('p')).toBeNull();
    expect(screen.getByRole('heading', { name: /Telegram/ })).toContainElement(link);
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
          link: { href: 'https://t.me/mikhail3468', label: 'https://t.me/mikhail3468' },
          withTextShadow: true,
        })}
      />,
    );

    expect(screen.getByRole('heading', { name: /Telegram/ })).toHaveClass('text-shadow');

    rerender(
      <ContactItem
        item={createItem({
          id: 'telegram',
          title: 'Telegram',
          link: { href: 'https://t.me/mikhail3468', label: 'https://t.me/mikhail3468' },
        })}
      />,
    );

    expect(screen.getByRole('heading', { name: /Telegram/ })).not.toHaveClass('text-shadow');
  });
});
