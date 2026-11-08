import { useEffect, useState } from 'react';

import { getLetters, replaceSpaceWithNbsp } from '@/shared/lib';

import AnimationScale3d from '../AnimationScale3d';
import { TITLE_WAVE_INTERVAL_MS } from './model/constants';
import { getWaveDelay } from './model/lib';

export interface AnimatedTitleProps {
  /** Текст заголовка. */
  readonly title: string;
  /** Уровень заголовка: `'h1'` (по умолчанию) или `'h2'`. */
  readonly as?: 'h1' | 'h2';
}

/**
 * Анимированный заголовок страницы.
 *
 * Разбивает строку заголовка на отдельные буквы через `getLetters`,
 * оборачивает каждую букву в компонент `AnimationScale3d` и заменяет
 * пробелы на неразрывные через `replaceSpaceWithNbsp`.
 *
 * Доступность: буквы — декоративные (`aria-hidden`), а корректный
 * accessible name задаётся через `aria-label={title}`, как в `OrbsTitle`.
 * Без этого скринридер читает заголовок по одной букве, а accessible name
 * зависит от склейки текста отдельных span (ловилось e2e-тестами).
 *
 * Каждые `TITLE_WAVE_INTERVAL_MS` миллисекунд автоматически запускает волну
 * анимации «rubber band»: чётный тик — слева направо, нечётный — справа
 * налево (направления чередуются). При `prefers-reduced-motion: reduce`
 * автозапуск не включается; анимация по наведению мыши сохраняется.
 *
 * @param props - пропсы компонента.
 * @param props.title - текст заголовка.
 * @param props.as - уровень заголовка (`'h1'` по умолчанию или `'h2'`).
 * @returns {JSX.Element} Разметка заголовка с анимированными буквами.
 */
export default function AnimatedTitle({ title, as: HeadingTag = 'h1' }: AnimatedTitleProps) {
  const letters = getLetters(title);

  // Счётчик «тиков» волны: 0 — волна ещё не запускалась, каждое значение
  // больше 0 запускает новую волну в AnimationScale3d. Нечётный тик — волна
  // слева направо, чётный — справа налево.
  const [playSignal, setPlaySignal] = useState(0);
  const isForward = playSignal % 2 === 1;

  useEffect(() => {
    // Уважаем системную настройку «уменьшить движение»: автозапуск не включаем
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPlaySignal((signal) => signal + 1);
    }, TITLE_WAVE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <HeadingTag className="title-1 main-text-shadow" aria-label={title}>
      {letters.map((letter, index) => (
        <AnimationScale3d
          key={`${index}-${letter}`}
          decorative
          playSignal={playSignal}
          waveDelay={getWaveDelay(index, letters.length, isForward ? 'forward' : 'backward')}
        >
          {replaceSpaceWithNbsp(letter)}
        </AnimationScale3d>
      ))}
    </HeadingTag>
  );
}
