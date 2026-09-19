# Portfolio

Сайт-портфолио фронтенд-разработчика: главная страница с анимациями, список проектов
и тестовых заданий, детальные страницы проектов и контакты.

Мигрирован с **Create React App (React 18) + Storybook** на **Vite + React 19** без Storybook.
План миграции — [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md).
Правила стиля и архитектуры кода — [`docs/style-guide.md`](./docs/style-guide.md).

## Стек

- **Vite** — сборщик и dev-сервер
- **React 19** (`react` / `react-dom`), JSX transform `react-jsx`
- **TypeScript 5.x** — строгая типизация, `moduleResolution: bundler`
- **React Router 7** — роутинг (API v6 сохранён): `/`, `/projects`, `/project/:id`, `/contacts`
- **framer-motion** — анимации (заголовки, буквы, «rubber band» эффект)
- **zustand** — состояние тёмной темы (вместо Recoil, см. раздел «Перенос»)
- **SCSS / CSS** — компиляция через dart-sass (modern API), глобальные стили, CSS-переменные темы
- **Vitest + Testing Library 16** — юнит-тесты (jsdom)
- **ESLint 9 (flat config) + Prettier** — линтинг и форматирование

## Команды

| Команда            | Описание                                                |
| ------------------ | ------------------------------------------------------- |
| `npm install`      | Установка зависимостей                                  |
| `npm run dev`      | Dev-сервер Vite (HMR), http://localhost:5173            |
| `npm run build`    | Проверка типов (`tsc -b`) + production-сборка в `dist/` |
| `npm run preview`  | Локальный просмотр production-сборки                    |
| `npm test`         | Запуск тестов (Vitest, watch-режим)                     |
| `npm run test:run` | Однократный запуск тестов                               |
| `npm run lint`     | Проверка ESLint (flat config)                           |
| `npm run lint:fix` | Автоисправление ESLint                                  |
| `npm run format`   | Форматирование Prettier                                 |

> Требуется Node.js **≥ 20.19** (проверено на Node 24). Версия зафиксирована в `.nvmrc`.

## Структура проекта

```
portfolio/
├── index.html                     # точка входа Vite (в корне)
├── vite.config.ts                 # Vite + React plugin + alias @ + Vitest config
├── tsconfig.json                  # корневой (references)
├── tsconfig.app.json              # конфиг приложения (src)
├── tsconfig.node.json             # конфиг для vite.config.ts
├── eslint.config.js               # ESLint 9 flat config
├── .prettierrc                    # конфиг Prettier (перенесён из исходника)
├── .gitignore
├── .nvmrc
├── public/                        # favicon, логотипы, manifest.json, robots.txt
└── src/
    ├── main.tsx                   # точка входа приложения (бывший index.tsx)
    ├── App.tsx                    # маршрутизация (BrowserRouter + Routes)
    ├── App.test.tsx               # тест приложения (Vitest + Testing Library)
    ├── setupTests.ts              # jest-dom + мок window.matchMedia
    ├── vite-env.d.ts              # типы Vite (бывший react-app-env.d.ts)
    ├── types.ts                   # реэкспорт общих типов из shared/types (DarkMode, ProjectItem)
    ├── atoms/
    │   └── darkModeState.ts       # zustand-стор тёмной темы
    ├── assets/
    │   ├── icons/                 # иконки GitHub / Live Demo (из stories)
    │   └── styles/                # main.css, reset.css, pulse-animation.css
    ├── hooks/
    │   ├── useLocalStorage.ts     # хук localStorage (из stories)
    │   └── detectDarkMode.ts      # определение системной темы (из stories)
    ├── components/
    │   ├── index.ts               # реэкспорт компонентов (баррель)
    │   ├── ScrollToTop/           # скролл к началу при смене маршрута
    │   ├── Animations/
    │   │   ├── AnimationScale3d/  # анимация букв
    │   │   └── AnimationText/     # анимация слов/букв
    │   ├── ButtonIconWithLink/    # кнопка с иконкой
    │   ├── Footer/                # подвал с соцсетями
    │   ├── Header/                # шапка с анимациями (+ model/lib.ts)
    │   └── Navbar/
    │       ├── index.ts           # реэкспорт Navbar и UI/ButtonToggleDarkMode
    │       ├── Navbar.tsx         # навигация (логотип, ссылки, переключатель темы)
    │       └── UI/
    │           └── ButtonToggleDarkMode.tsx  # переключатель тёмной темы
    ├── pages/
    │   ├── index.ts               # реэкспорт страниц
    │   ├── Home.tsx               # главная (Header + навыки)
    │   ├── Contacts/              # контакты
    │   │   ├── index.ts           # реэкспорт страницы
    │   │   ├── Contacts.tsx       # страница контактов
    │   │   ├── Contacts.types.ts  # типы ContactItem, ContactLink
    │   │   ├── model/
    │   │   │   ├── constants.ts   # локальные константы (CONTACTS_LIST)
    │   │   │   └── lib.ts         # getLetters, replaceSpaceWithNbsp
    │   │   └── UI/
    │   │       ├── AnimatedTitle.tsx  # анимированный заголовок
    │   │       └── ContactItem.tsx    # элемент списка контактов
    │   ├── Project/               # детальная страница проекта
    │   │   ├── index.ts           # реэкспорт страницы
    │   │   ├── Project.tsx        # страница проекта
    │   │   └── model/
    │   │       ├── constants.ts   # локальные константы (BUTTON_GRADIENT)
    │   │       └── lib.ts         # findProjectById(id)
    │   └── Projects/              # список проектов
    │       ├── index.ts           # реэкспорт Projects и UI/Project
    │       ├── Projects.tsx       # страница списка проектов
    │       ├── Projects.types.ts  # тип ProjectsSection
    │       ├── model/lib.ts       # getLetters(text)
    │       └── UI/
    │           ├── Project.tsx    # карточка проекта
    │           └── model/
    │               └── constants.ts  # DEFAULT_SHADOW_COLOR, INNER_SHADOW_COLOR_DARK
    └── shared/
        ├── assets/img/            # изображения проектов
        ├── constants/
        │   ├── index.ts           # реэкспорт констант
        │   ├── projectsList.ts    # список проектов
        │   ├── testTasksList.ts   # список тестовых заданий
        │   └── theme.ts           # стили темы (styles.mainTheme)
        └── types/
            ├── index.ts           # реэкспорт типов
            └── types.ts           # DarkMode, ProjectItem
```

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
и тесты. По запасному плану из MIGRATION_PLAN.md состояние тёмной темы переведено на
**zustand**. Затронутые файлы: `src/atoms/darkModeState.ts`,
`src/components/Navbar/UI/ButtonToggleDarkMode.tsx`, `src/pages/Projects/UI/Project.tsx`,
`src/App.tsx` (убран `RecoilRoot`). Функциональность тёмной темы сохранена:
переключение кнопкой, сохранение в `localStorage`, отслеживание системной схемы.

## Тесты

Тесты запускаются через Vitest (`environment: jsdom`, `setupFiles: ./src/setupTests.ts`).
`src/setupTests.ts` подключает матчеры `@testing-library/jest-dom/vitest` и мок
`window.matchMedia`, необходимый для компонентов тёмной темы в jsdom.

Покрытые модули (~39 тестов в 16 файлах):

| Модуль                         | Файл теста                                               |
| ------------------------------ | -------------------------------------------------------- |
| `App` (маршрутизация)          | `src/App.test.tsx`                                       |
| `Navbar`                       | `src/components/Navbar/Navbar.test.tsx`                  |
| `ButtonToggleDarkMode`         | `src/components/Navbar/UI/ButtonToggleDarkMode.test.tsx` |
| `Footer`                       | `src/components/Footer/index.test.tsx`                   |
| `Header`                       | `src/components/Header/index.test.tsx`                   |
| `ScrollToTop`                  | `src/components/ScrollToTop/index.test.tsx`              |
| `ButtonIconWithLink`           | `src/components/ButtonIconWithLink/index.test.tsx`       |
| `Home`                         | `src/pages/Home.test.tsx`                                |
| `Contacts`                     | `src/pages/Contacts.test.tsx`                            |
| `Projects`                     | `src/pages/Projects/Projects.test.tsx`                   |
| `Project` (карточка)           | `src/pages/Projects/UI/Project.test.tsx`                 |
| `Project` (страница)           | `src/pages/Project/Project.test.tsx`                     |
| `findProjectById`              | `src/pages/Project/model/lib.test.ts`                    |
| `useLocalStorage`              | `src/hooks/useLocalStorage.test.tsx`                     |
| `detectDarkMode`               | `src/hooks/detectDarkMode.test.ts`                       |
| `darkModeState` (zustand-стор) | `src/atoms/darkModeState.test.ts`                        |

Команда запуска (однократно):

```
npm run test:run
```

В watch-режиме — `npm test`.

## Лицензия

Проект является личным портфолио; используемые шрифты и изображения принадлежат их владельцам.
