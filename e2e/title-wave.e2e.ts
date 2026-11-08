import { expect, test, type Page } from '@playwright/test';

/**
 * E2E-тесты авто-волны заголовков в реальном браузере (chromium + WAAPI).
 *
 * Юнит-тесты AnimationScale3d работают с моками framer-motion и проверяют
 * только передаваемые transition; здесь же проверяется фактическая анимация:
 * буквы заголовка «Contacts» получают настоящие WAAPI-анимации (rubber band
 * по `transform`), у каждой — свой delay. Регрессия, которую ловят тесты:
 * transition.delay у framer-motion задаётся в секундах — если передать туда
 * миллисекунды, в волне будут анимироваться только буквы с нулевой задержкой,
 * а «залипший» флаг isPlaying навсегда отключит hover.
 *
 * Локаторы: заголовок находим по role + accessible name — в `AnimatedTitle`
 * корректный accessible name задаётся через `aria-label` (буквы-спаны
 * декоративные, `aria-hidden`), как в `OrbsTitle`. Сами буквы скрыты от
 * скринридеров, поэтому обращаемся к ним по структуре (`h1 > span`),
 * а не по role.
 */

interface WaveAnimation {
  readonly delay: number;
  readonly duration: number;
}

/** Читает WAAPI-анимации `transform` (rubber band) каждой буквы заголовка. */
async function getWaveAnimations(page: Page): Promise<WaveAnimation[][]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('h1 > span')).map((letter) =>
      Array.from(letter.getAnimations())
        .filter((animation) =>
          (animation.effect as KeyframeEffect | null)
            ?.getKeyframes()
            .some((frame) => 'transform' in frame),
        )
        .map((animation) => {
          const timing = animation.effect?.getTiming();
          return {
            delay: Number(timing?.delay ?? 0),
            duration: Number(timing?.duration ?? 0),
          };
        }),
    ),
  );
}

/** Ждёт появления WAAPI-анимации `transform` у первой буквы заголовка. */
async function waitForWaveTick(page: Page, timeout: number): Promise<void> {
  await page.waitForFunction(
    () => {
      const firstLetter = document.querySelector('h1 > span');
      return Boolean(
        firstLetter
          ?.getAnimations()
          .some((animation) =>
            (animation.effect as KeyframeEffect | null)
              ?.getKeyframes()
              .some((frame) => 'transform' in frame),
          ),
      );
    },
    { timeout },
  );
}

test('auto wave animates every letter with a stagger, alternating direction', async ({ page }) => {
  await page.goto('/contacts');
  // Accessible name заголовка задан через aria-label в AnimatedTitle;
  // проверка заодно охраняет доступность побуквенного заголовка.
  await expect(page.getByRole('heading', { level: 1, name: 'Contacts' })).toBeVisible();

  // Тик 1: волна слева направо — задержки 0, 60, …, 420 мс
  await waitForWaveTick(page, 15_000);

  const forwardWaves = await getWaveAnimations(page);
  // В момент тика у каждой из 8 букв создана ровно одна rubber-band анимация
  expect(forwardWaves.map((animations) => animations.length)).toEqual(Array(8).fill(1));
  expect(forwardWaves.every((list) => Math.round(list[0].duration) === 1000)).toBe(true);
  forwardWaves.forEach((list, index) => {
    // Допуск ±60 мс — на время между срабатыванием интервала и сэмплом
    expect(Math.abs(list[0].delay - index * 60)).toBeLessThanOrEqual(60);
  });

  // Тик 2: волна справа налево — задержки зеркально отражаются
  await page.waitForFunction(
    () => {
      const firstLetter = document.querySelector('h1 > span');
      return Array.from(firstLetter?.getAnimations() ?? []).some(
        (animation) => Number(animation.effect?.getTiming().delay ?? 0) > 200,
      );
    },
    { timeout: 15_000 },
  );

  const backwardWaves = await getWaveAnimations(page);
  const expectedBackwardDelays = [420, 360, 300, 240, 180, 120, 60, 0];
  expect(backwardWaves.map((animations) => animations.length)).toEqual(Array(8).fill(1));
  backwardWaves.forEach((list, index) => {
    expect(Math.abs(list[0].delay - expectedBackwardDelays[index])).toBeLessThanOrEqual(60);
  });

  // Волны завершаются — и hover по средней букве по-прежнему работает
  // (регрессия «залипшего» isPlaying после отложенных анимаций волны)
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll('h1 > span')).every(
        (letter) =>
          !letter
            .getAnimations()
            .some((animation) =>
              (animation.effect as KeyframeEffect | null)
                ?.getKeyframes()
                .some((frame) => 'transform' in frame),
            ),
      ),
    { timeout: 10_000 },
  );

  await page.locator('h1 > span').nth(3).hover();
  await page.waitForFunction(
    () => {
      const letter = document.querySelectorAll('h1 > span')[3];
      return letter?.getAnimations().some((animation) => {
        if (animation.playState !== 'running') {
          return false;
        }
        return (
          (animation.effect as KeyframeEffect | null)
            ?.getKeyframes()
            .some((frame) => 'transform' in frame) ?? false
        );
      });
    },
    { timeout: 5_000 },
  );
});

test('prefers-reduced-motion disables the auto wave', async ({ page }) => {
  // Фейковые часы: интервал волны детерминированно промотается без
  // реального ожидания (в отличие от page.waitForTimeout).
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contacts');
  await expect(page.getByRole('heading', { level: 1, name: 'Contacts' })).toBeVisible();

  // Промотали больше TITLE_WAVE_INTERVAL_MS (10 с) — тик волны должен был
  // произойти, но при reduced motion он не запускается.
  await page.clock.runFor(11_000);

  const waves = await getWaveAnimations(page);
  expect(waves.every((animations) => animations.length === 0)).toBe(true);
});
