import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Testimonial } from './interfaces';
import testimonialService from '../services/testimonial.service';
import { FaStar, FaRegStar } from 'react-icons/fa';

const TestimonialsSection = () => {
  // Estado para el carrusel y los datos
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carga de datos
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialService.getLatestTestimonials(8);
        setTestimonials(data);
      } catch (error) {
        console.error('Error al cargar los testimonios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  // Calcular número máximo de páginas
  const maxSlides = Math.ceil(testimonials.length / 3);

  // Auto-avance del carrusel
  useEffect(() => {
    if (maxSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === maxSlides - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [maxSlides]);

  // Navegar a testimonio anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxSlides - 1 : prevIndex - 1
    );
  };

  // Navegar a testimonio siguiente
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === maxSlides - 1 ? 0 : prevIndex + 1
    );
  };

  // Navegar a un testimonio específico
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Renderizar estrellas de calificación
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-primary-orange">
          {i < rating ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
    return stars;
  };

  // Componente de carga
  if (loading) {
    return (
      <section className="py-20 px-4 bg-white relative">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Nuestros Viajeros</h2>
          <div className="w-20 h-1 bg-primary-orange mx-auto rounded-full mb-6"></div>
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay testimonios, no mostrar la sección
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-white relative">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 opacity-5 z-0" 
           style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Nuestros Viajeros</h2>
          <div className="w-20 h-1 bg-primary-orange mx-auto rounded-full mb-6"></div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              {renderStars(5)}
              <span className="ml-2 text-gray-700 font-medium">{testimonials.length} Reseñas</span>
            </div>
          </div>
        </motion.div>

        {/* Carrusel de testimonios con espacio adicional para las flechas */}
        <div className="relative mx-10">
          {/* Botones de navegación colocados fuera del contenedor principal */}
          {maxSlides > 1 && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 -ml-6 hover:bg-gray-100"
                aria-label="Testimonio anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide} 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 -mr-6 hover:bg-gray-100"
                aria-label="Testimonio siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <motion.div 
              className="flex transition-transform duration-500"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              {/* Agrupar testimonios en slides de 3 para pantallas grandes */}
              {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 box-border py-4">
                  {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial) => (
                    <div key={testimonial.id} className="flex justify-center pb-8">
                      <motion.div 
                        className="bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {testimonial.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={testimonial.image_url} 
                              alt={`Foto de viaje de ${testimonial.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                          <div className="flex my-1">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-gray-700 text-sm mt-2 line-clamp-5">{testimonial.testimonial_text}</p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Indicadores de navegación */}
          {maxSlides > 1 && (
            <div className="flex justify-center mt-8">
              {Array.from({ length: maxSlides }).map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 mx-1 rounded-full ${currentIndex === index ? 'bg-primary-orange' : 'bg-gray-300'}`}
                  aria-label={`Ir al grupo de testimonios ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 