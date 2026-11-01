import { AnimationScale3d } from '@/components';
import { getLetters, replaceSpaceWithNbsp } from '@/shared/lib';

export interface AnimatedTitleProps {
  readonly title: string;
}

/**
 * Анимированный заголовок первого уровня страницы.
 *
 * Разбивает строку заголовка на отдельные буквы через `getLetters`,
 * оборачивает каждую букву в компонент `AnimationScale3d` и заменяет
 * пробелы на неразрывные через `replaceSpaceWithNbsp`.
 *
 * @param props - пропсы компонента.
 * @param props.title - текст заголовка.
 * @returns {JSX.Element} Разметка заголовка с анимированными буквами.
 */
export default function AnimatedTitle({ title }: AnimatedTitleProps) {
  const letters = getLetters(title);

  return (
    <h1 className="title-1 main-text-shadow">
      {letters.map((letter, index) => (
        <AnimationScale3d key={`${index}-${letter}`}>
          {replaceSpaceWithNbsp(letter)}
        </AnimationScale3d>
      ))}
    </h1>
  );
}
