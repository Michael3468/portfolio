import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OrbsTitle from './OrbsTitle';

/**
 * Набор тестов для заголовка с анимацией «падающих» букв (OrbsTitle).
 * Проверяет доступное имя заголовка, разбиение текста на буквы,
 * замену пробелов на неразрывные и объединение классов.
 * В jsdom нет element.animate, поэтому анимация (dropOrbs) не запускается —
 * компонент корректно отрабатывает и без неё.
 */
describe('OrbsTitle', () => {
  /**
   * Проверяет, что компонент рендерит заголовок h1 с доступным именем,
   * равным переданному тексту (aria-label), т.к. буквы скрыты aria-hidden.
   */
  it('renders a level-1 heading with the accessible name from the text', () => {
    render(<OrbsTitle text="Hi, I'm Mikhail" />);

    const heading = screen.getByRole('heading', { level: 1, name: "Hi, I'm Mikhail" });
    expect(heading).toBeInTheDocument();
  });

  /**
   * Проверяет, что каждый символ текста рендерится отдельным элементом
   * .orbs__letter, скрытым от скринридеров (aria-hidden="true").
   */
  it('renders every character as an aria-hidden letter span', () => {
    const { container } = render(<OrbsTitle text="abc" />);

    const letters = container.querySelectorAll('.orbs__letter');
    expect(letters).toHaveLength(3);
    letters.forEach((letter) => {
      expect(letter).toHaveAttribute('aria-hidden', 'true');
    });
  });

  /**
   * Проверяет, что пробелы заменяются на неразрывные (\u00A0),
   * чтобы буквы не переносились на новую строку.
   */
  it('replaces spaces with non-breaking spaces', () => {
    const { container } = render(<OrbsTitle text="a b" />);

    const letters = container.querySelectorAll('.orbs__letter');
    expect(letters).toHaveLength(3);
    // Сравниваем textContent напрямую: jest-dom нормализует неразрывные
    // пробелы (\u00A0) как обычные и схлопывает их в пустую строку.
    expect(letters[1].textContent).toBe('\u00A0');
  });

  /**
   * Проверяет, что переданный className объединяется с базовым классом orbs.
   */
  it('merges the custom className with the base orbs class', () => {
    render(<OrbsTitle text="Hi" className="header__title main-text-shadow" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'orbs',
      'header__title',
      'main-text-shadow',
    );
  });
});
