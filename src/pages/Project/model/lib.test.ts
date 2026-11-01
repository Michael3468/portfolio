import { describe, expect, it } from 'vitest';

import { findProjectById } from './lib';

/**
 * Группа тестов для функции `findProjectById`.
 * Проверяет поиск по id среди проектов и тестовых заданий
 * и поведение при некорректном или отсутствующем id.
 */
describe('findProjectById', () => {
  /**
   * Находит проект из секции «Projects» по строковому id из маршрута.
   */
  it('returns a project from the projects section', () => {
    const project = findProjectById('15');

    expect(project?.id).toBe(15);
    expect(project?.title).toBe('React Landing');
    expect(project?.section).toBe('project');
  });

  /**
   * Находит тестовое задание по id из той же общей таблицы.
   */
  it('returns a test task by id', () => {
    const project = findProjectById('29');

    expect(project?.id).toBe(29);
    expect(project?.section).toBe('testTask');
  });

  /**
   * Возвращает undefined для несуществующего id и для нечисловых или неточных
   * значений: поиск идёт по строке, без приведения через Number.
   */
  it('returns undefined for missing or non-matching ids', () => {
    expect(findProjectById('999')).toBeUndefined();
    expect(findProjectById('abc')).toBeUndefined();
    expect(findProjectById('015')).toBeUndefined();
    expect(findProjectById(' 15 ')).toBeUndefined();
    expect(findProjectById('')).toBeUndefined();
    expect(findProjectById(undefined)).toBeUndefined();
  });
});
