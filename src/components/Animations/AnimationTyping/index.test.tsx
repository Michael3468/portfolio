import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AnimationTyping from './index';

/**
 * Набор тестов для компонента анимации «печатной машинки» (AnimationTyping).
 * Проверяет посимвольный набор текста, паузу и удаление, мигание курсора,
 * применение className/style и сброс отображения при смене текста.
 * Все таймеры компонента — реальные setTimeout/setInterval, поэтому тесты
 * используют vi.useFakeTimers().
 */
describe('AnimationTyping', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Проверяет, что до начала набора компонент рендерит пустой текст
   * и блок-курсор с классом typing-cursor.
   */
  it('renders an empty text with a cursor before typing starts', () => {
    const { container } = render(<AnimationTyping text="Hi" />);

    const cursor = container.querySelector('.typing-cursor');
    expect(cursor).toBeInTheDocument();
    // Курсор не содержит текста, поэтому textContent обёртки пуст
    expect(container.firstElementChild?.textContent).toBe('');
  });

  /**
   * Проверяет, что текст появляется посимвольно: после каждого интервала
   * typingSpeed добавляется ровно один символ.
   */
  it('types the text character by character', () => {
    const { container } = render(<AnimationTyping text="abc" typingSpeed={80} />);

    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(container.firstElementChild?.textContent).toBe('a');

    act(() => {
      vi.advanceTimersByTime(160);
    });
    expect(container.firstElementChild?.textContent).toBe('abc');
  });

  /**
   * Проверяет полный цикл: после набора текста, паузы pauseBeforeDelete
   * и перехода через фазу «pausing» текст удаляется посимвольно,
   * а после паузы pauseBeforeType набор начинается заново.
   */
  it('deletes the text after the pause and starts typing again', () => {
    const { container } = render(<AnimationTyping text="ab" typingSpeed={50} deletingSpeed={25} />);

    // Текст полностью напечатан
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(container.firstElementChild?.textContent).toBe('ab');

    // Пауза перед удалением (2000) + переход 'pausing' (0) + удаление с запасом
    act(() => {
      vi.advanceTimersByTime(2000 + 300);
    });
    expect(container.firstElementChild?.textContent).toBe('');

    // Пауза перед новым набором (800) → цикл начинается заново,
    // короткий текст «ab» успевает напечататься полностью
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(container.firstElementChild?.textContent).toBe('ab');
  });

  /**
   * Проверяет мигание курсора: интервал мигания равен cursorBlinkSpeed * 500 мс,
   * opacity курсора попеременно становится 1 и 0.
   */
  it('blinks the cursor', () => {
    const { container } = render(<AnimationTyping text="x" />);

    const cursor = container.querySelector('.typing-cursor') as HTMLElement;
    expect(cursor.style.opacity).toBe('1');

    // cursorBlinkSpeed по умолчанию 0.6 → интервал 300 мс
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(cursor.style.opacity).toBe('0');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(cursor.style.opacity).toBe('1');
  });

  /**
   * Проверяет, что className и style применяются к элементу-обёртке.
   */
  it('applies className and style to the wrapper element', () => {
    const { container } = render(
      <AnimationTyping text="hi" className="neon-text" style={{ display: 'inline' }} />,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('neon-text');
    expect(wrapper).toHaveStyle({ display: 'inline' });
  });

  /**
   * Проверяет, что при изменении пропа text набранный текст сбрасывается
   * и цикл начинается заново с пустого состояния.
   */
  it('resets the displayed text when the text prop changes', () => {
    const { container, rerender } = render(<AnimationTyping text="old" />);

    act(() => {
      vi.advanceTimersByTime(80 * 3);
    });
    expect(container.firstElementChild?.textContent).toBe('old');

    rerender(<AnimationTyping text="new text" />);
    expect(container.firstElementChild?.textContent).toBe('');
  });
});
