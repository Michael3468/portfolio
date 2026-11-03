import { ProjectItem } from '@/shared/types';

export interface ProjectsSection {
  readonly title: string[];
  readonly projects: ProjectItem[];
  /** Показывать проекты слайдером в одну строку вместо сетки. */
  readonly isSlider?: boolean;
}
