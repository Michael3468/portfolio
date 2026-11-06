import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SkillBackground from './index';
import { SKILL_BACKGROUND_ICONS } from './model/constants';

describe('SkillBackground', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a decorative SVG tile for every skill', () => {
    const { container } = render(<SkillBackground />);

    const background = container.querySelector('.skill-background');
    const tiles = container.querySelectorAll<HTMLImageElement>('.skill-background__tile');

    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(tiles).toHaveLength(SKILL_BACKGROUND_ICONS.length);
    tiles.forEach((tile) => {
      expect(tile.getAttribute('src')).toMatch(/\.svg|data:image\/svg\+xml/);
      expect(tile).toHaveAttribute('alt', '');
    });
  });

  it('moves the layer three times slower than the mouse', () => {
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });

    const { container } = render(<SkillBackground />);
    const layer = container.querySelector<HTMLElement>('.skill-background__layer');

    // Первое событие запоминает точку, второе — двигает слой на 30 / 3 = 10px.
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 130, clientY: 100 });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(layer?.style.transform).toBe('translate3d(10px, 0px, 0)');
  });

  it('stays still for touch and pen input', () => {
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');

    const { container } = render(<SkillBackground />);
    const layer = container.querySelector<HTMLElement>('.skill-background__layer');

    fireEvent.pointerMove(window, { pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'touch', clientX: 200, clientY: 200 });

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(layer?.style.transform).toBe('');
  });

  it('does not move when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');

    const { container } = render(<SkillBackground />);
    const layer = container.querySelector<HTMLElement>('.skill-background__layer');

    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 200, clientY: 200 });

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(layer?.style.transform).toBe('');
  });
});
