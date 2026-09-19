import { CONTACTS_LIST, CONTACTS_TITLE } from './model/constants';
import { AnimatedTitle, ContactItem } from './UI';

/**
 * Страница «Контакты».
 *
 * Рендерит анимированный заголовок первого уровня со словом «Contacts»
 * (компонент `AnimatedTitle`) и список контактов из `CONTACTS_LIST`:
 * местоположение (Санкт-Петербург), ссылка на Telegram и ссылка на Email.
 *
 * @returns {JSX.Element} Разметка страницы «Контакты».
 */
export default function Contacts() {
  return (
    <main className="section">
      <div className="container">
        <AnimatedTitle title={CONTACTS_TITLE} />

        <ul className="content-list">
          {CONTACTS_LIST.map((item) => (
            <ContactItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </main>
  );
}
