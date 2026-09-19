import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import Navbar from './Navbar';

/**
 * Набор тестов для компонента {@link Navbar}.
 *
 * Проверяет рендеринг логотипа, навигационных ссылок,
 * кнопки переключения темы и подсветку активного пункта меню
 * в зависимости от текущего маршрута.
 */
describe('Navbar', () => {
  /**
   * Очищает localStorage перед каждым тестом,
   * чтобы исключить влияние сохранённого состояния темы.
   */
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Проверяет, что компонент отображает логотип
   * и все навигационные ссылки: Portfolio, Home, Projects, Contacts.
   */
  it('renders the logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacts' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что компонент отображает кнопку
   * переключения тёмной темы с корректным типом `button`.
   */
  it('renders the dark mode toggle button', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const toggle = screen.getByRole('button', { name: 'Переключить тему' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('type', 'button');
  });

  /**
   * Проверяет, что на маршруте `/projects` ссылка «Projects»
   * помечается как активная (aria-current="page"
   * и класс `nav-list__link--active`), а остальные ссылки — нет.
   */
  it('marks the Projects link as active on the /projects route', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Navbar />
      </MemoryRouter>,
    );

    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    expect(projectsLink).toHaveAttribute('aria-current', 'page');
    expect(projectsLink).toHaveClass('nav-list__link--active');

    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Contacts' })).not.toHaveAttribute('aria-current');
  });

  /**
   * Проверяет, что на маршруте `/contacts` ссылка «Contacts»
   * помечается как активная (aria-current="page"
   * и класс `nav-list__link--active`), а остальные ссылки — нет.
   */
  it('marks the Contacts link as active on the /contacts route', () => {
    render(
      <MemoryRouter initialEntries={['/contacts']}>
        <Navbar />
      </MemoryRouter>,
    );

    const contactsLink = screen.getByRole('link', { name: 'Contacts' });
    expect(contactsLink).toHaveAttribute('aria-current', 'page');
    expect(contactsLink).toHaveClass('nav-list__link--active');

    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute('aria-current');
  });
});
