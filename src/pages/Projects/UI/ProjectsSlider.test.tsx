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

    const dots = screen.getAllByRole('button', { name: /^Project \d/ });
    expect(dots).toHaveLength(projects.length);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[1]).not.toHaveAttribute('aria-current');
  });

  /**
   * Проверяет, что в tab-порядке и дереве доступности остаются только три
   * видимые карточки, а скрытые копии получают inert и tabindex="-1".
   */
  it('keeps only the three visible cards in the tab order', () => {
    const { container } = renderSlider();

    expect(container.querySelectorAll('.project')).toHaveLength(projects.length * 3);
    expect(container.querySelectorAll('.project[aria-hidden="true"]')).toHaveLength(6);

    const visibleCards = container.querySelectorAll('.project:not([aria-hidden="true"])');
    expect(visibleCards).toHaveLength(3);
    visibleCards.forEach((card) => {
      expect(card).not.toHaveAttribute('inert');
      expect(card.querySelector('a')).not.toHaveAttribute('tabindex');
    });

    const hiddenCards = container.querySelectorAll('.project[aria-hidden="true"]');
    hiddenCards.forEach((card) => {
      expect(card).toHaveAttribute('inert');
      expect(card.querySelector('a')).toHaveAttribute('tabindex', '-1');
    });
  });

  /**
   * Проверяет, что после перехода видимыми становятся следующие три карточки:
   * набор доступных элементов смещается вместе с лентой.
   */
  it('moves the tabbable set together with the visible slides', () => {
    const { container } = renderSlider();

    const visibleHrefs = () =>
      Array.from(container.querySelectorAll('.project:not([aria-hidden="true"]) a')).map((link) =>
        link.getAttribute('href'),
      );

    // В начале в центре Alpha, слева Gamma (последняя карточка в ленте), справа Beta.
    expect(visibleHrefs()).toEqual(['/project/3', '/project/1', '/project/2']);

    fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    expect(visibleHrefs()).toEqual(['/project/1', '/project/2', '/project/3']);
  });

  /**
   * Проверяет, что автопрокрутка останавливается, пока фокус находится на карточке,
   * и возобновляется после перехода фокуса на стрелку.
   */
  it('pauses autoplay while a project card is focused and resumes on an arrow', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.focusIn(screen.getByRole('link', { name: /Alpha/ }));

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');

    fireEvent.focusIn(screen.getByRole('button', { name: 'Next project' }));

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots()[1]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что кнопка «Next project» переводит активную точку вперёд.
   */
  it('moves to the next project on the next button click', () => {
    renderSlider();

    fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    const dots = screen.getAllByRole('button', { name: /^Project \d/ });
    expect(dots[1]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что с первого проекта «Предыдущий» ведёт к последнему, а с последнего
   * «Следующий» — к первому (бесконечная прокрутка в обе стороны).
   */
  it('wraps around from the first to the last and from the last to the first project', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });
    const prev = screen.getByRole('button', { name: 'Previous project' });
    const next = screen.getByRole('button', { name: 'Next project' });

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

    fireEvent.click(screen.getByRole('button', { name: 'Project 2: Beta' }));
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
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

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

    fireEvent.click(screen.getByRole('button', { name: 'Project 3: Gamma' }));
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    const dots = screen.getAllByRole('button', { name: /^Project \d/ });
    expect(dots[2]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что переходы игнорируются, пока идёт предыдущая анимация:
   * быстрый двойной клик сдвигает ленту только на один слайд.
   */
  it('ignores a new move while the previous slide transition is running', () => {
    renderSlider();
    const next = screen.getByRole('button', { name: 'Next project' });
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.click(next);
    fireEvent.click(next);

    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    expect(dots()[1]).toHaveAttribute('aria-current', 'true');
    expect(dots()[2]).not.toHaveAttribute('aria-current');
  });

  /**
   * Проверяет, что клик по уже активной точке не запускает переход
   * (нулевое смещение игнорируется).
   */
  it('keeps the current project when its active dot is clicked', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.click(dots()[0]);

    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });

    expect(dots()[0]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что точки выбирают кратчайший путь назад через границу:
   * с последнего проекта клик по первой точке ведёт вперёд через «ноль»,
   * а не прокручивает всю ленту обратно.
   */
  it('takes the shortest path between dots across the boundary', () => {
    renderSlider();
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.click(dots()[2]);
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });
    expect(dots()[2]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(dots()[0]);
    act(() => {
      vi.advanceTimersByTime(SLIDE_DURATION);
    });
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что после ухода фокуса за пределы слайдера автопрокрутка
   * возобновляется с полного интервала.
   */
  it('resumes autoplay when focus leaves the slider', () => {
    renderSlider();
    const card = screen.getByRole('link', { name: /Alpha/ });
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.focusIn(card);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');

    fireEvent.focusOut(card, { relatedTarget: document.body });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots()[1]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что перевод фокуса между элементами внутри слайдера не
   * сбрасывает состояние сразу: его обновляет следующий обработчик focus.
   */
  it('keeps focus tracking when focus moves inside the slider', () => {
    renderSlider();
    const card = screen.getByRole('link', { name: /Alpha/ });
    const next = screen.getByRole('button', { name: 'Next project' });
    const dots = () => screen.getAllByRole('button', { name: /^Project \d/ });

    fireEvent.focusIn(card);
    fireEvent.focusOut(card, { relatedTarget: next });
    fireEvent.focusIn(next);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(dots()[1]).toHaveAttribute('aria-current', 'true');
  });

  /**
   * Проверяет, что пустой список проектов не рендерит разметку слайдера.
   */
  it('renders nothing when there are no projects', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectsSlider projects={[]} />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });
});
