import { useEffect, useRef, type CSSProperties } from 'react';

import './styles.css';
import { SKILL_BACKGROUND_ICONS, type SkillBackgroundIcon } from './model/constants';
import {
  getNextSnowflakeY,
  getParallaxOffset,
  getRespawnLeft,
  getSnowSwayAngle,
  type ParallaxOffset,
} from './model/lib';

/** Состояние одной падающей иконки. */
interface SnowflakeMotion {
  /** Смещение по вертикали относительно слоя, в пикселях. */
  y: number;
  /** Текущее горизонтальное положение, в процентах от ширины слоя. */
  left: number;
  /** Текущий угол наклона, в градусах. */
  angle: number;
  /** Начальная фаза покачивания, в радианах. */
  readonly phase: number;
  /** Скорость падения, в пикселях в секунду. */
  readonly speed: number;
  /** Скорость покачивания, в радианах в секунду. */
  readonly swaySpeed: number;
}

/**
 * Создаёт начальное состояние иконки.
 *
 * Покачивание начинается не с нуля: `rotate` из данных задаёт фазу, поэтому
 * иконки качаются не синхронно. Скорости отличаются, чтобы падение выглядело
 * как снег, а не как строй.
 *
 * @param icon - Данные иконки.
 * @param index - Индекс иконки в списке.
 * @param viewportHeight - Высота окна в пикселях.
 * @returns Начальное состояние падения.
 */
const createSnowflakeMotion = (
  icon: SkillBackgroundIcon,
  index: number,
  viewportHeight: number,
): SnowflakeMotion => {
  const phase = ((icon.rotate + index * 3) * Math.PI) / 180;

  return {
    y: (icon.top / 100) * viewportHeight,
    left: icon.left,
    angle: getSnowSwayAngle(0, phase),
    phase,
    speed: 16 + ((index * 7) % 18),
    swaySpeed: 0.45 + ((index * 3) % 5) * 0.08,
  };
};

/**
 * Фон с иконками навыков из проектов.
 *
 * Иконки падают вниз постоянно, покачиваясь на ±30 градусов, даже когда
 * пользователь двигает мышью. Движение курсора лишь смещает весь слой влево
 * или вправо — в 20 раз медленнее и без вертикального сдвига. Уйдя целиком
 * за нижнюю границу, иконка возвращается сверху в новом месте по горизонтали
 * и снова появляется только после того, как полностью выйдет из-за верхнего края.
 *
 * Слой декоративный: он не перехватывает клики, скрыт от скринридеров
 * и не реагирует на касания.
 *
 * @returns {JSX.Element} Фиксированный слой с SVG-иконками.
 */
export default function SkillBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Пользователь просил уменьшить анимацию — оставляем фон статичным.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tiles = Array.from(layer.querySelectorAll<HTMLImageElement>('.skill-background__tile'));
    let viewportHeight = window.innerHeight;
    const motions = SKILL_BACKGROUND_ICONS.map((icon, index) =>
      createSnowflakeMotion(icon, index, viewportHeight),
    );
    const tileHeights = tiles.map(
      (tile, index) => tile.offsetHeight || SKILL_BACKGROUND_ICONS[index].size,
    );

    let offset: ParallaxOffset = { x: 0, y: 0 };
    let previousPoint: { readonly x: number; readonly y: number } | null = null;
    let parallaxFrame = 0;
    let snowFrame = 0;
    let lastTimestamp = 0;
    let hasPreviousFrame = false;
    let elapsed = 0;

    const applyMotion = (index: number) => {
      const tile = tiles[index];
      const motion = motions[index];
      if (!tile || !motion) return;

      tile.style.left = `${motion.left}%`;
      tile.style.transform = `translate(-50%, ${motion.y}px) rotate(${motion.angle}deg)`;
    };

    const applyOffset = () => {
      parallaxFrame = 0;
      layer.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      // Фон следует только за мышью: на тач-экранах он остаётся неподвижным.
      if (event.pointerType === 'touch' || event.pointerType === 'pen') return;

      const point = { x: event.clientX, y: event.clientY };
      const previous = previousPoint;
      previousPoint = point;

      // Первое событие только запоминает позицию — без скачка при входе в окно.
      if (!previous) return;

      // Учитываем только горизонтальное движение: иконки не должны прыгать вверх-вниз.
      offset = getParallaxOffset(
        offset,
        { x: point.x - previous.x },
        { width: window.innerWidth, height: window.innerHeight },
      );

      if (!parallaxFrame) {
        parallaxFrame = window.requestAnimationFrame(applyOffset);
      }
    };

    // После выхода курсора из окна следующее первое событие снова только
    // запоминает точку, иначе слой прыгнул бы на расстояние между окнами.
    const resetPointer = () => {
      previousPoint = null;
    };

    const handleResize = () => {
      viewportHeight = window.innerHeight;
    };

    const animateSnow = (timestamp: number) => {
      snowFrame = window.requestAnimationFrame(animateSnow);

      const deltaSeconds = hasPreviousFrame
        ? Math.min((timestamp - lastTimestamp) / 1000, 0.05)
        : 0;
      hasPreviousFrame = true;
      lastTimestamp = timestamp;

      elapsed += deltaSeconds;

      motions.forEach((motion, index) => {
        const nextY = getNextSnowflakeY(
          motion.y,
          motion.speed,
          deltaSeconds,
          tileHeights[index],
          viewportHeight,
        );

        // Иконка вернулась сверху — ставим её в новое место по горизонтали.
        if (nextY < motion.y) {
          motion.left = getRespawnLeft(motion.left);
        }

        motion.y = nextY;
        motion.angle = getSnowSwayAngle(elapsed * motion.swaySpeed, motion.phase);
        applyMotion(index);
      });
    };

    motions.forEach((_, index) => applyMotion(index));
    snowFrame = window.requestAnimationFrame(animateSnow);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    window.addEventListener('resize', handleResize, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetPointer);
      window.removeEventListener('resize', handleResize);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      window.cancelAnimationFrame(parallaxFrame);
      window.cancelAnimationFrame(snowFrame);
    };
  }, []);

  return (
    <div className="skill-background" aria-hidden="true">
      <div ref={layerRef} className="skill-background__layer">
        {SKILL_BACKGROUND_ICONS.map((icon, index) => {
          const motion = createSnowflakeMotion(icon, index, window.innerHeight);

          return (
            <img
              key={icon.id}
              className="skill-background__tile"
              src={icon.url}
              alt=""
              draggable={false}
              style={
                {
                  left: `${icon.left}%`,
                  top: 0,
                  transform: `translate(-50%, ${motion.y}px) rotate(${motion.angle}deg)`,
                  '--tile-size': `${icon.size}px`,
                  opacity: 0.05,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
