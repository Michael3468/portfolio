import { useLayoutEffect, useRef } from 'react';
import './OrbsTitle.css';

const START_DELAY = 400; // мс до начала анимации
const STAGGER = 100; // задержка между буквами
const DROP_DURATION = 400; // падение буквы
const SETTLE_DURATION = 1000; // переход в белый и масштаб 1
const DROP_HEIGHT = -18.75; // стартовое смещение по Y (rem)

/**
 * Запускает анимацию «падения» букв через Web Animations API.
 * Возвращает функцию очистки, которая отменяет все анимации.
 */
function dropOrbs(orbs: HTMLElement[]): () => void {
  const canAnimate = orbs.length > 0 && typeof orbs[0].animate === 'function';
  if (!canAnimate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const total = DROP_DURATION + SETTLE_DURATION;
  const dropOffset = DROP_DURATION / total;

  const animations = orbs.map((orb, index) =>
    orb.animate(
      [
        {
          transform: `translateY(${DROP_HEIGHT}px) scale(0.2)`,
          color: '#990000',
          offset: 0,
          easing: 'ease-out',
        },
        {
          transform: 'translateY(0) scale(0.2)',
          color: '#990000',
          offset: dropOffset,
          easing: 'ease-in-out',
        },
        {
          transform: 'translateY(0) scale(1)',
          color: '#fff',
          offset: 1,
        },
      ],
      {
        duration: total,
        delay: START_DELAY + index * STAGGER,
        fill: 'both',
      },
    ),
  );

  return () => animations.forEach((animation) => animation.cancel());
}

interface OrbsTitleProps {
  readonly text: string;
  readonly className?: string;
}

export default function OrbsTitle({ text, className }: OrbsTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const orbs = ref.current
      ? Array.from(ref.current.querySelectorAll<HTMLElement>('.orbs__letter'))
      : [];
    return dropOrbs(orbs);
  }, []);

  return (
    <h1 ref={ref} className={`orbs ${className ?? ''}`.trim()} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span key={index + char} className="orbs__letter" aria-hidden="true">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}
