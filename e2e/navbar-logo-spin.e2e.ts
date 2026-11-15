import { expect, test } from '@playwright/test';

/**
 * Проверяет автоматическое вращение иконки GitHub в хедере:
 * один оборот на 360° против часовой стрелки вокруг вертикальной оси
 * каждые 5 секунд, а также отключение анимации при reduced motion.
 */

test('github logo spins 360 degrees counterclockwise every 5 seconds', async ({ page }) => {
  await page.goto('/');

  const icon = page.locator('.logo__icon');
  await expect(icon).toBeVisible();

  const animation = await icon.evaluate((element) => {
    const [cssAnimation] = element.getAnimations() as CSSAnimation[];
    const effect = cssAnimation?.effect as KeyframeEffect | null;

    if (!effect) return null;

    const timing = effect.getTiming();

    return {
      name: cssAnimation.animationName,
      duration: timing.duration,
      iterations: timing.iterations === Number.POSITIVE_INFINITY ? 'infinite' : timing.iterations,
      keyframes: effect.getKeyframes().map((keyframe) => ({
        offset: keyframe.offset,
        transform: keyframe.transform,
      })),
    };
  });

  expect(animation).not.toBeNull();
  expect(animation?.name).toBe('logo-icon-spin');
  expect(animation?.duration).toBe(5000);
  expect(animation?.iterations).toBe('infinite');

  // Оборот завершается к 20% цикла (через 1 секунду), затем иконка отдыхает.
  const start = animation?.keyframes.find((keyframe) => keyframe.offset === 0);
  const turnEnd = animation?.keyframes.find((keyframe) => keyframe.offset === 0.2);

  expect(start?.transform).toBe('rotateY(0deg)');
  expect(turnEnd?.transform).toBe('rotateY(-360deg)');
});

test('github logo stops its idle spin on hover', async ({ page }) => {
  await page.goto('/');

  const link = page.locator('.logo__github');
  const icon = page.locator('.logo__icon');

  await expect
    .poll(() => icon.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('logo-icon-spin');

  await link.hover();

  await expect
    .poll(() => icon.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('none');
});

test('github logo does not spin when prefers-reduced-motion is set', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const icon = page.locator('.logo__icon');

  await expect(icon).toBeVisible();
  await expect
    .poll(() => icon.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('none');
  expect(await icon.evaluate((element) => element.getAnimations().length)).toBe(0);
});
