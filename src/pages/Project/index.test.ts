import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/pages/Project/index.ts`.
 * Проверяет, что компонент Project экспортирован по умолчанию.
 */
describe('Project page index exports', () => {
  /**
   * Проверяет, что Project экспортирован как default.
   */
  it('exports Project as default', async () => {
    const mod = await import('./index');

    expect(mod.default).toBeDefined();
  });
});
