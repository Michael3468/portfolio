import { describe, expect, it } from 'vitest';

import { BUTTON_GRADIENT } from './constants';

/**
 * Набор тестов для констант страницы проекта.
 * Проверяет значение градиента кнопок GitHub и Live Demo.
 */
describe('BUTTON_GRADIENT', () => {
  /**
   * Проверяет, что градиент кнопок определён как вертикальный
   * переход от белого к полупрозрачному чёрному цвету.
   */
  it('is a linear gradient from white to semi-transparent black', () => {
    expect(BUTTON_GRADIENT).toBe(
      'linear-gradient(to bottom, rgb(255, 255, 255), rgba(0, 0, 0, 0.5))',
    );
  });
});
