import { useEffect, useState, type FocusEvent } from 'react';

import { ProjectItem } from '@/shared/types';

import Project from './Project';

import './ProjectsSlider.css';

/** Длительность анимации перехода между слайдами (мс). Должна совпадать с CSS. */
const SLIDE_DURATION = 500;

/** Интервал автоматической прокрутки на следующий слайд (мс). */
const AUTOPLAY_INTERVAL = 5000;

/**
 * Количество копий списка в ленте. Средняя копия — основная, крайние нужны,
 * чтобы при переходе за границу слева или справа было что показать.
 */
const COPIES = 3;

/**
 * Пропсы слайдера проектов.
 */
export interface ProjectsSliderProps {
  readonly projects: readonly ProjectItem[];
}

/**
 * Приводит позицию в ленте к диапазону основной копии `[count, 2 * count)`.
 * Позиция сохраняет тот же слайд, поэтому переход визуально незаметен.
 */
function normalizePosition(position: number, count: number): number {
  return count + ((((position - count) % count) + count) % count);
}

/**
 * Слайдер проектов в одну строку с бесконечной прокруткой.
 *
 * Список проектов повторяется `COPIES` раз. Слайдер всегда показывает слайды
 * основной копии; при выходе за её границу позиция мгновенно переносится на
 * эквивалентную в основной копии, поэтому после последнего проекта идут первые,
 * а перед первым — последние. Внизу находятся точки-индикаторы по числу проектов,
 * а по бокам — кнопки листания.
 *
 * @param props.projects - Список проектов для отображения.
 * @returns Элемент слайдера с кнопками и точками.
 */
export default function ProjectsSlider({ projects }: ProjectsSliderProps) {
  const count = projects.length;
  const [position, setPosition] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  // Автопрокрутка остановлена, пока клавиатурный фокус находится на карточке:
  // иначе карточка уедет из-под пользователя прямо во время чтения.
  const [isCardFocused, setIsCardFocused] = useState(false);

  const activeIndex = normalizePosition(position, count) - count;

  /**
   * Запускает переход на `delta` слайдов. Во время анимации новые переходы игнорируются,
   * чтобы лента не ушла за пределы скопированных слайдов.
   */
  const move = (delta: number) => {
    if (isMoving || delta === 0) {
      return;
    }
    setAnimate(true);
    setPosition((prev) => prev + delta);
    setIsMoving(true);
  };

  /**
   * Переходит к слайду с индексом `index` кратчайшим путём (вперёд или назад).
   */
  const goTo = (index: number) => {
    let diff = index - activeIndex;
    if (diff > count / 2) {
      diff -= count;
    } else if (diff < -count / 2) {
      diff += count;
    }
    move(diff);
  };

  useEffect(() => {
    if (!isMoving) {
      return;
    }
    const timerId = setTimeout(() => {
      const normalized = normalizePosition(position, count);
      if (normalized !== position) {
        // Мгновенный перенос на эквивалентный слайд без анимации
        setAnimate(false);
        setPosition(normalized);
      }
      setIsMoving(false);
    }, SLIDE_DURATION);
    return () => clearTimeout(timerId);
  }, [isMoving, position, count]);

  // Автопрокрутка: таймер взводится, когда слайдер неподвижен и фокус не на карточке.
  // После ухода фокуса с карточек на стрелку (или за пределы слайдера) отсчёт
  // начинается заново с полного интервала.
  useEffect(() => {
    if (isMoving || isCardFocused) {
      return;
    }
    const timerId = setTimeout(() => {
      setAnimate(true);
      setPosition((prev) => prev + 1);
      setIsMoving(true);
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timerId);
  }, [isMoving, position, isCardFocused]);

  /**
   * Обновляет признак «фокус на карточке» при переходе фокуса внутри слайдера.
   * События focus/blur всплывают, поэтому обработчики висят на контейнере.
   */
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    setIsCardFocused(Boolean((event.target as HTMLElement).closest('.project')));
  };

  /**
   * Сбрасывает признак, когда фокус уходит за пределы слайдера.
   * При переходе между элементами внутри контейнера состояние не трогаем:
   * его обновит следующий handleFocus.
   */
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsCardFocused(false);
    }
  };

  if (count === 0) {
    return null;
  }

  const slides = Array.from({ length: COPIES }, (_, copy) =>
    projects.map((project) => ({ copy, project })),
  ).flat();

  const trackStyle = {
    transform: `translateX(calc(var(--slide-w) * -0.5 - ${position} * (var(--slide-w) + var(--slide-gap))))`,
    transition: animate ? undefined : 'none',
  };

  return (
    <div className="projects-slider" onFocus={handleFocus} onBlur={handleBlur}>
      <div className="projects-slider__stage">
        <button
          type="button"
          className="projects-slider__arrow projects-slider__arrow_prev"
          aria-label="Previous project"
          onClick={() => move(-1)}
        >
          ‹
        </button>

        <div className="projects-slider__viewport">
          <ul className="projects-slider__track" style={trackStyle}>
            {slides.map(({ copy, project }, index) => {
              // В tab-порядке и дереве доступности оставляем только карточки,
              // которые сейчас видны: центральную и двух соседних. Остальные
              // получают inert в компоненте Project и пропускаются Tab'ом.
              const isVisible = Math.abs(index - position) <= 1;

              return (
                <Project
                  key={`${copy}-${project.id}`}
                  title={project.title}
                  img={project.img}
                  id={project.id}
                  background={project.background}
                  ariaHidden={!isVisible}
                />
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          className="projects-slider__arrow projects-slider__arrow_next"
          aria-label="Next project"
          onClick={() => move(1)}
        >
          ›
        </button>
      </div>

      <div className="projects-slider__info">
        <p className="projects-slider__info-line">{`Project: ${projects[activeIndex].title}`}</p>
        <p className="projects-slider__info-line projects-slider__stack">
          {`Skills: ${projects[activeIndex].skills}`}
        </p>
      </div>

      <div className="projects-slider__dots">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className={`projects-slider__dot ${index === activeIndex ? 'projects-slider__dot_active' : ''}`}
            aria-label={`Project ${index + 1}: ${project.title}`}
            aria-current={index === activeIndex || undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
