import { projects } from '@/shared/constants';
import { ProjectItem } from '@/shared/types';

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
