export type DarkMode = 'light' | 'dark';

export interface ProjectItem {
  readonly id: number;
  readonly title: string;
  readonly skills: string;
  readonly img: string;
  readonly bigImg: string;
  readonly background: string;
  readonly gitHubLink: string;
  readonly liveDemo: string;
}
