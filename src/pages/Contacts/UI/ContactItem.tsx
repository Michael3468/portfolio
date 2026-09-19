import type { ContactItem, ContactLink } from '../Contacts.types';

export interface ContactItemProps {
  readonly item: ContactItem;
}

/**
 * Рендерит ссылку контакта.
 *
 * Если у ссылки установлен флаг `wrapInParagraph`, оборачивает её в абзац `<p>`,
 * иначе возвращает ссылку без обёртки.
 *
 * @param link - данные ссылки контакта.
 * @returns {JSX.Element} Разметка ссылки (возможно, обёрнутой в абзац).
 */
function renderContactLink(link: ContactLink) {
  const anchorElement = (
    <a href={link.href} className="text-shadow">
      {link.label}
    </a>
  );

  return link.wrapInParagraph ? <p>{anchorElement}</p> : anchorElement;
}

/**
 * Элемент списка контактов страницы «Контакты».
 *
 * Рендерит заголовок секции, а также либо текст (`text`), либо ссылку (`link`).
 * Если у ссылки установлен флаг `wrapInParagraph`, она оборачивается в абзац `<p>`.
 *
 * @param props - пропсы компонента.
 * @param props.item - данные контакта.
 * @returns {JSX.Element} Разметка элемента списка контактов.
 */
export default function ContactItem({ item }: ContactItemProps) {
  const { title, text, link, withTextShadow } = item;
  const headingClass = withTextShadow ? 'title-2 text-shadow' : 'title-2';

  const linkElement = link ? renderContactLink(link) : null;

  return (
    <li className="content-list__item">
      <h2 className={headingClass}>{title}</h2>
      {text ? <p>{text}</p> : null}
      {linkElement}
    </li>
  );
}
