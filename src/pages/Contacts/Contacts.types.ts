/**
 * Данные ссылки контакта.
 */
export interface ContactLink {
  readonly href: string;
  readonly label: string;
  /** Оборачивать ли ссылку в абзац `<p>`. */
  readonly wrapInParagraph?: boolean;
}

/**
 * Элемент списка контактов страницы «Контакты».
 *
 * Может содержать либо простой текст (`text`), либо ссылку (`link`).
 */
export interface ContactItem {
  readonly id: string;
  readonly title: string;
  readonly text?: string;
  readonly link?: ContactLink;
  /** Добавлять ли класс `text-shadow` заголовку секции. */
  readonly withTextShadow?: boolean;
}
