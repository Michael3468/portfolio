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
 * Элемент списка контактов страницы «Контакты».
 *
 * Может содержать либо простой текст (`text`), либо ссылку (`link`).
 * Заголовок и значение рендерятся в одной строке компонентом `ContactItem`.
 */
export interface ContactItem {
  readonly id: string;
  readonly title: string;
  readonly text?: string;
  readonly link?: ContactLink;
  /** Добавлять ли класс `text-shadow` заголовку секции. */
  readonly withTextShadow?: boolean;
}
