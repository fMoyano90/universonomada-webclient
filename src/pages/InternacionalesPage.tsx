import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Datos de ejemplo para destinos internacionales
const destinos = [
  {
    id: 1,
    title: 'Salar de Uyuni',
    description: 'Un viaje surrealista al espejo más grande del mundo',
    price: 598000,
    duration: '4 días y 3 noches',
    location: 'Bolivia',
    image: 'https://images.unsplash.com/photo-1626082372682-5a6ca46cc513?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 4,
    nights: 3
  },
  {
    id: 2,
    title: 'Machu Picchu',
    description: 'Descubre la magia de la ciudadela inca',
    price: 755000,
    duration: '5 días y 4 noches',
    location: 'Cusco, Perú',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 5,
    nights: 4
  },
  {
    id: 3,
    title: 'Islas Galápagos',
    description: 'Un paraíso natural único en el mundo',
    price: 1250000,
    duration: '7 días y 6 noches',
    location: 'Ecuador',
    image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 7,
    nights: 6
  },
  {
    id: 4,
    title: 'Río de Janeiro',
    description: 'La ciudad maravillosa entre montañas y playas',
    price: 680000,
    duration: '5 días y 4 noches',
    location: 'Brasil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 5,
    nights: 4
  },
  {
    id: 5,
    title: 'Buenos Aires',
    description: 'La capital del tango con su encanto europeo',
    price: 525000,
    duration: '4 días y 3 noches',
    location: 'Argentina',
    image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 4,
    nights: 3
  },
  {
    id: 6,
    title: 'Cartagena de Indias',
    description: 'Historia colonial y playas paradisíacas del Caribe',
    price: 620000,
    duration: '5 días y 4 noches',
    location: 'Colombia',
    image: 'https://images.unsplash.com/photo-1565105368034-288598a30ed2?q=80&w=2070&auto=format&fit=crop',
    isNacional: false,
    isBlackSale: true,
    days: 5,
    nights: 4
  }
];

const InternacionalesPage = () => {
  // Estados para filtros y ordenamiento
  const [filterAvailability, setFilterAvailability] = useState<string>('todos');
  const [filterPrice, setFilterPrice] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('Características');
  
  // Controlar apertura de dropdowns
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Filtrar destinos según criterios
  const destinosFiltrados = destinos.filter(destino => {
    let cumpleFiltroDisponibilidad = true;
    let cumpleFiltroPrecio = true;
    
    // Filtro por disponibilidad (ejemplo)
    if (filterAvailability === 'disponible') {
      cumpleFiltroDisponibilidad = true; // Aquí iría lógica real
    } else if (filterAvailability === 'agotado') {
      cumpleFiltroDisponibilidad = false; // Aquí iría lógica real
    }
    
    // Filtro por precio
    if (filterPrice === 'bajo') {
      cumpleFiltroPrecio = destino.price < 600000;
    } else if (filterPrice === 'medio') {
      cumpleFiltroPrecio = destino.price >= 600000 && destino.price < 900000;
    } else if (filterPrice === 'alto') {
      cumpleFiltroPrecio = destino.price >= 900000;
    }
    
    return cumpleFiltroDisponibilidad && cumpleFiltroPrecio;
  });
  
  // Ordenar destinos
  const destinosOrdenados = [...destinosFiltrados];
  
  if (sortBy === 'precio-asc') {
    destinosOrdenados.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'precio-desc') {
    destinosOrdenados.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'duracion') {
    destinosOrdenados.sort((a, b) => {
      const duracionA = parseInt(a.duration.split(' ')[0]);
      const duracionB = parseInt(b.duration.split(' ')[0]);
      return duracionB - duracionA;
    });
  }

  // Función para formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL').format(price);
  };

  return (
    <div className="min-h-screen bg-white pt-48 pb-36">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Internacionales</h1>
        
        {/* Filtros y ordenamiento */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium">Filtrar:</span>
            
            {/* Filtro disponibilidad */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                onClick={() => {
                  setAvailabilityOpen(!availabilityOpen);
                  setPriceOpen(false);
                  setSortOpen(false);
                }}
              >
                <span>Availability</span>
                <span className="ml-1">
                  {availabilityOpen ? (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform transform rotate-180"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {availabilityOpen && (
                <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="py-1">
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterAvailability === 'todos' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterAvailability('todos');
                        setAvailabilityOpen(false);
                      }}
                    >
                      Todos
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterAvailability === 'disponible' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterAvailability('disponible');
                        setAvailabilityOpen(false);
                      }}
                    >
                      Disponible
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterAvailability === 'agotado' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterAvailability('agotado');
                        setAvailabilityOpen(false);
                      }}
                    >
                      Agotado
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filtro precio */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                onClick={() => {
                  setPriceOpen(!priceOpen);
                  setAvailabilityOpen(false);
                  setSortOpen(false);
                }}
              >
                <span>Price</span>
                <span className="ml-1">
                  {priceOpen ? (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform transform rotate-180"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {priceOpen && (
                <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="py-1">
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterPrice === 'todos' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterPrice('todos');
                        setPriceOpen(false);
                      }}
                    >
                      Todos
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterPrice === 'bajo' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterPrice('bajo');
                        setPriceOpen(false);
                      }}
                    >
                      Hasta $600.000
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterPrice === 'medio' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterPrice('medio');
                        setPriceOpen(false);
                      }}
                    >
                      $600.000 - $900.000
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${filterPrice === 'alto' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setFilterPrice('alto');
                        setPriceOpen(false);
                      }}
                    >
                      Más de $900.000
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Ordenamiento */}
          <div className="flex items-center gap-3">
            <span className="font-medium">Ordenar por:</span>
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none min-w-[150px] justify-between"
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setAvailabilityOpen(false);
                  setPriceOpen(false);
                }}
              >
                <span>{sortBy === 'Características' ? 'Características' : 
                       sortBy === 'precio-asc' ? 'Precio: menor a mayor' :
                       sortBy === 'precio-desc' ? 'Precio: mayor a menor' :
                       'Duración'}</span>
                <span>
                  {sortOpen ? (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform transform rotate-180"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg 
                      width="16" 
                      height="16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {sortOpen && (
                <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="py-1">
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'Características' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortBy('Características');
                        setSortOpen(false);
                      }}
                    >
                      Características
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'precio-asc' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortBy('precio-asc');
                        setSortOpen(false);
                      }}
                    >
                      Precio: menor a mayor
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'precio-desc' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortBy('precio-desc');
                        setSortOpen(false);
                      }}
                    >
                      Precio: mayor a menor
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'duracion' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortBy('duracion');
                        setSortOpen(false);
                      }}
                    >
                      Duración
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500 ml-4">
              {destinosOrdenados.length} producto{destinosOrdenados.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        {/* Grid de destinos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinosOrdenados.map((destino) => (
            <motion.div 
              key={destino.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white group relative"
            >
              <Link to={`/destino/${destino.id}`} className="block relative">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={destino.image} 
                    alt={destino.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white py-1 px-4 rounded-full text-sm font-semibold text-primary-blue shadow-md">
                    Internacional
                  </div>
                  {destino.isBlackSale && (
                    <div className="absolute top-4 right-4 bg-primary-green-dark text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center">
                      BLACK SALE
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
                    {destino.days} días y {destino.nights} noches
                  </div>
                  <div className="mb-4 border-t border-gray-100 pt-4">
                    <p className="text-gray-500 text-sm">
                      desde <span className="text-xl font-bold text-primary-blue">${formatPrice(destino.price)}</span> <span className="text-xs">CLP</span>
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
      </div>
    </div>
  );
};

export default InternacionalesPage; 