import { useEffect } from 'react';

import { buildUrl, SITE_NAME } from '@/shared/constants/seo';

export interface DocumentMeta {
  readonly title: string;
  readonly description: string;
  /** Путь страницы, например `/projects`. */
  readonly path: string;
  /**
   * Если `true`, страница закрывается от индексации:
   * выставляется `<meta name="robots" content="noindex, nofollow" />`.
   * Используется, например, для страницы контактов и 404.
   */
  readonly noindex?: boolean;
}

/**
 * Создаёт или обновляет `<meta>` в `<head>`.
 *
 * @param attr - Атрибут поиска: `name` или `property` (для Open Graph).
 * @param key - Значение атрибута, например `description` или `og:title`.
 * @param content - Значение `content`.
 */
export const upsertMeta = (attr: 'name' | 'property', key: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const upsertCanonical = (href: string): void => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
};

/**
 * Выставляет title, description, robots, canonical и основные Open Graph-теги
 * для текущей страницы. Работает на клиенте: для краулеров, которые не выполняют
 * JavaScript, теги дополнительно прописываются при сборке (см. vite-plugins/seo.ts).
 *
 * @param meta - Метаданные страницы.
 */
export const useDocumentMeta = ({
  title,
  description,
  path,
  noindex = false,
}: DocumentMeta): void => {
  useEffect(() => {
    const url = buildUrl(path);

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertCanonical(url);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
  }, [title, description, path, noindex]);
};
