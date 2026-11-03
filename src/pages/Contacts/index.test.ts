import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/pages/Contacts/index.ts`.
 * Проверяет, что компонент Contacts экспортирован.
 */
describe('Contacts page index exports', () => {
  /**
   * Проверяет, что Contacts экспортирован как named export.
   */
  it('exports Contacts as a named export', async () => {
    const mod = await import('./index');

    expect(mod.Contacts).toBeDefined();
  });
});
