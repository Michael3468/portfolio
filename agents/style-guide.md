# Style Guide

Единый гайд по стилю и архитектуре проекта **Portfolio** (Vite + React 19 + TypeScript).
Правила обязательны для всего нового кода и для рефакторинга существующего.

---

## 1. Общие принципы

- **React 19** с новым JSX-трансформом (`react-jsx`): импорт `React` не требуется.
- **TypeScript strict**: включена строгая типизация (`strict: true`); запрещены неявные
  `any`, неиспользуемые переменные и нечитаемые поля.
- Предпочитаем функциональные компоненты и хуки; классовые компоненты не используются.
- Компоненты декларативные, без побочных эффектов вне `useEffect`.
- Всё новое пишется на русском языке в комментариях и UI-текстах, код и имена — на английском.
- Форматирование — Prettier, линтинг — ESLint 9 (flat config). Перед PR обязателен прогон
  `npm run lint` и `npm run format`.

## 2. Компоненты

Создавай компоненты через **function declaration**:

```tsx
export default function SettingsPage() {
  return <h1>Settings</h1>;
}
```

Запрещено:

- стрелочные функции в качестве компонентов:

  ```tsx
  // ❌ так нельзя
  const SettingsPage = () => <h1>Settings</h1>;
  ```

- устаревший тип `React.FC<>` / `FC<>` — типизируй через параметры функции
  (см. раздел «Пропсы»).

## 3. Пропсы

Для всех компонентов используй **readonly props**.

Интерфейс пропсов экспортируется, имя формируется по имени компонента:
`ComponentNameProps`. Поля объявляются через `readonly`:

```tsx
export interface ButtonProps {
  readonly children: React.ReactNode;
}

export default function Button({ children }: ButtonProps) {
  return <button type="button">{children}</button>;
}
```

Импорт типов из `react` делается явно (`import type { ReactNode } from 'react'`),
без обращения через глобальный `React.`.

## 4. Структура каталогов

### 4.1 Подкомпоненты и переиспользуемые элементы — `UI/`

Мелкие и/или переиспользуемые компоненты выносятся в каталог **`UI/` родительского
компонента**. Например, у компонента `components/Navbar` кнопка переключения темы лежит
в `components/Navbar/UI/ButtonToggleDarkMode.tsx`, а карточка проекта — в
`pages/Projects/UI/Project.tsx`.

### 4.2 Функции — `model/lib.ts`

Утилитарные функции и «бизнес-логика» компонента/страницы выносятся в `model/lib.ts`
родительского каталога. Примеры в проекте:

- `components/Header/model/lib.ts` — `getLetters(text)` для разбивки строки на буквы;
- `pages/Project/model/lib.ts` — `findProjectById(id)`.

### 4.3 Константы — `model/constants.ts`

Локальные константы компонента/страницы выносятся в `model/constants.ts`. Примеры:

- `pages/Project/model/constants.ts` — `BUTTON_GRADIENT`;
- `pages/Projects/UI/model/constants.ts` — `DEFAULT_SHADOW_COLOR`,
  `INNER_SHADOW_COLOR_DARK`.

Общие константы живут в `src/shared/constants` (см. раздел «Константы»).

### 4.4 Реэкспорт через `index.ts`

Подкомпоненты реэкспортируются через **`index.ts` родительского каталога**, а наружу
экспортируются **только из `index.ts`**:

```tsx
// components/Navbar/index.ts
export { default as ButtonToggleDarkMode } from './UI/ButtonToggleDarkMode';
export { default as Navbar } from './Navbar';

// components/index.ts — баррель всех компонентов
export { ButtonToggleDarkMode, Navbar } from './Navbar';
```

Чтобы **избежать циклических импортов**, внутри родителя разрешено импортировать
собственные подкомпоненты напрямую (а не через `../index.ts`):

```tsx
// components/Navbar/Navbar.tsx
import ButtonToggleDarkMode from './UI/ButtonToggleDarkMode'; // ✅ прямой импорт
```

## 5. Доступность

- Всегда добавляй `aria-label`, где нужна (иконки-ссылки, переключатели, кнопки с
  иконками без видимого текста):

  ```tsx
  <button type="button" aria-label="Переключить тему" aria-pressed={isDark}>
    ...
  </button>
  ```

- Используй семантические элементы: `<button>` вместо кликабельного `<div>`,
  `<nav>`, `<li>` для списков, `<h1>`–`<h3>` для заголовков.
- Декоративные иконки помечай `alt=""` + `aria-hidden="true"`, значимые —
  осмысленным `alt`.

## 6. Типы

- Единая нотация **без венгерских префиксов**: `DarkMode`, `ProjectItem`,
  `ProjectsSection` (никаких `TProject`, `IDarkMode`, `typeDarkMode`).
- Поля интерфейсов — `readonly`.
- **Общие типы** выносятся в `src/shared/types` (файл `types.ts`, реэкспорт через
  `index.ts`):

  ```ts
  // src/shared/types/types.ts
  export type DarkMode = 'light' | 'dark';

  export interface ProjectItem {
    readonly id: number;
    readonly title: string;
    readonly skills: string;
    readonly img: string;
    // ...
  }
  ```

- Локальные типы страницы хранятся рядом с ней (например,
  `pages/Projects/Projects.types.ts` с `ProjectsSection`).

## 7. Константы

- **Общие константы** — в `src/shared/constants`:

  - `projectsList.ts` — список проектов;
  - `testTasksList.ts` — список тестовых заданий;
  - `theme.ts` — стили темы (`styles.mainTheme.textShadow`);
  - реэкспорт всех констант — через `src/shared/constants/index.ts`.

- **Локальные константы** — в `model/constants.ts` родительского компонента/страницы.

## 8. Тесты

- **Всегда пиши тесты** для сделанных изменений (Vitest + Testing Library, jsdom).
- Тестовый файл располагается **рядом с модулем** и называется `*.test.tsx` /
  `*.test.ts` (например, `src/components/Navbar/UI/ButtonToggleDarkMode.test.tsx`).
- Покрываем рендер, ключевые атрибуты (`href`, `aria-label`, `alt`), пользовательские
  сценарии (клики, смена маршрута) и чистые функции (`findProjectById` и т.п.).
- В `src/setupTests.ts` подключены матчеры `@testing-library/jest-dom/vitest` и мок
  `window.matchMedia` для компонентов тёмной темы.
- Команды: `npm test` (watch) / `npm run test:run` (однократно).

## 9. Документация

- **Всегда читай `README.md` перед внесением изменений** в проект.
- **Обновляй `README.md`**, если изменения затрагивают структуру, команды, стек или тесты.
- Этот гайд (`agents/style-guide.md`) — источник правил кода; при изменении правил —
  актуализируй и его.

## 10. Чек-лист проверки перед PR

1. `npm run build` — проверка типов (`tsc -b`) + production-сборка.
2. `npm run test:run` — все тесты зелёные.
3. `npm run lint` — ESLint без ошибок.
4. `npm run format` — Prettier отформатировал код.
5. `README.md` актуален; при изменении правил — `agents/style-guide.md`.

## 11. Документация

- **Всегда читай `README.md` перед внесением изменений** в проект.
- **Обновляй `README.md`**, если изменения затрагивают структуру, команды, стек или тесты.
- **Всегда пиши** JSDoc к компонентам React.js и функциям, с @param и @returns и если что-то меняется в функции обновляй JSDoc.
- Эту документацию обновлять не нужно.
