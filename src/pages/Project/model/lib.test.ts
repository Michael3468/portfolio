import { describe, expect, it } from 'vitest';

import { findProjectById, getParallaxTransform } from './lib';

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

/**
 * Группа тестов для функции `getParallaxTransform`.
 * Проверяет расчёт CSS-transform фонового слоя mouse-parallax по позиции курсора.
 */
describe('getParallaxTransform', () => {
  /**
   * В центре окна фон смещается против курсора на половину амплитуды (25px).
   */
  it('returns a 25px shift for the window center', () => {
    expect(getParallaxTransform(512, 384, 1024, 768)).toBe('translate(-25px, -25px)');
  });

  /**
   * В правом нижнем углу смещение достигает полной амплитуды — 50px по каждой оси.
   */
  it('reaches the full 50px shift at the bottom-right corner', () => {
    expect(getParallaxTransform(1024, 768, 1024, 768)).toBe('translate(-50px, -50px)');
  });

  /**
   * В левом верхнем углу курсора смещение нулевое.
   */
  it('returns a zero shift at the top-left corner', () => {
    expect(getParallaxTransform(0, 0, 1024, 768)).toBe('translate(-0px, -0px)');
  });

  /**
   * Смещение линейно зависит от позиции курсора: четверть окна — четверть амплитуды.
   */
  it('scales linearly with the cursor position', () => {
    expect(getParallaxTransform(256, 192, 1024, 768)).toBe('translate(-12.5px, -12.5px)');
  });

  /**
   * Амплитуду можно переопределить — например, для нестандартной секции параллакса.
   */
  it('allows overriding the shift amplitude', () => {
    expect(getParallaxTransform(512, 384, 1024, 768, 100)).toBe('translate(-50px, -50px)');
  });
});
