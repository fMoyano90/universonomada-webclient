import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Mantenemos las imágenes estáticas como respaldo
import machuPicchu from '../assets/images/machu/machu picchu.jpg';
import sanPedroAtacama from '../assets/images/san pedro de atacama/san pedro de atacama.jpg';
import salarUyuni from '../assets/images/uyuni/salar-de-uyuni-bolivia-Respaldo-Portada.avif';

interface Slider {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  location: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

const HeroSlider = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de ejemplo como respaldo si la API falla
  const fallbackSlides = [
    {
      id: 1,
      imageUrl: machuPicchu,
      title: 'MACHU PICCHU',
      subtitle: 'Experiencias únicas en los paisajes más impresionantes',
      location: 'PERÚ',
      isActive: true,
      displayOrder: 0
    },
    {
      id: 2,
      imageUrl: sanPedroAtacama,
      title: 'SAN PEDRO DE ATACAMA',
      subtitle: 'Historia, cultura y gastronomía en un solo lugar',
      location: 'CHILE',
      isActive: true,
      displayOrder: 1
    },
    {
      id: 3,
      imageUrl: salarUyuni,
      title: 'SALAR DE UYUNI',
      subtitle: 'Naturaleza impresionante y experiencias auténticas',
      location: 'BOLIVIA',
      isActive: true,
      displayOrder: 2
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  // Cargar los sliders desde la API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/sliders`);
        
        // Manejar respuesta anidada
        let slidersData;
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          slidersData = response.data.data;
        } else if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          slidersData = response.data.data.data;
        } else {
          throw new Error('Formato de datos inesperado');
        }
        
        // Filtrar solo los sliders activos
        const activeSliders = slidersData.filter((slider: Slider) => slider.isActive);
        
        // Ordenar por displayOrder
        const sortedSliders = activeSliders.sort((a: Slider, b: Slider) => a.displayOrder - b.displayOrder);
        
        if (sortedSliders.length > 0) {
          setSliders(sortedSliders);
        } else {
          // Si no hay sliders activos, usar los de respaldo
          console.log('No se encontraron sliders activos, usando respaldo');
          setSliders(fallbackSlides);
        }
      } catch (err) {
        console.error('Error al cargar los sliders:', err);
        setError('No se pudieron cargar los sliders');
        // Usar los sliders de respaldo en caso de error
        setSliders(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const announcements = [
    "🌟 Tenemos los mejores destinos para tus vacaciones de otoño/invierno 🌟", 
    "Nuestros viajes son todo coordinado ✈️ 🧳 🚌", 
    "Black Sale Geoterra!🌎✨",
    "Conoce las promociones de temporada"
  ];

  // Función para cambiar a la siguiente diapositiva
  const nextSlide = () => {
    if (sliders.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
  };

  // Función para cambiar a la diapositiva anterior
  const prevSlide = () => {
    if (sliders.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliders.length) % sliders.length);
  };

  // Cambio automático de diapositivas
  useEffect(() => {
    // Solo iniciar el temporizador si hay más de 1 slider
    if (sliders.length <= 1) return;
    
    const startTimeout = () => {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 6000); // 6 segundos para cada slider
    };

    startTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, sliders.length]);

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

  // Si no hay sliders o todavía están cargando, mostrar una pantalla de carga
  if (loading || sliders.length === 0) {
    return (
      <div className="w-full h-[75vh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue mx-auto mb-4"></div>
          ) : (
            <div className="text-2xl font-bold text-gray-500">No hay destinos disponibles</div>
          )}
        </div>
      </div>
    );
  }

  // Si hay un error y no hay sliders, mostrar mensaje de error
  if (error && sliders.length === 0) {
    return (
      <div className="w-full h-[75vh] flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const currentSlider = sliders[currentIndex];

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
                backgroundImage: `url(${currentSlider.imageUrl})`,
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
                      {currentSlider.location}
                    </motion.h2>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl md:text-7xl font-bold text-center md:text-right mb-4 tracking-wider"
                    >
                      {currentSlider.title}
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
                        <p className="mb-4 text-xl">{currentSlider.subtitle}</p>
                        {currentSlider.buttonText && (
                          <a 
                            href={currentSlider.buttonUrl || '#'} 
                            className="inline-block bg-white text-primary-blue-dark hover:bg-primary-orange hover:text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md"
                          >
                            {currentSlider.buttonText}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación - mostrar solo si hay más de 1 slider */}
        {sliders.length > 1 && (
          <>
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
              {sliders.map((_, index) => (
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
          </>
        )}
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