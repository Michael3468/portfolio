import type { ComponentType } from 'react';

import type { ContactIcon, ContactItem } from '@/pages/Contacts/Contacts.types';

import LocationIcon from './LocationIcon';
import TelegramIcon from './TelegramIcon';

export interface ContactItemProps {
  readonly item: ContactItem;
}

/** Компоненты иконок, заменяющих видимые заголовки контактов. */
const CONTACT_ICONS: Record<ContactIcon, ComponentType<{ label: string }>> = {
  location: LocationIcon,
  telegram: TelegramIcon,
};

/**
 * Значение `rel` для ссылок на контакты.
 *
 * `nofollow` — подсказка поисковым системам не переходить по ссылке и не
 * учитывать её при ранжировании. Это дополнение к страничному
 * `<meta name="robots" content="noindex, nofollow">`, который задаётся
 * в `PAGES.contacts` и закрывает от индексации всю страницу контактов.
 */
export const CONTACT_LINK_REL = 'nofollow';

/**
 * Элемент списка контактов страницы «Контакты».
 *
 * Рендерит заголовок секции и значение в одну строку: либо текст (`text`),
 * либо видимую ссылку (`link`) без промежуточной подписи.
 *
 * Особенности разметки:
 * - значение идёт сразу после заголовка в том же `<h2>`, поэтому, например,
 *   получается «Location: St. Petersburg, Russia» без переноса на новую строку;
 * - если задан `icon`, вместо текстового заголовка выводится SVG-иконка,
 *   а `title` становится её доступной подписью (геометка для Location,
 *   самолётик для Telegram);
 * - для ссылки используется `link.label` — открытый адрес или URL
 *   (например, `mikhail3468@yandex.ru`), а не текст вроде «Click to send message»;
 * - ссылка помечается `rel="nofollow"`, чтобы поисковики не переходили по ней
 *   и не учитывали её при ранжировании.
 *
 * @param props - пропсы компонента.
 * @param props.item - данные контакта.
 * @returns {JSX.Element} Разметка элемента списка контактов.
 */
export default function ContactItem({ item }: ContactItemProps) {
  const { title, text, link, icon, withTextShadow } = item;
  // Тень применяется только к Telegram и Email, как задано в CONTACTS_LIST.
  const headingClass = withTextShadow ? 'title-2 text-shadow' : 'title-2';
  const Icon = icon ? CONTACT_ICONS[icon] : null;

  return (
    <li className="content-list__item">
      <h2 className={headingClass}>
        {Icon ? <Icon label={title} /> : `${title}:`}{' '}
        {/*
          `text ??` позволяет показать простое значение (Location), а если его нет —
          отрендерить ссылку. Обёртка `<p>` не используется намеренно: она вернула бы
          перенос значения на новую строку.
        */}
        {text ??
          (link ? (
            <a href={link.href} className="text-shadow" rel={CONTACT_LINK_REL}>
              {link.label}
            </a>
          ) : null)}
      </h2>
    </li>
  );
}
