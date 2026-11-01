import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SITE_URL } from '@/shared/constants/seo';

import { useDocumentMeta } from './useDocumentMeta';

/**
 * Тесты хука useDocumentMeta: проверяют title, description, robots,
 * canonical и Open Graph-теги, а также обновление при смене параметров.
 */
describe('useDocumentMeta', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  /**
   * Проверяет, что хук выставляет title и все основные мета-теги страницы.
   */
  it('sets title, description, canonical and Open Graph tags', () => {
    renderHook(() =>
      useDocumentMeta({ title: 'Projects — Portfolio', description: 'List', path: '/projects' }),
    );

    expect(document.title).toBe('Projects — Portfolio');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'List');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}/projects`,
    );
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Projects — Portfolio',
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${SITE_URL}/projects`,
    );
  });

  /**
   * Проверяет, что при noindex выставляется запрет индексации.
   */
  it('marks the page as noindex when requested', () => {
    renderHook(() =>
      useDocumentMeta({ title: '404', description: 'Not found', path: '/', noindex: true }),
    );

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });

  /**
   * Проверяет, что повторный рендер обновляет существующие теги, а не создаёт дубликаты.
   */
  it('updates existing tags instead of duplicating them', () => {
    const { rerender } = renderHook(
      ({ title }: { title: string }) =>
        useDocumentMeta({ title, description: 'd', path: '/project/1' }),
      { initialProps: { title: 'First' } },
    );
    rerender({ title: 'Second' });

    expect(document.title).toBe('Second');
    expect(document.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });
});
