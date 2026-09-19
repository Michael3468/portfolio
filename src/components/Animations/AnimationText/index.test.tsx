import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AnimationText from './index';

/**
 * Набор тестов для компонента анимации текста (AnimationText).
 * Проверяет разбиение строки на слова и буквы в зависимости
 * от типа анимации, а также замену пробелов на неразрывные.
 */
describe('AnimationText', () => {
  /**
   * Проверяет, что в режиме `words` текст разбивается на слова,
   * каждое из которых рендерится в отдельном элементе span.
   */
  it('splits text into words when animationType is words', () => {
    const { container } = render(<AnimationText text="frontend developer" animationType="words" />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('developer')).toBeInTheDocument();
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });

  /**
   * Проверяет, что в режиме `letters` текст разбивается на отдельные буквы,
   * каждая из которых рендерится в собственном элементе span.
   */
  it('splits text into letters when animationType is letters', () => {
    const { container } = render(<AnimationText text="abc" animationType="letters" />);

    expect(container.querySelectorAll('span')).toHaveLength(3);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  /**
   * Проверяет, что в режиме `letters` обычные пробелы заменяются
   * на неразрывные (\u00A0), чтобы сохранить визуальные отступы.
   */
  it('replaces spaces with non-breaking spaces in letters mode', () => {
    const { container } = render(<AnimationText text="a b" animationType="letters" />);

    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(3);
    // Сравниваем textContent напрямую: jest-dom нормализует неразрывные
    // пробелы (\u00A0) как обычные и схлопывает их в пустую строку.
    expect(spans[1].textContent).toBe('\u00A0');
  });
});
