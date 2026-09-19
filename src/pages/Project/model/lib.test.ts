import { describe, expect, it } from 'vitest';

import { findProjectById } from './lib';

/**
 * Группа тестов для функции `findProjectById`.
 * Проверяет поиск проекта по идентификатору в разных списках,
 * а также поведение при отсутствии проекта.
 */
describe('findProjectById', () => {
  /**
   * Возвращает проект из `projectsList` по переданному идентификатору.
   * Проверяет корректность id и title найденного проекта.
   */
  it('returns a project from projectsList by id', () => {
    const project = findProjectById('15');

    expect(project).toBeDefined();

    if (!project) {
      throw new Error('Project with id "15" was not found in projectsList');
    }

    expect(project.id).toBe(15);
    expect(project.title).toBe('React Landing');
  });

  /**
   * Возвращает проект из `testTasksList`, когда id отсутствует в `projectsList`.
   * Проверяет корректность id и title найденного проекта.
   */
  it('returns a project from testTasksList when id is not in projectsList', () => {
    const project = findProjectById('29');

    expect(project).toBeDefined();

    if (!project) {
      throw new Error('Project with id "29" was not found in testTasksList');
    }

    expect(project.id).toBe(29);
    expect(project.title).toBe('React Landing');
  });

  /**
   * Возвращает `undefined`, когда проект с указанным идентификатором не существует.
   * Покрывает случаи несуществующего id, некорректной строки и `undefined`.
   */
  it('returns undefined when the project does not exist', () => {
    expect(findProjectById('999')).toBeUndefined();
    expect(findProjectById('abc')).toBeUndefined();
    expect(findProjectById(undefined)).toBeUndefined();
  });
});
