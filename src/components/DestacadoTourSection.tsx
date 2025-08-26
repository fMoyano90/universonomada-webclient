import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import destinationService from '../services/destination.service';

// Tipos para el destino destacado
interface FeaturedDestination {
  id: number;
  title: string;
  slug: string;
  imageSrc: string;
  description: string;
  duration?: string;
  type?: string;
  location?: string;
  galleryImages?: Array<{id: number, imageUrl: string, destinationId: number}>;
}

const DestacadoTourSection = () => {
  const [featuredDestination, setFeaturedDestination] = useState<FeaturedDestination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchFeaturedDestination = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getLatestSpecialDestination();
        
        console.log('DestacadoTourSection - Respuesta completa:', response);
        
        // Detectar la estructura de la respuesta y extraer el destino destacado
        let featuredData: FeaturedDestination | null = null;
        
        if (response && typeof response === 'object') {
          // Si la respuesta es un objeto con propiedades que coinciden con FeaturedDestination
          if (response.id && response.title && response.imageSrc) {
            console.log('DestacadoTourSection - Usando respuesta directa');
            featuredData = response as FeaturedDestination;
          }
          // Si la respuesta tiene una propiedad data que contiene el destino
          else if (response.data && typeof response.data === 'object' && response.data.id) {
            console.log('DestacadoTourSection - Usando response.data');
            featuredData = response.data as FeaturedDestination;
          }
        }
        
        if (featuredData) {
          console.log('DestacadoTourSection - Destino destacado encontrado:', featuredData);
          setFeaturedDestination(featuredData);
        } else {
          console.warn('DestacadoTourSection - No se encontró un destino destacado válido:', response);
          setError('No se encontró un destino destacado');
        }
      } catch (error) {
        console.error('Error al obtener el destino destacado:', error);
        setError('No se pudo cargar el destino destacado. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDestination();
  }, []);

  // Si está cargando, mostrar un placeholder
  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#fffbf0]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
            <div className="md:w-1/2 mt-16 md:mt-0 md:pl-10">
              <div className="h-6 bg-gray-200 animate-pulse rounded-full w-24 mb-4"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-1/2 mb-6"></div>
              <div className="h-24 bg-gray-200 animate-pulse rounded-lg w-full mb-8"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si hay error, mostrar mensaje (opcionalmente podrías no mostrar nada)
  if (error || !featuredDestination) {
    return null; // O podrías mostrar un mensaje de error y usar un destino por defecto
  }

  // Obtener las imágenes del destino
  const mainImage = featuredDestination.imageSrc || '';
  console.log('Imagen principal:', mainImage);
  
  // Verificar de forma segura si hay imágenes de galería disponibles
  let galleryImage = mainImage; // Por defecto, usar la imagen principal
  
  if (featuredDestination.galleryImages && 
      Array.isArray(featuredDestination.galleryImages) && 
      featuredDestination.galleryImages.length > 0) {
    console.log('Imágenes de galería disponibles:', featuredDestination.galleryImages);
    galleryImage = featuredDestination.galleryImages[0].imageUrl;
  } else {
    console.log('No hay imágenes de galería, usando imagen principal como fallback');
  }
  
  console.log('Imagen de galería a usar:', galleryImage);

  // Preparar array de imágenes para el slider
  const images = [mainImage];
  if (galleryImage && galleryImage !== mainImage) {
    images.push(galleryImage);
  }

  // Función para cambiar imagen en el slider móvil
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-20 px-4 bg-[#fffbf0]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          {/* Imágenes escalonadas para desktop */}
          <motion.div 
            className="hidden md:block md:w-1/2 relative" 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10">
              <motion.div
                whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                transition={{ duration: 0.3 }}
                className="transform rotate-[-8deg] rounded-2xl overflow-hidden shadow-xl max-w-[350px]"
              >
                <img 
                  src={mainImage} 
                  alt={`Imagen principal de ${featuredDestination.title}`} 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
            {galleryImage && galleryImage !== mainImage && (
              <div className="absolute top-24 right-4 md:right-24 z-20">
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  transition={{ duration: 0.3 }}
                  className="transform rotate-[5deg] rounded-2xl overflow-hidden shadow-xl max-w-[350px]"
                >
                  <img 
                    src={galleryImage} 
                    alt={`Imagen de galería de ${featuredDestination.title}`} 
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Información del tour */}
          <motion.div 
            className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-primary-orange-dark py-1 px-4 rounded-full text-sm font-semibold text-white inline-block mb-4">
              Destacado
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {featuredDestination.title}
            </h2>
            
            {featuredDestination.duration && (
              <div className="flex items-center mb-6 text-gray-600 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {featuredDestination.duration}
              </div>
            )}

            {/* Slider para móvil - Posicionado después del título y duración */}
            <div className="block md:hidden mb-6">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`Imagen ${currentImageIndex + 1} de ${featuredDestination.title}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {/* Controles del slider */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              {featuredDestination.description}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/destinos/${featuredDestination.id}`} 
                className="inline-block py-3 px-8 bg-primary-orange hover:bg-primary-orange-dark text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Ver tour
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DestacadoTourSection;