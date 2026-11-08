import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ProjectPage from './Project';

/**
 * Подмена конструктора Image для проверки предзагрузки обложки.
 *
 * Обложка проекта выводится как фоновый слой mouse-parallax (без `<img>`),
 * поэтому компонент отслеживает загрузку через `new Image()`.
 */
class FakeImage {
  /** Все экземпляры, созданные в текущем тесте (очищается в afterEach). */
  static readonly instances: FakeImage[] = [];

  /** Обработчик загрузки изображения. */
  onload: (() => void) | null = null;

  /** URL изображения. */
  src = '';

  constructor() {
    FakeImage.instances.push(this);
  }
}

/**
 * Тесты страницы проекта.
 *
 * Проверяют рендер деталей проекта для существующего id, ссылки на GitHub
 * и живое демо, предзагрузку обложки с анимацией появления и mouse-parallax
 * фонового слоя обложки.
 */
describe('Project page', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    FakeImage.instances.splice(0, FakeImage.instances.length);
    vi.restoreAllMocks();
  });

  /**
   * Проверяет, что для существующего id страница отображает
   * заголовок проекта и список его навыков.
   */
  it('renders the project details for an existing id', () => {
    render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'React Landing' })).toBeInTheDocument();
    expect(screen.getByText(/Skills: React, TailwindCSS, Vite/i)).toBeInTheDocument();
  });

  /**
   * Проверяет, что на странице присутствуют ссылки «GitHub» и «Live Demo»
   * с корректными значениями атрибута href.
   */
  it('renders the GitHub and Live Demo links', () => {
    render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/Michael3468/bank-modern',
    );
    expect(screen.getByRole('link', { name: /Live Demo/i })).toHaveAttribute(
      'href',
      'https://bank-modern-rhccoder.vercel.app/',
    );
  });

  /**
   * Проверяет, что обложка — фоновый слой mouse-parallax с aria-label
   * из названия проекта, и что после предзагрузки большого изображения
   * к контейнеру добавляется класс анимации появления.
   */
  it('adds the loaded class to the cover container after the big image is preloaded', () => {
    vi.stubGlobal('Image', FakeImage);

    const { container } = render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const parallaxBg = container.querySelector('.mouse-parallax-bg');
    expect(parallaxBg).not.toBeNull();
    expect(parallaxBg).toHaveAttribute('aria-label', 'React Landing');

    // Компонент начинает предзагрузку большой картинки проекта.
    const image = FakeImage.instances[FakeImage.instances.length - 1];
    expect(image?.src).toContain('15-big');

    act(() => {
      image?.onload?.();
    });

    expect(container.querySelector('.project-details__container')).toHaveClass(
      'project-details__container__loaded',
    );
  });

  /**
   * Проверяет, что при движении мыши фоновый слой секции mouse-parallax
   * сдвигается против курсора: в центре окна — на 25px по каждой оси,
   * в правом нижнем углу — на все 50px (как в образце).
   */
  it('moves the parallax background against the cursor on mousemove', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const parallaxBg = container.querySelector('.mouse-parallax-bg') as HTMLElement;
    expect(parallaxBg).not.toBeNull();

    // jsdom: окно 1024x768, центр — 512x384 → смещение 25px.
    fireEvent.mouseMove(window, { clientX: 512, clientY: 384 });
    expect(parallaxBg.style.transform).toBe('translate(-25px, -25px)');

    // Правый нижний угол — максимальное смещение 50px.
    fireEvent.mouseMove(window, { clientX: 1024, clientY: 768 });
    expect(parallaxBg.style.transform).toBe('translate(-50px, -50px)');
  });

  /**
   * Проверяет, что при размонтировании страницы обработчик mousemove
   * снимается с window.
   */
  it('removes the mousemove listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  /**
   * Проверяет, что при включённом `prefers-reduced-motion: reduce`
   * параллакс не подписывается на движение мыши — фон остаётся статичным.
   */
  it('does not subscribe to mousemove when prefers-reduced-motion is set', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    const addSpy = vi.spyOn(window, 'addEventListener');

    render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(addSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  /**
   * Проверяет, что для несуществующего id страница показывает
   * сообщение «Проект не найден» и ссылку на главную, а не пустой экран.
   */
  it('renders the not-found message when the project does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/project/999']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(screen.getByText('Проект не найден')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/');
  });
});
