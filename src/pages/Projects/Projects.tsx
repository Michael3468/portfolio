import { AnimatedTitle } from '@/components/Animations/AnimatedTitle';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { projectsList, testTasksList } from '@/shared/constants';
import { PAGES } from '@/shared/constants/seo';

import { ProjectsSection } from './Projects.types';
import Project from './UI/Project';
import ProjectsSlider from './UI/ProjectsSlider';

import './Projects.styles.css';

/** Секции страницы. Список статичен, поэтому создаётся один раз при загрузке модуля. */
const PROJECTS_SECTIONS: readonly ProjectsSection[] = [
  {
    title: 'PROJECTS',
    projects: projectsList,
    isSlider: true,
  },
  {
    title: 'TEST TASKS',
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
          <div className="projects-list__block" key={item.title}>
            <AnimatedTitle as="h2" title={item.title} />

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
