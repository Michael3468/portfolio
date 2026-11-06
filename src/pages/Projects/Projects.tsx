import { AnimationScale3d } from '@/components';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { projectsList, testTasksList } from '@/shared/constants';
import { PAGES } from '@/shared/constants/seo';
import { getLetters, replaceSpaceWithNbsp } from '@/shared/lib';

import { ProjectsSection } from './Projects.types';
import Project from './UI/Project';
import ProjectsSlider from './UI/ProjectsSlider';

import './Projects.styles.css';

/** Секции страницы. Список статичен, поэтому создаётся один раз при загрузке модуля. */
const PROJECTS_SECTIONS: readonly ProjectsSection[] = [
  {
    title: getLetters('PROJECTS'),
    projects: projectsList,
    isSlider: true,
  },
  {
    title: getLetters('TEST TASKS'),
    projects: testTasksList,
    isSlider: true,
  },
];

export default function Projects() {
  useDocumentMeta(PAGES.projects);

  return (
    <main className="section">
      {/* Класс 'container' задаёт общую ширину и центрирование контента
          (определён в src/assets/styles/main.css) */}
      <div className="projects-list container">
        {PROJECTS_SECTIONS.map((item) => (
          <div className="projects-list__block" key={item.title.join('')}>
            <h2 className="title-1 main-text-shadow">
              {item.title.map((letter, index) => (
                <AnimationScale3d key={index + letter}>
                  {replaceSpaceWithNbsp(letter)}
                </AnimationScale3d>
              ))}
            </h2>

            {item.isSlider ? (
              <ProjectsSlider projects={item.projects} />
            ) : (
              <ul className="projects-list__block-items">
                {item.projects.map((project) => (
                  <Project
                    key={project.id}
                    title={project.title}
                    img={project.img}
                    id={project.id}
                    background={project.background}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
