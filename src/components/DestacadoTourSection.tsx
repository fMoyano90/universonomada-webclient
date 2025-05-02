import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    const fetchFeaturedDestination = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getLatestSpecialDestination();
        
        // Verificar la estructura anidada de la respuesta (success.data.data)
        if (response?.success && response?.data?.success && response?.data?.data) {
          const destinationData = response.data.data;
          
          // Ahora accedemos a los datos correctamente
          setFeaturedDestination(destinationData);
        } else {
          console.warn('Formato de respuesta no esperado:', response);
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

  return (
    <section className="py-20 px-4 bg-[#fffbf0]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          {/* Imágenes escalonadas */}
          <motion.div 
            className="md:w-1/2 relative" 
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
          </motion.div>

          {/* Información del tour */}
          <motion.div 
            className="md:w-1/2 mt-16 md:mt-0 md:pl-10"
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

            <p className="text-gray-600 mb-8">
              {featuredDestination.description}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/destinos/${featuredDestination.slug}`} 
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