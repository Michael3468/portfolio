import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/pages/Projects/index.ts`.
 * Проверяет, что компоненты Project и Projects экспортированы.
 */
describe('Projects page index exports', () => {
  /**
   * Проверяет, что Project и Projects экспортированы.
   */
  it('exports Project and Projects', async () => {
    const mod = await import('./index');

    expect(mod.Project).toBeDefined();
    expect(mod.Projects).toBeDefined();
  });
});
