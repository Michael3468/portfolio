import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

import { buildUrl, PageMeta, SITE_NAME, SITE_URL, STATIC_PAGES } from '../src/shared/constants/seo';

/** Теги, которые плагин заменяет в `<head>` готового index.html. */
const MANAGED_HEAD_TAGS =
  /\s*<title>.*?<\/title>|\s*<meta\s+(?:name="(?:description|robots)"|property="og:[^"]+")[^>]*>|\s*<link\s+rel="canonical"[^>]*>/gs;

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Подставляет в `<head>` шаблона title, description, canonical и Open Graph
 * для конкретной страницы. Нужно для краулеров, которые не выполняют JavaScript.
 */
export const renderHead = (template: string, page: PageMeta): string => {
  const url = buildUrl(page.path);
  const tags = [
    `<title>${escapeAttr(page.title)}</title>`,
    `<meta name="description" content="${escapeAttr(page.description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
  ].join('\n    ');

  return template.replace(MANAGED_HEAD_TAGS, '').replace('</head>', `    ${tags}\n  </head>`);
};

/** Текст robots.txt с указателем на sitemap. */
export const renderRobots = (): string =>
  ['User-agent: *', 'Disallow:', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');

/** Текст sitemap.xml для статических страниц. */
export const renderSitemap = (): string => {
  const urls = STATIC_PAGES.map(
    (page) => `  <url>\n    <loc>${escapeAttr(buildUrl(page.path))}</loc>\n  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * Плагин Vite: после сборки создаёт для каждой статической страницы свой index.html
 * с правильными мета-тегами, а также robots.txt и sitemap.xml.
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

      for (const page of STATIC_PAGES) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), renderHead(template, page));
      }

      fs.writeFileSync(path.join(outDir, 'robots.txt'), renderRobots());
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), renderSitemap());
    },
  };
}
