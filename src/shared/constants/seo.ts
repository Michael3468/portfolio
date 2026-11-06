/**
 * Базовый адрес сайта. Нужен для canonical, og:url, sitemap.xml и robots.txt.
 * TODO: Перед деплоем заменить на реальный домен.
 */
export const SITE_URL = 'https://example.com';

export const SITE_NAME = 'Portfolio';

/** Цвета адресной строки / шапки браузера под каждую тему (совпадают с фоном страницы). */
export const THEME_COLORS = {
  light: '#c1c1c1',
  dark: '#252526',
} as const;

export interface PageMeta {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  /**
   * Запретить индексацию страницы поисковыми системами.
   *
   * При `true` и клиентский хук `useDocumentMeta`, и SEO-плагин при сборке
   * выставляют `<meta name="robots" content="noindex, nofollow" />`.
   * Такая страница также не попадает в `sitemap.xml` (см. `INDEXABLE_PAGES`),
   * но её HTML всё равно генерируется — иначе краулер не увидит сам запрет.
   */
  readonly noindex?: boolean;
}

/** Метаданные статических страниц. */
export const PAGES = {
  home: {
    path: '/',
    title: 'Portfolio — Mikhail, frontend developer',
    description: 'Portfolio of Mikhail — frontend developer: skills, projects and contacts.',
  },
  projects: {
    path: '/projects',
    title: 'Projects — Portfolio',
    description: 'Projects and test tasks built with React, TypeScript and Vite.',
  },
  contacts: {
    path: '/contacts',
    title: 'Contacts — Portfolio',
    description: 'Contact Mikhail: Telegram and email.',
    /*
     * Контактные данные (местоположение, Telegram и email) не должны попадать
     * в поисковую выдачу. Отдельного «noindex» для строки текста не существует,
     * поэтому закрываем от индексации всю страницу контактов.
     */
    noindex: true,
  },
} as const satisfies Record<string, PageMeta>;

/**
 * Статические страницы: для них создаются HTML-файлы с мета-тегами при сборке.
 *
 * Список намеренно включает и страницы с `noindex`: такой HTML нужен, чтобы
 * краулер получил сам запрет индексации. Исключение из индекса делает тег
 * `robots`, а не отсутствие файла.
 */
export const STATIC_PAGES: readonly PageMeta[] = Object.values(PAGES);

/**
 * Страницы, которые разрешено индексировать: только они попадают в `sitemap.xml`.
 *
 * Страницы с `noindex` исключены из карты сайта, чтобы не давать поисковикам
 * противоречивый сигнал: sitemap приглашает страницу в индекс, а мета-тег её запрещает.
 */
export const INDEXABLE_PAGES: readonly PageMeta[] = STATIC_PAGES.filter((page) => !page.noindex);

/** Полный URL для указанного пути сайта. */
export const buildUrl = (path: string): string => `${SITE_URL}${path}`;
