import project21BigSm from '@/shared/assets/img/testProjects/21-big-sm.webp';
import project21Big from '@/shared/assets/img/testProjects/21-big.webp';
import project21 from '@/shared/assets/img/testProjects/21.webp';
import project22BigSm from '@/shared/assets/img/testProjects/22-big-sm.webp';
import project22Big from '@/shared/assets/img/testProjects/22-big.webp';
import project22 from '@/shared/assets/img/testProjects/22.webp';
import project23BigSm from '@/shared/assets/img/testProjects/23-big-sm.webp';
import project23Big from '@/shared/assets/img/testProjects/23-big.webp';
import project23 from '@/shared/assets/img/testProjects/23.webp';
import project29BigSm from '@/shared/assets/img/testProjects/29-big-sm.webp';
import project29Big from '@/shared/assets/img/testProjects/29-big.webp';
import project29 from '@/shared/assets/img/testProjects/29.webp';
import { ProjectItem } from '@/shared/types';

const testTasksList: ProjectItem[] = [
  {
    id: 29,
    title: 'React Landing',
    skills: 'React, Typescript, Vite',
    img: project29,
    bigImg: project29Big,
    bigImgSmall: project29BigSm,
    background: 'rgb(255, 178, 32)',
    gitHubLink: 'https://github.com/Michael3468/astrum-entertainment-test',
    liveDemo: 'https://astrum-entertainment-test.vercel.app/',
  },
  {
    id: 23,
    title: 'React Saga TODO',
    skills: 'React, Typescript, Saga, Vite',
    img: project23,
    bigImg: project23Big,
    bigImgSmall: project23BigSm,
    background: 'rgb(187, 7, 167)',
    gitHubLink: 'https://github.com/Michael3468/react-test-task',
    liveDemo: 'https://react-test-task-rhccoder.vercel.app/',
  },
  {
    id: 22,
    title: 'Vue TODO',
    skills: 'Vue, Typescript, Vite',
    img: project22,
    bigImg: project22Big,
    bigImgSmall: project22BigSm,
    background: 'rgb(63, 251, 11)',
    gitHubLink: 'https://github.com/Michael3468/vue3-test-task-2',
    liveDemo: 'https://vue3-test-task-2.vercel.app',
  },
  {
    id: 21,
    title: 'Vue Landing',
    skills: 'Vue, Typescript, Vite',
    img: project21,
    bigImg: project21Big,
    bigImgSmall: project21BigSm,
    background: 'rgb(94, 69, 185)',
    gitHubLink: 'https://github.com/Michael3468/vue-test-task',
    liveDemo: 'https://vue-test-task-rhccoder.vercel.app/',
  },
];

export default testTasksList;
