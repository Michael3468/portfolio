import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

import {
  buildUrl,
  INDEXABLE_PAGES,
  PageMeta,
  SITE_NAME,
  SITE_URL,
  STATIC_PAGES,
} from '../src/shared/constants/seo.js';

/** Маркер в index.html, на место которого плагин вставляет мета-теги страницы. */
export const SEO_HEAD_MARKER = '<!--seo-head-->';

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Подставляет на место маркера в шаблоне title, description, robots, canonical
 * и Open Graph для конкретной страницы. Нужно для краулеров, которые не выполняют JavaScript.
 *
 * Значение `robots` зависит от флага `page.noindex`: для страницы контактов
 * в собранный HTML попадает `noindex, nofollow`, поэтому поисковые системы
 * не должны показывать её в выдаче и переходить по её ссылкам.
 *
 * @throws если в шаблоне нет маркера `SEO_HEAD_MARKER`.
 */
export const renderHead = (template: string, page: PageMeta): string => {
  if (!template.includes(SEO_HEAD_MARKER)) {
    throw new Error(`index.html must contain ${SEO_HEAD_MARKER}`);
  }

  const url = buildUrl(page.path);
  // noindex + nofollow: страница не попадает в индекс, её ссылки не обходятся.
  const robots = page.noindex ? 'noindex, nofollow' : 'index, follow';
  const tags = [
    `<title>${escapeAttr(page.title)}</title>`,
    `<meta name="description" content="${escapeAttr(page.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
  ].join('\n    ');

  return template.replace(SEO_HEAD_MARKER, () => tags);
};

/** Текст robots.txt с указателем на sitemap. */
export const renderRobots = (): string =>
  ['User-agent: *', 'Disallow:', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');

/**
 * Текст sitemap.xml для статических страниц, разрешённых к индексации.
 *
 * Используется `INDEXABLE_PAGES`, а не `STATIC_PAGES`: страницы с `noindex`
 * (например, `/contacts`) намеренно не попадают в карту сайта.
 */
export const renderSitemap = (): string => {
  const urls = INDEXABLE_PAGES.map(
    (page) => `  <url>\n    <loc>${escapeAttr(buildUrl(page.path))}</loc>\n  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * Плагин Vite: после сборки создаёт для каждой статической страницы свой index.html
 * с правильными мета-тегами, а также robots.txt и sitemap.xml.
 *
 * HTML создаётся для всех страниц из `STATIC_PAGES`, включая закрытые через `noindex`:
 * краулер должен получить файл с мета-тегом `noindex`, иначе запрет индексации
 * просто не будет прочитан. В sitemap при этом попадают только `INDEXABLE_PAGES`.
 */
export default function seoPlugin(): Plugin {
  let outDir = '';

  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');

      // Для каждой статической страницы — свой index.html с мета-тегами.
      for (const page of STATIC_PAGES) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), renderHead(template, page));
      }

      fs.writeFileSync(path.join(outDir, 'robots.txt'), renderRobots());
      // sitemap.xml строится только по индексируемым страницам.
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), renderSitemap());
    },
  };
}
