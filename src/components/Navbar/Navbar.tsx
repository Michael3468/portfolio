import { NavLink } from 'react-router-dom';

// Прямой импорт подкомпонента вместо '../index.ts' — чтобы избежать циклической
// зависимости: src/components/Navbar/index.ts реэкспортирует Navbar.
import gitHub from './icons/gitHub.svg';
import ButtonToggleDarkMode from './UI/ButtonToggleDarkMode';

import './styles.css';

export default function Navbar() {
  const activeLink = 'nav-list__link nav-list__link--active main-text-shadow';
  const normalLink = 'nav-list__link main-text-shadow';

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-row">
          <div className="logo">
            <a
              className="logo__github"
              href="https://github.com/Michael3468"
              aria-label="Link to GitHub"
            >
              <img className="logo__icon main-drop-shadow" src={gitHub} alt="link to github" />
            </a>

            <NavLink to="/" className="logo__link">
              <strong className="main-text-shadow">Portfolio</strong>
            </NavLink>
          </div>

          <ButtonToggleDarkMode />

          <ul className="nav-list">
            <li className="nav-list__item">
              <NavLink to="/" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                Home
              </NavLink>
            </li>
            <li className="nav-list__item">
              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                Projects
              </NavLink>
            </li>
            <li className="nav-list__item">
              <NavLink
                to="/contacts"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                Contacts
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
