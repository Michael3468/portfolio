import { describe, expect, it } from 'vitest';

import testTasksList from './testTasksList';

/**
 * Набор тестов для списка тестовых заданий (testTasksList).
 * Проверяет корректность данных: непустой список, уникальность id
 * и наличие всех обязательных полей у каждого задания.
 */
describe('testTasksList', () => {
  /**
   * Проверяет, что список тестовых заданий не пуст.
   */
  it('contains a non-empty list of test tasks', () => {
    expect(testTasksList.length).toBeGreaterThan(0);
  });

  /**
   * Проверяет, что идентификаторы заданий уникальны.
   */
  it('has unique ids', () => {
    const ids = testTasksList.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * Проверяет, что каждое задание содержит все обязательные поля
   * с корректными типами значений.
   */
  it('has all required fields for every test task', () => {
    for (const task of testTasksList) {
      expect(typeof task.id).toBe('number');
      expect(typeof task.title).toBe('string');
      expect(typeof task.skills).toBe('string');
      expect(typeof task.img).toBe('string');
      expect(typeof task.bigImg).toBe('string');
      expect(typeof task.background).toBe('string');
      expect(typeof task.gitHubLink).toBe('string');
      expect(typeof task.liveDemo).toBe('string');
    }
  });
});
