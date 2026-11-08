import { TITLE_WAVE_STAGGER_MS } from './constants';

/** Направление волны анимации заголовка: слева направо или справа налево. */
export type WaveDirection = 'forward' | 'backward';

/**
 * Вычисляет задержку старта анимации для буквы заголовка.
 *
 * Волна идёт по буквам с шагом `stagger`:
 * - `forward` — слева направо: первая буква стартует сразу, каждая следующая позже;
 * - `backward` — справа налево: последняя буква стартует сразу, каждая предыдущая позже.
 *
 * @param index - Индекс буквы в заголовке (от 0).
 * @param count - Общее количество букв в заголовке.
 * @param direction - Направление волны.
 * @param stagger - Задержка между соседними буквами, в мс (по умолчанию `TITLE_WAVE_STAGGER_MS`).
 * @returns Задержка старта анимации буквы, в мс.
 */
export function getWaveDelay(
  index: number,
  count: number,
  direction: WaveDirection,
  stagger: number = TITLE_WAVE_STAGGER_MS,
): number {
  const position = direction === 'forward' ? index : count - 1 - index;
  return position * stagger;
}
