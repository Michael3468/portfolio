import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import AnimatedTitle from './AnimatedTitle';

/**
 * Мок компонента анимации: заменяем `AnimationScale3d` на простой `span`,
 * чтобы проверять развёртывание заголовка без запуска реальной анимации.
 */
vi.mock('../../../components', () => ({
  AnimationScale3d: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}));

/**
 * Набор тестов для анимированного заголовка страницы «Контакты».
 * Проверяет рендер заголовка, развёртывание текста на элементы
 * и замену пробелов на неразрывные.
 */
describe('AnimatedTitle', () => {
  /**
   * Проверяет, что заголовок рендерится как заголовок первого уровня
   * и содержит переданный текст.
   */
  it('renders the title as a level-one heading', () => {
    render(<AnimatedTitle title="Contacts" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Contacts');
  });

  /**
   * Проверяет, что каждая буква заголовка оборачивается
   * в отдельный анимированный элемент.
   */
  it('renders one animation element per letter of the title', () => {
    const { container } = render(<AnimatedTitle title="Hi" />);

    const animations = container.querySelectorAll('h1 > span');
    expect(animations).toHaveLength(2);
  });

  /**
   * Проверяет, что пробелы в заголовке заменяются на неразрывные пробелы (\u00A0).
   */
  it('replaces spaces with non-breaking spaces', () => {
    const { container } = render(<AnimatedTitle title="Test Task" />);

    const animations = Array.from(container.querySelectorAll('h1 > span'));
    expect(animations).toHaveLength(9);

    // Символ пробела в строке 'Test Task' имеет индекс 4 и заменяется на nbsp
    expect(animations[4].textContent).toBe('\u00A0');
  });
});
