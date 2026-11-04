import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from './index';

describe('Footer', () => {
  it('renders the github link', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: 'Link to GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/Michael3468');
  });

  it('renders only one link', () => {
    render(<Footer />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('renders the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026')).toBeInTheDocument();
  });
});
