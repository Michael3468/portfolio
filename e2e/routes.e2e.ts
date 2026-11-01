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

test('projects page lists projects and test tasks', async ({ page }) => {
  await page.goto('/projects');

  await expect(page).toHaveTitle('Projects — Portfolio');
  await expect(page.locator('a[href="/project/15"]')).toBeVisible();
  await expect(page.locator('a[href="/project/29"]')).toBeVisible();
});

test('navigating from a project card opens the project page', async ({ page }) => {
  await page.goto('/projects');

  await page.locator('a[href="/project/15"]').click();

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
  await expect(page.locator('a[href="/project/15"]')).toBeVisible();
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
