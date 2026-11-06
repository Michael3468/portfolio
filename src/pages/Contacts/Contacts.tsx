import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PAGES } from '@/shared/constants/seo';

import { CONTACTS_LIST, CONTACTS_TITLE } from './model/constants';
import { AnimatedTitle, ContactItem } from './UI';

/**
 * Страница «Контакты».
 *
 * Рендерит анимированный заголовок первого уровня со словом «Contacts»
 * (компонент `AnimatedTitle`) и список контактов из `CONTACTS_LIST`:
 * местоположение (Санкт-Петербург), ссылка на Telegram и ссылка на Email.
 *
 * `useDocumentMeta(PAGES.contacts)` выставляет для страницы
 * `<meta name="robots" content="noindex, nofollow">`: контактные данные
 * не должны попадать в поисковую выдачу. Дополнительно сами ссылки
 * помечаются `rel="nofollow"` в компоненте `ContactItem`.
 *
 * @returns {JSX.Element} Разметка страницы «Контакты».
 */
export default function Contacts() {
  useDocumentMeta(PAGES.contacts);

  return (
    <main className="section">
      <div className="container">
        <div style={{ marginBottom: '80px' }}>
          <AnimatedTitle title={CONTACTS_TITLE} />
        </div>

        <ul className="content-list">
          {CONTACTS_LIST.map((item) => (
            <ContactItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </main>
  );
}
