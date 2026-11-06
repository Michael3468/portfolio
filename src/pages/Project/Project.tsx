import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import gitHubIcon from '@/assets/icons/gitHub-black.svg';
import liveDemo from '@/assets/icons/live-demo-icon.svg';
import { ButtonIconWithLink } from '@/components';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import NotFound from '@/pages/NotFound';

import { BUTTON_GRADIENT } from './model/constants';
import { findProjectById } from './model/lib';

import './styles.css';

/**
 * Компонент страницы отдельного проекта.
 *
 * Извлекает идентификатор проекта из параметров маршрута (`id`),
 * находит проект по идентификатору и отображает его детали:
 * название, навыки, обложку и ссылки на GitHub и Live Demo.
 *
 * @returns {JSX.Element} Разметка страницы с деталями проекта.
 */
export default function Project() {
  const { id } = useParams();
  const [imgLoaded, setImgLoaded] = useState(false);

  /**
   * Сброс флага загрузки обложки при смене проекта.
   *
   * Компонент не размонтируется при переходе между проектами
   * (изменяется только параметр маршрута `id`), поэтому без сброса
   * `imgLoaded` остаётся `true` и анимация появления новой обложки
   * не отрабатывает.
   */
  useEffect(() => {
    setImgLoaded(false);
  }, [id]);

  const project = findProjectById(id);

  useDocumentMeta(
    project
      ? {
          title: `${project.title} — Portfolio`,
          description: `Skills: ${project.skills}`,
          path: `/project/${project.id}`,
        }
      : {
          title: 'Project not found — Portfolio',
          description: 'The project you are looking for does not exist.',
          path: '/',
          noindex: true,
        },
  );

  if (!project) {
    return <NotFound message="Проект не найден" />;
  }

  /**
   * Обработчик события загрузки изображения проекта.
   *
   * Устанавливает флаг `imgLoaded` в значение `true`,
   * что запускает анимацию появления обложки проекта.
   */
  const handleImgLoaded = () => {
    setImgLoaded(true);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="project-details">
          <h1 className="title-1 main-text-shadow">{project.title}</h1>

          <div className="project-details__desc text-shadow">
            <p>{`Skills: ${project.skills}`}</p>
          </div>

          <div
            className={`project-details__container ${
              imgLoaded ? 'project-details__container__loaded' : ''
            }`}
            style={{
              background: `${project.background}`,
            }}
          >
            <img
              src={project.bigImg}
              srcSet={`${project.bigImgSmall} 800w, ${project.bigImg} 1200w`}
              sizes="(max-width: 54.0625rem) 100vw, 54.0625rem"
              alt={project.title}
              className={`project-details__cover ${
                imgLoaded ? 'project-details__cover_loaded' : ''
              }`}
              onLoad={handleImgLoaded}
            />
          </div>

          <div>
            <ButtonIconWithLink
              link={project.gitHubLink}
              buttonText="GitHub"
              img={gitHubIcon}
              altText="github repo"
              backgroundColor={BUTTON_GRADIENT}
              style={{ marginBottom: 10 }}
            />

            <ButtonIconWithLink
              link={project.liveDemo}
              buttonText="Live Demo"
              img={liveDemo}
              altText="live demo"
              backgroundColor={BUTTON_GRADIENT}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
