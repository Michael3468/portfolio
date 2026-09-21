import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

export interface AnimationTextProps {
  readonly text: string;
  readonly animationType: 'words' | 'letters';
  readonly staggerChildren?: number;
  readonly delayChildren?: number;
  readonly hiddenX?: number;
  readonly hiddenY?: number;
  readonly visibleX?: number;
  readonly visibleY?: number;
  readonly dumping?: number;
  readonly stiffness?: number;
  readonly style?: CSSProperties;
}

export default function AnimationText({
  text,
  animationType,
  staggerChildren = 0.5,
  delayChildren = 2,
  hiddenX = 0,
  hiddenY = 20,
  visibleX = 0,
  visibleY = 0,
  dumping = 12,
  stiffness = 100,
  style = {},
}: AnimationTextProps) {
  const items = animationType === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren, delayChildren: delayChildren * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      x: hiddenX,
      y: hiddenY,
      transition: {
        type: 'spring' as const,
        dumping,
        stiffness,
      },
    },

    visible: {
      opacity: 1,
      x: visibleX,
      y: visibleY,
      transition: {
        type: 'spring' as const,
        dumping,
        stiffness,
      },
    },
  };

  /**
   * Возвращает отображаемый текст отдельного элемента анимации:
   * в режиме `letters` обычные пробелы заменяются на неразрывные (\u00A0),
   * чтобы сохранить визуальные отступы между буквами; в режиме `words`
   * текст возвращается без изменений.
   */
  const getDisplayText = (item: string): string => {
    if (animationType === 'letters' && item === ' ') {
      return '\u00A0';
    }
    return item;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}
    >
      {items.map((item, index) => (
        // this motion uses parent 'initial' and 'animate' props and values
        // causes they have same names 'hidden' and 'visible'
        <motion.span key={index} variants={child} style={{ ...style }}>
          {getDisplayText(item)}
        </motion.span>
      ))}
    </motion.div>
  );
}
