import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ButtonIconWithLink, { ButtonIconWithLinkProps } from './index';

const baseProps: ButtonIconWithLinkProps = {
  buttonText: 'GitHub',
  link: 'https://github.com/example',
  img: 'icon.svg',
  altText: 'github icon',
};

describe('ButtonIconWithLink', () => {
  it('renders a link with href, target and rel attributes', () => {
    render(<ButtonIconWithLink {...baseProps} />);

    const link = screen.getByRole('link', { name: /GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/example');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders the icon image with the provided alt text', () => {
    render(<ButtonIconWithLink {...baseProps} />);

    const img = screen.getByRole('img', { name: 'github icon' });
    expect(img).toHaveAttribute('src', 'icon.svg');
  });

  it('renders the text without link semantics when link is not provided', () => {
    const { container } = render(<ButtonIconWithLink buttonText="GitHub" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();

    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBeNull();
    expect(anchor?.getAttribute('target')).toBeNull();
  });
});
