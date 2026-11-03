import { describe, expect, it } from 'vitest';

import { projects, projectsList, testTasksList } from './index';

/**
 * Тесты barrel-файла `src/shared/constants/index.ts`.
 * Проверяет, что все ожидаемые экспорты доступны.
 */
describe('shared/constants index exports', () => {
  /**
   * Проверяет, что projects экспортирован и является массивом.
   */
  it('exports projects as an array', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  /**
   * Проверяет, что projectsList экспортирован и является массивом.
   */
  it('exports projectsList as an array', () => {
    expect(Array.isArray(projectsList)).toBe(true);
  });

  /**
   * Проверяет, что testTasksList экспортирован и является массивом.
   */
  it('exports testTasksList as an array', () => {
    expect(Array.isArray(testTasksList)).toBe(true);
  });
});
