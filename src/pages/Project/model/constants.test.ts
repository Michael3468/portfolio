import { describe, expect, it } from 'vitest';

import { BUTTON_GRADIENT, MOUSE_PARALLAX_SHIFT_PX } from './constants';

/**
 * Набор тестов для констант страницы проекта.
 * Проверяет градиент кнопок GitHub и Live Demo
 * и амплитуду смещения фона секции mouse-parallax.
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

/**
 * Набор тестов для константы `MOUSE_PARALLAX_SHIFT_PX`.
 * Проверяет амплитуду смещения фона секции mouse-parallax.
 */
describe('MOUSE_PARALLAX_SHIFT_PX', () => {
  /**
   * Проверяет, что амплитуда смещения фона за курсором равна 50 пикселям,
   * как в образце mouse-parallax.
   */
  it('is 50 pixels', () => {
    expect(MOUSE_PARALLAX_SHIFT_PX).toBe(50);
  });
});
