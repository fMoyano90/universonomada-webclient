import {
  HeroSlider,
  DestacadosSection,
  BenefitsSection,
  TestimonialsSection,
  AboutUsSection,
  ToursSection,
  DestacadoTourSection
} from '../components';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <DestacadosSection />
      <ToursSection />
      <DestacadoTourSection />
      <BenefitsSection />
      <TestimonialsSection />
      <AboutUsSection />
    </div>
  );
};

export default HomePage;
