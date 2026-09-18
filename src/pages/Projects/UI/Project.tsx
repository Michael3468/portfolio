import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useDarkModeStore } from '../../../atoms/darkModeState';
import { DEFAULT_SHADOW_COLOR, INNER_SHADOW_COLOR_DARK } from './model/constants';

import './Project.css';
import '../../../assets/styles/pulse-animation.css';

/**
 * Пропсы компонента карточки проекта.
 */
export interface ProjectProps {
  readonly title: string;
  readonly img: string;
  readonly id: number;
  readonly background: string;
}

/**
 * Компонент карточки проекта.
 *
 * Отображает превью проекта в виде элемента списка со ссылкой на страницу
 * проекта. При наличии изображения показывает его внутри контейнера с фоном;
 * в тёмной теме цвет подсветки карточки берётся из пропа `background`.
 *
 * @param props.title - Название проекта.
 * @param props.img - URL изображения проекта.
 * @param props.id - Идентификатор проекта.
 * @param props.background - Цвет фона контейнера в тёмной теме.
 * @returns Элемент списка с карточкой проекта.
 */
export default function Project({ title, img, id, background }: ProjectProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [projectShadowColor, setProjectShadowColor] = useState<string>(DEFAULT_SHADOW_COLOR);
  const [innerShadow, setInnerShadow] = useState<string>(DEFAULT_SHADOW_COLOR);
  const darkModeLocalStorageValue = useDarkModeStore((state) => state.darkMode);

  /**
   * Обработчик успешной загрузки изображения: устанавливает флаг `imgLoaded`.
   */
  const handleImgLoaded = () => {
    setImgLoaded(true);
  };

  useEffect(() => {
    setProjectShadowColor(darkModeLocalStorageValue === 'dark' ? background : DEFAULT_SHADOW_COLOR);
    setInnerShadow(
      darkModeLocalStorageValue === 'dark' ? INNER_SHADOW_COLOR_DARK : DEFAULT_SHADOW_COLOR,
    );
  }, [background, darkModeLocalStorageValue]);

  return (
    <li
      className="project pulse-animation"
      style={
        !img
          ? {
              display: 'flex',
              alignItems: 'center',
              boxShadow: `0 0 11px ${projectShadowColor}`,
            }
          : {
              boxShadow: `0 0 11px ${projectShadowColor}`,
            }
      }
    >
      <NavLink
        to={`/project/${id}`}
        style={{
          width: 'inherit',
          maxWidth: 'inherit',
          borderRadius: 'inherit',
          boxShadow: `0 0 10px ${innerShadow} inset`,
        }}
      >
        {img && (
          <div
            className="project__container"
            style={{
              background,
            }}
          >
            <img
              src={img}
              alt={title}
              className={`project__img ${imgLoaded ? 'project__img_loaded' : ''}`}
              onLoad={handleImgLoaded}
            />
          </div>
        )}
        <h3 className="project__title">{title}</h3>
      </NavLink>
    </li>
  );
}
