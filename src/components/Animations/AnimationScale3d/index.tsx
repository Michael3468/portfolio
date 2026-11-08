import { m, useAnimationControls } from 'framer-motion';
import { ReactNode, useCallback, useEffect, useState } from 'react';

/** Значения `times` для keyframes анимации «rubber band» по умолчанию. */
const DEFAULT_TRANSITION_TIMES = [0, 0.4, 0.6, 0.7, 0.8, 0.9];

export interface AnimationScale3dProps {
  readonly children: ReactNode;
  readonly transitionTimes?: number[];
  readonly duration?: number;
  readonly startOnInit?: boolean;
  /**
   * Помечает элемент как декоративный (`aria-hidden="true"`): используется,
   * когда родительский заголовок задаёт корректный accessible name через
   * `aria-label` (см. `AnimatedTitle`), и скринридер не должен читать
   * содержимое по отдельным буквам.
   */
  readonly decorative?: boolean;
  /**
   * Счётчик волн автозапуска. При его увеличении (значение больше 0) анимация
   * запускается автоматически с задержкой `waveDelay`. Без пропса (undefined)
   * поведение компонента не меняется — работает только анимация по наведению.
   */
  readonly playSignal?: number;
  /** Задержка старта анимации волны для этой буквы, в миллисекундах. */
  readonly waveDelay?: number;
}

/**
 * Компонент анимации «rubber band» для отдельной буквы.
 *
 * @param transitionTimes {number[]} array of number between 0 and 1.
 * example: [0, 0.4, 0.6, 0.7, 0.8, 0.9]
 * transitionTimes array must contain same count of numbers as 'transform' array
 */
export default function AnimationScale3d({
  children,
  transitionTimes = DEFAULT_TRANSITION_TIMES,
  duration = 1,
  startOnInit = false,
  playSignal,
  waveDelay = 0,
  decorative = false,
}: AnimationScale3dProps) {
  const controls = useAnimationControls();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const rubberBand = useCallback(
    (delaySeconds = 0) => {
      void controls.start({
        transform: [
          'scale3d(1, 1, 1)',
          'scale3d(1.4, .55, 1)',
          'scale3d(.75, 1.25, 1)',
          'scale3d(1.25, .85, 1)',
          'scale3d(.9, 1.05, 1)',
          'scale3d(1, 1, 1)',
        ],
        transition: {
          times: transitionTimes,
          duration,
          delay: delaySeconds,
        },
      });
      setIsPlaying(true);
    },
    [controls, duration, transitionTimes],
  );

  useEffect(() => {
    if (startOnInit) {
      rubberBand();
    }
  }, [rubberBand, startOnInit]);

  // ВАЖНО о единицах: transition у framer-motion задаёт delay и duration
  // в секундах, а waveDelay приходит в миллисекундах — поэтому ниже
  // конвертируем делением на 1000. Ранее delay передавался в мс «как есть»:
  // буква с waveDelay=60 мс получала анимацию с задержкой 60 секунд, из-за
  // чего в волне визуально участвовали только буквы с нулевой задержкой,
  // а onAnimationComplete отложенных анимаций не срабатывал и через флаг
  // isPlaying навсегда блокировал hover.

  // Автозапуск волны: реакция строго на изменение счётчика playSignal —
  // ровно один запуск анимации на каждый тик волны. Пока сигнал 0 или не
  // передан вовсе, анимация не запускается.
  //
  // Задержка waveDelay меняется синхронно с playSignal (оба вычисляются из
  // одного тика волны в AnimatedTitle), поэтому читаем её из замыкания
  // текущего рендера. Намеренно не включаем waveDelay и rubberBand в
  // зависимости: любые ре-рендеры буквы (например, переключение флага
  // isPlaying) не должны перезапускать controls.start и отменять уже
  // запланированную отложенную анимацию — иначе буквы выбиваются из волны
  // и участвуют не все символы заголовка.
  useEffect(() => {
    if (playSignal === undefined || playSignal === 0) {
      return;
    }
    rubberBand(waveDelay / 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playSignal]);

  return (
    <m.span
      style={{ display: 'inline-block', cursor: 'pointer' }}
      aria-hidden={decorative || undefined}
      animate={controls}
      onMouseOver={() => {
        if (!isPlaying) rubberBand();
      }}
      onAnimationComplete={() => setIsPlaying(false)}
    >
      {children}
    </m.span>
  );
}
