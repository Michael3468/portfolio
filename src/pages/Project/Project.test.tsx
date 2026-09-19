import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import ProjectPage from './Project';

/**
 * Тесты страницы проекта.
 *
 * Проверяют рендер деталей проекта для существующего id,
 * а также наличие ссылок на GitHub и живое демо.
 */
describe('Project page', () => {
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
   * Проверяет, что после успешной загрузки обложки проекта к изображению
   * и его контейнеру добавляются классы анимации появления
   * (`project-details__cover_loaded` и `project-details__container__loaded`).
   */
  it('adds the loaded classes to the cover after the image load event', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/project/15']}>
        <Routes>
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const cover = container.querySelector('.project-details__cover');
    expect(cover).not.toBeNull();

    fireEvent.load(cover as HTMLImageElement);

    expect(cover).toHaveClass('project-details__cover_loaded');
    expect(container.querySelector('.project-details__container')).toHaveClass(
      'project-details__container__loaded',
    );
  });
});
