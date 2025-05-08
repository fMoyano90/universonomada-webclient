import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import destinationService from '../services/destination.service';

// Interfaz para los datos de destino
interface Destination {
  id: number;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  location?: string;
  imageSrc?: string;
  slug?: string;
  type?: string;
}

const ToursRecomendados = () => {
  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        setLoading(true);
        // Buscar destinos recomendados de tipo nacional (puedes ajustar según necesidades)
        const data = await destinationService.getRecommendedDestinations('nacional', 3);
        
        console.log('Datos de destinos recomendados:', data);
        
        // La respuesta ya está procesada en el servicio para devolver el array de destinos
        if (Array.isArray(data) && data.length > 0) {
          setDestinos(data);
          setError(null);
        } else {
          console.warn('No se encontraron destinos recomendados o formato incorrecto', data);
          setDestinos([]);
          setError('No hay destinos recomendados disponibles');
        }
      } catch (err) {
        console.error('Error al cargar destinos recomendados:', err);
        setError('No se pudieron cargar los destinos recomendados');
        setDestinos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestinos();
  }, []);

  // Formatear el precio para mostrarlo correctamente
  const formatPrice = (price?: number | string) => {
    if (!price) return "Consultar";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString();
  };

  // Animación para las cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando destinos recomendados...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || destinos.length === 0) {
    // Si hay un error o no hay destinos, no mostrar la sección
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Otros destinos que te podrían interesar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Continúa explorando experiencias únicas en los destinos más impresionantes de Sudamérica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinos.map((tour, index) => (
            <motion.div
              key={tour.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <Link to={`/destinos/${tour.id}`}>
                <div className="relative h-48">
                  <img 
                    src={tour.imageSrc} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  {tour.duration && (
                    <div className="absolute top-0 right-0 bg-primary-orange text-white text-sm font-medium px-3 py-1 rounded-bl-lg">
                      {tour.duration}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tour.location || 'Consultar ubicación'}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{tour.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description || 'Consultar detalles'}</p>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      <div className="text-xs text-gray-500">Desde</div>
                      <div className="text-primary-orange">CLP ${formatPrice(tour.price)}</div>
                    </div>
                    <div className="bg-primary-orange hover:bg-primary-orange-dark text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Ver detalles
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursRecomendados; 