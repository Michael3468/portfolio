import type { ContactItem } from '@/pages/Contacts/Contacts.types';

/**
 * Заголовок страницы «Контакты».
 */
export const CONTACTS_TITLE = 'Contacts';

/**
 * Ссылка на Telegram.
 *
 * Используется и как `href`, и как видимый текст ссылки — пользователь видит
 * открытый адрес, а не подпись «Click to send message».
 */
export const TELEGRAM_URL = 'https://t.me/mikhail3468';

/**
 * Адрес электронной почты в человекочитаемом виде.
 *
 * Хранится отдельно от `EMAIL_URL`, потому что в интерфейсе нужно показать
 * сам адрес, а в `href` — ссылку с префиксом `mailto:`.
 */
export const EMAIL_ADDRESS = 'mikhail3468@yandex.ru';

/**
 * Ссылка на Email для атрибута `href` (открывает почтовый клиент).
 */
export const EMAIL_URL = `mailto:${EMAIL_ADDRESS}`;

/**
 * Текст местоположения.
 */
export const LOCATION_TEXT = 'St. Petersburg, Russia';

/**
 * Список контактов, отображаемых на странице «Контакты».
 *
 * У каждого элемента `title` и значение рендерятся в одной строке компонентом
 * `ContactItem`. Для ссылок `label` — это открытый адрес/URL: у Telegram
 * показывается полный URL, у Email — адрес без `mailto:`.
 *
 * Сама страница закрыта от индексации флагом `noindex` в `PAGES.contacts`,
 * поэтому контактные данные не попадают в поисковую выдачу.
 */
export const CONTACTS_LIST: readonly ContactItem[] = [
  {
    id: 'location',
    title: 'Location',
    icon: 'location',
    text: LOCATION_TEXT,
  },
  {
    id: 'telegram',
    title: 'Telegram',
    icon: 'telegram',
    link: {
      // href ведёт на Telegram, а label показывает этот же URL пользователю.
      href: TELEGRAM_URL,
      label: TELEGRAM_URL,
    },
    withTextShadow: true,
  },
  {
    id: 'email',
    title: 'Email',
    icon: 'email',
    link: {
      // href открывает почтовый клиент, а label показывает чистый адрес.
      href: EMAIL_URL,
      label: EMAIL_ADDRESS,
    },
    withTextShadow: true,
  },
];
