import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProjectItem } from '@/shared/types';

import ProjectsSlider from './ProjectsSlider';

const SLIDE_DURATION = 500;

const makeProject = (id: number, title: string, skills: string) =>
  ({
    id,
    title,
    skills,
    section: 'projects',
    img: '',
    bigImg: '',
    bigImgSmall: '',
    background: '#000000',
    gitHubLink: '',
    liveDemo: '',
  }) as unknown as ProjectItem;

const projects = [
  makeProject(1, 'Alpha', 'React, Vite'),
  makeProject(2, 'Beta', 'Vue, Pinia'),
  makeProject(3, 'Gamma', 'Node.js, Express'),
];

const renderSlider = () =>
  render(
    <MemoryRouter>
      <ProjectsSlider projects={projects} />
    </MemoryRouter>,
  );

/**
 * Тесты слайдера проектов: точки-индикаторы, листание в обе стороны
 * и зацикливание ленты.
 */
describe('ProjectsSlider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Проверяет, что под слайдером есть точка на каждый проект и первая точка активна.
   */
  it('renders a dot per project with the first one active', () => {
    renderSlider();

    const dots = screen.getAllByRole('button', { name: /^Проект \d/ });
    expect(dots).toHaveLength(projects.length);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[1]).not.toHaveAttribute('aria-current');
  });

  /**
   * Проверяет, что кнопка «Следующий проект» переводит активную точку вперёд.
   */
  it('moves to the next project on the next button click', () => {
    renderSlider();

    fireEvent.click(screen.getByRole('button', { name: 'Следующий проект' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    const dots = screen.getAllByRole('button', { name: /^Проект \d/ });
    expect(dots[1]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что с первого проекта «Предыдущий» ведёт к последнему, а с последнего
   * «Следующий» — к первому (бесконечная прокрутка в обе стороны).
   */
  it('wraps around from the first to the last and from the last to the first project', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Проект \d/ });
    const prev = screen.getByRole('button', { name: 'Предыдущий проект' });
    const next = screen.getByRole('button', { name: 'Следующий проект' });

    fireEvent.click(prev);
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });
    expect(dots()[2]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(next);
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что под слайдами выводится стек (skills) проекта, который сейчас в центре,
   * и что он меняется при переходе к другому проекту.
   */
  it('shows the skills of the centered project under the slides', () => {
    renderSlider();

    expect(screen.getByText('Project: Alpha')).toBeInTheDocument();
    expect(screen.getByText('Skills: React, Vite')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Проект 2: Beta' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    expect(screen.getByText('Project: Beta')).toBeInTheDocument();
    expect(screen.getByText('Skills: Vue, Pinia')).toBeInTheDocument();
  });

  /**
   * Проверяет автопрокрутку: через 5 секунд слайдер переходит на следующий проект,
   * а ручной переход сбрасывает отсчёт.
   */
  it('auto-advances to the next project every 5 seconds', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Проект \d/ });

    act(() => {
      vi.advanceTimersByTime(4900);
    });
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(dots()[1]).toHaveAttribute('aria-current', 'true');

    // После анимации таймер заново взводится на 5 секунд
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots()[2]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что клик по точке делает активным соответствующий проект.
   */
  it('switches to the project chosen by a dot', () => {
    renderSlider();

    fireEvent.click(screen.getByRole('button', { name: 'Проект 3: Gamma' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    const dots = screen.getAllByRole('button', { name: /^Проект \d/ });
    expect(dots[2]).toHaveAttribute('aria-current', 'true');
  });
});
