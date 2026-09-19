import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDarkModeStore } from '../../../atoms/darkModeState';
import ButtonToggleDarkMode from './ButtonToggleDarkMode';

/**
 * Набор тестов для компонента ButtonToggleDarkMode.
 *
 * Покрывает рендер кнопки переключения тёмной темы, переключение темы
 * по клику с обновлением ARIA-атрибутов и реакцию на изменение
 * системной цветовой схемы (prefers-color-scheme).
 */
describe('ButtonToggleDarkMode', () => {
  /**
   * Сбрасывает окружение перед каждым тестом:
   * очищает localStorage, удаляет класс `dark` с body
   * и возвращает хранилище темы (darkMode store) в состояние `dark`.
   */
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark');
    useDarkModeStore.setState({ darkMode: 'dark' });
  });

  /**
   * Проверяет, что кнопка переключения темы отрендерилась
   * с корректными ARIA-атрибутами: type="button" и aria-pressed="false".
   */
  it('renders a toggle button with aria attributes', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  /**
   * Проверяет, что клик по кнопке переключает тему на тёмную:
   * обновляет aria-pressed на true, добавляет класс `dark` на body
   * и сохраняет значение 'dark' в localStorage.
   */
  it('switches to dark theme on click and updates aria-pressed', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('dark');
  });

  /**
   * Проверяет, что повторный клик по кнопке возвращает светлую тему:
   * aria-pressed становится false, класс `dark` снимается с body,
   * а в localStorage сохраняется значение 'light'.
   */
  it('switches back to light theme on the second click', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('light');
  });

  /**
   * Проверяет, что компонент реагирует на изменение системной цветовой схемы:
   * при matches: true включается тёмная тема, при matches: false — светлая.
   * window.matchMedia подменяется через vi.stubGlobal, чтобы слушатель
   * события change можно было вызвать вручную из теста.
   */
  it('updates the theme when the system color scheme changes', () => {
    // Локально переопределяем window.matchMedia, чтобы слушатель события
    // change сохранялся и его можно было вызвать вручную из теста.
    let changeListener: ((event: { matches: boolean }) => void) | null = null;

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(
          (_event: string, listener: (event: { matches: boolean }) => void) => {
            changeListener = listener;
          },
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => false),
      })),
    );

    try {
      render(<ButtonToggleDarkMode />);

      expect(changeListener).not.toBeNull();

      act(() => {
        changeListener?.({ matches: true });
      });

      expect(document.body.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('darkMode')).toBe('dark');

      act(() => {
        changeListener?.({ matches: false });
      });

      expect(document.body.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('darkMode')).toBe('light');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
