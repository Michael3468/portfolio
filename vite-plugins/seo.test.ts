import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ResolvedConfig } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';

import { INDEXABLE_PAGES, STATIC_PAGES } from '../src/shared/constants/seo.js';
import seoPlugin, { renderHead, renderRobots, renderSitemap, SEO_HEAD_MARKER } from './seo';

const template = `<html><head>\n    ${SEO_HEAD_MARKER}\n  </head></html>`;

/**
 * Вызывает хук плагина Vite/Rollup независимо от формы записи. Хук может быть как
 * функцией, так и объектом `{ handler: fn }` (тип `ObjectHook<T>`), поэтому обращение
 * к нему напрямую (например, `plugin.configResolved(...)`) не компилируется — TS2349.
 * Контекст `this` внутри хуков seo-плагина не используется (они работают с замыканиями),
 * но передаётся для корректности.
 *
 * @param hook хук плагина (функция или объект `{ handler }`);
 * @param thisArg значение `this` для вызова хука;
 * @param args аргументы хука.
 */
const callPluginHook = (
  hook: ((...args: never[]) => unknown) | { handler?: (...args: never[]) => unknown } | undefined,
  thisArg: unknown,
  ...args: unknown[]
): void => {
  const handler = typeof hook === 'function' ? hook : hook?.handler;
  handler?.apply(thisArg, args as never[]);
};

/**
 * Тесты подстановки мета-тегов в шаблон index.html.
 */
describe('renderHead', () => {
  /**
   * Проверяет, что маркер заменяется на title, description, canonical и Open Graph страницы.
   */
  it('replaces the marker with the page meta tags', () => {
    const html = renderHead(template, {
      path: '/projects',
      title: 'Projects — Portfolio',
      description: 'List of projects',
    });

    expect(html).not.toContain(SEO_HEAD_MARKER);
    expect(html).toContain('<title>Projects — Portfolio</title>');
    expect(html).toContain('<meta name="description" content="List of projects" />');
    expect(html).toContain('<meta name="robots" content="index, follow" />');
    expect(html).toContain('<link rel="canonical" href="https://example.com/projects" />');
    expect(html).toContain('<meta property="og:url" content="https://example.com/projects" />');
  });

  /**
   * Проверяет экранирование кавычек и угловых скобок в атрибутах.
   */
  it('escapes special characters in attribute values', () => {
    const html = renderHead(template, {
      path: '/',
      title: 'A "quoted" <tag>',
      description: 'Tom & Jerry',
    });

    expect(html).toContain('content="Tom &amp; Jerry"');
    expect(html).toContain('<title>A &quot;quoted&quot; &lt;tag&gt;</title>');
  });

  /**
   * Проверяет, что для страницы с noindex выставляется запрет индексации.
   */
  it('marks noindex pages as noindex, nofollow', () => {
    const html = renderHead(template, {
      path: '/contacts',
      title: 'Contacts',
      description: 'Contacts',
      noindex: true,
    });

    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
  });

  /**
   * Проверяет, что шаблон без маркера вызывает ошибку, а не собирается молча без тегов.
   */
  it('throws when the template has no marker', () => {
    expect(() => renderHead('<html></html>', { path: '/', title: 't', description: 'd' })).toThrow(
      SEO_HEAD_MARKER,
    );
  });
});

/**
 * Тесты генерации robots.txt.
 */
describe('renderRobots', () => {
  /**
   * Проверяет, что robots.txt разрешает обход всем агентам и указывает на sitemap.
   */
  it('renders robots.txt with the sitemap pointer', () => {
    expect(renderRobots()).toBe(
      'User-agent: *\nDisallow:\n\nSitemap: https://example.com/sitemap.xml\n',
    );
  });
});

/**
 * Тесты генерации sitemap.xml.
 */
describe('renderSitemap', () => {
  /**
   * Проверяет, что sitemap.xml содержит XML-заголовок и URL каждой индексируемой страницы.
   */
  it('renders sitemap.xml with every indexable page URL', () => {
    const sitemap = renderSitemap();

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    for (const page of INDEXABLE_PAGES) {
      expect(sitemap).toContain(`<loc>https://example.com${page.path}</loc>`);
    }
    expect(sitemap).not.toContain('<loc>https://example.com/contacts</loc>');
  });
});

/**
 * Тесты плагина целиком: запись файлов в каталог сборки в closeBundle.
 * Выполняется во временном каталоге, чтобы не трогать реальный dist/.
 */
describe('seoPlugin closeBundle', () => {
  /** Корень временного каталога текущего теста (создаётся в каждом тесте). */
  let tempRoot = '';

  afterEach(() => {
    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
      tempRoot = '';
    }
  });

  /**
   * Проверяет, что после сборки в outDir появляются index.html каждой статической
   * страницы (с подставленными мета-тегами вместо маркера), robots.txt и sitemap.xml.
   */
  it('writes per-page index.html, robots.txt and sitemap.xml into outDir', () => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-plugin-'));
    const outDir = path.join(tempRoot, 'dist');
    fs.mkdirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), template);

    const plugin = seoPlugin();
    // Хуки вызываются через callPluginHook: тип ObjectHook<T> не является вызываемым
    // напрямую, так как хук может быть записан и как объект `{ handler: fn }`.
    callPluginHook(plugin.configResolved, plugin, {
      root: tempRoot,
      build: { outDir: 'dist' },
    } as unknown as ResolvedConfig);
    callPluginHook(plugin.closeBundle, plugin);

    // Для каждой статической страницы создан свой index.html с мета-тегами
    for (const page of STATIC_PAGES) {
      const html = fs.readFileSync(path.join(outDir, page.path, 'index.html'), 'utf8');
      expect(html).not.toContain(SEO_HEAD_MARKER);
      expect(html).toContain(`<title>${page.title}</title>`);
      expect(html).toContain(`<link rel="canonical" href="https://example.com${page.path}" />`);
    }

    // Страница контактов закрыта от индексации
    const contactsHtml = fs.readFileSync(path.join(outDir, 'contacts', 'index.html'), 'utf8');
    expect(contactsHtml).toContain('<meta name="robots" content="noindex, nofollow" />');

    expect(fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8')).toBe(renderRobots());
    expect(fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8')).toBe(renderSitemap());
  });
});
