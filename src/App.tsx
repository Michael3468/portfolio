import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Footer, Navbar, ScrollToTop } from './components';
import { Contacts, Home, Project, Projects } from './pages';

export default function App() {
  return (
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
}
