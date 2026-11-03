import { describe, expect, it } from 'vitest';

import { projectsList } from '@/shared/constants/projects';

/**
 * Тесты типов из `src/shared/types/types.ts`.
 * TypeScript-компилятор гарантирует корректность типов на этапе сборки,
 * поэтому тесты проверяют, что типы не пусты и соответствуют ожиданиям.
 */
describe('ProjectItem type contract', () => {
  /**
   * Проверяет, что элементы projectsList соответствуют типу ProjectItem
   * по наличию всех обязательных полей.
   */
  it('projectsList items have all ProjectItem fields', () => {
    for (const item of projectsList) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('skills');
      expect(item).toHaveProperty('section');
      expect(item).toHaveProperty('img');
      expect(item).toHaveProperty('bigImg');
      expect(item).toHaveProperty('bigImgSmall');
      expect(item).toHaveProperty('background');
      expect(item).toHaveProperty('gitHubLink');
      expect(item).toHaveProperty('liveDemo');
    }
  });

  /**
   * Проверяет, что section имеет допустимое значение.
   */
  it('every item has a valid section', () => {
    for (const item of projectsList) {
      expect(['project', 'testTask']).toContain(item.section);
    }
  });
});
