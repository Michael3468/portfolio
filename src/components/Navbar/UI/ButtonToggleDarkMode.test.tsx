import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useDarkModeStore } from '../../../atoms/darkModeState';
import ButtonToggleDarkMode from './ButtonToggleDarkMode';

describe('ButtonToggleDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark');
    useDarkModeStore.setState({ darkMode: 'dark' });
  });

  it('renders a toggle button with aria attributes', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to dark theme on click and updates aria-pressed', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('dark');
  });

  it('switches back to light theme on the second click', () => {
    render(<ButtonToggleDarkMode />);

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('light');
  });
});
