import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useDarkModeStore } from '@/store/darkModeStore';

import ButtonToggleDarkMode from './ButtonToggleDarkMode';

/**
 * Набор тестов для компонента ButtonToggleDarkMode.
 *
 * Покрывает рендер кнопки переключения тёмной темы, переключение темы
 * по клику с обновлением ARIA-атрибутов и класса на <html>.
 */
describe('ButtonToggleDarkMode', () => {
  /**
   * Сбрасывает окружение перед каждым тестом:
   * очищает localStorage, удаляет класс `dark` с <html>
   * и возвращает хранилище темы (darkMode store) в состояние `light`.
   */
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    useDarkModeStore.setState({ darkMode: 'light' });
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
   * обновляет aria-pressed на true, добавляет класс `dark` на <html>
   * и сохраняет значение 'dark' в localStorage.
   */
  it('switches to dark theme on click and updates aria-pressed', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('dark');
  });

  /**
   * Проверяет, что повторный клик по кнопке возвращает светлую тему:
   * aria-pressed становится false, класс `dark` снимается с <html>,
   * а в localStorage сохраняется значение 'light'.
   */
  it('switches back to light theme on the second click', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('light');
  });
});
