import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Importar imágenes para el tour destacado
import egiptoImage1 from '../assets/images/uyuni/istockphoto-478415328-612x612.jpg'; // Sustitución temporal, reemplazar con imagen real
import egiptoImage2 from '../assets/images/uyuni/1.webp'; // Sustitución temporal, reemplazar con imagen real

const DestacadoTourSection = () => {
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
                  src={egiptoImage1} 
                  alt="Templo de Abu Simbel, Egipto" 
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
                  src={egiptoImage2} 
                  alt="Paseo en camello por las pirámides, Egipto" 
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
            <div className="bg-[#faf5e4] py-1 px-4 rounded-full text-sm font-semibold text-primary-blue inline-block mb-4">
              Destacado
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Del Desierto al Salar
            </h2>
            
            <div className="flex items-center mb-6 text-gray-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              11 días y 10 noches
            </div>

            <p className="text-gray-600 mb-8">
              ¡Vamos a una aventura inolvidable por el Chile! Descubre los paisajes del norte de Chile, desde el impresionante desierto de Atacama hasta el majestuoso Salar de Uyuni en Bolivia. Un viaje que combina naturaleza, aventura y experiencias únicas.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/tours/egipto-aventura-por-historia" 
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