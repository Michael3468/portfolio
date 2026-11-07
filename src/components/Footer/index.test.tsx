import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from './index';

describe('Footer', () => {
  it('renders the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026')).toBeInTheDocument();
  });

  it('does not render any links', () => {
    render(<Footer />);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
