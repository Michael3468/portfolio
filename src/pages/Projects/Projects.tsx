import { AnimationScale3d } from '../../components';
import { projectsList, styles, testTasksList } from '../../shared/constants';
import { getLetters } from './model/lib';
import { ProjectsSection } from './Projects.types';
import Project from './UI/Project';

import './Projects.styles.scss';

export default function Projects() {
  const projectsString = getLetters('Projects');
  const testTasksString = getLetters('Test Tasks');

  const projectsSections: ProjectsSection[] = [
    {
      title: projectsString,
      projects: projectsList,
    },
    {
      title: testTasksString,
      projects: testTasksList,
    },
  ];

  return (
    <main className="section">
      {/* Класс 'container' задаёт общую ширину и центрирование контента
          (определён в src/assets/styles/main.css); вынос в SCSS-mixin —
          возможное улучшение для переиспользования в других страницах */}
      <div className="projects-list container">
        {projectsSections.map((item) => (
          <div className="projects-list__block" key={item.title.join('')}>
            <h2 className="title-1" style={{ textShadow: `${styles.mainTheme.textShadow}` }}>
              {item.title.map((letter, index) => (
                <AnimationScale3d key={index}>
                  {letter === ' ' ? '\u00A0' : letter}
                </AnimationScale3d>
              ))}
            </h2>

            <ul className="projects-list__block-items">
              {item.projects.map((project) => (
                <Project
                  key={project.title}
                  title={project.title}
                  img={project.img}
                  id={project.id}
                  background={project.background}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
