import { NavLink } from 'react-router-dom';

import { styles } from '../../shared/constants';
// Прямой импорт подкомпонента вместо '../index.ts' — чтобы избежать циклической
// зависимости: src/components/Navbar/index.ts реэкспортирует Navbar.
import ButtonToggleDarkMode from './UI/ButtonToggleDarkMode';

import './styles.css';

export default function Navbar() {
  const activeLink = 'nav-list__link nav-list__link--active';
  const normalLink = 'nav-list__link';

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-row">
          <NavLink to="/" className="logo">
            <strong style={{ textShadow: `${styles.mainTheme.textShadow}` }}>Portfolio</strong>
          </NavLink>

          <ButtonToggleDarkMode />

          <ul className="nav-list">
            <li className="nav-list__item">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                style={{ textShadow: `${styles.mainTheme.textShadow}` }}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-list__item">
              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                style={{ textShadow: `${styles.mainTheme.textShadow}` }}
              >
                Projects
              </NavLink>
            </li>
            <li className="nav-list__item">
              <NavLink
                to="/contacts"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                style={{ textShadow: `${styles.mainTheme.textShadow}` }}
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
