import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Header from './index';

/**
 * Набор тестов для компонента шапки (Header).
 * Шапка состоит из OrbsTitle (заголовок с анимацией букв) и AnimationTyping
 * (подзаголовок «печатной машинки», который начинает с пустого текста).
 * Тесты набора AnimationTyping используют фейковые таймеры.
 */
describe('Header', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Проверяет, что имя выводится заголовком h1: доступное имя задаётся
   * через aria-label (буквы скрыты для скринридеров), а каждая буква
   * рендерится элементом .orbs__letter.
   */
  it('renders the name as the main heading', () => {
    const { container } = render(<Header />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('aria-label', "Hi, I'm Mikhail");
    expect(container.querySelectorAll('.orbs__letter')).toHaveLength("Hi, I'm Mikhail".length);
  });

  /**
   * Проверяет подзаголовок «печатной машинки»: до начала набора виден
   * только курсор, а после прохождения таймингов (20 символов * 80 мс)
   * выводится полный текст «Full-Stack Developer».
   */
  it('renders the typing subtitle with a cursor', () => {
    vi.useFakeTimers();
    const { container } = render(<Header />);

    const subtitle = container.querySelector('.header__text');
    expect(subtitle).toBeInTheDocument();

    // До начала набора текст пуст, виден только курсор
    expect(container.querySelector('.typing-cursor')).toBeInTheDocument();
    expect(subtitle?.textContent).toBe('');

    // Полный текст «Full-Stack Developer» (20 символов) набирается за 20 * 80 мс
    act(() => {
      vi.advanceTimersByTime(20 * 80);
    });
    expect(subtitle?.textContent).toBe('Full-Stack Developer');
  });
});
