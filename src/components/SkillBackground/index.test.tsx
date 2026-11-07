import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SkillBackground from './index';
import { SKILL_BACKGROUND_ICONS } from './model/constants';
import { PARALLAX_FACTOR } from './model/lib';

/**
 * Управляемый requestAnimationFrame для тестов: кадры не выполняются сами,
 * поэтому анимация снега не уходит в бесконечную рекурсию.
 */
const createFrameController = () => {
  const callbacks = new Map<number, FrameRequestCallback>();
  let id = 0;

  const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    id += 1;
    callbacks.set(id, callback);
    return id;
  });

  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
    callbacks.delete(frameId);
  });

  const step = (timestamp: number) => {
    const pending = Array.from(callbacks.values());
    callbacks.clear();
    pending.forEach((callback) => callback(timestamp));
  };

  return { request, cancel, step };
};

/** Возвращает вертикальное смещение из transform иконки. */
const getTileY = (tile: HTMLElement): number => {
  const match = /translate\(-50%,\s*(-?[\d.]+)px\)/u.exec(tile.style.transform);
  return match ? Number(match[1]) : Number.NaN;
};

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

  it('moves the layer only horizontally and much slower than the mouse', () => {
    const frames = createFrameController();

    const { container } = render(<SkillBackground />);
    const layer = container.querySelector<HTMLElement>('.skill-background__layer');

    // Первое событие запоминает точку, второе — двигает слой на 30px * PARALLAX_FACTOR.
    // Вертикальное смещение курсора игнорируется.
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 130, clientY: 160 });
    frames.step(16);

    expect(frames.request).toHaveBeenCalled();
    expect(layer?.style.transform).toBe(`translate3d(${30 * PARALLAX_FACTOR}px, 0px, 0)`);
  });

  it('does not move the layer for touch and pen input', () => {
    createFrameController();

    const { container } = render(<SkillBackground />);
    const layer = container.querySelector<HTMLElement>('.skill-background__layer');

    fireEvent.pointerMove(window, { pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'touch', clientX: 200, clientY: 200 });

    expect(layer?.style.transform).toBe('');
  });

  it('falls down even while the mouse moves', () => {
    const frames = createFrameController();

    const { container } = render(<SkillBackground />);
    const tile = container.querySelector<HTMLElement>('.skill-background__tile');
    const startY = getTileY(tile as HTMLElement);

    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 200, clientY: 100 });

    frames.step(1000);
    frames.step(1080);

    expect(getTileY(tile as HTMLElement)).toBeGreaterThan(startY);
  });

  it('returns the icon at a different horizontal position after a full fall', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(120);
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const frames = createFrameController();

    const { container } = render(<SkillBackground />);
    const tile = container.querySelector<HTMLElement>('.skill-background__tile');
    const startLeft = tile?.style.left;

    let timestamp = 0;
    for (let index = 0; index < 200; index += 1) {
      timestamp += 50;
      frames.step(timestamp);
    }

    expect(tile?.style.left).not.toBe(startLeft);
  });

  it('does not animate when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    const frames = createFrameController();

    render(<SkillBackground />);

    expect(frames.request).not.toHaveBeenCalled();
  });
});
