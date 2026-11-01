import { Link } from 'react-router-dom';

import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { styles } from '@/shared/constants';

import './styles.css';

type NotFoundProps = {
  /** Текст под заголовком. По умолчанию — «Страница не найдена». */
  readonly message?: string;
};

/**
 * Страница «не найдено».
 *
 * Используется как fallback для неизвестных маршрутов (`*`) и для страницы
 * проекта с несуществующим id. Содержит код 404, пояснение и ссылку на главную.
 *
 * @param props.message - Текст под заголовком.
 * @returns {JSX.Element} Разметка страницы 404.
 */
export default function NotFound({ message = 'Страница не найдена' }: NotFoundProps) {
  useDocumentMeta({
    title: '404 — Portfolio',
    description: 'The page you are looking for does not exist.',
    path: '/',
    noindex: true,
  });

  return (
    <main className="section">
      <div className="container not-found">
        <h1 className="title-1" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
          404
        </h1>

        <p className="not-found__message text-shadow">{message}</p>

        <Link to="/" className="not-found__link">
          На главную
        </Link>
      </div>
    </main>
  );
}
