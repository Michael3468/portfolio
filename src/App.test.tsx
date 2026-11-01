import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders navigation and pages', () => {
    render(<App />);

    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacts/i })).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown route', async () => {
    window.history.pushState({}, '', '/this-page-does-not-exist');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На главную' })).toBeInTheDocument();
  });
});
