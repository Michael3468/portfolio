import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './index';

describe('Header', () => {
  it('renders the name as the main heading', () => {
    render(<Header />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent("Hi, I'm Mikhail,");
  });

  it('renders the subtitle words', () => {
    render(<Header />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('developer')).toBeInTheDocument();
  });

  it('renders the letters of the bottom tagline', () => {
    const { container } = render(<Header />);

    expect(container).toHaveTextContent('with passion for learning and creating');
  });
});
