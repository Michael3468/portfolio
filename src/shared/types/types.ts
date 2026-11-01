export type DarkMode = 'light' | 'dark';

/** Раздел, к которому относится проект: собственный проект или тестовое задание. */
export type ProjectSection = 'project' | 'testTask';

export interface ProjectItem {
  readonly id: number;
  readonly title: string;
  readonly skills: string;
  readonly section: ProjectSection;
  /** Превью для списка (URL после сборки). */
  readonly img: string;
  /** Обложка для страницы проекта (URL после сборки). */
  readonly bigImg: string;
  /** Уменьшенная обложка для srcset (URL после сборки). */
  readonly bigImgSmall: string;
  readonly background: string;
  readonly gitHubLink: string;
  readonly liveDemo: string;
}
