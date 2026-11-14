import { describe, expect, it } from 'vitest';

/**
 * Тесты barrel-файла `src/components/Animations/AnimatedTitle/index.ts`.
 * Проверяет, что компонент анимированного заголовка экспортирован.
 */
describe('AnimatedTitle index exports', () => {
  /**
   * Проверяет, что AnimatedTitle экспортирован как named export.
   */
  it('exports AnimatedTitle as a named export', async () => {
    const mod = await import('./index');

    expect(mod.AnimatedTitle).toBeDefined();
  });
});
