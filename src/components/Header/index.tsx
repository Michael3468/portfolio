import { styles } from '../../shared/constants';
// Прямые импорты вместо '../index.ts' — чтобы избежать циклической зависимости:
// src/components/index.ts реэкспортирует Header.
import AnimationScale3d from '../Animations/AnimationScale3d';
import AnimationText from '../Animations/AnimationText';
import { getLetters } from './model/lib';
import './styles.css';

export default function Header() {
  const name = getLetters("Hi, I'm Mikhail,");

  return (
    <header className="header">
      <div className="header__wrapper">
        <h1 className="header__title" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
          {name.map((letter, index) => (
            <AnimationScale3d key={index} startOnInit>
              {letter === ' ' ? '\u00A0' : letter}
            </AnimationScale3d>
          ))}
        </h1>
        <AnimationText
          text="frontend developer"
          animationType="words"
          delayChildren={3}
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            marginRight: 15,
            textShadow: `${styles.mainTheme.textShadow}`,
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
            style={{ textShadow: `${styles.mainTheme.textShadow}` }}
          />
        </div>
      </div>
    </header>
  );
}
