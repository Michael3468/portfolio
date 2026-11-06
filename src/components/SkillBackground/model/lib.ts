/** Смещение слоя фоновых иконок в пикселях. */
export interface ParallaxOffset {
  readonly x: number;
  readonly y: number;
}

/** Во сколько раз движение фона медленнее движения курсора. */
export const PARALLAX_FACTOR = 1 / 20;

/** Максимальное смещение слоя в долях от размера окна. */
export const MAX_OFFSET_RATIO = 0.18;

/**
 * Ограничивает значение заданным диапазоном.
 *
 * @param value - Исходное значение.
 * @param min - Нижняя граница.
 * @param max - Верхняя граница.
 * @returns Значение внутри `[min, max]`.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Считает новое смещение фонового слоя по смещению курсора.
 *
 * Курсор проходит расстояние `delta`, а слой — в `PARALLAX_FACTOR` раз меньше,
 * то есть в 20 раз медленнее. Смещение ограничено краями увеличенного слоя,
 * чтобы плитки не уезжали из кадра.
 *
 * @param current - Текущее смещение слоя.
 * @param delta - Смещение курсора с прошлого события, в пикселях.
 * @param viewport - Размеры окна в пикселях.
 * @param factor - Коэффициент замедления, по умолчанию 1/3.
 * @returns Новое смещение слоя.
 */
export const getParallaxOffset = (
  current: ParallaxOffset,
  delta: ParallaxOffset,
  viewport: { readonly width: number; readonly height: number },
  factor: number = PARALLAX_FACTOR,
): ParallaxOffset => {
  const maxX = viewport.width * MAX_OFFSET_RATIO;
  const maxY = viewport.height * MAX_OFFSET_RATIO;

  return {
    x: clamp(current.x + delta.x * factor, -maxX, maxX),
    y: clamp(current.y + delta.y * factor, -maxY, maxY),
  };
};
