# План миграции портфолио: Create React App → Vite + React 19 (без Storybook)

> Цель: перенести сайт-портфолио из каталога `/home/user/Documents/web/react-portfolio`
> в новый проект в `/home/user/Documents/web/portflolio` на стеке **Vite + React 19**,
> удалив Storybook, устаревшие конфигурации CRA и обновив все зависимости до актуальных версий.

---

## 1. Обзор и цели

| Параметр   | Исходный проект                                   | Целевой проект                           |
| ---------- | ------------------------------------------------- | ---------------------------------------- |
| Сборщик    | Create React App (`react-scripts` 5.0.1, Webpack) | Vite (последняя стабильная версия)       |
| React      | 18.2.0                                            | 19.x                                     |
| TypeScript | 4.9.5                                             | последняя стабильная (5.8+)              |
| Роутинг    | react-router-dom 6.10.0                           | react-router-dom 7.x (API v6 сохранён)   |
| Storybook  | 7.0 (webpack5) + git submodule `src/stories`      | ❌ полностью удаляется                   |
| Тесты      | Jest (через react-scripts) + Testing Library 13   | Vitest + Testing Library 16              |
| Стили      | CSS + SCSS (dart-sass 1.69)                       | CSS + SCSS (актуальный dart-sass)        |
| Состояние  | Recoil 0.7.7, framer-motion 10.12                 | Recoil (см. риски), framer-motion 11/12+ |

**Функциональность и внешний вид сайта должны сохраниться без изменений.**
Список страниц и маршрутов:

- `/` — Home (Header с анимациями + список навыков)
- `/projects` — Projects (2 секции: Projects / Test Tasks)
- `/project/:id` — Project (детали проекта, кнопки GitHub / Live Demo)
- `/contacts` — Contacts (Telegram, Email)

---

## 2. Ключевые находки анализа исходного кода

### 2.1. КРИТИЧНО: `src/stories` — это git-submodule, части которого использует само приложение

`.gitmodules` подключает репозиторий `https://github.com/Michael3468/storybook.git` в `src/stories`.
НЕЛЬЗЯ просто удалить весь `src/stories` — приложение импортирует из него **рабочие** файлы:

| Файл-импортёр                                   | Что импортируется из `src/stories`                                                                                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/App.tsx`                                   | `./stories/utils/ScrollToTop`                                                                                                                                       |
| `src/pages/Contacts.tsx`                        | `../../stories/components/Animations/AnimationScale3d`                                                                                                              |
| `src/pages/Projects/Projects.tsx`               | `../../stories/components/Animations/AnimationScale3d`                                                                                                              |
| `src/pages/Project/Project.tsx`                 | `../../stories/assets/images/icons/gitHub-black.svg`, `../../stories/assets/images/icons/live-demo-icon.svg`, `../../stories/components/Buttons/ButtonIconWithLink` |
| `src/components/Header/index.tsx`               | `AnimationScale3d`, `AnimationText` (из stories/components/Animations)                                                                                              |
| `src/components/Project/Project.tsx`            | `../../stories/assets/css/animations/pulse-animation.css`                                                                                                           |
| `src/components/ButtonToggleDarkMode/index.tsx` | `../../stories/utils/customHooks` (useLocalStorage), `../../stories/utils/detectDarkMode`                                                                           |

**Стратегия:** перенести только используемые файлы из `src/stories` в структуру `src/` целевого
проекта (см. раздел 5), после чего удалить `src/stories` целиком вместе с `.gitmodules`.

### 2.2. Что можно копировать «как есть» без изменений

- Вся страница `src/pages/` кроме правок импортов из stories;
- `src/components/` кроме правок импортов;
- `src/shared/` (константы, типы, картинки проектов);
- `src/assets/` (styles, constants.ts);
- `src/atoms/darkModeState.ts`;
- `src/types.ts`;
- CSS-файлы компонентов, `colorMode.css`, `Projects.styles.scss`.

### 2.3. Устаревшие/CRA-специфичные части (переписать или удалить)

- `src/index.tsx` → станет `src/main.tsx` (механика та же, но без `reportWebVitals`);
- `src/react-app-env.d.ts` (`/// <reference types="react-scripts" />`) → `src/vite-env.d.ts`;
- `src/reportWebVitals.ts` + зависимость `web-vitals` → **удалить** (не нужна);
- `src/App.test.tsx` — CRA-заглушка «renders learn react link», которая не соответствует контенту → **переписать** под Vitest + Testing Library;
- `public/index.html` — CRA-шаблон с `%PUBLIC_URL%` → **переписать** под Vite (index.html в корне проекта);
- `public/manifest.json` — CRA-дефолты («React App», «Create React App Sample») → обновить;
- `.babelrc.json` — не нужен (Vite использует esbuild/@vitejs/plugin-react);
- `.storybook/`, все `*.stories.ts`, `Introduction.mdx`, storybook-специфичные readme → **удалить**.

### 2.4. Замечание по React 19: `defaultProps` на функциональных компонентах больше не работает

В React 19 `defaultProps` для **функциональных** компонентов удалены (для class-компонентов сохранены).
В `src/stories` три компонента используют `Component.defaultProps`:

- `AnimationScale3d` (transitionTimes, duration, startOnInit);
- `AnimationText` (staggerChildren, delayChildren, hiddenX/Y, visibleX/Y, dumping, stiffness, style);
- `ButtonIconWithLink` (~16 пропсов).

Эти компоненты будут перенесены в `src/` и **обязательно** адаптированы: дефолтные значения
переводятся в параметры деструктуризации: `({ duration = 1, startOnInit = false, ... })`.
Иначе при рендере будут `undefined` значения (типы, стили и логика сломаются).

### 2.5. Разное

- В коде нет absolute-импортов (`@/...`): все импорты относительные. Alias `@` настроим, но массово
  переписывать импорты не требуется.
- `src/components/ButtonToggleDarkMode/readme.md` — это документация для Storybook-кнопки
  (описывает CSS-переменные темы). Сами переменные уже есть в `colorMode.css`, поэтому
  readme **не переносится** (значение переменных сохранено в коде).
- `framer-motion` (анимации Header, заголовков) и `recoil` (тёмная тема) — это НЕ Storybook-зависимости,
  они используются приложением напрямую и **должны остаться** в новом проекте.
- `public/favicon.ico`, `logo192.png`, `logo512.png` переносятся как есть; `header-bg.png` и иконки
  соцсетей уже лежат внутри `src/components/*` и переносятся автоматически.

---

## 3. Зависимости нового проекта

### 3.1. Команды установки (выполнять в `/home/user/Documents/web/portflolio`)

```bash
# 1) Инициализация package.json
npm init -y

# 2) Runtime-зависимости
npm install react@latest react-dom@latest react-router-dom@latest recoil@^0.7.7 framer-motion@latest

# 3) Dev-зависимости: Vite, TypeScript, плагины
npm install -D vite@latest @vitejs/plugin-react@latest typescript@latest @types/node@latest

# 4) Dev-зависимости: типы React
npm install -D @types/react@latest @types/react-dom@latest

# 5) Dev-зависимости: SCSS
npm install -D sass@latest

# 6) Dev-зависимости: тесты (Vitest + Testing Library + jsdom)
npm install -D vitest@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest

# 7) Dev-зависимости: ESLint (flat config) и Prettier
npm install -D eslint@latest @eslint/js@latest typescript-eslint@latest \
  eslint-plugin-react@latest eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest \
  eslint-plugin-import@latest eslint-plugin-import-helpers@latest prettier@latest

# (опционально) Stylelint — конфиг переносится из исходного проекта
npm install -D stylelint@latest stylelint-config-standard@latest stylelint-config-rational-order@latest \
  stylelint-scss@latest stylelint-order@latest postcss-scss@latest
```

> Примечание: вместо фиксации точных версий на момент написания плана используется `@latest` /
> мажорные диапазоны. На момент реализации необходимо убедиться, что:
>
> - `react` / `react-dom` — ветка 19.x;
> - `react-router-dom` — ветка 7.x;
> - `vitest` — ветка 3.x+ (совместима с Vite 7);
> - `eslint` — ветка 9.x (flat config по умолчанию);
> - `sass` — ветка 1.8x+;
> - `framer-motion` — ветка 11+ (поддержка React 19).

### 3.2. Какие зависимости остаются

| Пакет                                              | Версия в исходнике | Целевая версия     | Зачем                                                                  |
| -------------------------------------------------- | ------------------ | ------------------ | ---------------------------------------------------------------------- |
| `react`                                            | ^18.2.0            | ^19                | ядро                                                                   |
| `react-dom`                                        | ^18.2.0            | ^19                | ядро                                                                   |
| `react-router-dom`                                 | ^6.10.0            | ^7                 | роутинг; API BrowserRouter/Routes/NavLink/useParams обратно совместимы |
| `framer-motion`                                    | ^10.12.4           | 11+/latest         | анимации (AnimationScale3d, AnimationText) — используются приложением  |
| `recoil`                                           | ^0.7.7             | ^0.7.7 (см. риски) | тёмная тема (darkModeState)                                            |
| `typescript`                                       | ^4.9.5             | latest (5.8+)      | типизация                                                              |
| `@types/react`, `@types/react-dom`                 | ^18                | latest (19.x)      | типы React                                                             |
| `sass`                                             | ^1.69.4            | latest             | компиляция `Projects.styles.scss`                                      |
| `@testing-library/react`, `jest-dom`, `user-event` | 13/5/13            | 16/6/14            | тесты                                                                  |
| `prettier`                                         | ^2.8.7             | latest             | форматирование (конфиг `.prettierrc` переносится)                      |
| `stylelint` + плагины                              | 15.x               | latest             | линтинг SCSS (конфиг `.stylelintrc.json` переносится) — опционально    |

### 3.3. Какие зависимости УДАЛИТЬ (не переносятся)

| Пакет                                                                                                                                                                                   | Причина                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `react-scripts`                                                                                                                                                                         | CRA-обёртка, заменяется Vite                                                                                 |
| `web-vitals`                                                                                                                                                                            | используется только в `reportWebVitals.ts`, который удаляется                                                |
| `@types/jest`                                                                                                                                                                           | Jest заменяется Vitest (матрёры приходят из `@testing-library/jest-dom/vitest`)                              |
| `@storybook/*` (addon-essentials, addon-interactions, addon-links, blocks, preset-create-react-app, react, react-webpack5, testing-library), `storybook`, `storybook-source-code-addon` | Storybook удаляется полностью                                                                                |
| `eslint-plugin-storybook`                                                                                                                                                               | правило `plugin:storybook/recommended` больше не нужно                                                       |
| `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`                                                                                                                  | Vite транслирует через esbuild; jest больше нет                                                              |
| `eslint-config-airbnb`, `eslint-config-airbnb-base`                                                                                                                                     | в flat-конфиге заменяются на `@eslint/js` + `typescript-eslint` (см. раздел 6.4)                             |
| `prop-types`                                                                                                                                                                            | код на TypeScript, PropTypes не используются                                                                 |
| `commitizen`, `cz-conventional-changelog`, `git-flow`                                                                                                                                   | скрипты `release-*`, `cm`, `cml` — вне рамок миграции (можно вернуть отдельно, если нужен git-flow workflow) |

> `@types/node` оставить/установить: нужен для типизации `vite.config.ts` (node:path, process.env).

---

## 4. Карта переноса файлов

### 4.1. Копируются как есть (без изменений)

```
public/favicon.ico
public/logo192.png
public/logo512.png
public/robots.txt
src/assets/styles/reset.css
src/assets/styles/main.css            # содержит @import './reset.css' и Google Fonts — Vite это поддерживает
src/assets/constants.ts
src/atoms/darkModeState.ts
src/types.ts
src/shared/constants/index.ts
src/shared/constants/projectsList.ts  # относительные импорты ../assets/img/... работают
src/shared/constants/testTasksList.ts
src/shared/types/index.ts
src/shared/types/types.ts
src/shared/assets/img/**              # jpg проектов (projects/, testProjects/)
src/pages/index.ts
src/pages/Home.tsx
src/pages/Contacts.tsx                # только после правки импорта AnimationScale3d
src/pages/Projects/index.ts
src/pages/Projects/Projects.tsx       # только после правки импорта AnimationScale3d
src/pages/Projects/Projects.types.ts
src/pages/Projects/Projects.styles.scss
src/pages/Project/index.ts
src/pages/Project/Project.tsx         # после правки импортов иконок и ButtonIconWithLink
src/pages/Project/styles.css
src/components/index.ts
src/components/Header/index.tsx       # после правки импортов анимаций
src/components/Header/header-bg.png
src/components/Header/styles.css
src/components/Navbar/index.tsx
src/components/Navbar/styles.css
src/components/Navbar/moon.svg
src/components/Navbar/sun.svg
src/components/Footer/index.tsx
src/components/Footer/styles.css
src/components/Footer/icons/*.svg
src/components/Project/index.ts
src/components/Project/Project.tsx    # после правки импорта pulse-animation.css
src/components/Project/styles.css
src/components/ButtonToggleDarkMode/index.tsx      # после правки импортов useLocalStorage/detectDarkMode
src/components/ButtonToggleDarkMode/styles.css
src/components/ButtonToggleDarkMode/colorMode.css
src/components/ButtonToggleDarkMode/moon.svg
src/components/ButtonToggleDarkMode/sun.svg
```

### 4.2. Переносятся из `src/stories` в `src` (с адаптацией путей и React 19)

| Источник (исходный проект)                                     | Назначение (новый проект)                              | Адаптация                                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `src/stories/utils/ScrollToTop.tsx`                            | `src/components/ScrollToTop/index.tsx`                 | без изменений логики                                                                    |
| `src/stories/components/Animations/AnimationScale3d/index.tsx` | `src/components/Animations/AnimationScale3d/index.tsx` | убрать `defaultProps` → дефолты в аргументах; `import React` не нужен                   |
| `src/stories/components/Animations/AnimationText/index.tsx`    | `src/components/Animations/AnimationText/index.tsx`    | убрать `defaultProps`; `React.CSSProperties` заменить на импорт типа из 'react'         |
| `src/stories/components/Buttons/ButtonIconWithLink/index.tsx`  | `src/components/ButtonIconWithLink/index.tsx`          | убрать `defaultProps`; заменить `React.ReactNode`/`React.CSSProperties` на импорт типов |
| `src/stories/components/Buttons/ButtonIconWithLink/styles.css` | `src/components/ButtonIconWithLink/styles.css`         | как есть                                                                                |
| `src/stories/utils/customHooks/useLocalStorage.ts`             | `src/hooks/useLocalStorage.ts`                         | без изменений                                                                           |
| `src/stories/utils/detectDarkMode.ts`                          | `src/hooks/detectDarkMode.ts`                          | без изменений (импорт `TDarkMode` из `../types` сохраняется)                            |
| `src/stories/assets/css/animations/pulse-animation.css`        | `src/assets/styles/pulse-animation.css`                | как есть                                                                                |
| `src/stories/assets/images/icons/gitHub-black.svg`             | `src/assets/icons/gitHub-black.svg`                    | как есть                                                                                |
| `src/stories/assets/images/icons/live-demo-icon.svg`           | `src/assets/icons/live-demo-icon.svg`                  | как есть                                                                                |

### 4.3. Переименовываются / переписываются

| Источник                 | Назначение                     | Изменения                                                                                                         |
| ------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/index.tsx`          | `src/main.tsx`                 | убрать `reportWebVitals`; добавить импорт `main.css` перенесён из `App.tsx` (или оставить в `App.tsx` — на выбор) |
| `src/react-app-env.d.ts` | `src/vite-env.d.ts`            | содержимое: `/// <reference types="vite/client" />`                                                               |
| `src/setupTests.ts`      | `src/setupTests.ts`            | `import '@testing-library/jest-dom';` → `import '@testing-library/jest-dom/vitest';`                              |
| `src/App.test.tsx`       | `src/App.test.tsx`             | полная перезапись под Vitest (см. 6.5)                                                                            |
| `public/index.html`      | `/index.html` (корень проекта) | переписать под Vite (см. 6.7)                                                                                     |
| `public/manifest.json`   | `public/manifest.json`         | обновить name/short_name на «Portfolio»                                                                           |
| `README.md`              | `README.md`                    | написать заново: команды Vite (`npm run dev/build/preview/test/lint`), описание стека                             |

### 4.4. Удаляются полностью (не переносятся)

```
.storybook/                          # main.ts, preview.ts
.babelrc.json
.gitmodules                          # submodule src/stories больше не нужен
src/stories/                         # ВСЁ: .git, Introduction.mdx, LICENSE, package.json,
                                     # *.stories.ts, assets/, components/ (кроме перенесённого),
                                     # utils/ (кроме перенесённого), readme.md
src/reportWebVitals.ts
src/components/ButtonToggleDarkMode/readme.md   # storybook-специфичная документация
src/stories/**/readme.md             # вся storybook-документация
```

---

## 5. Структура итогового проекта

```
portflolio/
├── index.html                       # точка входа Vite (в корне!)
├── package.json
├── vite.config.ts                   # Vite + React plugin + alias + Vitest config
├── tsconfig.json                    # конфиг приложения (src)
├── tsconfig.node.json               # конфиг для vite.config.ts
├── eslint.config.js                 # flat config (ESLint 9)
├── .prettierrc                      # из исходного проекта, без изменений
├── .stylelintrc.json                # из исходного проекта, без изменений (опционально)
├── .gitignore                       # node_modules, dist, *.local
├── README.md                        # новый
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json                # обновлён
│   └── robots.txt
└── src/
    ├── main.tsx                     # бывший index.tsx
    ├── App.tsx
    ├── App.test.tsx                 # переписан под Vitest
    ├── setupTests.ts                # jest-dom/vitest
    ├── vite-env.d.ts                # бывший react-app-env.d.ts
    ├── types.ts
    ├── atoms/
    │   └── darkModeState.ts
    ├── assets/
    │   ├── constants.ts
    │   ├── icons/
    │   │   ├── gitHub-black.svg     # из stories
    │   │   └── live-demo-icon.svg   # из stories
    │   └── styles/
    │       ├── main.css
    │       ├── reset.css
    │       └── pulse-animation.css  # из stories
    ├── hooks/
    │   ├── detectDarkMode.ts        # из stories
    │   └── useLocalStorage.ts       # из stories
    ├── components/
    │   ├── index.ts
    │   ├── ScrollToTop/
    │   │   └── index.tsx            # из stories
    │   ├── Animations/
    │   │   ├── AnimationScale3d/index.tsx   # из stories, без defaultProps
    │   │   └── AnimationText/index.tsx      # из stories, без defaultProps
    │   ├── ButtonIconWithLink/
    │   │   ├── index.tsx            # из stories, без defaultProps
    │   │   └── styles.css           # из stories
    │   ├── ButtonToggleDarkMode/    # (index.tsx, styles.css, colorMode.css, moon.svg, sun.svg)
    │   ├── Footer/                  # (index.tsx, styles.css, icons/*)
    │   ├── Header/                  # (index.tsx, styles.css, header-bg.png)
    │   ├── Navbar/                  # (index.tsx, styles.css, moon.svg, sun.svg)
    │   └── Project/                 # (index.ts, Project.tsx, styles.css)
    ├── pages/
    │   ├── index.ts
    │   ├── Home.tsx
    │   ├── Contacts.tsx
    │   ├── Project/
    │   │   ├── index.ts
    │   │   ├── Project.tsx
    │   │   └── styles.css
    │   └── Projects/
    │       ├── index.ts
    │       ├── Projects.tsx
    │       ├── Projects.types.ts
    │       └── Projects.styles.scss
    └── shared/
        ├── assets/img/**            # все jpg проектов
        ├── constants/
        │   ├── index.ts
        │   ├── projectsList.ts
        │   └── testTasksList.ts
        └── types/
            ├── index.ts
            └── types.ts
```

---

## 6. Необходимые изменения в коде

### 6.1. `src/main.tsx` (бывший `src/index.tsx`)

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './assets/styles/main.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Изменения относительно исходника:

- имя файла `index.tsx` → `main.tsx`;
- удалён вызов `reportWebVitals()` и сам импорт;
- импорт `./assets/styles/main.css` перенесён сюда из `App.tsx` (рекомендуется — глобальные стили
  подключаются один раз в точке входа); если удобнее — можно оставить в `App.tsx`, тогда из
  `main.tsx` его убрать;
- `import React from 'react'` не нужен (react-jsx transform);
- типы `ReactDOM` не используются.

### 6.2. Правки импортов, связанные с переносом файлов из `src/stories`

| Файл                                            | Было                                                                                    | Стало                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/App.tsx`                                   | `import ScrollToTop from './stories/utils/ScrollToTop';`                                | `import ScrollToTop from './components/ScrollToTop';`                                                 |
| `src/pages/Contacts.tsx`                        | `import AnimationScale3d from '../stories/components/Animations/AnimationScale3d';`     | `import AnimationScale3d from '../components/Animations/AnimationScale3d';`                           |
| `src/pages/Projects/Projects.tsx`               | `import AnimationScale3d from '../../stories/components/Animations/AnimationScale3d';`  | `import AnimationScale3d from '../../components/Animations/AnimationScale3d';`                        |
| `src/pages/Project/Project.tsx`                 | `import gitHubIcon from '../../stories/assets/images/icons/gitHub-black.svg';`          | `import gitHubIcon from '../../assets/icons/gitHub-black.svg';`                                       |
| `src/pages/Project/Project.tsx`                 | `import liveDemo from '../../stories/assets/images/icons/live-demo-icon.svg';`          | `import liveDemo from '../../assets/icons/live-demo-icon.svg';`                                       |
| `src/pages/Project/Project.tsx`                 | `import ButtonIconWithLink from '../../stories/components/Buttons/ButtonIconWithLink';` | `import ButtonIconWithLink from '../../components/ButtonIconWithLink';`                               |
| `src/components/Header/index.tsx`               | `from '../../stories/components/Animations/AnimationScale3d'` и `.../AnimationText'`    | `from '../../components/Animations/AnimationScale3d'` и `'../../components/Animations/AnimationText'` |
| `src/components/Project/Project.tsx`            | `import '../../stories/assets/css/animations/pulse-animation.css';`                     | `import '../../assets/styles/pulse-animation.css';`                                                   |
| `src/components/ButtonToggleDarkMode/index.tsx` | `import { useLocalStorage } from '../../stories/utils/customHooks';`                    | `import { useLocalStorage } from '../../hooks/useLocalStorage';`                                      |
| `src/components/ButtonToggleDarkMode/index.tsx` | `import detectDarkMode from '../../stories/utils/detectDarkMode';`                      | `import detectDarkMode from '../../hooks/detectDarkMode';`                                            |

Также в `src/hooks/detectDarkMode.ts` сохранить импорт `import { TDarkMode } from '../types';` —
в целевом проекте файл лежит в `src/hooks/`, поэтому путь становится `../types`.

### 6.3. Адаптация под React 19: `defaultProps` → параметры по умолчанию

Пример для `src/components/Animations/AnimationScale3d/index.tsx`:

```tsx
import { motion, useAnimationControls } from 'framer-motion';
import { FC, useCallback, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  transitionTimes?: number[];
  duration?: number;
  startOnInit?: boolean;
};

const AnimationScale3d: FC<Props> = ({
  children,
  transitionTimes = [0, 0.4, 0.6, 0.7, 0.8, 0.9],
  duration = 1,
  startOnInit = false,
}) => {
  // ... логика без изменений
};
```

- Убрать блок `AnimationScale3d.defaultProps = {...}`;
- То же самое проделать с `AnimationText` (все 10 пропсов) и `ButtonIconWithLink` (все 19 пропсов);
- В `AnimationText` и `ButtonIconWithLink` заменить `React.CSSProperties` на
  `import type { CSSProperties } from 'react'` (в React 19 типы импортируются явно);
- Опционально (по style-guide проекта): переписать компоненты со стрелочных функций на
  `export default function ComponentName(...)`. Для миграции это не обязательно — приоритет
  — сохранение функциональности.

### 6.4. Конфигурация проекта

#### `vite.config.ts` (Vite + Vitest в одном файле)

```ts
/// <reference types="vitest/config" />
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
  },
});
```

Пояснения:

- `import.meta.dirname` доступен на Node 20.11+/21.2+ (Vite 7 требует Node ≥20.19). Если окружение
  старше — использовать `fileURLToPath(new URL('.', import.meta.url))`;
- `test`-блок описывает Vitest: jsdom-окружение, глобальные `describe/it/expect`, подгрузка
  `setupTests.ts`, CSS не загружается (достаточно для юнит-тестов);
- алиас `@` → `src` настраиваем для будущего использования, но существующие относительные
  импорты НЕ переписываем.

#### `tsconfig.json` (приложение)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

Примечание:

- `moduleResolution: "bundler"` и `module: "ESNext"` — рекомендованный набор для Vite;
- `types: ["vitest/globals", ...]` даёт типы для `describe/it/expect` и jest-dom-матрёров в тестах;
- если `noUnusedLocals` начнёт ругаться на переменные с префиксом `_` в деструктуризации —
  TypeScript игнорирует их по соглашению; при иных срабатываниях — почистить код или временно
  выключить флаг (решение за исполнителем, фиксируем факт в чек-листе).

#### `tsconfig.node.json` (для vite.config.ts)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

#### `package.json` — scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "stylelint": "stylelint \"src/**/*.{css,scss}\""
  }
}
```

### 6.5. ESLint: flat config (`eslint.config.js`)

**Решение: используем новый формат `eslint.config.js` (flat config).**

Обоснование:

1. ESLint 9.x (текущая major-версия) использует flat config **по умолчанию**; `.eslintrc.json`
   объявлен deprecated и в ESLint 10 будет удалён;
2. исходный `.eslintrc.json` завязан на `eslint-config-airbnb` (старый способ, несовместимый с
   flat config) и `plugin:storybook/recommended` (Storybook удаляется) — переносить его «как есть»
   бессмысленно;
3. flat config проще: `typescript-eslint` и `eslint-plugin-react-hooks` официально поддерживают его.

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importHelpers from 'eslint-plugin-import-helpers';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-helpers': importHelpers,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: ['module', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
);
```

> `globals` импортируется из `globals`-пакета (ставится как транзитивная зависимость typescript-eslint;
> при необходимости — `npm i -D globals`). Исходный eslint-конфиг содержал специфичные правила
> `import/extensions`, `no-underscore-dangle` и др. — при переезде их можно перенести точечно,
> но это не является обязательным условием сборки. Порядок импортов сохранён через
> `eslint-plugin-import-helpers`.

### 6.6. Stylelint и Prettier

- `.prettierrc` — копируется без изменений;
- `.stylelintrc.json` — копируется без изменений (стили в новом проекте не меняются);
- если stylelint не устанавливается — скрипт `stylelint` из package.json просто не добавляется.

### 6.7. `index.html` (корень проекта) и `public/`

Для Vite HTML-файл лежит в **корне** проекта, а не в `public/`. Шаблон:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Portfolio of Mikhail — frontend developer" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Portfolio</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Изменения против исходника:

- `%PUBLIC_URL%` заменяется на корневые пути `/favicon.ico`, `/logo192.png`, `/manifest.json`
  (Vite обслуживает `public/` из корня);
- добавлен `<script type="module" src="/src/main.tsx">` — так Vite подключает бандл;
- удалены комментарии CRA (иначе кодрефакторинг индекса не полон).

`public/manifest.json` — обновить:

```json
{
  "short_name": "Portfolio",
  "name": "Portfolio",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 24x24 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "logo512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### 6.8. Тесты: `src/setupTests.ts` и `src/App.test.tsx`

`src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`src/App.test.tsx` (переписан с CRA-заглушки на реальный контент):

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders navigation and pages', () => {
    render(<App />);

    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacts/i })).toBeInTheDocument();
  });
});
```

Замечания:

- `App` сам содержит `BrowserRouter` и `RecoilRoot`, поэтому дополнительный враппер не нужен;
- `ScrollToTop` использует `useLocation` — работает внутри `BrowserRouter`;
- `jsdom` имитирует `window.matchMedia`? — нет! `detectDarkMode` (используется в
  `ButtonToggleDarkMode`) вызывает `window.matchMedia(...)`. В jsdom `window.matchMedia` не определён
  (до jsdom 26 matchMedia отсутствует). НЕОБХОДИМО добавить мок в `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest';

// jsdom не реализует window.matchMedia — мокаем для компонентов тёмной темы
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

> Это же требование актуально и для ручного запуска тестов — без мока тест App упадёт.

---

## 7. Порядок действий (пошаговый чек-лист реализации)

Этапы выполняются в указанном порядке. После каждого — запуск соответствующей проверки.

1. **Инициализация проекта**
   - [ ] создать `package.json` (`npm init -y`) в `/home/user/Documents/web/portflolio`;
   - [ ] установить зависимости (команды из раздела 3.1);
   - [ ] создать `.gitignore` (`node_modules`, `dist`, `*.local`, `.DS_Store`).

2. **Каркас Vite**
   - [ ] создать `index.html` (раздел 6.7);
   - [ ] создать `src/main.tsx` (раздел 6.1) и `src/vite-env.d.ts`;
   - [ ] создать `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json` (раздел 6.4);
   - [ ] проверить `npm run dev` — открывается пустая страница с точкой входа.

3. **Перенос статики и данных**
   - [ ] скопировать `public/*` (favicon, логотипы, robots.txt, manifest.json с правкой);
   - [ ] скопировать `src/shared/**` (типы, константы, изображения проектов);
   - [ ] скопировать `src/assets/**` (styles, constants.ts) + иконки и pulse-animation из stories
         по карте 4.2;
   - [ ] скопировать `src/hooks/` (useLocalStorage, detectDarkMode) из stories.

4. **Перенос компонентов**
   - [ ] скопировать `src/components/**` (Footer, Header, Navbar, Project, ButtonToggleDarkMode);
   - [ ] перенести из stories: ScrollToTop, AnimationScale3d, AnimationText, ButtonIconWithLink
         с адаптацией под React 19 (раздел 6.3);
   - [ ] скопировать `src/pages/**` (все страницы, включая SCSS);
   - [ ] скопировать `src/atoms/`, `src/types.ts`, `src/components/index.ts`, `src/pages/index.ts`.

5. **Правка импортов**
   - [ ] применить все замены импортов из таблицы раздела 6.2;
   - [ ] удалить `import React from 'react'` там, где он больше не нужен (react-jsx transform):
         `main.tsx`, компоненты анимаций и кнопок (при их переписывании);
   - [ ] убедиться, что в `src/` не осталось ни одного упоминания `stories`.

6. **Конфигурация линтеров и тестов**
   - [ ] создать `eslint.config.js` (раздел 6.5), скопировать `.prettierrc`, `.stylelintrc.json`;
   - [ ] обновить `src/setupTests.ts` и переписать `src/App.test.tsx` (раздел 6.8);
   - [ ] добавить scripts в `package.json` (раздел 6.4);
   - [ ] написать новый `README.md` (команды, стек, структура).

7. **Проверки и верификация**
   - [ ] `npm run lint` — нет ошибок;
   - [ ] `npm run test:run` — тесты зелёные;
   - [ ] `npm run build` — прод-сборка успешна (dist/);
   - [ ] `npm run preview` — сайт открывается, все 4 маршрута работают, тёмная тема
         переключается, анимации воспроизводятся, картинки проектов загружаются.

8. **Финализация**
   - [ ] удалить из исходного каталога (или просто не переносить) всё Storybook-содержимое;
   - [ ] git init (если нужен) и первый коммит с готовой структурой.

---

## 8. Чек-лист проверки результата

- [ ] `npm run dev` — сервер стартует без ошибок, HMR работает;
- [ ] `npm run build` — сборка проходит с нулём ошибок TS;
- [ ] `npm run test:run` — `App.test.tsx` проходит (включая мок matchMedia);
- [ ] `npm run lint` — нет ошибок (warning допустимы);
- [ ] страница `/` — заголовок с анимацией букв, текст «frontend developer», список навыков;
- [ ] страница `/projects` — секции «Projects» и «Test Tasks», карточки с картинками;
- [ ] переход на `/project/:id` — детальная страница, кнопки GitHub и Live Demo открываются в новой вкладке;
- [ ] страница `/contacts` — заголовок с анимацией, ссылки Telegram и Email;
- [ ] тёмная/светлая тема: кнопка в Navbar переключает тему, состояние сохраняется в localStorage,
      отслеживается системная схема;
- [ ] favicon, manifest, robots.txt доступны по `/favicon.ico`, `/manifest.json`, `/robots.txt`;
- [ ] в `node_modules` отсутствуют пакеты `storybook*`, `react-scripts`, `web-vitals`;
- [ ] в проекте нет файлов `*.stories.*`, `.storybook/`, `src/stories/`, `.gitmodules`;
- [ ] Google Fonts подключаются (видимый шрифт DM Sans/Poppins).

---

## 9. Риски и спорные моменты

1. **Recoil 0.7.7 + React 19.** Recoil использует unstable-интерфейсы React; на React 19 возможны
   предупреждения в консоли или проблемы с типизацией. Порядок действий:
   - сначала проверить работу с `recoil@^0.7.7` (сайт работает, тема переключается);
   - при проблемах — **запасной план**: заменить Recoil на лёгкую альтернативу (zustand или
     контекст + useState). Объём изменений ограничен: `src/atoms/darkModeState.ts`,
     `src/components/ButtonToggleDarkMode/index.tsx`, `src/components/Project/Project.tsx`,
     `src/App.tsx` (убрать `RecoilRoot`). Это решение принимает исполнитель на этапе реализации
     после запуска dev-сервера.

2. **`defaultProps` в React 19.** Обязательная адаптация трёх переносимых компонентов (раздел 6.3).
   Если пропустить — пропсы станут `undefined`, анимации и кнопки сломаются. Это главный источник
   «тихих» багов при миграции.

3. **`window.matchMedia` в jsdom отсутствует.** Без мока (раздел 6.8) тесты падают. Мок обязателен.

4. **Sass deprecation.** Новый dart-sass deprecates legacy JS API и `@import`. В конфиге Vite
   включены `api: 'modern-compiler'` и `silenceDeprecations`. CSS-файлы с `@import './reset.css'`
   обрабатываются самим Vite (postcss-import), поэтому SCSS-deprecation их не касается.

5. **react-router-dom v7.** В v7 пакет `react-router-dom` остаётся тонкой обёрткой над
   `react-router`. Используемые здесь API (`BrowserRouter`, `Routes`, `Route`, `NavLink`,
   `useParams`, `useLocation`) полностью совместимы. Миграционных правок кода не требуется.

6. **framer-motion.** Пакет переименован в `motion` (последние версии публикуются под обоими
   именами). Импорты `{ motion, useAnimationControls }` и API компонентов не меняются.
   Поддерживается React 19 с версии 11+.

7. **Полное соответствие style-guide (function declarations, UI/-каталоги, model/lib.ts).**
   Исходный код написан в другом стиле (стрелочные функции, FC, defaultProps). В рамках данной
   миграции приоритет — сохранение функциональности; приведение всего кода к style-guide выходит
   за рамки задачи. Новые файлы (main.tsx, тесты, конфиги) оформляются по правилам style-guide.

8. **`@types/node` и Node-версия.** Vite 7 требует Node ≥ 20.19 (либо 22.12+). Если на машине
   установлен Node 18 (как в `.nvmrc` исходника) — обновить окружение или использовать nvm
   (`nvm use 22`). `.nvmrc` в новый проект добавить с актуальной версией (например, `v22`).

9. **Изменение структуры после переноса.** Пути импортов меняются только для файлов,
   перенесённых из `src/stories` (раздел 6.2). Никаких других изменений путей не требуется —
   относительная структура `src/pages`, `src/components`, `src/shared` сохраняется.

---

## 10. Итоговая сводка ключевых решений

- Сборщик: **Vite** (последний стабильный) + `@vitejs/plugin-react`, dev-порты/скрипты стандартные.
- React: **19.x**, entry point `src/main.tsx`, `react-jsx` transform, `StrictMode` сохранён.
- Роутер: **react-router-dom 7.x** без изменений кода.
- Storybook удалён полностью, включая git-submodule `src/stories`; используемые им файлы
  (4 компонента, 2 хука/утилиты, 2 иконки, 1 CSS-анимация) переносятся в `src/`.
- Тесты: **Vitest + jsdom + Testing Library 16**, setupTests с моком `matchMedia`.
- Линтинг: **ESLint 9 flat config** (`eslint.config.js`) + Prettier + Stylelint (SCSS).
- Конфиг Vite/Vitest — единый файл `vite.config.ts`; TypeScript — двухуровневый
  (`tsconfig.json` + `tsconfig.node.json`).
- Удалены: `react-scripts`, `web-vitals`, `reportWebVitals.ts`, `.babelrc.json`,
  все storybook-пакеты и документация, CRA-артефакты из `index.html`/`manifest.json`.
