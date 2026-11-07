import { describe, expect, it } from 'vitest';

import {
  clamp,
  getNextSnowflakeY,
  getParallaxOffset,
  getRespawnLeft,
  getSnowSwayAngle,
  MAX_OFFSET_RATIO,
  PARALLAX_FACTOR,
  SNOW_HIDDEN_HEIGHT_SCALE,
  SNOW_LEFT_MAX,
  SNOW_LEFT_MIN,
  SNOW_SWAY_AMPLITUDE,
} from './lib';

describe('SkillBackground lib', () => {
  const viewport = { width: 1200, height: 800 };

  it('keeps the value inside the given range', () => {
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(10, -5, 5)).toBe(5);
    expect(clamp(3, -5, 5)).toBe(3);
  });

  it('moves the layer horizontally in the same direction as the cursor', () => {
    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 90 }, viewport);

    expect(offset.x).toBeGreaterThan(0);
    expect(offset.y).toBe(0);
  });

  it('moves the layer much slower than the cursor', () => {
    expect(PARALLAX_FACTOR).toBeCloseTo(1 / 20);

    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 90 }, viewport);

    expect(offset).toEqual({ x: 4.5, y: 0 });
  });

  it('ignores vertical cursor movement so the icons keep falling', () => {
    const offset = getParallaxOffset({ x: 10, y: 0 }, { x: 30 }, viewport);

    expect(offset).toEqual({ x: 11.5, y: 0 });
  });

  it('does not let the layer move beyond the window limits', () => {
    const offset = getParallaxOffset({ x: 0, y: 0 }, { x: 10000 }, viewport);

    expect(offset).toEqual({
      x: viewport.width * MAX_OFFSET_RATIO,
      y: 0,
    });
  });

  it('sways the icon to 30 degrees in both directions', () => {
    expect(SNOW_SWAY_AMPLITUDE).toBe(30);
    expect(getSnowSwayAngle(Math.PI / 2, 0)).toBe(30);
    expect(getSnowSwayAngle(-Math.PI / 2, 0)).toBe(-30);
  });

  it('moves the icon down at the given speed', () => {
    expect(getNextSnowflakeY(100, 20, 1, 60, 800)).toBe(120);
    expect(getNextSnowflakeY(100, 20, 0.5, 60, 800)).toBe(110);
  });

  it('returns the icon above the top with a margin after it leaves the bottom', () => {
    // Следующая позиция 810 > 800 — иконка целиком ушла вниз.
    expect(getNextSnowflakeY(790, 20, 1, 60, 800)).toBe(-60 * SNOW_HIDDEN_HEIGHT_SCALE);
  });

  it('picks a new horizontal position for the returned icon', () => {
    const left = getRespawnLeft(20, () => 0.8);

    expect(left).toBeCloseTo(SNOW_LEFT_MIN + 0.8 * (SNOW_LEFT_MAX - SNOW_LEFT_MIN));
    expect(Math.abs(left - 20)).toBeGreaterThan(10);
  });

  it('retries when the random position is too close to the previous one', () => {
    const values = [0, 0, 0.9];
    let index = 0;
    const random = () => values[index++] ?? 0.9;

    expect(getRespawnLeft(SNOW_LEFT_MIN, random)).toBeCloseTo(
      SNOW_LEFT_MIN + 0.9 * (SNOW_LEFT_MAX - SNOW_LEFT_MIN),
    );
  });

  it('shifts the icon to the other side if random keeps returning the same place', () => {
    const range = SNOW_LEFT_MAX - SNOW_LEFT_MIN;
    const samePlace = () => (60 - SNOW_LEFT_MIN) / range;

    // 60 + 45 = 105 > 95, поэтому позиция переносится на 15.
    expect(getRespawnLeft(60, samePlace)).toBe(15);
  });
});
