import { describe, expect, it } from 'vitest';

import { DEFAULT_SHADOW_COLOR, INNER_SHADOW_COLOR_DARK } from './constants';

/**
 * Набор тестов для констант карточки проекта.
 * Проверяет цвета теней, используемые в светлой и тёмной темах.
 */
describe('Project card constants', () => {
  /**
   * Проверяет, что определён цвет внешней тени по умолчанию.
   */
  it('defines the default shadow color', () => {
    expect(DEFAULT_SHADOW_COLOR).toBe('black');
  });

  /**
   * Проверяет, что определён цвет внутренней тени для тёмной темы.
   */
  it('defines the dark inner shadow color', () => {
    expect(INNER_SHADOW_COLOR_DARK).toBe('#505050');
  });
});
