import { Header } from '../components';

/**
 * Главная страница портфолио.
 *
 * Рендерит шапку сайта (Header) и секцию с перечнем навыков,
 * сгруппированных по направлениям: Frontend и Backend.
 *
 * @returns {JSX.Element} Фрагмент с шапкой и списком навыков.
 */
export default function Home() {
  return (
    <>
      <Header />

      <main className="section">
        <div className="container">
          <ul className="content-list">
            <li className="content-list__item">
              <h2 className="title-2 text-shadow">Frontend</h2>
              <p className="text-shadow">
                HTML, PUG, CSS, SCSS, JavaScript, TypeScript, NextJS, ReactJS, Redux, Redux Toolkit,
                Redux Thunk, MobX, NPM, BootStrap, TailwindCSS, Webpack, Vite
              </p>
            </li>
            <li className="content-list__item">
              <h2 className="title-2 text-shadow">Backend</h2>
              <p className="text-shadow">
                NodeJS, ExpressJS, MongoDB, PostgreSQL, Mongoose, Sequelize, Django REST Framework
              </p>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
