import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import DestinacionalesPage from './pages/DestinacionalesPage';
import InternacionalesPage from './pages/InternacionalesPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Componente para manejar el scroll al inicio cuando cambia la ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/destino/:id" element={<DestinationDetailPage />} />
        <Route path="/destinos-nacionales" element={<DestinacionalesPage />} />
        <Route path="/destinos-internacionales" element={<InternacionalesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
