import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Importar imágenes de los destinos
import machuPicchu from '../assets/images/machu/machu picchu.jpg';
import sanPedroAtacama from '../assets/images/san pedro de atacama/san pedro de atacama.jpg';
import salarUyuni from '../assets/images/uyuni/salar-de-uyuni-bolivia-Respaldo-Portada.avif';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  location: string;
}

const HeroSlider = () => {
  // Datos de ejemplo para las diapositivas (con imágenes desde assets)
  const slides: Slide[] = [
    {
      id: 1,
      image: machuPicchu,
      title: 'MACHU PICCHU',
      subtitle: 'Experiencias únicas en los paisajes más impresionantes',
      location: 'PERÚ'
    },
    {
      id: 2,
      image: sanPedroAtacama,
      title: 'SAN PEDRO DE ATACAMA',
      subtitle: 'Historia, cultura y gastronomía en un solo lugar',
      location: 'CHILE'
    },
    {
      id: 3,
      image: salarUyuni,
      title: 'SALAR DE UYUNI',
      subtitle: 'Naturaleza impresionante y experiencias auténticas',
      location: 'BOLIVIA'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const announcements = [
    "🌟 Tenemos los mejores destinos para tus vacaciones de otoño/invierno 🌟", 
    "Nuestros viajes son todo coordinado ✈️ 🧳 🚌", 
    "Black Sale Geoterra!🌎✨",
    "Conoce las promociones de temporada"
  ];

  // Función para cambiar a la siguiente diapositiva
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Función para cambiar a la diapositiva anterior
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Cambio automático de diapositivas
  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 6000); // Aumentamos a 6 segundos para dar más tiempo para ver cada imagen
    };

    startTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Variantes de animación para las diapositivas
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative overflow-hidden">
      {/* Slider principal */}
      <div className="relative w-full h-[75vh]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div 
              className="w-full h-full bg-center bg-cover bg-no-repeat" 
              style={{ 
                backgroundImage: `url(${slides[currentIndex].image})`,
                backgroundPosition: 'center 25%', // Ajustar posición vertical
                backgroundColor: '#3D667A' // Color de respaldo mientras carga la imagen
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 flex flex-col justify-center items-center text-white">
                <div className="flex flex-col md:flex-row items-center justify-center h-full w-full">
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-8">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg md:text-xl mb-2 tracking-widest text-primary-orange font-bold bg-gray-900 pr-2 pl-2 rounded-lg"
                    >
                      {slides[currentIndex].location}
                    </motion.h2>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl md:text-7xl font-bold text-center md:text-right mb-4 tracking-wider"
                    >
                      {slides[currentIndex].title}
                    </motion.h1>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="md:pl-8 text-center md:text-left"
                    >
                      <div className="bg-primary-orange/80 text-white px-6 py-8 rounded-lg backdrop-blur-sm max-w-md shadow-xl">
                        <h2 className="text-2xl font-bold mb-3">Temporada<br/>Otoño/Invierno</h2>
                        <p className="mb-4">{slides[currentIndex].subtitle}</p>
                        <button className="bg-white text-primary-blue-dark hover:bg-primary-orange hover:text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md">
                          Cotiza tu viaje
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center text-white z-10 backdrop-blur-sm transition-all shadow-md"
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center text-white z-10 backdrop-blur-sm transition-all shadow-md"
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de diapositiva */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary-orange w-10' : 'bg-white/60 w-3'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Texto en movimiento (marquee) */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-yellow-100 py-3 text-black">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="whitespace-nowrap flex items-center"
        >
          {announcements.map((announcement, index) => (
            <span key={index} className="mx-8 text-lg font-medium">
              {announcement}
            </span>
          ))}
          {/* Repetir para efecto continuo */}
          {announcements.map((announcement, index) => (
            <span key={`repeat-${index}`} className="mx-8 text-lg font-medium">
              {announcement}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSlider; 