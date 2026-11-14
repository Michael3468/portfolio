import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import OrbsTitle from './OrbsTitle';

type Animate = (
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions,
) => Animation;

/**
 * Набор тестов для заголовка с анимацией «падающих» букв (OrbsTitle).
 * Проверяет доступное имя заголовка, разбиение текста на буквы,
 * замену пробелов на неразрывные, объединение классов и запуск/отмену
 * анимации через Web Animations API.
 */
describe('OrbsTitle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  });
  /**
   * Проверяет, что компонент рендерит заголовок h1 с доступным именем,
   * равным переданному тексту (aria-label), т.к. буквы скрыты aria-hidden.
   */
  it('renders a level-1 heading with the accessible name from the text', () => {
    render(<OrbsTitle text="Hi, I'm Mikhail" />);

    const heading = screen.getByRole('heading', { level: 1, name: "Hi, I'm Mikhail" });
    expect(heading).toBeInTheDocument();
  });

  /**
   * Проверяет, что каждый символ текста рендерится отдельным элементом
   * .orbs__letter, скрытым от скринридеров (aria-hidden="true").
   */
  it('renders every character as an aria-hidden letter span', () => {
    const { container } = render(<OrbsTitle text="abc" />);

    const letters = container.querySelectorAll('.orbs__letter');
    expect(letters).toHaveLength(3);
    letters.forEach((letter) => {
      expect(letter).toHaveAttribute('aria-hidden', 'true');
    });
  });

  /**
   * Проверяет, что пробелы заменяются на неразрывные (\u00A0),
   * чтобы буквы не переносились на новую строку.
   */
  it('replaces spaces with non-breaking spaces', () => {
    const { container } = render(<OrbsTitle text="a b" />);

    const letters = container.querySelectorAll('.orbs__letter');
    expect(letters).toHaveLength(3);
    // Сравниваем textContent напрямую: jest-dom нормализует неразрывные
    // пробелы (\u00A0) как обычные и схлопывает их в пустую строку.
    expect(letters[1].textContent).toBe('\u00A0');
  });

  /**
   * Проверяет, что переданный className объединяется с базовым классом orbs.
   */
  it('merges the custom className with the base orbs class', () => {
    render(<OrbsTitle text="Hi" className="header__title main-text-shadow" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'orbs',
      'header__title',
      'main-text-shadow',
    );
  });

  /**
   * Проверяет, что при поддержке Web Animations API каждая буква получает
   * свою анимацию с нарастающей задержкой, а при размонтировании компонента
   * все анимации отменяются.
   */
  it('animates every letter with a stagger and cancels the animations on unmount', () => {
    const cancel = vi.fn();
    const animate = vi.fn<Animate>(() => ({ cancel }) as unknown as Animation);
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      writable: true,
      value: animate,
    });

    const { unmount } = render(<OrbsTitle text="ab" />);

    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate).toHaveBeenNthCalledWith(
      1,
      expect.any(Array),
      expect.objectContaining({ delay: 400, duration: 1400, fill: 'both' }),
    );
    expect(animate).toHaveBeenNthCalledWith(
      2,
      expect.any(Array),
      expect.objectContaining({ delay: 500, duration: 1400, fill: 'both' }),
    );

    expect(cancel).not.toHaveBeenCalled();
    unmount();
    expect(cancel).toHaveBeenCalledTimes(2);
  });

  /**
   * Проверяет, что при системной настройке «уменьшить движение» анимация
   * не запускается, хотя буквы всё равно отрисованы.
   */
  it('does not animate when the user prefers reduced motion', () => {
    const animate = vi.fn<Animate>(() => ({ cancel: vi.fn() }) as unknown as Animation);
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      writable: true,
      value: animate,
    });
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

    const { container } = render(<OrbsTitle text="ab" />);

    expect(container.querySelectorAll('.orbs__letter')).toHaveLength(2);
    expect(animate).not.toHaveBeenCalled();
  });

  /**
   * Проверяет, что без Web Animations API компонент рендерится и не падает:
   * в jsdom метод `animate` отсутствует по умолчанию.
   */
  it('renders without the Web Animations API', () => {
    expect(HTMLElement.prototype.animate).toBeUndefined();

    const { container } = render(<OrbsTitle text="Hi" />);

    expect(container.querySelectorAll('.orbs__letter')).toHaveLength(2);
  });

  /**
   * Проверяет, что пустой текст рендерит заголовок без букв и не пытается
   * запускать анимацию.
   */
  it('renders an empty heading for empty text', () => {
    const { container } = render(<OrbsTitle text="" />);

    expect(container.querySelectorAll('.orbs__letter')).toHaveLength(0);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
