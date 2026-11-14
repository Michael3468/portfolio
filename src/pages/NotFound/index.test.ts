import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/pages/NotFound/index.ts`.
 * Проверяет, что страница 404 экспортирована по умолчанию.
 */
describe('NotFound page index exports', () => {
  /**
   * Проверяет, что NotFound экспортирован как default.
   */
  it('exports NotFound as default', async () => {
    const mod = await import('./index');

    expect(mod.default).toBeDefined();
  });
});
