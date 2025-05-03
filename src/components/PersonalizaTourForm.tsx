import { useState } from 'react';
import { motion } from 'framer-motion';

// Destinos disponibles
const destinos = [
  "San Pedro de Atacama",
  "Torres del Paine",
  "Machu Picchu",
  "Salar de Uyuni",
  "Isla de Pascua",
  "Valparaíso",
  "Carretera Austral",
  "Cusco",
  "Lima",
  "La Paz"
];

const PersonalizaTourForm = () => {
  const [selectedDestino, setSelectedDestino] = useState("");
  const [showDestinos, setShowDestinos] = useState(false);
  const [fechaEstablecida, setFechaEstablecida] = useState(true);
  const [adultos, setAdultos] = useState(1);
  const [infantes, setInfantes] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);
  const [necesitaHotel, setNecesitaHotel] = useState(false);

  const incrementarPasajero = (tipo: string) => {
    switch (tipo) {
      case 'adultos':
        setAdultos(prev => Math.min(prev + 1, 10));
        break;
      case 'infantes':
        setInfantes(prev => Math.min(prev + 1, 5));
        break;
      case 'ninos':
        setNinos(prev => Math.min(prev + 1, 8));
        break;
      case 'adultosMayores':
        setAdultosMayores(prev => Math.min(prev + 1, 5));
        break;
    }
  };

  const decrementarPasajero = (tipo: string) => {
    switch (tipo) {
      case 'adultos':
        setAdultos(prev => Math.max(prev - 1, 0));
        break;
      case 'infantes':
        setInfantes(prev => Math.max(prev - 1, 0));
        break;
      case 'ninos':
        setNinos(prev => Math.max(prev - 1, 0));
        break;
      case 'adultosMayores':
        setAdultosMayores(prev => Math.max(prev - 1, 0));
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para procesar el formulario
    console.log({
      destino: selectedDestino,
      fechaEstablecida,
      pasajeros: {
        adultos,
        infantes,
        ninos,
        adultosMayores
      },
      necesitaHotel
    });
    alert('Formulario enviado correctamente, pronto nos pondremos en contacto contigo.');
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tu Próxima Aventura Empieza Aquí
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vive la libertad de viajar a destinos auténticos, diseñados a tu medida, 
            donde la naturaleza y la cultura se unen para cumplir tus sueños.
          </p>
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-primary-green-dark animate-bounce cursor-pointer" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              onClick={() => {
                const formElement = document.getElementById('personalizaTourForm');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          id="personalizaTourForm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-5xl"
        >
          <div className="bg-primary-orange-dark text-white rounded-lg py-3 px-6 inline-block mb-8">
            <h3 className="font-bold text-lg">PERSONALIZA TU TOUR</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Destino</label>
                  <div className="relative">
                    <div 
                      className="border border-gray-300 rounded-lg w-full p-3 flex items-center cursor-pointer"
                      onClick={() => setShowDestinos(!showDestinos)}
                    >
                      <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedDestino || "Selecciona un destino"}
                      <svg 
                        className={`h-5 w-5 ml-auto text-gray-500 transition-transform ${showDestinos ? 'transform rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {showDestinos && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                        {destinos.map((destino, index) => (
                          <div 
                            key={index}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedDestino(destino);
                              setShowDestinos(false);
                            }}
                          >
                            {destino}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="fechaFlexible" 
                      className="w-4 h-4" 
                      checked={!fechaEstablecida}
                      onChange={() => setFechaEstablecida(!fechaEstablecida)}
                    />
                    <label htmlFor="fechaFlexible" className="ml-2 text-gray-700">
                      No tengo fecha establecida
                    </label>
                  </div>
                </div>

                {fechaEstablecida && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Fecha de salida</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="dd/mm/aaaa" 
                          className="border border-gray-300 rounded-lg w-full p-3"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = 'text';
                          }}
                        />
                        <svg className="absolute right-3 top-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Fecha de retorno</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="dd/mm/aaaa" 
                          className="border border-gray-300 rounded-lg w-full p-3"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = 'text';
                          }}
                        />
                        <svg className="absolute right-3 top-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <label className="text-gray-700 font-medium">Alojamiento</label>
                    <input 
                      type="checkbox" 
                      id="necesitaHotel" 
                      className="ml-auto w-4 h-4" 
                      checked={necesitaHotel}
                      onChange={() => setNecesitaHotel(!necesitaHotel)}
                    />
                    <label htmlFor="necesitaHotel" className="ml-2 text-gray-700">
                      Necesito hotel
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-4">Pasajeros</label>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Infantes (0-2)</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero('infantes')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{infantes}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero('infantes')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Niños (3-11)</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero('ninos')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{ninos}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero('ninos')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Adultos (12-64)</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero('adultos')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{adultos}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero('adultos')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Adultos mayores (65+)</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero('adultosMayores')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{adultosMayores}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero('adultosMayores')}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tu nombre completo" 
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="tu@email.com" 
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      placeholder="+56 9 1234 5678" 
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                className="w-full bg-primary-orange hover:bg-primary-orange text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                SOLICITAR COTIZACIÓN
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalizaTourForm; 