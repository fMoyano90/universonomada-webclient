import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import destinationService from '../services/destination.service';

// Interfaz para los datos de destino
interface Destination {
  id: number;
  title: string;
  slug: string;
  imageSrc: string;
  type: string;
  description: string;
  duration?: string; // Añadir campo duration que viene de la API
  days?: number; 
  nights?: number;
  price?: number | string; // Precio puede venir como string
  isRecommended?: boolean;
  isSpecial?: boolean;
  galleryImages?: string[];
  location?: string;
}

const DestinacionalesPage = () => {
  // Estado para almacenar los destinos
  const [destinos, setDestinos] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 6; // Número fijo de elementos por página
  
  // Cargar destinos desde la API
  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        setLoading(true);
        console.log('Iniciando fetch de destinos nacionales...');
        
        const response = await destinationService.getPaginatedDestinationsByType(
          'nacional',
          currentPage,
          itemsPerPage
        );
        
        console.log('Respuesta API:', response);
        
        // Navegamos a través de la estructura de respuesta
        const data = response?.data?.data?.data || [];
        const meta = response?.data?.data?.meta || { total: 0, totalPages: 1, page: 1, limit: itemsPerPage };
        
        console.log('Datos procesados:', { data, meta });
        
        setDestinos(data);
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.total || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener destinos nacionales:', err);
        setError('Error al cargar los destinos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchDestinos();
  }, [currentPage]);

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Cambiar a la página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Cambiar a una página específica
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Función para formatear precio
  const formatPrice = (price: number = 0): string => {
    return new Intl.NumberFormat('es-CL').format(price);
  };

  // Renderizar páginas de paginación
  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? 'bg-primary-blue text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-white pt-48 pb-36">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Nacionales</h1>
        
        {/* Información de resultados */}
        <div className="flex justify-end mb-8">
          <div className="text-sm text-gray-500">
            {totalItems} destino{totalItems !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-blue border-t-transparent"></div>
            <p className="mt-3 text-gray-600">Cargando destinos...</p>
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <p>{error}</p>
          </div>
        )}
        
        {/* Sin resultados */}
        {!loading && !error && destinos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No hay destinos disponibles en esta categoría.</p>
          </div>
        )}
        
        {/* Grid de destinos */}
        {!loading && !error && destinos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinos.map((destino) => (
              <motion.div 
                key={destino.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden shadow-lg bg-white group relative"
              >
                <Link to={`/destinos/${destino.id}`} className="block relative">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={destino.imageSrc} 
                      alt={destino.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white py-1 px-4 rounded-full text-sm font-semibold text-primary-blue shadow-md">
                      Nacional
                    </div>
                    {destino.isSpecial && (
                      <div className="absolute top-4 right-4 bg-primary-green-dark text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center">
                        DESTACADO
                        <span className="ml-1">✈️</span>
                      </div>
                    )}
                    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{destino.title}</h3>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center mb-3 text-gray-600 font-medium text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {destino.duration || 'Consultar duración'}
                    </div>
                    {destino.location && (
                      <div className="flex items-center mb-3 text-gray-600 font-medium text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {destino.location}
                      </div>
                    )}
                    <div className="mb-4 border-t border-gray-100 pt-4">
                      <p className="text-gray-500 text-sm">
                        desde <span className="text-xl font-bold text-primary-blue">
                          ${formatPrice(typeof destino.price === 'string' ? parseFloat(destino.price) : destino.price)}
                        </span> <span className="text-xs">CLP</span>
                      </p>
                    </div>
                    <div 
                      className="inline-block w-full text-center py-2 px-4 bg-white border border-primary-orange text-primary-orange rounded-lg font-medium hover:bg-primary-orange hover:text-white transition-colors duration-300 relative z-10"
                    >
                      Ver detalles
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Paginación */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded mx-1 ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              &laquo; Anterior
            </button>
            
            {renderPaginationNumbers()}
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded mx-1 ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Siguiente &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinacionalesPage; 