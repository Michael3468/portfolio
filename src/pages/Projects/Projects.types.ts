import { ProjectItem } from '@/shared/types';

export interface ProjectsSection {
  /** Текст заголовка секции (рендерится анимированным заголовком `AnimatedTitle`). */
  readonly title: string;
  readonly projects: ProjectItem[];
  /** Показывать проекты слайдером в одну строку вместо сетки. */
  readonly isSlider?: boolean;
}
