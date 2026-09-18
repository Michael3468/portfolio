import { projectsList, testTasksList } from '../../../shared/constants';
import { ProjectItem } from '../../../shared/types';

/**
 * Находит проект по id сначала в списке проектов, затем в списке тестовых заданий.
 *
 * Поиск выполняется по числовому значению id: строка приводится к числу через Number(id).
 * Если проект не найден ни в одном из списков, возвращается undefined.
 *
 * @param id - Идентификатор проекта (строка или undefined). Пустое значение
 *             приводит к Number(undefined) === NaN, и поиск не даст результата.
 * @returns Объект проекта из projectsList, либо из testTasksList,
 *          либо undefined, если проект с указанным id отсутствует в обоих списках.
 */
export const findProjectById = (id: string | undefined): ProjectItem | undefined => {
  const numericId = Number(id);
  return (
    projectsList.find((project) => project.id === numericId) ||
    testTasksList.find((project) => project.id === numericId)
  );
};
