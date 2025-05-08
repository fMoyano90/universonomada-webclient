import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import DestinacionalesPage from './pages/DestinacionalesPage';
import InternacionalesPage from './pages/InternacionalesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import AdminSubscriptionsPage from './pages/AdminSubscriptionsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminSlidersPage from './pages/AdminSlidersPage'; // Import Sliders Page
import AdminDestinationsPage from './pages/AdminDestinationsPage'; // Import Destinations Page
import AdminTestimonialsPage from './pages/AdminTestimonialsPage'; // Import Testimonials Page
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

// Component to conditionally render Navbar and Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/destino/:id" element={<MainLayout><DestinationDetailPage /></MainLayout>} />
        <Route path="/destinos/:id" element={<MainLayout><DestinationDetailPage /></MainLayout>} />
        <Route path="/destinos-nacionales" element={<MainLayout><DestinacionalesPage /></MainLayout>} />
        <Route path="/destinos-internacionales" element={<MainLayout><InternacionalesPage /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />

        {/* Admin Login Route (doesn't use MainLayout or AdminLayout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes (use AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="sliders" element={<AdminSlidersPage />} />
          <Route path="destinations" element={<AdminDestinationsPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
