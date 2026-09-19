import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AnimationScale3d from './index';

/**
 * Хранилище мок-объектов framer-motion: мок-метод `start` контролов
 * и колбэки, которые компонент передаёт в `motion.span`.
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

// Мок framer-motion: заменяем motion.span обычным span, сохраняя обработчики
// событий, а useAnimationControls — объектом с мок-методом start.
vi.mock('framer-motion', async () => {
  const ReactModule = await import('react');

  return {
    motion: {
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
});
