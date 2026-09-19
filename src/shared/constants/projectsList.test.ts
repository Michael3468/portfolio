import { describe, expect, it } from 'vitest';

import projectsList from './projectsList';

/**
 * Набор тестов для списка проектов (projectsList).
 * Проверяет корректность данных: непустой список, уникальность id
 * и наличие всех обязательных полей у каждого проекта.
 */
describe('projectsList', () => {
  /**
   * Проверяет, что список проектов не пуст.
   */
  it('contains a non-empty list of projects', () => {
    expect(projectsList.length).toBeGreaterThan(0);
  });

  /**
   * Проверяет, что идентификаторы проектов уникальны
   * (необходимо для корректной работы findProjectById и маршрутов).
   */
  it('has unique ids', () => {
    const ids = projectsList.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * Проверяет, что каждый проект содержит все обязательные поля
   * с корректными типами значений.
   */
  it('has all required fields for every project', () => {
    for (const project of projectsList) {
      expect(typeof project.id).toBe('number');
      expect(typeof project.title).toBe('string');
      expect(typeof project.skills).toBe('string');
      expect(typeof project.img).toBe('string');
      expect(typeof project.bigImg).toBe('string');
      expect(typeof project.background).toBe('string');
      expect(typeof project.gitHubLink).toBe('string');
      expect(typeof project.liveDemo).toBe('string');
    }
  });
});
