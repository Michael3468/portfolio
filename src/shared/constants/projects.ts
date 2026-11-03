import rawProjects from '@/shared/data/projects.json';
import { ProjectItem, ProjectSection } from '@/shared/types';

/** Запись из `src/shared/data/projects.json`: изображения указаны именами файлов. */
interface RawProject {
  readonly id: number;
  readonly title: string;
  readonly skills: string;
  readonly section: ProjectSection;
  readonly img: string;
  readonly bigImg: string;
  readonly bigImgSmall: string;
  readonly background: string;
  readonly gitHubLink: string;
  readonly liveDemo: string;
}

/**
 * URL всех WebP-изображений из `src/shared/assets/img`, собранные Vite на этапе сборки.
 * Ключи вида `../assets/img/projects/15.webp`.
 */
const imageUrls = import.meta.glob<string>('../assets/img/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/**
 * Возвращает URL изображения по пути относительно `src/shared/assets/img`.
 * Бросает ошибку, если файла нет: опечатка в JSON ломает сборку сразу, а не на сайте.
 *
 * @param file - Путь вида `projects/15.webp`.
 * @returns URL изображения.
 */
// Экспортируется для тестов: ветка с ошибкой недостижима на валидных данных из JSON
export const resolveImage = (file: string): string => {
  const url = imageUrls[`../assets/img/${file}`];
  if (!url) {
    throw new Error(`Image not found: src/shared/assets/img/${file}`);
  }
  return url;
};

/**
 * Все проекты и тестовые задания в одном списке. Порядок совпадает с порядком в JSON.
 */
export const projects: readonly ProjectItem[] = (rawProjects as RawProject[]).map((raw) => ({
  id: raw.id,
  title: raw.title,
  skills: raw.skills,
  section: raw.section,
  img: resolveImage(raw.img),
  bigImg: resolveImage(raw.bigImg),
  bigImgSmall: resolveImage(raw.bigImgSmall),
  background: raw.background,
  gitHubLink: raw.gitHubLink,
  liveDemo: raw.liveDemo,
}));

/** Собственные проекты (секция «Projects»). */
export const projectsList = projects.filter((project) => project.section === 'project');

/** Тестовые задания (секция «Test Tasks»). */
export const testTasksList = projects.filter((project) => project.section === 'testTask');
