import {
  HeroSlider,
  DestacadosSection,
  BenefitsSection,
  TestimonialsSection,
  AboutUsSection,
  ToursSection,
  DestacadoTourSection,
  PersonalizaTourForm
} from '../components';
import SubscriptionModal from '../components/SubscriptionModal';
import useSubscriptionModal from '../hooks/useSubscriptionModal';

const HomePage = () => {
  const { isModalOpen, closeModal } = useSubscriptionModal({
    delayMs: 30000, // 30 segundos
    enableExitIntent: true,
  });

  return (
    <div className="min-h-screen">
      <HeroSlider />
      <DestacadosSection />
      <ToursSection />
      <DestacadoTourSection />
      <PersonalizaTourForm />
      <BenefitsSection />
      <TestimonialsSection />
      <AboutUsSection />
      
      {/* Modal de suscripción */}
      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default HomePage;
