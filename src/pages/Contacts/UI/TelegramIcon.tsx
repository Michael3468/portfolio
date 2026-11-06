export interface TelegramIconProps {
  /** Текстовая подпись иконки для скринридеров. */
  readonly label: string;
}

/**
 * Иконка Telegram (бумажный самолётик).
 *
 * Заменяет видимый заголовок «Telegram» в списке контактов. Подпись
 * передаётся в `aria-label`, поэтому назначение иконки остаётся понятным
 * вспомогательным технологиям.
 *
 * @param props - пропсы компонента.
 * @param props.label - текстовая подпись иконки.
 * @returns {JSX.Element} SVG-иконка Telegram.
 */
export default function TelegramIcon({ label }: TelegramIconProps) {
  return (
    <svg
      className="contact-item__icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path
        d="M22 2 11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2 15 22 11 13 2 9 22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
