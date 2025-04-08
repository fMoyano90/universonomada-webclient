import HeroSlider from '../components/HeroSlider';
import DestacadosSection from '../components/DestacadosSection';
import ToursSection from '../components/ToursSection';
import DestacadoTourSection from '../components/DestacadoTourSection';
import PersonalizaTourForm from '../components/PersonalizaTourForm';
import BenefitsSection from '../components/BenefitsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import AboutUsSection from '../components/AboutUsSection';

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      <main className="mt-[35px]">
        <HeroSlider />
        <DestacadosSection />
        <ToursSection />
        <DestacadoTourSection />
        <PersonalizaTourForm />
        <BenefitsSection />
        <TestimonialsSection />
        <AboutUsSection />
      </main>
    </div>
  )
}
