import { useEffect, useRef, type CSSProperties } from 'react';

import './styles.css';
import { SKILL_BACKGROUND_ICONS } from './model/constants';
import { getParallaxOffset, type ParallaxOffset } from './model/lib';

/**
 * Фон с иконками навыков из проектов.
 *
 * Плитки лежат неподвижно, пока пользователь не двигает мышью. Движение курсора
 * смещает весь слой в ту же сторону, но в 3 раза медленнее. Слой декоративный:
 * он не перехватывает клики, скрыт от скринридеров и не реагирует на касания.
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

    let offset: ParallaxOffset = { x: 0, y: 0 };
    let previousPoint: { readonly x: number; readonly y: number } | null = null;
    let frame = 0;

    const applyOffset = () => {
      frame = 0;
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

      offset = getParallaxOffset(
        offset,
        { x: point.x - previous.x, y: point.y - previous.y },
        { width: window.innerWidth, height: window.innerHeight },
      );

      if (!frame) {
        frame = window.requestAnimationFrame(applyOffset);
      }
    };

    // После выхода курсора из окна следующее первое событие снова только
    // запоминает точку, иначе слой прыгнул бы на расстояние между окнами.
    const resetPointer = () => {
      previousPoint = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetPointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="skill-background" aria-hidden="true">
      <div ref={layerRef} className="skill-background__layer">
        {SKILL_BACKGROUND_ICONS.map((icon) => (
          <img
            key={icon.id}
            className="skill-background__tile"
            src={icon.url}
            alt=""
            draggable={false}
            style={
              {
                left: `${icon.left}%`,
                top: `${icon.top}%`,
                '--tile-size': `${icon.size}px`,
                '--tile-rotate': `${icon.rotate}deg`,
                opacity: 0.05,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
