import { LazyMotion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Footer, Navbar, ScrollToTop, SkillBackground } from './components';
import { upsertMeta } from './hooks/useDocumentMeta';
import { THEME_COLORS } from './shared/constants/seo';
import { useDarkModeStore } from './store/darkModeStore';

// Наборы анимаций framer-motion подгружаются отдельным чанком, а не входят в главный бандл.
const loadFeatures = () => import('framer-motion').then((res) => res.domAnimation);

// Страницы подгружаются по маршруту, чтобы не тянуть весь код в главный бандл.
// Импорты идут напрямую из файлов страниц, а не из барреля './pages',
// иначе ленивые чанки не разделились бы.
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const Project = lazy(() => import('./pages/Project/Project'));
const Contacts = lazy(() => import('./pages/Contacts/Contacts'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  // Цвет адресной строки мобильных браузеров следует за выбранной темой сайта
  useEffect(() => {
    upsertMeta('name', 'theme-color', THEME_COLORS[darkMode]);
  }, [darkMode]);

  return (
    // strict: framer-motion выбросит ошибку, если внутри случайно останется motion.* вместо m.*
    <LazyMotion features={loadFeatures} strict>
      <div className="App">
        <SkillBackground />

        <BrowserRouter>
          <ScrollToTop />
          <Navbar />

          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Footer />
        </BrowserRouter>
      </div>
    </LazyMotion>
  );
}
