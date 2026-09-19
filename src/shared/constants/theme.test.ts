import { describe, expect, it } from 'vitest';

import { styles } from './theme';

/**
 * Набор тестов для констант стилей темы.
 * Проверяет структуру объекта `styles` и значения ключевых стилей.
 */
describe('theme styles', () => {
  /**
   * Проверяет, что определена тень текста основной темы.
   */
  it('defines the main theme text shadow', () => {
    expect(styles.mainTheme.textShadow).toBe('2px 2px 2px black');
  });
});
