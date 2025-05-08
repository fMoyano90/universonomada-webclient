import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import destinationService from '../services/destination.service';

// Definir tipo de datos para destinos
interface Destination {
  id: number;
  title: string;
  slug: string;
  imageSrc: string;
  type: string;
  description?: string;
  price?: string; // Precio viene como string
  location?: string;
  duration?: string;
  isRecommended?: boolean;
  isSpecial?: boolean;
  galleryImages?: Array<{id: number, imageUrl: string}>;
}

// Definir tipo de datos para los tours mostrados
interface Tour {
  id: string | number;
  imageSrc?: string;
  title: string;
  price?: number;
  currency?: string;
  type?: string;
  onSale?: boolean;
  slug?: string;
  duration?: string;
  location?: string;
}

const ToursSection = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getLatestDestinations(6);
        
        console.log('ToursSection - Respuesta completa:', response);
        
        // Extraer los datos sin importar la estructura de la respuesta
        let destinationsData: Destination[] = [];
        
        if (response?.success && Array.isArray(response?.data)) {
          // Caso: { success: true, data: [...] }
          destinationsData = response.data;
        } else if (Array.isArray(response)) {
          // Caso: La respuesta es directamente el array
          destinationsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          // Caso: { data: [...] }
          destinationsData = response.data;
        } else {
          console.warn('Formato de respuesta no esperado:', response);
          setError('No se pudieron procesar los datos de destinos correctamente.');
          setTours([]);
          setLoading(false);
          return;
        }
        
        console.log('Datos de destinos encontrados:', destinationsData);
        
        if (destinationsData.length === 0) {
          setTours([]);
          setLoading(false);
          return;
        }
        
        // Transformar los datos
        const transformedData: Tour[] = destinationsData.map((dest: Destination) => ({
          id: dest.id,
          imageSrc: dest.imageSrc,
          title: dest.title,
          type: dest.type,
          price: dest.price ? parseFloat(dest.price.toString()) : undefined,
          currency: 'CLP',
          onSale: dest.isSpecial,
          slug: dest.slug,
          duration: dest.duration,
          location: dest.location
        }));
        
        console.log('Datos transformados:', transformedData);
        setTours(transformedData);
      } catch (error) {
        console.error('Error al obtener los destinos:', error);
        setError('No se pudieron cargar los destinos. Por favor, intente nuevamente más tarde.');
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Función para formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL').format(price);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Conoce nuestros tours</h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-2 mb-4">
            <p className="text-orange-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && tours.length === 0 && !error && (
          <div className="text-center py-10">
            <p className="text-gray-600">No hay destinos disponibles actualmente.</p>
          </div>
        )}

        {tours.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden shadow-lg bg-white group relative"
              >
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={tour.imageSrc} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white py-1 px-4 rounded-full text-sm font-semibold text-primary-blue shadow-md">
                    {tour.type === 'nacional' || tour.type === 'NACIONAL' ? 'Nacional' : 'Internacional'}
                  </div>
                  {tour.onSale && (
                    <div className="absolute top-4 right-4 bg-primary-green-dark text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center">
                      BLACK SALE
                      <span className="ml-1">✈️</span>
                    </div>
                  )}
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{tour.title}</h3>
                </div>
                
                <div className="p-5">
                  {tour.duration && (
                    <div className="flex items-center mb-3 text-gray-600 font-medium text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {tour.duration}
                    </div>
                  )}
                  
                  {tour.location && (
                    <div className="flex items-center mb-3 text-gray-600 font-medium text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {tour.location}
                    </div>
                  )}

                  <div className="mb-4 border-t border-gray-100 pt-4">
                    {tour.price ? (
                      <p className="text-gray-500 text-sm">
                        desde <span className="text-xl font-bold text-primary-blue">${formatPrice(tour.price)}</span> <span className="text-xs">{tour.currency}</span>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm h-6">
                        Consulta por precios y disponibilidad
                      </p>
                    )}
                  </div>
                  <Link 
                    to={`/destinos/${tour.id}`} 
                    className="inline-block w-full text-center py-2 px-4 bg-white border border-primary-orange text-primary-orange rounded-lg font-medium hover:bg-primary-orange hover:text-white transition-colors duration-300 relative z-10"
                  >
                    Ver detalles
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ToursSection; 