import type { ContactItem } from '../Contacts.types';

/**
 * Заголовок страницы «Контакты».
 */
export const CONTACTS_TITLE = 'Contacts';

/**
 * Текст ссылок для отправки сообщения.
 */
export const SEND_MESSAGE_TEXT = 'Click to send message';

/**
 * Ссылка на Telegram.
 */
export const TELEGRAM_URL = 'https://t.me/mikhail3468';

/**
 * Ссылка на Email.
 */
export const EMAIL_URL = 'mailto:mikhail3468@yandex.ru';

/**
 * Текст местоположения.
 */
export const LOCATION_TEXT = 'St. Petersburg, Russia';

/**
 * Список контактов, отображаемых на странице «Контакты».
 */
export const CONTACTS_LIST: readonly ContactItem[] = [
  {
    id: 'location',
    title: 'Location',
    text: LOCATION_TEXT,
  },
  {
    id: 'telegram',
    title: 'Telegram',
    link: {
      href: TELEGRAM_URL,
      label: SEND_MESSAGE_TEXT,
    },
    withTextShadow: true,
  },
  {
    id: 'email',
    title: 'Email',
    link: {
      href: EMAIL_URL,
      label: SEND_MESSAGE_TEXT,
      wrapInParagraph: true,
    },
    withTextShadow: true,
  },
];
