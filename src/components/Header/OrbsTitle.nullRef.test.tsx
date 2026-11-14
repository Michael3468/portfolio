import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Подменяет `useRef` на объект, который React не может заполнить ссылкой
 * на DOM-узел. Это воспроизводит защитную ветку `ref.current === null`,
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

import OrbsTitle from './OrbsTitle';

type Animate = (
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions,
) => Animation;

/**
 * Тесты защитной ветки OrbsTitle, когда ref на заголовок не привязан.
 */
describe('OrbsTitle without an attached heading ref', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  });

  /**
   * Проверяет, что без доступного DOM-узла компонент всё равно рендерит буквы,
   * но не запускает анимацию и не падает при размонтировании.
   */
  it('renders letters but does not animate when the ref is not attached', () => {
    const animate = vi.fn<Animate>(() => ({ cancel: vi.fn() }) as unknown as Animation);
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      writable: true,
      value: animate,
    });

    const { container, unmount } = render(<OrbsTitle text="ab" />);

    expect(container.querySelectorAll('.orbs__letter')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 1, name: 'ab' })).toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });
});
