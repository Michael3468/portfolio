import { projects } from '@/shared/constants';
import { ProjectItem } from '@/shared/types';

import { MOUSE_PARALLAX_SHIFT_PX } from './constants';

/** Индекс проектов по строковому id: поиск не зависит от того, в каком списке лежит проект. */
const PROJECTS_BY_ID = new Map<string, ProjectItem>(
  projects.map((project) => [String(project.id), project]),
);

/**
 * Находит проект или тестовое задание по id из маршрута `/project/:id`.
 *
 * id сравнивается как строка, без приведения через Number: значения вроде `'015'`,
 * `' 15 '` или `'1e1'` не совпадают с существующими id.
 *
 * @param id - Идентификатор из маршрута (строка или undefined).
 * @returns Объект проекта, либо undefined, если проекта с таким id нет.
 */
export const findProjectById = (id: string | undefined): ProjectItem | undefined =>
  id === undefined ? undefined : PROJECTS_BY_ID.get(id);

/**
 * Считает CSS-transform для фонового слоя секции mouse-parallax по позиции курсора.
 *
 * Позиция курсора нормализуется к диапазону [0, 1] по размерам окна и умножается
 * на амплитуду смещения, как в образце: `translate(-(x * 50)px, -(y * 50)px)` —
 * фон движется против курсора. Одно и то же значение применяется ко всем секциям
 * параллакса на странице, поэтому их слои движутся синхронно.
 *
 * @param clientX - Горизонтальная позиция курсора, в пикселях.
 * @param clientY - Вертикальная позиция курсора, в пикселях.
 * @param windowWidth - Ширина окна, в пикселях.
 * @param windowHeight - Высота окна, в пикселях.
 * @param shiftPx - Амплитуда смещения, в пикселях (по умолчанию 50).
 * @returns Значение для CSS-свойства `transform` фонового слоя.
 */
export const getParallaxTransform = (
  clientX: number,
  clientY: number,
  windowWidth: number,
  windowHeight: number,
  shiftPx: number = MOUSE_PARALLAX_SHIFT_PX,
): string => {
  const x = clientX / windowWidth;
  const y = clientY / windowHeight;

  return `translate(-${x * shiftPx}px, -${y * shiftPx}px)`;
};
