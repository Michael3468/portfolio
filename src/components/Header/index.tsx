// Прямые импорты вместо '../index.ts' — чтобы избежать циклической зависимости:
// src/components/index.ts реэкспортирует Header.
import AnimationScale3d from '@/components/Animations/AnimationScale3d';
import AnimationText from '@/components/Animations/AnimationText';
import { getLetters, replaceSpaceWithNbsp } from '@/shared/lib';
import './styles.css';

export default function Header() {
  const name = getLetters("Hi, I'm Mikhail,");

  return (
    <header className="header">
      <div className="header__wrapper">
        <h1 className="header__title main-text-shadow">
          {name.map((letter, index) => (
            <AnimationScale3d key={index} startOnInit>
              {replaceSpaceWithNbsp(letter)}
            </AnimationScale3d>
          ))}
        </h1>
        <AnimationText
          text="frontend developer"
          animationType="words"
          delayChildren={3}
          className="main-text-shadow"
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            marginRight: 15,
          }}
        />

        <div className="header__text" style={{ marginTop: 20 }}>
          <AnimationText
            text="with passion for learning and creating"
            animationType="letters"
            staggerChildren={0.05}
            delayChildren={5}
            hiddenX={-20}
            hiddenY={-20}
            className="main-text-shadow"
          />
        </div>
      </div>
    </header>
  );
}
