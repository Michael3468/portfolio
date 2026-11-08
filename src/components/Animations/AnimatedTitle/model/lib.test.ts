import { describe, expect, it } from 'vitest';

import { TITLE_WAVE_STAGGER_MS } from './constants';
import { getWaveDelay } from './lib';

/**
 * Тесты чистой функции расчёта задержек волны анимации заголовка `getWaveDelay`.
 */
describe('getWaveDelay', () => {
  /**
   * Проверяет, что в направлении «слева направо» первая буква стартует сразу,
   * а каждая следующая — с шагом stagger.
   */
  it('returns increasing delays for the forward direction', () => {
    expect(getWaveDelay(0, 5, 'forward')).toBe(0);
    expect(getWaveDelay(2, 5, 'forward')).toBe(2 * TITLE_WAVE_STAGGER_MS);
    expect(getWaveDelay(4, 5, 'forward')).toBe(4 * TITLE_WAVE_STAGGER_MS);
  });

  /**
   * Проверяет, что в направлении «справа налево» порядок задержек
   * зеркально отражается: последняя буква стартует сразу.
   */
  it('returns mirrored delays for the backward direction', () => {
    expect(getWaveDelay(0, 5, 'backward')).toBe(4 * TITLE_WAVE_STAGGER_MS);
    expect(getWaveDelay(2, 5, 'backward')).toBe(2 * TITLE_WAVE_STAGGER_MS);
    expect(getWaveDelay(4, 5, 'backward')).toBe(0);
  });

  /**
   * Проверяет возможность передачи собственного шага волны.
   */
  it('supports a custom stagger', () => {
    expect(getWaveDelay(1, 3, 'forward', 25)).toBe(25);
    expect(getWaveDelay(1, 3, 'backward', 25)).toBe(25);
    expect(getWaveDelay(0, 3, 'backward', 25)).toBe(50);
  });

  /**
   * Проверяет пограничный случай: у одиночной буквы задержка всегда нулевая.
   */
  it('returns 0 for a single-letter title', () => {
    expect(getWaveDelay(0, 1, 'forward')).toBe(0);
    expect(getWaveDelay(0, 1, 'backward')).toBe(0);
  });
});
