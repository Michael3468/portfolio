import { describe, expect, it } from 'vitest';

import { getLetters, replaceSpaceWithNbsp } from './text';

/**
 * Тесты barrel-файла `src/shared/lib/index.ts`.
 * Проверяет, что все ожидаемые экспорты доступны.
 */
describe('shared/lib index exports', () => {
  /**
   * Проверяет, что getLetters экспортирован и является функцией.
   */
  it('exports getLetters as a function', () => {
    expect(typeof getLetters).toBe('function');
    expect(getLetters('test')).toEqual(['t', 'e', 's', 't']);
  });

  /**
   * Проверяет, что replaceSpaceWithNbsp экспортирован и является функцией.
   */
  it('exports replaceSpaceWithNbsp as a function', () => {
    expect(typeof replaceSpaceWithNbsp).toBe('function');
    expect(replaceSpaceWithNbsp(' ')).toBe('\u00A0');
    expect(replaceSpaceWithNbsp('a')).toBe('a');
  });
});
