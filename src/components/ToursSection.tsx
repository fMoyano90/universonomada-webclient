import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importar imágenes de los tours
import torresTour from '../assets/images/Region atacama/foto-regiones_0012_atacama.jpg';
import carreteraNorteTour from '../assets/images/valle aconcagua/Cerros-del-Valle-de-Aconcagua-scaled.jpeg';
import campoHieloTour from '../assets/images/Region Valparaiso/valparaiso.jpg';
import carreteraSurTour from '../assets/images/san pedro de atacama/San-Pedro-De-Atacama.jpg';
import machuPicchuTour from '../assets/images/machu/machu picchu.jpg';
import cappadociaTour from '../assets/images/uyuni/colchani6.jpg';

// Definir tipo de datos para tours
interface Tour {
  id: string;
  image: string;
  title: string;
  days: number;
  nights: number;
  price: number;
  currency: string;
  type: 'nacional' | 'internacional';
  onSale?: boolean;
}

const ToursSection = () => {
  const tours: Tour[] = [
    {
      id: 'carretera-austral-norte',
      image: carreteraNorteTour,
      title: 'Carretera Austral Norte',
      days: 7,
      nights: 6,
      price: 875000,
      currency: 'CLP',
      type: 'nacional',
      onSale: true
    },
    {
      id: 'torres-del-paine',
      image: torresTour,
      title: 'Torres del Paine',
      days: 5,
      nights: 4,
      price: 595000,
      currency: 'CLP',
      type: 'nacional',
      onSale: true
    },
    {
      id: 'campo-de-hielo-sur',
      image: campoHieloTour,
      title: 'Campo de Hielo Sur',
      days: 7,
      nights: 6,
      price: 995000,
      currency: 'CLP',
      type: 'nacional',
      onSale: true
    },
    {
      id: 'carretera-austral-sur',
      image: carreteraSurTour,
      title: 'Carretera Austral Sur',
      days: 6,
      nights: 5,
      price: 885000,
      currency: 'CLP',
      type: 'nacional',
      onSale: true
    },
    {
      id: 'machu-picchu',
      image: machuPicchuTour,
      title: 'Machu Picchu',
      days: 6,
      nights: 5,
      price: 1250000,
      currency: 'CLP',
      type: 'internacional',
      onSale: true
    },
    {
      id: 'las-maravillas-de-turquia',
      image: cappadociaTour,
      title: 'Las Maravillas de Turquía',
      days: 14,
      nights: 13,
      price: 2850000,
      currency: 'CLP',
      type: 'internacional',
      onSale: true
    }
  ];

  // Función para formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL').format(price);
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
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
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white py-1 px-4 rounded-full text-sm font-semibold text-primary-blue shadow-md">
                  {tour.type === 'nacional' ? 'Nacional' : 'Internacional'}
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
                <div className="flex items-center mb-3 text-gray-600 font-medium text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {tour.days} días y {tour.nights} noches
                </div>
                <div className="mb-4 border-t border-gray-100 pt-4">
                  <p className="text-gray-500 text-sm">
                    desde <span className="text-xl font-bold text-primary-blue">${formatPrice(tour.price)}</span> <span className="text-xs">{tour.currency}</span>
                  </p>
                </div>
                <Link 
                  to={`/tours/${tour.id}`} 
                  className="inline-block w-full text-center py-2 px-4 bg-white border border-primary-orange text-primary-orange rounded-lg font-medium hover:bg-primary-orange hover:text-white transition-colors duration-300 relative z-10"
                >
                  Ver detalles
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection; 