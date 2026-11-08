# Portfolio

Сайт-портфолио фронтенд-разработчика: главная страница с анимациями, список проектов
и тестовых заданий, детальные страницы проектов и контакты.

Мигрирован с **Create React App (React 18) + Storybook** на **Vite + React 19** без Storybook.
План миграции — [`docs/archive/MIGRATION_PLAN.md`](./docs/archive/MIGRATION_PLAN.md) (архив).
Правила стиля и архитектуры кода — [`agents/style-guide.md`](./agents/style-guide.md).

## Стек

- **Vite 8** — сборщик и dev-сервер
- **React 19** (`react` / `react-dom`), JSX transform `react-jsx`
- **TypeScript 5.x** — строгая типизация, `moduleResolution: bundler`
- **React Router 7** — роутинг (API v6 сохранён): `/`, `/projects`, `/project/:id`, `/contacts`,
  `*` → страница 404 (`NotFound`)
- **framer-motion** — анимации (заголовки, буквы, «rubber band» эффект); через `LazyMotion`
  наборы фич подгружаются отдельным чанком, в коде используется `m.*`, а не `motion.*`
- **zustand** — состояние тёмной темы (вместо Recoil, см. раздел «Перенос»)
- **CSS** — глобальные стили и CSS-переменные темы (без препроцессора)
- **Vitest + Testing Library 16** — юнит-тесты (jsdom)
- **Playwright** — e2e smoke-тесты собранного сайта (chromium)
- **ESLint 9 (flat config) + Prettier** — линтинг и форматирование
- **husky + lint-staged** — pre-commit хук

## Команды

| Команда                 | Описание                                                |
| ----------------------- | ------------------------------------------------------- |
| `npm install`           | Установка зависимостей                                  |
| `npm run dev`           | Dev-сервер Vite (HMR), http://localhost:5173            |
| `npm run build`         | Проверка типов (`tsc -b`) + production-сборка в `dist/` |
| `npm run typecheck`     | Только проверка типов (`tsc -b`)                        |
| `npm run preview`       | Локальный просмотр production-сборки                    |
| `npm test`              | Запуск юнит-тестов (Vitest, watch-режим)                |
| `npm run test:run`      | Однократный запуск юнит-тестов                          |
| `npm run test:coverage` | Coverage report (Vitest + provider v8)                  |
| `npm run test:e2e`      | Сборка + Playwright smoke-тесты против `vite preview`   |
| `npm run lint`          | Проверка ESLint (flat config)                           |
| `npm run lint:fix`      | Автоисправление ESLint                                  |
| `npm run format`        | Форматирование Prettier                                 |

> Требуется Node.js **≥ 20.19** — меньше не позволяет сам Vite (`engines: ^20.19.0 || >=22.12.0`).
> Рабочая версия зафиксирована в `.nvmrc` — Node **v24**; на ней проект и проверяется.

> Импорты вне текущего каталога пишутся через алиас `@` (= `src/`), например
> `import { getLetters } from '@/shared/lib'`; относительные `./` — только внутри каталога.

## Структура проекта

```
portfolio/
├── index.html                   # точка входа Vite (в корне); маркер <!--seo-head--> для мета-тегов
├── vite.config.ts               # react-плагин + seo-плагин + alias @ + конфиг Vitest
├── vite-plugins/
│   ├── seo.ts                   # плагин предрендера: мета-теги страниц, robots.txt, sitemap.xml (в dist/)
│   └── seo.test.ts              # тесты seo-плагина
├── playwright.config.ts         # Playwright: smoke-тесты против vite preview
├── e2e/
│   ├── routes.e2e.ts            # e2e: роутинг, 404, прямые заходы, сохранение темы
│   └── title-wave.e2e.ts        # e2e: авто-волна заголовков (getAnimations) + hover
├── scripts/
│   └── optimize-images.sh       # конвертация исходных JPG → WebP (нужен ffmpeg с libwebp)
├── agents/
│   └── style-guide.md           # правила стиля и архитектуры кода
├── docs/
│   └── archive/
│       └── MIGRATION_PLAN.md    # архивный план миграции CRA → Vite
├── .github/workflows/ci.yml     # CI: lint → typecheck → unit-тесты → build → e2e
├── .husky/pre-commit            # lint-staged (eslint --fix, prettier --write)
├── .prettierrc                  # конфиг Prettier
├── .gitignore
├── .nvmrc                       # v24.16.0
├── public/                      # favicon.ico, logo192/512.png, manifest.json
│                                # (robots.txt и sitemap.xml в public/ нет: их генерирует seo-плагин
│                                #  при сборке прямо в dist/, см. раздел «SEO и мета-теги»)
└── src/
    ├── main.tsx                 # точка входа приложения (бывший index.tsx)
    ├── App.tsx                  # маршрутизация (BrowserRouter + Routes) + LazyMotion
    ├── App.test.tsx             # тест приложения (Vitest + Testing Library)
    ├── setupTests.ts            # jest-dom + мок window.matchMedia
    ├── vite-env.d.ts            # типы Vite (бывший react-app-env.d.ts)
    ├── store/
    │   ├── darkModeStore.ts     # zustand-стор тёмной темы
    │   └── darkModeStore.test.ts
    ├── hooks/
    │   ├── useDocumentMeta.ts   # клиентские метаданные: title, description, canonical, OG
    │   └── useDocumentMeta.test.ts
    ├── assets/
    │   ├── icons/               # иконки GitHub / Live Demo
    │   └── styles/              # main.css, reset.css, pulse-animation.css
    ├── components/
    │   ├── index.ts             # реэкспорт компонентов (баррель)
    │   ├── index.test.ts        # barrel-тест реэкспортов
    │   ├── ScrollToTop/
    │   │   ├── index.tsx        # скролл к началу при смене маршрута
    │   │   └── index.test.tsx
    │   ├── SkillBackground/
    │   │   ├── index.tsx        # фон с SVG-иконками навыков, параллакс за мышью
    │   │   ├── index.test.tsx
    │   │   ├── styles.css
    │   │   └── model/
    │   │       ├── constants.ts       # позиции и прозрачность плиток
    │   │       ├── constants.test.ts
    │   │       ├── lib.ts             # параллакс, снег и покачивание иконок
    │   │       └── lib.test.ts
    │   ├── Animations/
    │   │   ├── AnimationScale3d/
    │   │   │   ├── index.tsx    # анимация «rubber band» букв (hover + автозапуск
    │   │   │   │                # по playSignal с задержкой waveDelay)
    │   │   │   └── index.test.tsx
    │   │   ├── AnimatedTitle/
    │   │   │   ├── AnimatedTitle.tsx   # анимированный заголовок страницы (h1/h2)
    │   │   │   │                       # с авто-волной «rubber band» каждые 10 секунд;
    │   │   │   │                       # доступность: aria-label на заголовке,
    │   │   │   │                       # буквы — декоративные (aria-hidden)
    │   │   │   ├── AnimatedTitle.test.tsx
    │   │   │   ├── index.ts            # barrel-реэкспорт AnimatedTitle
    │   │   │   └── model/
    │   │   │       ├── constants.ts       # TITLE_WAVE_INTERVAL_MS, TITLE_WAVE_STAGGER_MS
    │   │   │       ├── constants.test.ts
    │   │   │       ├── lib.ts             # getWaveDelay(index, count, direction)
    │   │   │       └── lib.test.ts
    │   │   ├── AnimationText/
    │   │   │   ├── index.tsx    # анимация слов/букв
    │   │   │   └── index.test.tsx
    │   │   └── AnimationTyping/
    │   │       ├── index.tsx    # анимация «печатной машинки» с мигающим курсором
    │   │       └── index.test.tsx
    │   ├── ButtonIconWithLink/
    │   │   ├── index.tsx        # кнопка с иконкой
    │   │   ├── index.test.tsx
    │   │   └── styles.css
    │   ├── Footer/
    │   │   ├── index.tsx        # подвал с соцсетями
    │   │   ├── index.test.tsx
    │   │   ├── styles.css
    │   │   └── icons/           # иконки соцсетей (GitHub, LinkedIn, VK, Twitter, Instagram)
    │   ├── Header/
    │   │   ├── index.tsx        # шапка (OrbsTitle + AnimationTyping)
    │   │   ├── index.test.tsx
    │   │   ├── OrbsTitle.tsx    # заголовок с анимацией падения букв (Web Animations API)
    │   │   ├── OrbsTitle.css
    │   │   ├── OrbsTitle.test.tsx
    │   │   ├── styles.css
    │   │   └── header-bg.png
    │   └── Navbar/
    │       ├── index.ts         # реэкспорт Navbar и UI/ButtonToggleDarkMode
    │       ├── index.test.ts    # barrel-тест реэкспортов Navbar
    │       ├── Navbar.tsx       # навигация (логотип, ссылки, переключатель темы)
    │       ├── Navbar.test.tsx
    │       ├── styles.css
    │       └── UI/
    │           ├── ButtonToggleDarkMode.tsx  # переключатель тёмной темы
    │           ├── ButtonToggleDarkMode.css
    │           ├── ButtonToggleDarkMode.test.tsx
    │           ├── colorMode.css  # CSS-переменные светлой/тёмной темы
    │           ├── moon.svg
    │           └── sun.svg
    ├── pages/                   # барреля pages/index.ts нет: App импортирует страницы
    │   │                        # напрямую, чтобы ленивые чанки разделились
    │   ├── Home.tsx             # главная (Header + навыки)
    │   ├── Home.test.tsx
    │   ├── Contacts/
    │   │   ├── index.ts         # реэкспорт страницы
    │   │   ├── index.test.ts    # barrel-тест реэкспорта
    │   │   ├── Contacts.tsx     # страница контактов
    │   │   ├── Contacts.types.ts  # типы ContactItem, ContactLink
    │   │   ├── Contacts.types.test.ts  # тесты типов
    │   │   ├── Contacts.test.tsx
    │   │   ├── model/
    │   │   │   ├── constants.ts   # локальные константы (CONTACTS_LIST)
    │   │   │   └── constants.test.ts
    │   │   └── UI/
    │   │       ├── ContactItem.tsx    # элемент списка контактов
    │   │       └── index.ts
    │   ├── Project/
    │   │   ├── index.ts         # реэкспорт страницы
    │   │   ├── index.test.ts    # barrel-тест реэкспорта
    │   │   ├── Project.tsx      # страница проекта (обложка — секция mouse-parallax)
    │   │   ├── Project.test.tsx
    │   │   ├── styles.css
    │   │   └── model/
    │   │       ├── constants.ts   # локальные константы (BUTTON_GRADIENT)
    │   │       ├── constants.test.ts
    │   │       ├── lib.ts         # findProjectById(id)
    │   │       └── lib.test.ts
    │   ├── Projects/
    │   │   ├── index.ts         # реэкспорт Projects и UI/Project
    │   │   ├── index.test.ts    # barrel-тест реэкспортов
    │   │   ├── Projects.tsx     # страница списка проектов
    │   │   ├── Projects.styles.css
    │   │   ├── Projects.types.ts  # тип ProjectsSection
    │   │   ├── Projects.types.test.ts  # тесты типов
    │   │   ├── Projects.test.tsx
    │   │   └── UI/
    │   │       ├── Project.tsx    # карточка проекта
    │   │       ├── Project.css
    │   │       ├── Project.test.tsx
    │   │       └── model/
    │   │           ├── constants.ts  # DEFAULT_SHADOW_COLOR, INNER_SHADOW_COLOR_DARK
    │   │           └── constants.test.ts
    │   └── NotFound/
    │       ├── index.ts         # реэкспорт страницы
    │       ├── NotFound.tsx     # страница 404
    │       ├── NotFound.test.tsx
    │       └── styles.css
    └── shared/
        ├── assets/
        │   ├── img/
        │   │   ├── projects/        # изображения проектов (WebP: X, X-big, X-big-sm)
        │   │   └── testProjects/    # изображения тестовых заданий (те же размеры)
        │   └── icons/
        │       └── skill-tiles/     # белые SVG-плитки навыков с прозрачным логотипом
        ├── data/
        │   └── projects.json    # данные проектов и тестовых заданий
        ├── constants/
        │   ├── index.ts         # реэкспорт констант
        │   ├── index.test.ts    # barrel-тест реэкспортов
        │   ├── projects.ts      # projects.json → projects, projectsList, testTasksList,
        │   │                    # resolveImage (путь картинки через import.meta.glob)
        │   ├── projects.test.ts
        │   ├── seo.ts           # SITE_URL, SITE_NAME, PAGES, THEME_COLORS, STATIC_PAGES
        │   └── seo.test.ts      # тесты seo-констант
        ├── lib/
        │   ├── index.ts         # реэкспорт утилит
        │   ├── index.test.ts    # barrel-тест реэкспортов
        │   ├── text.ts          # getLetters, replaceSpaceWithNbsp
        │   └── text.test.ts
        └── types/
            ├── index.ts         # реэкспорт типов
            ├── index.test.ts    # barrel-тест реэкспортов
            ├── types.ts         # DarkMode, ProjectSection, ProjectItem
            └── types.test.ts    # тесты типов
```

## SEO и мета-теги

`robots.txt`, `sitemap.xml` и per-page мета-теги — сгенерированные артефакты сборки, а не статика:
в `public/` их нет, всё создаёт плагин [`vite-plugins/seo.ts`](./vite-plugins/seo.ts) (`seo-prerender`,
выполняется после сборки, `closeBundle`):

- для каждой страницы из `STATIC_PAGES` (`src/shared/constants/seo.ts`) создаёт
  `dist/<path>/index.html`, подставляя на место маркера `<!--seo-head-->` из шаблона
  `title`, `description`, `robots`, `canonical` и Open Graph — чтобы краулеры, не
  выполняющие JavaScript, видели правильные метаданные;
- пишет `dist/robots.txt` (со ссылкой на sitemap) и `dist/sitemap.xml`.

Клиентские метаданные (для SPA-переходов и цветных страниц) обновляет
`src/hooks/useDocumentMeta.ts`: `upsertMeta`/`upsertCanonical` управляют `<meta>` и
`<link>` в `<head>`, а `App.tsx` выставляет `theme-color` под выбранную тему
(`THEME_COLORS` в `src/shared/constants/seo.ts`).

> В `src/shared/constants/seo.ts` задаётся `SITE_URL` (canonical, og:url, sitemap).
> Перед деплоем заменить placeholder на реальный домен.

## Контент: данные и изображения

- Проекты и тестовые задания хранятся в `src/shared/data/projects.json`.
  `src/shared/constants/projects.ts` мапит его в `ProjectItem`, а URL картинок
  разрешает через экспортируемую функцию `resolveImage` (по `import.meta.glob`
  из `src/shared/assets/img/**/*.webp`) — опечатка в имени файла ломает сборку
  сразу, а не сайт.
- Изображения — WebP трёх размеров: превью для списка (≤ 600px), обложка проекта
  (1200px) и её уменьшенная версия для `srcset` (800px).
- Конвертация из исходных JPG (для каталогов `projects/` и `testProjects/`) —
  `bash scripts/optimize-images.sh`; нужен ffmpeg с libwebp, исходные JPG не удаляются.

## Фон с иконками навыков

`SkillBackground` — фиксированный декоративный слой под контентом. На нём разложены
SVG-плитки всех навыков из `projects.json`: белые квадраты со скруглёнными углами,
логотип внутри вырезан прозрачностью. Иконки падают постоянно — даже когда пользователь
двигает мышью, — покачиваясь на ±30 градусов; уйдя целиком за нижнюю границу, иконка
возвращается сверху в новом месте по горизонтали (с запасом на поворот) и снова
появляется из-за верхнего края.
Движение мыши смещает весь слой только влево или вправо, без вертикального сдвига,
и в 20 раз медленнее курсора (`getParallaxOffset`, коэффициент `1 / 20`). На тач-экранах
и при `prefers-reduced-motion: reduce` анимация отключается. Слой имеет
`pointer-events: none` и `aria-hidden`, поэтому не мешает кликам и скринридерам.

## Mouse-parallax на странице проекта

Обложка проекта на странице `/project/:id` — секция mouse-parallax (структура и стили
по образцу: контейнер `.mouse-parallax` с `overflow: hidden` и фоновый слой
`.mouse-parallax-bg` размером 110%×110% с `background-size: cover` и переходом
`all 0.5s ease-out`; большая картинка проекта подставляется в `background-image`).
Один обработчик `mousemove` на `window` двигает все секции параллакса на странице
синхронно — `translate(-(x * 50)px, -(y * 50)px)`. Расчёт transform вынесен в чистую
функцию `getParallaxTransform` (`src/pages/Project/model/lib.ts`), амплитуда —
константа `MOUSE_PARALLAX_SHIFT_PX` (50px). Подписка снимается при размонтировании,
а при `prefers-reduced-motion: reduce` параллакс не включается вовсе. Обложка
рендерится как фоновый слой (без `<img>`), поэтому загрузка отслеживается через
предзагрузку `new Image()` — она запускает анимацию появления контейнера.

## Как перенесён проект (CRA → Vite)

| Что                                              | Как                                                                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `src/index.tsx`                                  | → `src/main.tsx`; удалён `reportWebVitals`, импорт `main.css` перенесён сюда                                           |
| `public/index.html`                              | → `index.html` в корне; `%PUBLIC_URL%` заменён на корневые пути, добавлен `<script type="module" src="/src/main.tsx">` |
| `public/manifest.json`                           | обновлён (name/short_name «Portfolio»)                                                                                 |
| `src/react-app-env.d.ts`                         | → `src/vite-env.d.ts` (`/// <reference types="vite/client" />`)                                                        |
| `src/setupTests.ts`                              | `@testing-library/jest-dom/vitest` + мок `window.matchMedia` (jsdom его не реализует)                                  |
| `src/App.test.tsx`                               | переписан с CRA-заглушки на реальный контент (Vitest)                                                                  |
| `src/reportWebVitals.ts`                         | удалён (вместе с зависимостью `web-vitals`)                                                                            |
| `.babelrc.json`, `.storybook/`, `.eslintrc.json` | не переносятся                                                                                                         |

### Файлы из git-submodule `src/stories`

Приложение импортировало рабочие файлы из Storybook-submodule. Они перенесены в `src/`,
а сам submodule **не переносится** (Storybook в проекте отсутствует полностью):

| Было (в `src/stories/`)                     | Стало (в `src/`)                         |
| ------------------------------------------- | ---------------------------------------- |
| `utils/ScrollToTop.tsx`                     | `components/ScrollToTop/index.tsx`       |
| `components/Animations/AnimationScale3d`    | `components/Animations/AnimationScale3d` |
| `components/Animations/AnimationText`       | `components/Animations/AnimationText`    |
| `components/Buttons/ButtonIconWithLink`     | `components/ButtonIconWithLink`          |
| `utils/customHooks/useLocalStorage.ts`      | `hooks/useLocalStorage.ts`               |
| `utils/detectDarkMode.ts`                   | `hooks/detectDarkMode.ts`                |
| `assets/css/animations/pulse-animation.css` | `assets/styles/pulse-animation.css`      |
| `assets/images/icons/gitHub-black.svg`      | `assets/icons/gitHub-black.svg`          |
| `assets/images/icons/live-demo-icon.svg`    | `assets/icons/live-demo-icon.svg`        |

Все импорты переписаны; в `src/` нет упоминаний `stories`/`storybook`.

### Адаптация под React 19

- У трёх компонентов (`AnimationScale3d`, `AnimationText`, `ButtonIconWithLink`) удалён
  `Component.defaultProps` (в React 19 он не работает для функциональных компонентов);
  значения по умолчанию перенесены в параметры деструктуризации.
- `React.CSSProperties` / `React.ReactNode` / `React.Dispatch` заменены на явные импорты типов из `react`.

### Замена Recoil → zustand

`recoil@0.7.7` (последняя версия) несовместим с React 19: он обращается к удалённому
`react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`, из-за чего падают и браузер,
и тесты. По запасному плану из docs/archive/MIGRATION_PLAN.md состояние тёмной темы переведено на
**zustand**. Затронутые файлы: `src/store/darkModeStore.ts`,
`src/components/Navbar/UI/ButtonToggleDarkMode.tsx`, `src/pages/Projects/UI/Project.tsx`,
`src/App.tsx` (убран `RecoilRoot`). Функциональность тёмной темы сохранена:
переключение кнопкой, сохранение в `localStorage`. По умолчанию включена тёмная тема,
системная схема не учитывается.

## Авто-волна заголовков

Заголовки страниц «Contacts», «Projects» и «Test Tasks» рендерит общий компонент
`AnimatedTitle` (`src/components/Animations/AnimatedTitle`): каждая буква — отдельный
`AnimationScale3d` с эффектом «rubber band». Буквы декоративные (`aria-hidden`),
а корректный accessible name заголовка задаётся через `aria-label={title}`
(как в `OrbsTitle`) — иначе скринридер читает заголовок по одной букве.
Помимо анимации по наведению мыши,
каждые `TITLE_WAVE_INTERVAL_MS` (10 секунд) заголовок автоматически запускает
«волну»: в волне участвует каждая буква заголовка (включая пробелы в многословных
заголовках вроде «TEST TASKS»); нечётный тик — слева направо (от первой буквы к
последней), чётный — справа налево (от последней к первой). Задержка каждой буквы
считается чистой функцией `getWaveDelay` с шагом `TITLE_WAVE_STAGGER_MS` (60 мс).
В `AnimationScale3d` волновой эффект реагирует строго на счётчик тиков `playSignal`:
ровно один запуск на тик, ре-рендеры буквы (переключение флага `isPlaying`) не
перезапускают запланированную отложенную анимацию. При `prefers-reduced-motion: reduce`
автозапуск не включается, hover-поведение сохраняется.

> **Важно про единицы:** `transition.delay`/`transition.duration` у framer-motion
> задаются в **секундах**, а `waveDelay` приходит в миллисекундах — `AnimationScale3d`
> конвертирует их делением на 1000. Ранее delay передавался в мс «как есть»: буква
> с задержкой 60 мс получала анимацию с задержкой 60 секунд — в волне визуально
> двигались только буквы с нулевой задержкой (первая на нечётном тике, последняя на
> чётном), а навсегда «залипший» флаг `isPlaying` (его сбрасывает `onAnimationComplete`,
> который для отложенной на минуты анимации не срабатывает) полностью отключал hover.
> Реальное поведение анимации в браузере (WAAPI `getAnimations()` каждой буквы,
> направление волны и работоспособность hover после волн) проверяют e2e-тесты
> `e2e/title-wave.e2e.ts`.

## Тесты

Юнит-тесты запускаются через Vitest (`environment: jsdom`, `setupFiles: ./src/setupTests.ts`,
`pool: vmThreads` на один воркер-поток для всех файлов). `src/setupTests.ts` подключает матчеры
`@testing-library/jest-dom/vitest` и мок `window.matchMedia`, необходимый для компонентов
тёмной темы в jsdom.

Все юнит-тесты проходят: **210 тестов в 46 файлах** (включая barrel-тесты, тесты типов
и тесты seo-плагина). Покрытие по v8 на момент обновления README: **96.63%** statements /
**94.25%** branches / **95.97%** functions / **97.44%** lines; актуальные цифры после
каждого запуска печатает `npm run test:coverage`.

| Модуль                                                                    | Файл теста                                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `App` (маршрутизация, ленивые загрузчики)                                 | `src/App.test.tsx`                                                |
| баррель компонентов                                                       | `src/components/index.test.ts`                                    |
| баррель `Navbar`                                                          | `src/components/Navbar/index.test.ts`                             |
| `Navbar`                                                                  | `src/components/Navbar/Navbar.test.tsx`                           |
| `ButtonToggleDarkMode`                                                    | `src/components/Navbar/UI/ButtonToggleDarkMode.test.tsx`          |
| `Footer`                                                                  | `src/components/Footer/index.test.tsx`                            |
| `Header`                                                                  | `src/components/Header/index.test.tsx`                            |
| `ScrollToTop`                                                             | `src/components/ScrollToTop/index.test.tsx`                       |
| `SkillBackground`                                                         | `src/components/SkillBackground/index.test.tsx`                   |
| параллакс, снег и покачивание                                             | `src/components/SkillBackground/model/lib.test.ts`                |
| константы `SkillBackground`                                               | `src/components/SkillBackground/model/constants.test.ts`          |
| `ButtonIconWithLink`                                                      | `src/components/ButtonIconWithLink/index.test.tsx`                |
| `AnimationScale3d`                                                        | `src/components/Animations/AnimationScale3d/index.test.tsx`       |
| `AnimationText` (варианты `words` / `letters`)                            | `src/components/Animations/AnimationText/index.test.tsx`          |
| `Home`                                                                    | `src/pages/Home.test.tsx`                                         |
| баррель страницы `Contacts`                                               | `src/pages/Contacts/index.test.ts`                                |
| типы `ContactItem` / `ContactLink`                                        | `src/pages/Contacts/Contacts.types.test.ts`                       |
| `Contacts`                                                                | `src/pages/Contacts/Contacts.test.tsx`                            |
| `AnimatedTitle` (заголовки Contacts, Projects, Test Tasks)                | `src/components/Animations/AnimatedTitle/AnimatedTitle.test.tsx`  |
| `getWaveDelay` (волна заголовков)                                         | `src/components/Animations/AnimatedTitle/model/lib.test.ts`       |
| `TITLE_WAVE_INTERVAL_MS` / `TITLE_WAVE_STAGGER_MS`                        | `src/components/Animations/AnimatedTitle/model/constants.test.ts` |
| `ContactItem` (`Contacts`)                                                | `src/pages/Contacts/UI/ContactItem.test.tsx`                      |
| константы `Contacts`                                                      | `src/pages/Contacts/model/constants.test.ts`                      |
| баррель страницы `Projects`                                               | `src/pages/Projects/index.test.ts`                                |
| тип `ProjectsSection`                                                     | `src/pages/Projects/Projects.types.test.ts`                       |
| `Projects`                                                                | `src/pages/Projects/Projects.test.tsx`                            |
| `Project` (карточка)                                                      | `src/pages/Projects/UI/Project.test.tsx`                          |
| `DEFAULT_SHADOW_COLOR` / `INNER_SHADOW_COLOR_DARK`                        | `src/pages/Projects/UI/model/constants.test.ts`                   |
| баррель страницы `Project`                                                | `src/pages/Project/index.test.ts`                                 |
| `Project` (страница)                                                      | `src/pages/Project/Project.test.tsx`                              |
| `findProjectById` / `getParallaxTransform`                                | `src/pages/Project/model/lib.test.ts`                             |
| `BUTTON_GRADIENT` / `MOUSE_PARALLAX_SHIFT_PX`                             | `src/pages/Project/model/constants.test.ts`                       |
| `NotFound` (404)                                                          | `src/pages/NotFound/NotFound.test.tsx`                            |
| `useDocumentMeta` / `upsertMeta`                                          | `src/hooks/useDocumentMeta.test.ts`                               |
| `darkModeStore` (zustand-стор, catch-ветки)                               | `src/store/darkModeStore.test.ts`                                 |
| `projects` / `projectsList` / `testTasksList` / `resolveImage`            | `src/shared/constants/projects.test.ts`                           |
| баррель констант                                                          | `src/shared/constants/index.test.ts`                              |
| seo-константы (`SITE_URL`, `PAGES`, …)                                    | `src/shared/constants/seo.test.ts`                                |
| баррель утилит                                                            | `src/shared/lib/index.test.ts`                                    |
| `getLetters` / `replaceSpaceWithNbsp`                                     | `src/shared/lib/text.test.ts`                                     |
| баррель типов                                                             | `src/shared/types/index.test.ts`                                  |
| типы `DarkMode` / `ProjectSection` / `ProjectItem`                        | `src/shared/types/types.test.ts`                                  |
| seo-плагин (`renderHead`, `renderRobots`, `renderSitemap`, `closeBundle`) | `vite-plugins/seo.test.ts`                                        |

Команда запуска (однократно):

```
npm run test:run
```

В watch-режиме — `npm test`, с отчётом покрытия — `npm run test:coverage`.

## E2E-тесты (Playwright)

`e2e/routes.e2e.ts` — smoke-тесты на собранном сайте: страница открывается, роутинг работает,
deep link открывается без SPA-навигации, неизвестные маршруты и id проекта дают 404,
тёмная тема применяется при загрузке и сохраняется после перезагрузки. Uncaught
ошибки в консоли браузера считаются падением теста.

`e2e/title-wave.e2e.ts` — реальное поведение авто-волны заголовка «Contacts» в браузере
(юнит-тесты framer-motion замоканы и анимацию не исполняют): через `getAnimations()` каждой
буквы проверяется, что на первом тике волны все 8 букв получают rubber-band WAAPI-анимацию
со задержками 0, 60, …, 420 мс (слева направо), на втором тике — зеркально (справа налево),
а после завершения волн hover по букве по-прежнему запускает анимацию (регрессия «залипшего»
флага `isPlaying`). Отдельный тест проверяет, что при `prefers-reduced-motion: reduce`
авто-волна не запускается.

```
npm run test:e2e   # сначала производит сборку, затем playwright test
```

Playwright запускает `vite preview` на порту 4173 (см. `playwright.config.ts`) и гоняет
тесты в chromium.

## CI и Git-хуки

- `.github/workflows/ci.yml` — на Node из `.nvmrc`: `lint` → `typecheck` → `test:run` →
  `build` → Playwright smoke-тесты; при падении upload-ится playwright-отчёт.
- Pre-commit хук (`husky` + `lint-staged`): для `*.{ts,tsx}` — `eslint --fix` и
  `prettier --write`; для css/scss/json/md/html — `prettier --write`.

## Лицензия

Проект является личным портфолио; используемые шрифты и изображения принадлежат их владельцам.
