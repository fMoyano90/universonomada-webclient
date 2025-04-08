import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importar imágenes para las tarjetas de destinos
import imgInternacional from '../assets/images/Cusco/Excursiones-en-Cusco-y-Machu-Picchu-5-dias-1.jpg';
import imgNacional from '../assets/images/Region atacama/foto-regiones_0012_atacama.jpg';

const DestacadosSection = () => {
  return (
    <section className="pt-20 pb-16 px-4 bg-white -mt-2">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="text-primary-green-dark mb-3"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 transform -rotate-45">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </motion.div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-3">¿Dónde quieres Viajar?</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Conoce un destino maravilloso y vive una aventura inolvidable con Universo Nómada Viajes
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta destino Internacional */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl shadow-lg group relative h-80"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={imgInternacional} 
                alt="Destinos Internacionales" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
              <div className="p-8 w-full">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl py-3 px-6 inline-block">
                  <h3 className="text-primary-blue text-xl font-bold">Internacional</h3>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-90 transition-all duration-300 hidden md:block">
              <motion.img 
                src="https://img.icons8.com/fluency/96/hot-air-balloon.png" 
                alt="Globos aerostáticos" 
                className="w-24 h-24"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <Link to="/internacional" className="absolute inset-0" aria-label="Ver destinos internacionales"></Link>
          </motion.div>

          {/* Tarjeta destino Nacional */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl shadow-lg group relative h-80"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={imgNacional} 
                alt="Destinos Nacionales" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
              <div className="p-8 w-full">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl py-3 px-6 inline-block">
                  <h3 className="text-primary-blue text-xl font-bold">Nacionales</h3>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-90 transition-all duration-300 hidden md:block">
              <motion.img 
                src="https://img.icons8.com/color/96/mountain.png" 
                alt="Montañas" 
                className="w-24 h-24"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <Link to="/nacional" className="absolute inset-0" aria-label="Ver destinos nacionales"></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DestacadosSection; 