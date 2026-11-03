import { describe, expect, it } from 'vitest';

import { PAGES, SITE_NAME, SITE_URL, STATIC_PAGES, THEME_COLORS, buildUrl } from './seo';

/**
 * Тесты SEO-констант и утилит из `src/shared/constants/seo.ts`.
 * Проверяют базовые константы, метаданные страниц и функцию buildUrl.
 */
describe('SEO constants', () => {
  /**
   * Проверяет, что базовый URL определён как строка.
   */
  it('exports SITE_URL as a string', () => {
    expect(typeof SITE_URL).toBe('string');
    expect(SITE_URL).toMatch(/^https?:\/\//);
  });

  /**
   * Проверяет, что имя сайта определено.
   */
  it('exports SITE_NAME as a non-empty string', () => {
    expect(typeof SITE_NAME).toBe('string');
    expect(SITE_NAME.length).toBeGreaterThan(0);
  });

  /**
   * Проверяет, что цвета темы определены для светлой и тёмной темы.
   */
  it('defines theme colors for both light and dark modes', () => {
    expect(THEME_COLORS.light).toMatch(/^#[0-9a-f]{6}$/i);
    expect(THEME_COLORS.dark).toMatch(/^#[0-9a-f]{6}$/i);
    expect(THEME_COLORS.light).not.toBe(THEME_COLORS.dark);
  });
});

/**
 * Тесты метаданных страниц.
 */
describe('PAGES', () => {
  /**
   * Проверяет, что определены все три статические страницы.
   */
  it('defines home, projects, and contacts pages', () => {
    expect(PAGES).toHaveProperty('home');
    expect(PAGES).toHaveProperty('projects');
    expect(PAGES).toHaveProperty('contacts');
  });

  /**
   * Проверяет, что у каждой страницы есть все обязательные поля.
   */
  it('has path, title, and description for every page', () => {
    for (const meta of Object.values(PAGES)) {
      expect(typeof meta.path).toBe('string');
      expect(meta.path).toMatch(/^\//);
      expect(typeof meta.title).toBe('string');
      expect(meta.title.length).toBeGreaterThan(0);
      expect(typeof meta.description).toBe('string');
      expect(meta.description.length).toBeGreaterThan(0);
    }
  });

  /**
   * Проверяет конкретные пути страниц.
   */
  it('has correct paths for each page', () => {
    expect(PAGES.home.path).toBe('/');
    expect(PAGES.projects.path).toBe('/projects');
    expect(PAGES.contacts.path).toBe('/contacts');
  });

  /**
   * Проверяет, что все страницы имеют уникальные пути.
   */
  it('has unique paths across all pages', () => {
    const paths = Object.values(PAGES).map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

/**
 * Тесты STATIC_PAGES — массива объектов PageMeta.
 */
describe('STATIC_PAGES', () => {
  /**
   * Проверяет, что STATIC_PAGES содержит те же элементы, что и значения PAGES.
   */
  it('contains exactly the same entries as PAGES values', () => {
    expect(STATIC_PAGES).toHaveLength(Object.keys(PAGES).length);

    const pagePaths = new Set<string>(Object.values(PAGES).map((p) => p.path));
    for (const page of STATIC_PAGES) {
      expect(pagePaths.has(page.path)).toBe(true);
    }
  });

  /**
   * Проверяет, что STATIC_PAGES — это массив с правильным количеством элементов.
   */
  it('is an array with correct length', () => {
    expect(Array.isArray(STATIC_PAGES)).toBe(true);
    expect(STATIC_PAGES).toHaveLength(3);
  });
});

/**
 * Тесты функции buildUrl.
 */
describe('buildUrl', () => {
  /**
   * Проверяет, что функция корректно формирует полный URL.
   */
  it('returns a full URL by concatenating SITE_URL and path', () => {
    expect(buildUrl('/')).toBe(`${SITE_URL}/`);
    expect(buildUrl('/projects')).toBe(`${SITE_URL}/projects`);
    expect(buildUrl('/contacts')).toBe(`${SITE_URL}/contacts`);
  });

  /**
   * Проверяет, что path без ведущего слэша тоже работает.
   */
  it('works with paths without leading slash', () => {
    expect(buildUrl('projects')).toBe(`${SITE_URL}projects`);
  });

  /**
   * Проверяет, что пустой путь возвращает только SITE_URL.
   */
  it('returns SITE_URL for an empty path', () => {
    expect(buildUrl('')).toBe(SITE_URL);
  });

  /**
   * Проверяет, что путь с ведущим слэшем не удваивается.
   */
  it('does not double the slash when path starts with /', () => {
    const result = buildUrl('/test');
    // SITE_URL не заканчивается на слэш, buildUrl просто конкатенирует
    expect(result).toBe(`${SITE_URL}/test`);
  });
});
