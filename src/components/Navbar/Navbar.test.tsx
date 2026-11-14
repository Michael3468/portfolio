import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Link to GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Michael3468',
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '/contacts');
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
   * Проверяет, что порядок Tab совпадает с визуальным: после ссылки Portfolio
   * идут пункты меню, а кнопка темы стоит последней справа.
   */
  it('keeps the theme toggle after the navigation links in the tab order', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const focusables = Array.from(container.querySelectorAll('a[href], button')).map(
      (element) => element.getAttribute('aria-label') ?? element.textContent?.trim(),
    );

    expect(focusables).toEqual([
      'Link to GitHub',
      'Portfolio',
      'Home',
      'Projects',
      'Contacts',
      'Переключить тему',
    ]);
  });

  /**
   * Проверяет фактическую клавиатурную навигацию: Tab последовательно
   * проходит ссылки хедера и только затем попадает на кнопку темы.
   */
  it('tabs through the header links before the theme toggle', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const sequence = [
      screen.getByRole('link', { name: 'Link to GitHub' }),
      screen.getByRole('link', { name: 'Portfolio' }),
      screen.getByRole('link', { name: 'Home' }),
      screen.getByRole('link', { name: 'Projects' }),
      screen.getByRole('link', { name: 'Contacts' }),
      screen.getByRole('button', { name: 'Переключить тему' }),
    ];

    for (const element of sequence) {
      await user.tab();
      expect(element).toHaveFocus();
    }
  });

  /**
   * Проверяет, что на корневом маршруте активен только пункт «Home»:
   * он получает aria-current="page" и класс активной ссылки,
   * а остальные пункты остаются в обычном состоянии.
   */
  it('marks only the Home link as active on the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
    expect(homeLink).toHaveClass('nav-list__link--active');

    ['Projects', 'Contacts'].forEach((name) => {
      const link = screen.getByRole('link', { name });
      expect(link).not.toHaveAttribute('aria-current');
      expect(link).not.toHaveClass('nav-list__link--active');
      expect(link).toHaveClass('nav-list__link', 'main-text-shadow');
    });
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
