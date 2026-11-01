import project10BigSm from '@/shared/assets/img/projects/10-big-sm.webp';
import project10Big from '@/shared/assets/img/projects/10-big.webp';
import project10 from '@/shared/assets/img/projects/10.webp';
import project11BigSm from '@/shared/assets/img/projects/11-big-sm.webp';
import project11Big from '@/shared/assets/img/projects/11-big.webp';
import project11 from '@/shared/assets/img/projects/11.webp';
import project12BigSm from '@/shared/assets/img/projects/12-big-sm.webp';
import project12Big from '@/shared/assets/img/projects/12-big.webp';
import project12 from '@/shared/assets/img/projects/12.webp';
import project13BigSm from '@/shared/assets/img/projects/13-big-sm.webp';
import project13Big from '@/shared/assets/img/projects/13-big.webp';
import project13 from '@/shared/assets/img/projects/13.webp';
import project14BigSm from '@/shared/assets/img/projects/14-big-sm.webp';
import project14Big from '@/shared/assets/img/projects/14-big.webp';
import project14 from '@/shared/assets/img/projects/14.webp';
import project15BigSm from '@/shared/assets/img/projects/15-big-sm.webp';
import project15Big from '@/shared/assets/img/projects/15-big.webp';
import project15 from '@/shared/assets/img/projects/15.webp';
import { ProjectItem } from '@/shared/types';

const projectsList: ProjectItem[] = [
  {
    id: 15,
    title: 'React Landing',
    skills: 'React, TailwindCSS, Vite',
    img: project15,
    bigImg: project15Big,
    bigImgSmall: project15BigSm,
    background: 'rgb(0, 219, 255)',
    gitHubLink: 'https://github.com/Michael3468/bank-modern',
    liveDemo: 'https://bank-modern-rhccoder.vercel.app/',
  },
  {
    id: 14,
    title: 'Blog',
    skills: 'MongoDB, ExpressJS, React, Node.js, Mongoose, Axios',
    img: project14,
    bigImg: project14Big,
    bigImgSmall: project14BigSm,
    background: 'rgb(76, 230, 7)',
    gitHubLink: 'https://github.com/Michael3468/mern-blog',
    liveDemo: 'https://mern-blog-fipk.onrender.com/',
  },
  {
    id: 13,
    title: 'Social',
    skills: 'Next.js, Next-Auth, Emoji-Mart, TailwindCSS, TypeScript, RecoilJS, Firebase',
    img: project13,
    bigImg: project13Big,
    bigImgSmall: project13BigSm,
    background: 'rgb(98, 0, 153)',
    gitHubLink: 'https://github.com/Michael3468/twitter-clone',
    liveDemo: 'https://twitter-clone-rhccoder.vercel.app/',
  },
  {
    id: 12,
    title: 'jQuery plugin',
    skills: 'Pug, SCSS, jQuery, TypeScript, Jest, MVP, Webpack',
    img: project12,
    bigImg: project12Big,
    bigImgSmall: project12BigSm,
    background: 'rgb(54, 54, 255)',
    gitHubLink: 'https://github.com/Michael3468/RangeSlider',
    liveDemo: 'https://Michael3468.github.io/RangeSlider/',
  },
  {
    id: 11,
    title: 'Booking Service',
    skills: 'Pug, SCSS, JavaScript, Webpack',
    img: project11,
    bigImg: project11Big,
    bigImgSmall: project11BigSm,
    background: 'rgb(0, 255, 143)',
    gitHubLink: 'https://github.com/Michael3468/BookingService',
    liveDemo: 'https://Michael3468.github.io/BookingService/',
  },
  {
    id: 10,
    title: 'Landing',
    skills: 'Pug, SCSS, JavaScript, jQuery',
    img: project10,
    bigImg: project10Big,
    bigImgSmall: project10BigSm,
    background: 'rgb(236, 213, 13)',
    gitHubLink: 'https://github.com/Michael3468/LuxRest',
    liveDemo: 'https://Michael3468.github.io/LuxRest/',
  },
];

export default projectsList;
