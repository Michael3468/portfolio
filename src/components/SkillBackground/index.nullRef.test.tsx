import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Подменяет `useRef` на объект, который React не может заполнить ссылкой
 * на DOM-узел. Это воспроизводит защитную ветку `layer === null`,
 * недостижимую при обычном монтировании компонента.
 */
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();

  return {
    ...actual,
    useRef: () => ({
      get current() {
        return null;
      },
      set current(_value: unknown) {},
    }),
  };
});

import SkillBackground from './index';
import { SKILL_BACKGROUND_ICONS } from './model/constants';

/**
 * Тесты защитной ветки SkillBackground, когда ref на слой не привязан.
 */
describe('SkillBackground without an attached layer ref', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что без доступного слоя иконки всё равно отрисованы статично,
   * а анимация снега и обработчики движения не запускаются.
   */
  it('renders static tiles without starting the snow animation', () => {
    const request = vi.spyOn(window, 'requestAnimationFrame');

    const { container } = render(<SkillBackground />);

    expect(container.querySelectorAll('.skill-background__tile')).toHaveLength(
      SKILL_BACKGROUND_ICONS.length,
    );
    expect(request).not.toHaveBeenCalled();
  });
});
