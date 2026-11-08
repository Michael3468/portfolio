import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AnimationScale3d from './index';

/**
 * Хранилище мок-объектов framer-motion: мок-метод `start` контролов
 * и колбэки, которые компонент передаёт в `m.span`.
 */
const mocks = vi.hoisted(() => {
  const start = vi.fn();

  return {
    start,
    // Объект контролов стабилен между рендерами, как в реальном framer-motion
    controls: { start },
    callbacks: {} as {
      onMouseOver?: () => void;
      onMouseLeave?: () => void;
      onAnimationComplete?: () => void;
    },
  };
});

// Мок framer-motion: заменяем m.span обычным span, сохраняя обработчики
// событий, а useAnimationControls — объектом с мок-методом start.
vi.mock('framer-motion', async () => {
  const ReactModule = await import('react');

  return {
    m: {
      span: (props: Record<string, unknown>) => {
        const { children, onAnimationComplete, ...rest } = props;
        delete rest.animate;

        mocks.callbacks.onMouseOver = rest.onMouseOver as (() => void) | undefined;
        mocks.callbacks.onMouseLeave = rest.onMouseLeave as (() => void) | undefined;
        mocks.callbacks.onAnimationComplete = onAnimationComplete as (() => void) | undefined;

        return ReactModule.createElement('span', rest, children as ReactNode);
      },
    },
    useAnimationControls: () => mocks.controls,
  };
});

/**
 * Набор тестов для компонента анимации «rubber band» (AnimationScale3d).
 * Проверяет рендеринг дочернего содержимого, запуск анимации по наведению
 * мыши, автоматический запуск при установке флага startOnInit и сброс
 * флага воспроизведения по колбэку onAnimationComplete.
 */
describe('AnimationScale3d', () => {
  beforeEach(() => {
    mocks.start.mockClear();
    mocks.callbacks.onMouseOver = undefined;
    mocks.callbacks.onMouseLeave = undefined;
    mocks.callbacks.onAnimationComplete = undefined;
  });

  /**
   * Проверяет, что компонент рендерит переданное дочернее содержимое
   * и применяет базовые стили инлайн-блока с курсором-указателем.
   */
  it('renders its children with the inline-block styles', () => {
    render(<AnimationScale3d>Hello</AnimationScale3d>);

    const element = screen.getByText('Hello');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ display: 'inline-block', cursor: 'pointer' });
  });

  /**
   * Проверяет, что наведение курсора запускает анимацию без ошибок.
   */
  it('starts the animation on mouse over', () => {
    render(<AnimationScale3d>Hello</AnimationScale3d>);

    const element = screen.getByText('Hello');
    expect(() => fireEvent.mouseOver(element)).not.toThrow();
  });

  /**
   * Проверяет, что при установленном флаге startOnInit анимация
   * запускается автоматически и дети корректно отображаются.
   */
  it('starts the animation on init when startOnInit is set', () => {
    render(
      <AnimationScale3d startOnInit>
        <span>Child</span>
      </AnimationScale3d>,
    );

    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(mocks.start).toHaveBeenCalled();
  });

  /**
   * Проверяет механику флага isPlaying: пока анимация «играет», повторное
   * наведение не запускает её, а после вызова onAnimationComplete флаг
   * сбрасывается и наведение снова запускает анимацию.
   */
  it('restarts the animation after onAnimationComplete resets the playing flag', () => {
    render(<AnimationScale3d>Hello</AnimationScale3d>);

    const element = screen.getByText('Hello');

    fireEvent.mouseOver(element);
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Повторное наведение во время «играющей» анимации игнорируется
    fireEvent.mouseOver(element);
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Завершение анимации сбрасывает флаг isPlaying
    act(() => {
      mocks.callbacks.onAnimationComplete?.();
    });

    fireEvent.mouseOver(element);
    expect(mocks.start).toHaveBeenCalledTimes(2);
  });

  /**
   * Проверяет, что при монтировании без пропса playSignal анимация
   * автоматически не запускается: работает только запуск по наведению.
   */
  it('does not start the animation on mount without playSignal', () => {
    render(<AnimationScale3d>Hello</AnimationScale3d>);

    expect(mocks.start).not.toHaveBeenCalled();
  });

  /**
   * Проверяет, что нулевой сигнал playSignal (волна ещё не запускалась)
   * не запускает анимацию при монтировании.
   */
  it('does not start the animation while playSignal is 0', () => {
    render(
      <AnimationScale3d playSignal={0} waveDelay={100}>
        Hello
      </AnimationScale3d>,
    );

    expect(mocks.start).not.toHaveBeenCalled();
  });

  /**
   * Проверяет, что увеличение счётчика playSignal запускает анимацию волны
   * с задержкой waveDelay, передаваемой в transition вызова controls.start.
   *
   * Регрессионный тест на баг единиц: transition у framer-motion задаёт
   * delay в СЕКУНДАХ, а проп waveDelay приходит в миллисекундах, поэтому
   * компонент обязан конвертировать его (120 мс → 0.12 c). Раньше delay
   * передавался «как есть» (120), и в реальном браузере буква ждала
   * анимацию 2 минуты — в волне двигались только буквы с нулевой
   * задержкой, а навсегда «залипший» флаг isPlaying убивал hover.
   */
  it('starts the wave when playSignal increases, converting waveDelay ms to seconds', () => {
    const { rerender } = render(
      <AnimationScale3d playSignal={0} waveDelay={120}>
        Hello
      </AnimationScale3d>,
    );
    expect(mocks.start).not.toHaveBeenCalled();

    rerender(
      <AnimationScale3d playSignal={1} waveDelay={120}>
        Hello
      </AnimationScale3d>,
    );

    expect(mocks.start).toHaveBeenCalledTimes(1);
    expect(mocks.start.mock.calls[0][0].transition.delay).toBeCloseTo(0.12);
  });

  /**
   * Проверяет конвертацию единиц для большой задержки волны: хвост длинного
   * заголовка («TEST TASKS», буква 420 мс) не должен превращаться в 420 секунд.
   */
  it('converts large waveDelay values to seconds', () => {
    const { rerender } = render(
      <AnimationScale3d playSignal={0} waveDelay={420}>
        Hello
      </AnimationScale3d>,
    );

    rerender(
      <AnimationScale3d playSignal={1} waveDelay={420}>
        Hello
      </AnimationScale3d>,
    );

    expect(mocks.start).toHaveBeenCalledTimes(1);
    expect(mocks.start.mock.calls[0][0].transition.delay).toBeCloseTo(0.42);
  });

  /**
   * Проверяет, что без пропса waveDelay волна запускается без задержки
   * (delay = 0 в transition).
   */
  it('starts the wave without delay when waveDelay is omitted', () => {
    const { rerender } = render(<AnimationScale3d playSignal={0}>Hello</AnimationScale3d>);

    rerender(<AnimationScale3d playSignal={1}>Hello</AnimationScale3d>);

    expect(mocks.start).toHaveBeenCalledTimes(1);
    expect(mocks.start.mock.calls[0][0].transition.delay).toBe(0);
  });

  /**
   * Проверяет, что во время автозапуска волны флаг isPlaying активен:
   * наведение не запускает анимацию повторно, а после onAnimationComplete
   * наведение снова работает.
   */
  it('keeps the isPlaying guard after the wave start', () => {
    const { rerender } = render(<AnimationScale3d playSignal={0}>Hello</AnimationScale3d>);

    rerender(<AnimationScale3d playSignal={1}>Hello</AnimationScale3d>);
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Наведение во время «играющей» волны игнорируется
    fireEvent.mouseOver(screen.getByText('Hello'));
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Завершение анимации сбрасывает флаг isPlaying
    act(() => {
      mocks.callbacks.onAnimationComplete?.();
    });

    fireEvent.mouseOver(screen.getByText('Hello'));
    expect(mocks.start).toHaveBeenCalledTimes(2);
  });

  /**
   * Регрессионный тест волны: ре-рендеры буквы при неизменном playSignal
   * (например, переключение флага isPlaying по onAnimationComplete) не должны
   * перезапускать отложенную анимацию — иначе буквы выбиваются из волны
   * и в анимации участвуют не все символы заголовка.
   */
  it('does not restart the wave on rerenders with the same playSignal', () => {
    const { rerender } = render(
      <AnimationScale3d playSignal={0} waveDelay={120}>
        Hello
      </AnimationScale3d>,
    );

    rerender(
      <AnimationScale3d playSignal={1} waveDelay={120}>
        Hello
      </AnimationScale3d>,
    );
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Переключение флага isPlaying (isPlaying -> false) вызывает ре-рендер,
    // который не должен перезапустить запланированную отложенную анимацию
    act(() => {
      mocks.callbacks.onAnimationComplete?.();
    });
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Ре-рендер с тем же playSignal (даже с другой задержкой) — без перезапуска
    rerender(
      <AnimationScale3d playSignal={1} waveDelay={0}>
        Hello
      </AnimationScale3d>,
    );
    expect(mocks.start).toHaveBeenCalledTimes(1);

    // Новый тик волны снова запускает анимацию ровно один раз
    rerender(
      <AnimationScale3d playSignal={2} waveDelay={0}>
        Hello
      </AnimationScale3d>,
    );
    expect(mocks.start).toHaveBeenCalledTimes(2);
  });
});
