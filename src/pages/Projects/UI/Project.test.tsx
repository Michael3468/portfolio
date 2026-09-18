import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Project from './Project';

/** Моковые данные проекта, используемые во всех тестах карточки проекта. */
const projectProps = {
  title: 'React Landing',
  img: 'project.jpg',
  id: 15,
  background: 'rgb(0, 219, 255)',
};

/**
 * Тестовый набор для карточки проекта (компонент Project).
 * Проверяет рендеринг заголовка, ссылки на страницу проекта
 * и изображения с атрибутом alt.
 */
describe('Project card', () => {
  /**
   * Проверяет, что карточка рендерит заголовок третьего уровня
   * и ссылку на страницу проекта с корректным адресом.
   */
  it('renders the title and a link to the project page', () => {
    render(
      <MemoryRouter>
        <Project {...projectProps} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'React Landing' })).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /React Landing/ });
    expect(link).toHaveAttribute('href', '/project/15');
  });

  /**
   * Проверяет, что карточка рендерит изображение
   * с атрибутом alt и корректным значением src.
   */
  it('renders the image with an alt attribute', () => {
    render(
      <MemoryRouter>
        <Project {...projectProps} />
      </MemoryRouter>,
    );

    const img = screen.getByRole('img', { name: 'React Landing' });
    expect(img).toHaveAttribute('src', 'project.jpg');
  });
});
