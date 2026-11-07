/** Смещение слоя фоновых иконок в пикселях. */
export interface ParallaxOffset {
  readonly x: number;
  readonly y: number;
}

/** Во сколько раз движение фона медленнее движения курсора. */
export const PARALLAX_FACTOR = 1 / 20;

/** Максимальное смещение слоя в долях от размера окна. */
export const MAX_OFFSET_RATIO = 0.18;

/** Амплитуда покачивания иконок при падении, в градусах. */
export const SNOW_SWAY_AMPLITUDE = 30;

/** Допустимый диапазон горизонтальной позиции иконки, в процентах от ширины слоя. */
export const SNOW_LEFT_MIN = 5;
export const SNOW_LEFT_MAX = 95;

/** Минимальное расстояние между старой и новой позицией, в долях диапазона. */
const SNOW_LEFT_MIN_DISTANCE_RATIO = 0.2;

/**
 * Выбирает новое горизонтальное положение для иконки, вернувшейся сверху.
 *
 * Позиция всегда заметно отличается от предыдущей, чтобы иконка появлялась
 * в другом месте, а не падала по той же линии.
 *
 * @param currentLeft - Позиция перед возвратом, в процентах.
 * @param random - Источник случайных чисел, по умолчанию `Math.random`.
 * @returns Новая позиция в процентах.
 */
export const getRespawnLeft = (currentLeft: number, random: () => number = Math.random): number => {
  const range = SNOW_LEFT_MAX - SNOW_LEFT_MIN;
  const minDistance = range * SNOW_LEFT_MIN_DISTANCE_RATIO;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const nextLeft = SNOW_LEFT_MIN + random() * range;
    if (Math.abs(nextLeft - currentLeft) >= minDistance) {
      return nextLeft;
    }
  }

  // Крайне маловероятный случай: сдвигаем на половину диапазона.
  const shifted = currentLeft + range / 2;
  return shifted > SNOW_LEFT_MAX ? shifted - range : shifted;
};

/**
 * Запас при возврате иконки наверх: повёрнутый квадрат занимает больше высоты,
 * поэтому его нужно спрятать с запасом, чтобы ни один угол не выглянул из-за края.
 */
export const SNOW_HIDDEN_HEIGHT_SCALE = 1.5;

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
 * Угол покачивания иконки в текущий момент падения.
 *
 * @param elapsed - Время падения в секундах.
 * @param phase - Начальная фаза, чтобы иконки качались не синхронно.
 * @returns Угол от -30 до 30 градусов.
 */
export const getSnowSwayAngle = (elapsed: number, phase: number): number =>
  Math.sin(elapsed + phase) * SNOW_SWAY_AMPLITUDE;

/**
 * Смещает иконку вниз и возвращает её сверху, когда она полностью ушла за нижнюю границу.
 *
 * После возврата верх иконки находится ровно на её высоту выше верхней границы окна,
 * поэтому в момент появления иконка полностью скрыта.
 *
 * @param y - Текущее вертикальное смещение иконки относительно слоя, в пикселях.
 * @param speed - Скорость падения в пикселях в секунду.
 * @param deltaSeconds - Время с прошлого кадра в секундах.
 * @param tileHeight - Высота иконки в пикселях.
 * @param viewportHeight - Высота окна в пикселях.
 * @returns Новое вертикальное смещение иконки.
 */
export const getNextSnowflakeY = (
  y: number,
  speed: number,
  deltaSeconds: number,
  tileHeight: number,
  viewportHeight: number,
): number => {
  const nextY = y + speed * deltaSeconds;

  // Иконка целиком ушла вниз — возвращаем её выше окна с запасом на поворот.
  if (nextY > viewportHeight) {
    return -tileHeight * SNOW_HIDDEN_HEIGHT_SCALE;
  }

  return nextY;
};

/**
 * Считает новое смещение фонового слоя по горизонтальному смещению курсора.
 *
 * Курсор проходит расстояние `delta.x`, а слой — в `PARALLAX_FACTOR` раз меньше,
 * то есть в 20 раз медленнее. Вертикальное движение курсора игнорируется: слой
 * смещается только влево и вправо, чтобы не мешать падению иконок. Смещение
 * ограничено краями увеличенного слоя, чтобы плитки не уезжали из кадра.
 *
 * @param current - Текущее смещение слоя.
 * @param delta - Смещение курсора с прошлого события, в пикселях.
 * @param viewport - Размеры окна в пикселях.
 * @param factor - Коэффициент замедления, по умолчанию 1/20.
 * @returns Новое смещение слоя по горизонтали.
 */
export const getParallaxOffset = (
  current: ParallaxOffset,
  delta: { readonly x: number },
  viewport: { readonly width: number; readonly height: number },
  factor: number = PARALLAX_FACTOR,
): ParallaxOffset => {
  const maxX = viewport.width * MAX_OFFSET_RATIO;

  return {
    x: clamp(current.x + delta.x * factor, -maxX, maxX),
    y: 0,
  };
};
