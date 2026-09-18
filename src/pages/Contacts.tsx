import { AnimationScale3d } from '../components';
import { styles } from '../shared/constants';
import { getLetters } from './Contacts/model/lib';

export default function Contacts() {
  const contactsString = getLetters('Contacts');

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
          {contactsString.map((letter, index) => (
            <AnimationScale3d key={index}>{letter === ' ' ? '\u00A0' : letter}</AnimationScale3d>
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
