import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacts' })).toBeInTheDocument();
  });

  it('renders the dark mode toggle button', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('type', 'button');
  });
});
