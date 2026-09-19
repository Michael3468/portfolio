import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { useDarkModeStore } from '../../../atoms/darkModeState';
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
  beforeEach(() => {
    useDarkModeStore.setState({ darkMode: 'dark' });
  });

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

  /**
   * Проверяет, что после успешной загрузки изображения к нему
   * добавляется класс анимации появления `project__img_loaded`.
   */
  it('adds the loaded class to the image after the load event', () => {
    const { container } = render(
      <MemoryRouter>
        <Project {...projectProps} />
      </MemoryRouter>,
    );

    const img = container.querySelector('.project__img');
    expect(img).not.toBeNull();

    fireEvent.load(img as HTMLImageElement);

    expect(img).toHaveClass('project__img_loaded');
  });

  /**
   * Проверяет, что при пустой строке в качестве изображения карточка
   * рендерится без изображения и использует flex-выравнивание контейнера.
   */
  it('renders the card without an image when img is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <Project {...projectProps} img="" />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('.project')).toHaveStyle({ display: 'flex' });
  });

  /**
   * Проверяет, что в светлой теме карточка использует дефолтные цвета теней
   * вместо цвета фона проекта (ветка useEffect для тёмной темы по умолчанию
   * уже покрыта остальными тестами).
   */
  it('uses the default shadow colors in the light theme', () => {
    useDarkModeStore.setState({ darkMode: 'light' });

    const { container } = render(
      <MemoryRouter>
        <Project {...projectProps} />
      </MemoryRouter>,
    );

    expect(container.querySelector('.project')).toHaveStyle({
      boxShadow: '0 0 11px black',
    });

    const link = container.querySelector('a');
    expect(link).toHaveStyle({ boxShadow: '0 0 10px black inset' });
  });
});
