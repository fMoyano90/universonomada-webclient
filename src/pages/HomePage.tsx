import {
  HeroSlider,
  DestacadosSection,
  BenefitsSection,
  TestimonialsSection,
  AboutUsSection
} from '../components';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <DestacadosSection />
      <BenefitsSection />
      <TestimonialsSection />
      <AboutUsSection />
    </div>
  );
};

export default HomePage;
