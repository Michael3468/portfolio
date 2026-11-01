/**
 * Базовый адрес сайта. Нужен для canonical, og:url, sitemap.xml и robots.txt.
 * Перед деплоем заменить на реальный домен.
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
  },
} as const satisfies Record<string, PageMeta>;

/** Статические страницы: для них создаются HTML-файлы с мета-тегами при сборке. */
export const STATIC_PAGES: readonly PageMeta[] = Object.values(PAGES);

/** Полный URL для указанного пути сайта. */
export const buildUrl = (path: string): string => `${SITE_URL}${path}`;
