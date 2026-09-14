import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Footer, Navbar } from './components';
import { Contacts, Home, Project, Projects } from './pages';
import ScrollToTop from './components/ScrollToTop';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  </div>
);

export default App;
