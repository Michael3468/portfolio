import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/pages/Contacts/UI/index.ts`.
 * Проверяет, что подкомпоненты списка контактов экспортированы.
 */
describe('Contacts UI index exports', () => {
  /**
   * Проверяет, что ContactItem экспортирован как named export.
   */
  it('exports ContactItem as a named export', async () => {
    const mod = await import('./index');

    expect(mod.ContactItem).toBeDefined();
  });
});
