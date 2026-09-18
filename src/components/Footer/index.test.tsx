import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from './index';

describe('Footer', () => {
  it('renders social links with their aria-labels', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Link to VK' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link to Instagram' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link to Twitter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link to GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link to LinkedIn' })).toBeInTheDocument();
  });

  it('points every social link to the github profile', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://github.com/Michael3468');
    });
  });

  it('renders the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2023')).toBeInTheDocument();
  });
});
