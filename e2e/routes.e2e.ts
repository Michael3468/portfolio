import { expect, test } from '@playwright/test';

/**
 * Smoke-тесты роутинга и ключевых сценариев на собранном сайте.
 * Проверяют, что страницы открываются, переходы работают, а тема сохраняется.
 */

test.beforeEach(({ page }, testInfo) => {
  // Ошибки, которые не перехвачены React (uncaught), считаем падением теста
  page.on('pageerror', (error) => {
    testInfo.fail(true, `Uncaught error: ${error.message}`);
  });
});

test('home page renders with its own title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Portfolio — Mikhail, frontend developer');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frontend' })).toBeVisible();
});

test('skill background follows the mouse only horizontally and much slower', async ({ page }) => {
  await page.goto('/');

  const layer = page.locator('.skill-background__layer');
  const tiles = page.locator('.skill-background__tile');

  expect(await tiles.count()).toBeGreaterThan(0);
  await expect(tiles.first()).toHaveAttribute('src', /\.svg$/);

  await page.mouse.move(300, 300);
  await page.mouse.move(600, 450, { steps: 10 });

  // Курсор прошёл 300px по X — слой проходит 15px. Смещение по Y игнорируется.
  await expect
    .poll(() => layer.evaluate((element) => element.style.transform))
    .toBe('translate3d(15px, 0px, 0px)');
});

test('skill icons keep falling while the mouse moves', async ({ page }) => {
  await page.goto('/');

  const tile = page.locator('.skill-background__tile').first();
  const getY = (element: Element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;

  const startY = await tile.evaluate(getY);

  await expect.poll(() => tile.evaluate(getY), { timeout: 3000 }).toBeGreaterThan(startY);

  // Иконка продолжает падать, пока курсор двигается.
  const beforeMoveY = await tile.evaluate(getY);
  await page.mouse.move(300, 300);
  await page.mouse.move(500, 350, { steps: 10 });

  await expect.poll(() => tile.evaluate(getY), { timeout: 3000 }).toBeGreaterThan(beforeMoveY);
});

test('projects page lists projects and test tasks', async ({ page }) => {
  await page.goto('/projects');

  await expect(page).toHaveTitle('Projects — Portfolio');
  // В слайдере три копии ленты, и ссылки в крайних копиях помечены aria-hidden.
  // Берём карточку из основной (видимой) копии.
  await expect(page.locator('li:not([aria-hidden="true"]) a[href="/project/15"]')).toBeVisible();
  await expect(page.locator('li:not([aria-hidden="true"]) a[href="/project/29"]')).toBeVisible();
});

test('hidden slider copies are inert and cannot take focus', async ({ page }) => {
  await page.goto('/projects');

  // Крайние копии ленты скрыты от скринридеров и должны быть inert,
  // иначе их ссылки остаются в tab-порядке.
  const hiddenCopy = page.locator('li[aria-hidden="true"]').first();
  await expect(hiddenCopy).toHaveAttribute('inert');

  const hiddenLink = hiddenCopy.locator('a').first();
  await hiddenLink.evaluate((element) => element.focus());
  await expect(hiddenLink).not.toBeFocused();
});

test('keyboard focus on a slider card shows a visible focus ring', async ({ page }) => {
  await page.goto('/projects');

  const slider = page.locator('.projects-slider').first();
  const prevArrow = slider.getByRole('button', { name: 'Предыдущий проект' });
  const focusedCard = page.locator('.project:has(a:focus-visible)');

  // Ставим фокус на левую стрелку и переходим Tab'ом на первую видимую карточку.
  await prevArrow.focus();
  await page.keyboard.press('Tab');

  await expect(focusedCard).toHaveCount(1);

  // Рамка рисуется псевдоэлементом поверх карточки: собственный outline
  // ссылки обрезается из-за overflow: hidden у .project.
  const ring = await focusedCard.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      content: style.content,
      borderWidth: style.borderTopWidth,
      borderStyle: style.borderTopStyle,
    };
  });

  expect(ring.content).not.toBe('none');
  expect(ring.borderWidth).toBe('2px');
  expect(ring.borderStyle).toBe('solid');
});

test('tab walks only through visible slider cards, in visual order', async ({ page }) => {
  await page.goto('/projects');

  const slider = page.locator('.projects-slider').first();
  const prevArrow = slider.getByRole('button', { name: 'Предыдущий проект' });
  const nextArrow = slider.getByRole('button', { name: 'Следующий проект' });

  await prevArrow.focus();

  const focusedCards: string[] = [];
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      return {
        href: element?.getAttribute('href') ?? '',
        isCard: Boolean(element?.closest('.project')),
        isVisible: Boolean(element?.closest('.project:not([aria-hidden="true"])')),
      };
    });

    expect(focused.isCard).toBe(true);
    expect(focused.isVisible).toBe(true);
    focusedCards.push(focused.href);
  }

  // Все три карточки разные, а следующий Tab уходит на правую стрелку.
  expect(new Set(focusedCards).size).toBe(3);
  await page.keyboard.press('Tab');
  await expect(nextArrow).toBeFocused();

  // В обратную сторону: правая стрелка → третья, вторая, первая карточка → левая стрелка.
  const reversedCards: string[] = [];
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press('Shift+Tab');
    reversedCards.push(
      await page.evaluate(
        () => (document.activeElement as HTMLElement | null)?.getAttribute('href') ?? '',
      ),
    );
  }

  expect(reversedCards).toEqual([...focusedCards].reverse());
  await page.keyboard.press('Shift+Tab');
  await expect(prevArrow).toBeFocused();
});

test('autoplay pauses while a visible card is focused and resumes on an arrow', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/projects');

  const slider = page.locator('.projects-slider').first();
  const activeDot = slider.locator('.projects-slider__dot[aria-current="true"]');
  const nextArrow = slider.getByRole('button', { name: 'Следующий проект' });

  await slider.getByRole('button', { name: 'Предыдущий проект' }).focus();
  await page.keyboard.press('Tab');

  const activeBefore = await activeDot.getAttribute('aria-label');

  // Пока фокус на карточке, автопрокрутка остановлена.
  await page.clock.runFor(6000);
  await expect(activeDot).toHaveAttribute('aria-label', activeBefore ?? '');

  // После ухода фокуса на стрелку отсчёт начинается заново.
  await nextArrow.focus();
  await page.clock.runFor(5000);

  await expect(activeDot).not.toHaveAttribute('aria-label', activeBefore ?? '');
});

test('navigating from a project card opens the project page', async ({ page }) => {
  await page.goto('/projects');

  await page.locator('li:not([aria-hidden="true"]) a[href="/project/15"]').click();

  await expect(page).toHaveURL('/project/15');
  await expect(page.getByRole('heading', { level: 1, name: 'React Landing' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'GitHub' })).toBeVisible();
});

test('contacts page is reachable from the navbar', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Contacts' }).click();

  await expect(page).toHaveURL('/contacts');
  await expect(page).toHaveTitle('Contacts — Portfolio');
});

test('contacts page is closed from indexing and shows open contacts', async ({ page }) => {
  await page.goto('/contacts');

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.getByRole('link', { name: '@mikhail3468' })).toHaveAttribute('rel', 'nofollow');
  await expect(page.getByRole('link', { name: 'mikhail3468@yandex.ru' })).toHaveAttribute(
    'href',
    'mailto:mikhail3468@yandex.ru',
  );
});

test('unknown project id shows the not-found message', async ({ page }) => {
  await page.goto('/project/999');

  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(page.getByText('Проект не найден')).toBeVisible();
});

test('unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');

  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await page.getByRole('link', { name: 'На главную' }).click();
  await expect(page).toHaveURL('/');
});

test('direct visit to a deep link works without client-side navigation', async ({ page }) => {
  await page.goto('/projects');

  await expect(page).toHaveTitle('Projects — Portfolio');
  // В слайдере три копии ленты, и ссылки в крайних копиях помечены aria-hidden.
  // Берём карточку из основной (видимой) копии.
  await expect(page.locator('li:not([aria-hidden="true"]) a[href="/project/15"]')).toBeVisible();
});

test('dark theme is applied on load and survives a reload', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('darkMode', 'dark'));
  await page.goto('/');

  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('theme toggle switches to light and persists the choice', async ({ page }) => {
  // Выставляем тему только при первой загрузке, иначе reload сбросит выбор пользователя
  await page.addInitScript(() => {
    if (localStorage.getItem('darkMode') === null) localStorage.setItem('darkMode', 'dark');
  });
  await page.goto('/');

  await page.getByRole('button', { name: 'Переключить тему' }).click();

  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#c1c1c1');

  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
