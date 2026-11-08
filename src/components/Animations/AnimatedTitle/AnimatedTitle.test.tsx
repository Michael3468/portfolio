import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AnimatedTitle from './AnimatedTitle';
import { TITLE_WAVE_INTERVAL_MS, TITLE_WAVE_STAGGER_MS } from './model/constants';

/**
 * Хранилище мок-пропсов: каждый рендер мокнутого AnimationScale3d
 * добавляет сюда props буквы (playSignal, waveDelay).
 */
const mocks = vi.hoisted(() => ({
  letters: [] as Array<{ playSignal?: number; waveDelay?: number }>,
}));

/**
 * Мок компонента анимации: заменяем `AnimationScale3d` на простой `span`,
 * запоминая переданные пропсы, чтобы проверять запуски волны и задержки букв.
 * Проп `decorative` транслируется в `aria-hidden`, чтобы тестировать
 * доступность заголовка.
 */
vi.mock('../AnimationScale3d', async () => {
  const ReactModule = await import('react');

  return {
    default: (props: {
      children?: ReactNode;
      playSignal?: number;
      waveDelay?: number;
      decorative?: boolean;
    }) => {
      mocks.letters.push({ playSignal: props.playSignal, waveDelay: props.waveDelay });
      return ReactModule.createElement(
        'span',
        { 'aria-hidden': props.decorative || undefined },
        props.children,
      );
    },
  };
});

/**
 * Набор тестов для анимированного заголовка страницы.
 * Проверяет рендер заголовка, развёртывание текста на элементы,
 * замену пробелов на неразрывные, уровень заголовка и автозапуск волны.
 */
describe('AnimatedTitle', () => {
  beforeEach(() => {
    mocks.letters.length = 0;
  });

  /**
   * Проверяет, что заголовок рендерится как заголовок первого уровня
   * и содержит переданный текст.
   */
  it('renders the title as a level-one heading', () => {
    render(<AnimatedTitle title="Contacts" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Contacts');
  });

  /**
   * Проверяет доступность заголовка: корректный accessible name задаётся
   * через `aria-label` с полным текстом, а отдельные буквы-спаны скрыты
   * от скринридеров (`aria-hidden`), как в компоненте `OrbsTitle`.
   */
  it('exposes the full title via aria-label and hides the letters from screen readers', () => {
    const { container } = render(<AnimatedTitle title="Contacts" />);

    const heading = screen.getByRole('heading', { level: 1, name: 'Contacts' });
    expect(heading).toHaveAttribute('aria-label', 'Contacts');

    const letters = container.querySelectorAll('h1 > span');
    expect(letters).toHaveLength(8);
    expect(
      Array.from(letters).every((letter) => letter.getAttribute('aria-hidden') === 'true'),
    ).toBe(true);
  });

  /**
   * Проверяет, что заголовок можно отрендерить как заголовок второго уровня.
   */
  it('renders as a level-two heading when the as prop is h2', () => {
    render(<AnimatedTitle as="h2" title="PROJECTS" />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('PROJECTS');
  });

  /**
   * Проверяет, что каждая буква заголовка оборачивается
   * в отдельный анимированный элемент.
   */
  it('renders one animation element per letter of the title', () => {
    const { container } = render(<AnimatedTitle title="Hi" />);

    const animations = container.querySelectorAll('h1 > span');
    expect(animations).toHaveLength(2);
  });

  /**
   * Проверяет, что пробелы в заголовке заменяются на неразрывные пробелы (\u00A0).
   */
  it('replaces spaces with non-breaking spaces', () => {
    const { container } = render(<AnimatedTitle title="Test Task" />);

    const animations = Array.from(container.querySelectorAll('h1 > span'));
    expect(animations).toHaveLength(9);

    // Символ пробела в строке 'Test Task' имеет индекс 4 и заменяется на nbsp
    expect(animations[4].textContent).toBe('\u00A0');
  });

  /**
   * Набор тестов автозапуска волны: используются фейковые таймеры,
   * чтобы не ждать 10 секунд между тиками.
   */
  describe('auto wave', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      mocks.letters.length = 0;
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    /**
     * Проверяет, что каждые 10 секунд запускается волна анимации и что
     * направление волны чередуется: первый тик — слева направо,
     * второй — справа налево.
     */
    it('runs the wave every 10 seconds alternating direction', () => {
      render(<AnimatedTitle title="AB" />);

      // До первого тика волна не запускалась
      expect(mocks.letters.every((letter) => letter.playSignal === 0)).toBe(true);

      // Первый тик: волна слева направо (первая буква сразу, вторая с задержкой)
      act(() => {
        vi.advanceTimersByTime(TITLE_WAVE_INTERVAL_MS);
      });
      let wave = mocks.letters.slice(-2);
      expect(wave.map((letter) => letter.playSignal)).toEqual([1, 1]);
      expect(wave.map((letter) => letter.waveDelay)).toEqual([0, TITLE_WAVE_STAGGER_MS]);

      // Второй тик: волна справа налево (задержки зеркально отражаются)
      act(() => {
        vi.advanceTimersByTime(TITLE_WAVE_INTERVAL_MS);
      });
      wave = mocks.letters.slice(-2);
      expect(wave.map((letter) => letter.playSignal)).toEqual([2, 2]);
      expect(wave.map((letter) => letter.waveDelay)).toEqual([TITLE_WAVE_STAGGER_MS, 0]);
    });

    /**
     * Проверяет участие ВСЕХ букв многословного заголовка: «TEST TASKS»
     * содержит 10 символов (включая пробел), и на первом тике каждая буква —
     * от первой до последней — получает строго возрастающую задержку волны,
     * а на втором тике — зеркально убывающую (волна идёт обратно).
     */
    it('animates every letter of a multi-word title on each tick', () => {
      const title = 'TEST TASKS';
      render(<AnimatedTitle as="h2" title={title} />);

      // Первый тик: волна слева направо — каждая буква получает свой сигнал
      // и строго возрастающую задержку от первой буквы к последней
      act(() => {
        vi.advanceTimersByTime(TITLE_WAVE_INTERVAL_MS);
      });
      let wave = mocks.letters.slice(-title.length);
      expect(wave).toHaveLength(title.length);
      expect(wave.map((letter) => letter.playSignal)).toEqual(
        Array.from({ length: title.length }, () => 1),
      );
      expect(wave.map((letter) => letter.waveDelay)).toEqual(
        Array.from({ length: title.length }, (_, index) => index * TITLE_WAVE_STAGGER_MS),
      );

      // Второй тик: волна справа налево — задержки зеркально отражаются,
      // последняя буква стартует сразу, первая — последней
      act(() => {
        vi.advanceTimersByTime(TITLE_WAVE_INTERVAL_MS);
      });
      wave = mocks.letters.slice(-title.length);
      expect(wave).toHaveLength(title.length);
      expect(wave.map((letter) => letter.playSignal)).toEqual(
        Array.from({ length: title.length }, () => 2),
      );
      expect(wave.map((letter) => letter.waveDelay)).toEqual(
        Array.from(
          { length: title.length },
          (_, index) => (title.length - 1 - index) * TITLE_WAVE_STAGGER_MS,
        ),
      );
    });

    /**
     * Проверяет, что при prefers-reduced-motion: reduce автозапуск волны
     * не включается вовсе.
     */
    it('does not run the wave when prefers-reduced-motion is set', () => {
      const matchMediaSpy = vi
        .spyOn(window, 'matchMedia')
        .mockReturnValue({ matches: true } as MediaQueryList);

      try {
        render(<AnimatedTitle title="AB" />);

        act(() => {
          vi.advanceTimersByTime(TITLE_WAVE_INTERVAL_MS * 3);
        });

        expect(mocks.letters.every((letter) => letter.playSignal === 0)).toBe(true);
      } finally {
        matchMediaSpy.mockRestore();
      }
    });
  });
});
