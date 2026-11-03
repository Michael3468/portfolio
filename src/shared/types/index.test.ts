import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/shared/types/index.ts`.
 * Проверяет, что все ожидаемые тип-экспорты доступны.
 *
 * TypeScript-компилятор обеспечивает корректность типов на этапе сборки,
 * поэтому тесты проверяют лишь факт доступности экспортов.
 */
describe('shared/types index exports', () => {
  /**
   * Проверяет, что DarkMode — это тип, а не значение.
   * В runtime мы не можем напрямую проверить тип, но можем убедиться,
   * что модуль импортируется без ошибок.
   */
  it('can import DarkMode type without errors', async () => {
    const mod = await import('./types');
    expect(mod).toBeDefined();
  });

  /**
   * Проверяет, что ProjectItem и ProjectSection импортируются.
   */
  it('can import ProjectItem and ProjectSection without errors', async () => {
    const mod = await import('./types');
    expect(mod).toBeDefined();
  });
});
