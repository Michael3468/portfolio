/**
 * Данные фоновых иконок навыков.
 *
 * SVG-файлы лежат в `src/shared/assets/icons/skill-tiles`: это белые квадраты
 * со скруглёнными углами, внутри которых логотип вырезан прозрачностью.
 * Vite собирает URL всех файлов на этапе сборки.
 */

/** Путь к каталогу с готовыми плитками относительно этого файла. */
const TILE_DIR = '../../../shared/assets/icons/skill-tiles';

/** URL всех SVG-плиток, ключи вида `../../../shared/assets/icons/skill-tiles/react.svg`. */
const tileUrls = import.meta.glob<string>('../../../shared/assets/icons/skill-tiles/*.svg', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
});

/** Фоновая иконка навыка вместе с её положением на экране. */
export interface SkillBackgroundIcon {
  /** Уникальный идентификатор для ключа React. */
  readonly id: string;
  /** Название навыка (используется только в данных и тестах). */
  readonly label: string;
  /** URL собранного SVG. */
  readonly url: string;
  /** Положение по горизонтали, в процентах от размера слоя. */
  readonly left: number;
  /** Положение по вертикали, в процентах от размера слоя. */
  readonly top: number;
  /** Размер плитки в пикселях. */
  readonly size: number;
  /** Небольшой наклон плитки в градусах. */
  readonly rotate: number;
  /** Прозрачность плитки. */
  readonly opacity: number;
}

/**
 * Возвращает URL SVG-плитки по имени файла.
 * Бросает ошибку, если файла нет: опечатка ломает сборку сразу, а не на сайте.
 *
 * @param file - Имя файла, например `react.svg`.
 * @returns URL собранного SVG.
 */
export const resolveSkillTile = (file: string): string => {
  const url = tileUrls[`${TILE_DIR}/${file}`];
  if (!url) {
    throw new Error(`Skill tile not found: ${TILE_DIR}/${file}`);
  }
  return url;
};

/**
 * Все навыки, которые встречаются в данных проектов.
 * Позиции подобраны так, чтобы плитки равномерно заполняли фон и не собирались в центре.
 */
export const SKILL_BACKGROUND_ICONS: readonly SkillBackgroundIcon[] = [
  {
    id: 'react',
    label: 'React',
    url: resolveSkillTile('react.svg'),
    left: 16,
    top: 12,
    size: 68,
    rotate: -7,
    opacity: 0.73,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    url: resolveSkillTile('typescript.svg'),
    left: 36,
    top: 10,
    size: 52,
    rotate: 5,
    opacity: 0.53,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    url: resolveSkillTile('nextjs.svg'),
    left: 55,
    top: 14,
    size: 62,
    rotate: -4,
    opacity: 0.63,
  },
  {
    id: 'vite',
    label: 'Vite',
    url: resolveSkillTile('vite.svg'),
    left: 74,
    top: 11,
    size: 48,
    rotate: 8,
    opacity: 0.49,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    url: resolveSkillTile('javascript.svg'),
    left: 11,
    top: 27,
    size: 58,
    rotate: 4,
    opacity: 0.6,
  },
  {
    id: 'tailwindcss',
    label: 'TailwindCSS',
    url: resolveSkillTile('tailwindcss.svg'),
    left: 29,
    top: 30,
    size: 46,
    rotate: -8,
    opacity: 0.46,
  },
  {
    id: 'scss',
    label: 'SCSS',
    url: resolveSkillTile('scss.svg'),
    left: 48,
    top: 25,
    size: 64,
    rotate: 6,
    opacity: 0.67,
  },
  {
    id: 'pug',
    label: 'Pug',
    url: resolveSkillTile('pug.svg'),
    left: 67,
    top: 29,
    size: 56,
    rotate: -5,
    opacity: 0.56,
  },
  {
    id: 'jquery',
    label: 'jQuery',
    url: resolveSkillTile('jquery.svg'),
    left: 83,
    top: 26,
    size: 44,
    rotate: 7,
    opacity: 0.44,
  },
  {
    id: 'webpack',
    label: 'Webpack',
    url: resolveSkillTile('webpack.svg'),
    left: 15,
    top: 45,
    size: 60,
    rotate: -6,
    opacity: 0.63,
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    url: resolveSkillTile('nodejs.svg'),
    left: 34,
    top: 46,
    size: 50,
    rotate: 4,
    opacity: 0.49,
  },
  {
    id: 'express',
    label: 'ExpressJS',
    url: resolveSkillTile('express.svg'),
    left: 52,
    top: 42,
    size: 66,
    rotate: -3,
    opacity: 0.68,
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    url: resolveSkillTile('mongodb.svg'),
    left: 70,
    top: 47,
    size: 54,
    rotate: 6,
    opacity: 0.54,
  },
  {
    id: 'mongoose',
    label: 'Mongoose',
    url: resolveSkillTile('mongoose.svg'),
    left: 84,
    top: 43,
    size: 46,
    rotate: -7,
    opacity: 0.46,
  },
  {
    id: 'firebase',
    label: 'Firebase',
    url: resolveSkillTile('firebase.svg'),
    left: 10,
    top: 62,
    size: 50,
    rotate: 8,
    opacity: 0.51,
  },
  {
    id: 'axios',
    label: 'Axios',
    url: resolveSkillTile('axios.svg'),
    left: 27,
    top: 63,
    size: 62,
    rotate: -4,
    opacity: 0.65,
  },
  {
    id: 'recoiljs',
    label: 'RecoilJS',
    url: resolveSkillTile('recoiljs.svg'),
    left: 45,
    top: 58,
    size: 44,
    rotate: 6,
    opacity: 0.42,
  },
  {
    id: 'saga',
    label: 'Saga',
    url: resolveSkillTile('saga.svg'),
    left: 63,
    top: 64,
    size: 58,
    rotate: -5,
    opacity: 0.6,
  },
  {
    id: 'jest',
    label: 'Jest',
    url: resolveSkillTile('jest.svg'),
    left: 81,
    top: 60,
    size: 48,
    rotate: 7,
    opacity: 0.47,
  },
  {
    id: 'vue',
    label: 'Vue',
    url: resolveSkillTile('vue.svg'),
    left: 14,
    top: 79,
    size: 54,
    rotate: -6,
    opacity: 0.56,
  },
  {
    id: 'emoji-mart',
    label: 'Emoji-Mart',
    url: resolveSkillTile('emoji-mart.svg'),
    left: 33,
    top: 80,
    size: 46,
    rotate: 5,
    opacity: 0.44,
  },
  {
    id: 'next-auth',
    label: 'Next-Auth',
    url: resolveSkillTile('next-auth.svg'),
    left: 52,
    top: 76,
    size: 60,
    rotate: -8,
    opacity: 0.61,
  },
  {
    id: 'mvp',
    label: 'MVP',
    url: resolveSkillTile('mvp.svg'),
    left: 72,
    top: 81,
    size: 48,
    rotate: 6,
    opacity: 0.49,
  },
];
