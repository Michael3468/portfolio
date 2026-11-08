import { describe, expect, it } from 'vitest';

import { TITLE_WAVE_INTERVAL_MS, TITLE_WAVE_STAGGER_MS } from './constants';

/**
 * Тесты констант волны анимации заголовка.
 * Проверяют значения интервалов автозапуска и задержки между буквами.
 */
describe('title wave constants', () => {
  /**
   * Проверяет, что волна запускается каждые 10 секунд.
   */
  it('autostarts the wave every 10 seconds', () => {
    expect(TITLE_WAVE_INTERVAL_MS).toBe(10_000);
  });

  /**
   * Проверяет, что задержка между буквами разумная: больше нуля,
   * чтобы волна была заметна, но не больше 100 мс, чтобы не растягивать волну.
   */
  it('uses a reasonable stagger between letters', () => {
    expect(TITLE_WAVE_STAGGER_MS).toBeGreaterThan(0);
    expect(TITLE_WAVE_STAGGER_MS).toBeLessThanOrEqual(100);
  });
});
