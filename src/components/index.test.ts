import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/components/index.ts`.
 * Проверяет, что все ожидаемые компоненты экспортированы.
 */
describe('components index exports', () => {
  /**
   * Проверяет, что модуль импортируется без ошибок.
   */
  it('can import all components without errors', async () => {
    const mod = await import('./index');

    expect(mod).toBeDefined();
    expect(mod.AnimationScale3d).toBeDefined();
    expect(mod.AnimationText).toBeDefined();
    expect(mod.ButtonIconWithLink).toBeDefined();
    expect(mod.ButtonToggleDarkMode).toBeDefined();
    expect(mod.Navbar).toBeDefined();
    expect(mod.Footer).toBeDefined();
    expect(mod.Header).toBeDefined();
    expect(mod.ScrollToTop).toBeDefined();
  });
});
