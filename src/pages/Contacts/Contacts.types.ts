/**
 * Данные ссылки контакта.
 */
export interface ContactLink {
  /** Куда ведёт ссылка: URL или `mailto:`-адрес. */
  readonly href: string;
  /**
   * Видимый текст ссылки, например адрес или URL.
   *
   * Используется вместо CTA-подписи: пользователь видит открытый контакт
   * (`https://t.me/...` или `mikhail3468@yandex.ru`), а не «Click to send message».
   */
  readonly label: string;
}

/**
 * Иконка, которая заменяет видимый заголовок контакта.
 *
 * `location` — геометка для местоположения.
 */
export type ContactIcon = 'location';

/**
 * Элемент списка контактов страницы «Контакты».
 *
 * Может содержать либо простой текст (`text`), либо ссылку (`link`).
 * Заголовок и значение рендерятся в одной строке компонентом `ContactItem`.
 * Если задан `icon`, вместо текстового заголовка показывается иконка,
 * а `title` используется как её доступная подпись.
 */
export interface ContactItem {
  readonly id: string;
  readonly title: string;
  readonly text?: string;
  readonly link?: ContactLink;
  /** Иконка вместо видимого текстового заголовка. */
  readonly icon?: ContactIcon;
  /** Добавлять ли класс `text-shadow` заголовку секции. */
  readonly withTextShadow?: boolean;
}
