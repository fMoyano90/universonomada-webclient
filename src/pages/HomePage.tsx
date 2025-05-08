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

const HomePage = () => {
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
    </div>
  );
};

export default HomePage;
