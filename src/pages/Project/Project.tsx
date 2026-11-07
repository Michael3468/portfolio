import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import gitHubIcon from '@/assets/icons/gitHub-black.svg';
import liveDemo from '@/assets/icons/live-demo-icon.svg';
import { ButtonIconWithLink } from '@/components';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import NotFound from '@/pages/NotFound';

import { BUTTON_GRADIENT } from './model/constants';
import { findProjectById, getParallaxTransform } from './model/lib';

import './styles.css';

/**
 * Компонент страницы отдельного проекта.
 *
 * Извлекает идентификатор проекта из параметров маршрута (`id`),
 * находит проект по идентификатору и отображает его детали:
 * название, навыки, обложку и ссылки на GitHub и Live Demo.
 *
 * Обложка проекта — секция mouse-parallax: её фоновый слой (`mouse-parallax-bg`)
 * сдвигается против движения курсора мыши на величину до 50 пикселей.
 *
 * @returns {JSX.Element} Разметка страницы с деталями проекта.
 */
export default function Project() {
  const { id } = useParams();
  const [imgLoaded, setImgLoaded] = useState(false);

  /**
   * Ссылки на фоновые слои всех секций mouse-parallax на странице.
   *
   * Индексы массива позволяют поддерживать несколько секций параллакса:
   * каждая секция сохраняет свой DOM-узел через callback ref.
   */
  const parallaxBgRefs = useRef<Array<HTMLDivElement | null>>([]);

  /**
   * Подписка на движение мыши для параллакса фоновых слоёв.
   *
   * Один обработчик на `window` двигает все секции параллакса синхронно,
   * как в образце: `translate(-(x * 50)px, -(y * 50)px)`. Подписка снимается
   * при размонтировании компонента. При `prefers-reduced-motion: reduce`
   * параллакс не включается вовсе.
   */
  useEffect(() => {
    // Пользователь просил уменьшить анимацию — оставляем фон статичным.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layers = parallaxBgRefs.current.filter(
      (layer): layer is HTMLDivElement => layer !== null,
    );
    if (layers.length === 0) return;

    const handleMouseMove = (event: MouseEvent) => {
      const transform = getParallaxTransform(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      );

      layers.forEach((layer) => {
        layer.style.transform = transform;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  /**
   * Сброс флага загрузки обложки при смене проекта и предзагрузка большого
   * изображения обложки.
   *
   * Компонент не размонтируется при переходе между проектами
   * (изменяется только параметр маршрута `id`), поэтому без сброса
   * `imgLoaded` остаётся `true` и анимация появления новой обложки
   * не отрабатывает. Обложка теперь фоновый слой параллакса, поэтому
   * загрузка отслеживается через `new Image()` без вывода `<img>`.
   */
  useEffect(() => {
    setImgLoaded(false);

    const project = findProjectById(id);
    if (!project) return;

    const image = new Image();
    image.onload = () => setImgLoaded(true);
    image.src = project.bigImg;

    return () => {
      image.onload = null;
    };
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
            {/* Секция mouse-parallax: фоновый слой с большой картинкой проекта. */}
            <div className="mouse-parallax">
              <div
                ref={(element) => {
                  parallaxBgRefs.current[0] = element;
                }}
                className="mouse-parallax-bg"
                style={{ backgroundImage: `url("${project.bigImg}")` }}
                role="img"
                aria-label={project.title}
              />
            </div>
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
