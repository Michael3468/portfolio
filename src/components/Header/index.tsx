// Прямые импорты вместо '../index.ts' — чтобы избежать циклической зависимости:
// src/components/index.ts реэкспортирует Header.
import AnimationTyping from '@/components/Animations/AnimationTyping';

import OrbsTitle from './OrbsTitle';
import './styles.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__wrapper">
        <OrbsTitle
          text="Hi, I'm Mikhail"
          className="header__title main-text-shadow no-underline-text"
        />

        <span className="neon-text header__text">
          <AnimationTyping
            text="Full-Stack Developer"
            style={{
              display: 'inline',
            }}
          />
        </span>
      </div>
    </header>
  );
}
