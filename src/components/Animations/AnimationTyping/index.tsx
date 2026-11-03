import { useEffect, useRef, useState } from 'react';

export interface AnimationTypingProps {
  readonly text: string;
  readonly typingSpeed?: number;
  readonly deletingSpeed?: number;
  readonly cursorBlinkSpeed?: number;
  readonly pauseBeforeDelete?: number;
  readonly pauseBeforeType?: number;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

type Phase = 'typing' | 'pausing' | 'deleting' | 'pause';

export default function AnimationTyping({
  text,
  typingSpeed = 80,
  deletingSpeed = 40,
  cursorBlinkSpeed = 0.6,
  pauseBeforeDelete = 2000,
  pauseBeforeType = 800,
  className,
  style,
}: AnimationTypingProps) {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const displayedRef = useRef('');
  const textRef = useRef(text);

  // При изменении text сбрасываем набранный текст и начинаем цикл заново.
  // Раньше здесь было два эффекта: второй был «мёртвым» кодом — первый уже
  // синхронизировал textRef, из-за чего сброс displayed никогда не срабатывал.
  useEffect(() => {
    textRef.current = text;
    displayedRef.current = '';
    setDisplayed('');
  }, [text]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((p) => !p), cursorBlinkSpeed * 500);
    return () => clearInterval(interval);
  }, [cursorBlinkSpeed]);

  // Main loop
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = (phase: Phase) => {
      if (cancelled) return;

      if (phase === 'typing') {
        if (displayedRef.current.length < textRef.current.length) {
          displayedRef.current = textRef.current.slice(0, displayedRef.current.length + 1);
          setDisplayed(displayedRef.current);
          const id = setTimeout(() => run('typing'), typingSpeed);
          timers.push(id);
        } else {
          const id = setTimeout(() => run('pausing'), pauseBeforeDelete);
          timers.push(id);
        }
      } else if (phase === 'pausing') {
        const id = setTimeout(() => run('deleting'), 0);
        timers.push(id);
      } else if (phase === 'deleting') {
        if (displayedRef.current.length > 0) {
          displayedRef.current = textRef.current.slice(0, displayedRef.current.length - 1);
          setDisplayed(displayedRef.current);
          const id = setTimeout(() => run('deleting'), deletingSpeed);
          timers.push(id);
        } else {
          const id = setTimeout(() => run('pause'), pauseBeforeType);
          timers.push(id);
        }
      } else {
        const id = setTimeout(() => run('typing'), 0);
        timers.push(id);
      }
    };

    const id = setTimeout(() => run('typing'), typingSpeed);
    timers.push(id);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [text, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBeforeType]);

  return (
    <span className={className} style={style}>
      {displayed}
      <span
        className="typing-cursor"
        style={{
          opacity: cursorVisible ? 1 : 0,
          transition: `opacity ${cursorBlinkSpeed / 2}s`,
        }}
      />
    </span>
  );
}
