import { describe, expect, it } from 'vitest';

import { clamp, getParallaxOffset, MAX_OFFSET_RATIO, PARALLAX_FACTOR } from './lib';

describe('SkillBackground lib', () => {
  const viewport = { width: 1200, height: 800 };

  it('keeps the value inside the given range', () => {
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(10, -5, 5)).toBe(5);
    expect(clamp(3, -5, 5)).toBe(3);
  });

  it('moves the layer in the same direction as the cursor', () => {
    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 90, y: -60 }, viewport);

    expect(offset.x).toBeGreaterThan(0);
    expect(offset.y).toBeLessThan(0);
  });

  it('moves the layer three times slower than the cursor', () => {
    expect(PARALLAX_FACTOR).toBeCloseTo(1 / 3);

    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 90, y: -60 }, viewport);

    expect(offset).toEqual({ x: 30, y: -20 });
  });

  it('accumulates the offset from the current position', () => {
    const offset = getParallaxOffset({ x: 10, y: 5 }, { x: 30, y: 15 }, viewport);

    expect(offset).toEqual({ x: 20, y: 10 });
  });

  it('does not let the layer move beyond the window limits', () => {
    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 10000, y: -10000 }, viewport);

    expect(offset).toEqual({
      x: viewport.width * MAX_OFFSET_RATIO,
      y: -viewport.height * MAX_OFFSET_RATIO,
    });
  });
});
