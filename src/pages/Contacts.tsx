import { AnimationScale3d } from '../components';
import { styles } from '../shared/constants';
import { getLetters, replaceSpaceWithNbsp } from './Contacts/model/lib';

/**
 * Страница «Контакты».
 *
 * Рендерит заголовок первого уровня с анимированными буквами слова
 * «Contacts» (буквы разбиваются через `getLetters` и оборачиваются
 * в компонент `AnimationScale3d`; пробелы заменяются на неразрывные).
 *
 * Ниже заголовка выводится список контактов: местоположение
 * (Санкт-Петербург), ссылка на Telegram и ссылка на Email.
 *
 * @returns {JSX.Element} Разметка страницы «Контакты».
 */
export default function Contacts() {
  const contactsString = getLetters('Contacts');

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
          {contactsString.map((letter, index) => (
            <AnimationScale3d key={`${index}-${letter}`}>{replaceSpaceWithNbsp(letter)}</AnimationScale3d>
          ))}
        </h1>

        <ul className="content-list">
          <li className="content-list__item">
            <h2 className="title-2">Location</h2>
            <p>St. Petersburg, Russia</p>
          </li>

          <li className="content-list__item">
            <h2 className="title-2 text-shadow">Telegram</h2>
            <a href="https://t.me/mikhail3468" className="text-shadow">
              Click to send message
            </a>
          </li>

          <li className="content-list__item">
            <h2 className="title-2 text-shadow">Email</h2>
            <p>
              <a href="mailto:mikhail3468@yandex.ru" className="text-shadow">
                Click to send message
              </a>
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
