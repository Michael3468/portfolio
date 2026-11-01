import { describe, expect, it } from 'vitest';

import { renderHead, SEO_HEAD_MARKER } from './seo';

const template = `<html><head>\n    ${SEO_HEAD_MARKER}\n  </head></html>`;

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
   * Проверяет, что шаблон без маркера вызывает ошибку, а не собирается молча без тегов.
   */
  it('throws when the template has no marker', () => {
    expect(() => renderHead('<html></html>', { path: '/', title: 't', description: 'd' })).toThrow(
      SEO_HEAD_MARKER,
    );
  });
});
