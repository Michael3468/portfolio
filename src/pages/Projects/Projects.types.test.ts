import { describe, expect, it } from 'vitest';

import { projectsList, testTasksList } from '@/shared/constants/projects';

import { ProjectsSection } from './Projects.types';

/**
 * Тесты типов из `src/pages/Projects/Projects.types.ts`.
 * TypeScript-компилятор гарантирует корректность типов на этапе сборки,
 * поэтому тесты проверяют, что данные соответствуют ожидаемой структуре.
 */
describe('ProjectsSection type contract', () => {
  /**
   * Проверяет, что projectsList содержит ProjectItem с id и title.
   * Реальная ProjectsSection создаётся в Projects.tsx через getLetters + projectsList.
   */
  it('projectsList items have ProjectItem fields', () => {
    for (const item of projectsList) {
      expect(typeof item.id).toBe('number');
      expect(typeof item.title).toBe('string');
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  /**
   * Проверяет, что testTasksList содержит ProjectItem с id и title.
   */
  it('testTasksList items have ProjectItem fields', () => {
    for (const item of testTasksList) {
      expect(typeof item.id).toBe('number');
      expect(typeof item.title).toBe('string');
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  /**
   * Проверяет, что ProjectsSection можно корректно сконструировать из данных.
   */
  it('can construct a valid ProjectsSection', () => {
    const section: ProjectsSection = {
      title: ['P', 'r', 'o', 'j', 'e', 'c', 't', 's'],
      projects: projectsList,
    };

    expect(section.title).toHaveLength(8); // 'Projects' = 8 letters
    expect(section.projects).toHaveLength(projectsList.length);
  });
});
