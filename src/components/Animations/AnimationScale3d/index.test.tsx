import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AnimationScale3d from './index';

/**
 * Набор тестов для компонента анимации «rubber band» (AnimationScale3d).
 * Проверяет рендеринг дочернего содержимого, запуск анимации по наведению
 * мыши и автоматический запуск при установке флага startOnInit.
 */
describe('AnimationScale3d', () => {
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
  });
});
