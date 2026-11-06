export interface EmailIconProps {
  /** Текстовая подпись иконки для скринридеров. */
  readonly label: string;
}

/**
 * Иконка Email (конверт).
 *
 * Заменяет видимый заголовок «Email» в списке контактов. Подпись
 * передаётся в `aria-label`, поэтому назначение иконки остаётся понятным
 * вспомогательным технологиям.
 *
 * @param props - пропсы компонента.
 * @param props.label - текстовая подпись иконки.
 * @returns {JSX.Element} SVG-иконка конверта.
 */
export default function EmailIcon({ label }: EmailIconProps) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
