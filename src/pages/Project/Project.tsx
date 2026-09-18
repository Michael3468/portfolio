import { useState } from 'react';
import { useParams } from 'react-router-dom';

import gitHubIcon from '../../assets/icons/gitHub-black.svg';
import liveDemo from '../../assets/icons/live-demo-icon.svg';
import { ButtonIconWithLink } from '../../components';
import { styles } from '../../shared/constants';
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

  const project = findProjectById(id);

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
          <h1 className="title-1" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
            {project.title}
          </h1>

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
