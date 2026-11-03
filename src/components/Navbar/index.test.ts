import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/components/Navbar/index.ts`.
 * Проверяет, что все ожидаемые компоненты экспортированы.
 */
describe('Navbar index exports', () => {
  /**
   * Проверяет, что ButtonToggleDarkMode и Navbar экспортированы.
   */
  it('exports ButtonToggleDarkMode and Navbar', async () => {
    const mod = await import('./index');

    expect(mod.ButtonToggleDarkMode).toBeDefined();
    expect(mod.Navbar).toBeDefined();
  });
});
