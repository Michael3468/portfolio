# Portfolio

Сайт-портфолио фронтенд-разработчика: главная страница с анимациями, список проектов
и тестовых заданий, детальные страницы проектов и контакты.

Мигрирован с **Create React App (React 18) + Storybook** на **Vite + React 19** без Storybook.
План миграции — [`docs/archive/MIGRATION_PLAN.md`](./docs/archive/MIGRATION_PLAN.md) (архив).
Правила стиля и архитектуры кода — [`agents/style-guide.md`](./agents/style-guide.md).

## Стек

- **Vite** — сборщик и dev-сервер
- **React 19** (`react` / `react-dom`), JSX transform `react-jsx`
- **TypeScript 5.x** — строгая типизация, `moduleResolution: bundler`
- **React Router 7** — роутинг (API v6 сохранён): `/`, `/projects`, `/project/:id`, `/contacts`
- **framer-motion** — анимации (заголовки, буквы, «rubber band» эффект)
- **zustand** — состояние тёмной темы (вместо Recoil, см. раздел «Перенос»)
- **CSS** — глобальные стили и CSS-переменные темы (без препроцессора)
- **Vitest + Testing Library 16** — юнит-тесты (jsdom)
- **ESLint 9 (flat config) + Prettier** — линтинг и форматирование

## Команды

| Команда                 | Описание                                                |
| ----------------------- | ------------------------------------------------------- |
| `npm install`           | Установка зависимостей                                  |
| `npm run dev`           | Dev-сервер Vite (HMR), http://localhost:5173            |
| `npm run build`         | Проверка типов (`tsc -b`) + production-сборка в `dist/` |
| `npm run preview`       | Локальный просмотр production-сборки                    |
| `npm test`              | Запуск тестов (Vitest, watch-режим)                     |
| `npm run test:run`      | Однократный запуск тестов                               |
| `npm run test:coverage` | Coverage report (Vitest + provider v8)                  |
| `npm run lint`          | Проверка ESLint (flat config)                           |
| `npm run lint:fix`      | Автоисправление ESLint                                  |
| `npm run format`        | Форматирование Prettier                                 |

> Требуется Node.js **≥ 20.19** (проверено на Node 24). Версия зафиксирована в `.nvmrc`.

> Импорты вне текущего каталога пишутся через алиас `@` (= `src/`), например
> `import { styles } from '@/shared/constants'`; относительные `./` — только внутри каталога.

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
    ├── store/
    │   ├── darkModeStore.ts       # zustand-стор тёмной темы
    │   └── darkModeStore.test.ts  # тест zustand-стора
    ├── assets/
    │   ├── icons/                 # иконки GitHub / Live Demo
    │   └── styles/                # main.css, reset.css, pulse-animation.css
    ├── hooks/
    │   ├── useLocalStorage.ts     # хук localStorage
    │   ├── useLocalStorage.test.tsx  # тест хука
    │   ├── detectDarkMode.ts      # определение системной темы
    │   └── detectDarkMode.test.ts  # тест хука
    ├── components/
    │   ├── index.ts               # реэкспорт компонентов (баррель)
    │   ├── ScrollToTop/
    │   │   ├── index.tsx          # скролл к началу при смене маршрута
    │   │   └── index.test.tsx
    │   ├── Animations/
    │   │   ├── AnimationScale3d/
    │   │   │   ├── index.tsx     # анимация «rubber band» букв
    │   │   │   └── index.test.tsx
    │   │   └── AnimationText/
    │   │       ├── index.tsx     # анимация слов/букв
    │   │       └── index.test.tsx
    │   ├── ButtonIconWithLink/
    │   │   ├── index.tsx          # кнопка с иконкой
    │   │   ├── index.test.tsx
    │   │   └── styles.css
    │   ├── Footer/
    │   │   ├── index.tsx          # подвал с соцсетями
    │   │   ├── index.test.tsx
    │   │   ├── styles.css
    │   │   └── icons/             # иконки соцсетей
    │   ├── Header/
    │   │   ├── index.tsx          # шапка с анимациями
    │   │   ├── index.test.tsx
    │   │   └── styles.css
    │   └── Navbar/
    │       ├── index.ts           # реэкспорт Navbar и UI/ButtonToggleDarkMode
    │       ├── Navbar.tsx         # навигация (логотип, ссылки, переключатель темы)
    │       ├── Navbar.test.tsx
    │       ├── styles.css
    │       └── UI/
    │           ├── ButtonToggleDarkMode.tsx  # переключатель тёмной темы
    │           ├── ButtonToggleDarkMode.css
    │           ├── ButtonToggleDarkMode.test.tsx
    │           ├── colorMode.css  # CSS-переменные светлой/тёмной темы
    │           ├── moon.svg
    │           └── sun.svg
    ├── pages/
    │   ├── index.ts               # реэкспорт страниц
    │   ├── Home.tsx               # главная (Header + навыки)
    │   ├── Home.test.tsx
    │   ├── Contacts/
    │   │   ├── index.ts           # реэкспорт страницы
    │   │   ├── Contacts.tsx       # страница контактов
    │   │   ├── Contacts.types.ts  # типы ContactItem, ContactLink
    │   │   ├── Contacts.test.tsx
    │   │   ├── model/
    │   │   │   ├── constants.ts   # локальные константы (CONTACTS_LIST)
    │   │   │   └── constants.test.ts
    │   │   └── UI/
    │   │       ├── AnimatedTitle.tsx  # анимированный заголовок
    │   │       ├── ContactItem.tsx    # элемент списка контактов
    │   │       └── index.ts
    │   ├── Project/
    │   │   ├── index.ts           # реэкспорт страницы
    │   │   ├── Project.tsx        # страница проекта
    │   │   ├── Project.test.tsx
    │   │   ├── styles.css
    │   │   └── model/
    │   │       ├── constants.ts   # локальные константы (BUTTON_GRADIENT)
    │   │       ├── lib.ts         # findProjectById(id)
    │   │       └── lib.test.ts
    │   └── Projects/
    │       ├── index.ts           # реэкспорт Projects и UI/Project
    │       ├── Projects.tsx       # страница списка проектов
    │       ├── Projects.styles.css
    │       ├── Projects.types.ts  # тип ProjectsSection
    │       ├── Projects.test.tsx
    │       └── UI/
    │           ├── Project.tsx    # карточка проекта
    │           ├── Project.css
    │           ├── Project.test.tsx
    │           └── model/
    │               ├── constants.ts  # DEFAULT_SHADOW_COLOR, INNER_SHADOW_COLOR_DARK
    │               └── constants.test.ts
    └── shared/
        ├── assets/img/            # изображения проектов
        ├── constants/
        │   ├── index.ts           # реэкспорт констант
        │   ├── projectsList.ts    # список проектов
        │   ├── projectsList.test.ts
        │   ├── testTasksList.ts   # список тестовых заданий
        │   ├── testTasksList.test.ts
        │   └── theme.ts           # стили темы (styles.mainTheme)
        ├── lib/
        │   ├── index.ts           # реэкспорт утилит
        │   ├── text.ts            # getLetters, replaceSpaceWithNbsp
        │   └── text.test.ts
        ├── types/
        │   ├── index.ts           # реэкспорт типов
        │   └── types.ts           # DarkMode, ProjectItem
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
и тесты. По запасному плану из docs/archive/MIGRATION_PLAN.md состояние тёмной темы переведено на
**zustand**. Затронутые файлы: `src/store/darkModeStore.ts`,
`src/components/Navbar/UI/ButtonToggleDarkMode.tsx`, `src/pages/Projects/UI/Project.tsx`,
`src/App.tsx` (убран `RecoilRoot`). Функциональность тёмной темы сохранена:
переключение кнопкой, сохранение в `localStorage`, отслеживание системной схемы.

## Тесты

Тесты запускаются через Vitest (`environment: jsdom`, `setupFiles: ./src/setupTests.ts`).
`src/setupTests.ts` подключает матчеры `@testing-library/jest-dom/vitest` и мок
`window.matchMedia`, необходимый для компонентов тёмной темы в jsdom.

Покрытие тестов — **100%** statements / branches / functions / lines.
Все тесты проходят: **86 тестов в 27 файлах**.

| Модуль                                             | Файл теста                                                  |
| -------------------------------------------------- | ----------------------------------------------------------- |
| `App` (маршрутизация)                              | `src/App.test.tsx`                                          |
| `Navbar`                                           | `src/components/Navbar/Navbar.test.tsx`                     |
| `ButtonToggleDarkMode`                             | `src/components/Navbar/UI/ButtonToggleDarkMode.test.tsx`    |
| `Footer`                                           | `src/components/Footer/index.test.tsx`                      |
| `Header`                                           | `src/components/Header/index.test.tsx`                      |
| `ScrollToTop`                                      | `src/components/ScrollToTop/index.test.tsx`                 |
| `ButtonIconWithLink`                               | `src/components/ButtonIconWithLink/index.test.tsx`          |
| `AnimationScale3d`                                 | `src/components/Animations/AnimationScale3d/index.test.tsx` |
| `AnimationText`                                    | `src/components/Animations/AnimationText/index.test.tsx`    |
| `Home`                                             | `src/pages/Home.test.tsx`                                   |
| `Contacts`                                         | `src/pages/Contacts/Contacts.test.tsx`                      |
| `AnimatedTitle` (`Contacts`)                       | `src/pages/Contacts/UI/AnimatedTitle.test.tsx`              |
| `ContactItem` (`Contacts`)                         | `src/pages/Contacts/UI/ContactItem.test.tsx`                |
| константы `Contacts`                               | `src/pages/Contacts/model/constants.test.ts`                |
| `Projects`                                         | `src/pages/Projects/Projects.test.tsx`                      |
| `Project` (карточка)                               | `src/pages/Projects/UI/Project.test.tsx`                    |
| `DEFAULT_SHADOW_COLOR` / `INNER_SHADOW_COLOR_DARK` | `src/pages/Projects/UI/model/constants.test.ts`             |
| `Project` (страница)                               | `src/pages/Project/Project.test.tsx`                        |
| `findProjectById`                                  | `src/pages/Project/model/lib.test.ts`                       |
| `BUTTON_GRADIENT`                                  | `src/pages/Project/model/constants.test.ts`                 |
| `useLocalStorage`                                  | `src/hooks/useLocalStorage.test.tsx`                        |
| `detectDarkMode`                                   | `src/hooks/detectDarkMode.test.ts`                          |
| `darkModeStore` (zustand-стор)                     | `src/store/darkModeStore.test.ts`                           |
| `theme` (`styles.mainTheme`)                       | `src/shared/constants/theme.test.ts`                        |
| `projectsList`                                     | `src/shared/constants/projectsList.test.ts`                 |
| `testTasksList`                                    | `src/shared/constants/testTasksList.test.ts`                |
| `getLetters` / `replaceSpaceWithNbsp`              | `src/shared/lib/text.test.ts`                               |

Команда запуска (однократно):

```
npm run test:run
```

В watch-режиме — `npm test`.

## Лицензия

Проект является личным портфолио; используемые шрифты и изображения принадлежат их владельцам.
