export interface LocationIconProps {
  /** Текстовая подпись иконки для скринридеров. */
  readonly label: string;
}

/**
 * Иконка точки на карте (геометка).
 *
 * Заменяет видимый заголовок «Location» в списке контактов. Подпись
 * передаётся в `aria-label`, поэтому назначение иконки остаётся понятным
 * вспомогательным технологиям.
 *
 * @param props - пропсы компонента.
 * @param props.label - текстовая подпись иконки.
 * @returns {JSX.Element} SVG-иконка геометки.
 */
export default function LocationIcon({ label }: LocationIconProps) {
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
        d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
    </svg>
  );
}
