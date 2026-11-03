import { describe, expect, it } from 'vitest';

import { projects, projectsList, resolveImage, testTasksList } from './projects';

/**
 * Тесты данных проектов из `src/shared/data/projects.json`.
 * Проверяют уникальность id, обязательные поля, разбиение по секциям
 * и наличие всех изображений.
 */
describe('projects data', () => {
  /**
   * Проверяет, что обе секции непустые и в сумме дают весь список.
   */
  it('splits into non-empty sections that cover the whole list', () => {
    expect(projectsList.length).toBeGreaterThan(0);
    expect(testTasksList.length).toBeGreaterThan(0);
    expect(projectsList.length + testTasksList.length).toBe(projects.length);
  });

  /**
   * Проверяет, что id уникальны во всём списке, а не только внутри секции.
   * Это нужно для поиска по id на странице проекта.
   */
  it('has unique ids across all sections', () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * Проверяет, что у каждого проекта заполнены все поля нужных типов.
   */
  it('has all required fields for every project', () => {
    for (const project of projects) {
      expect(typeof project.id).toBe('number');
      expect(typeof project.title).toBe('string');
      expect(typeof project.skills).toBe('string');
      expect(['project', 'testTask']).toContain(project.section);
      expect(typeof project.img).toBe('string');
      expect(typeof project.bigImg).toBe('string');
      expect(typeof project.bigImgSmall).toBe('string');
      expect(typeof project.background).toBe('string');
      expect(typeof project.gitHubLink).toBe('string');
      expect(typeof project.liveDemo).toBe('string');
    }
  });

  /**
   * Проверяет, что все изображения каждого проекта разрешены в URL.
   * Отсутствующий файл уже падает на этапе загрузки модуля; тест фиксирует это требование.
   */
  it('resolves every image to a non-empty URL', () => {
    for (const project of projects) {
      expect(project.img).toBeTruthy();
      expect(project.bigImg).toBeTruthy();
      expect(project.bigImgSmall).toBeTruthy();
    }
  });

  /**
   * Проверяет, что существующий файл изображения разрешается в непустой URL.
   */
  it('resolves a known image file to a URL', () => {
    expect(resolveImage('projects/10.webp')).toBeTruthy();
  });

  /**
   * Проверяет, что опечатка в имени файла изображения из JSON падает с понятной
   * ошибкой на этапе сборки, а не даёт на сайте битую картинку.
   */
  it('throws a descriptive error when the image file does not exist', () => {
    expect(() => resolveImage('projects/definitely-missing.webp')).toThrow(
      'Image not found: src/shared/assets/img/projects/definitely-missing.webp',
    );
  });
});
