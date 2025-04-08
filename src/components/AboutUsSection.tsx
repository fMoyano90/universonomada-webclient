import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import aboutUsImage from '../assets/images/nosotros.jpg';

const AboutUsSection = () => {
  return (
    <section className="py-24 px-4 bg-[#f1fae8] relative">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                  {/* Reemplazar con el logo SVG de Universo Nómada */}
                  <path d="M30 13.3333C28.2319 13.3333 26.5362 14.0357 25.286 15.286C24.0357 16.5362 23.3333 18.2319 23.3333 20V40C23.3333 41.7681 24.0357 43.4638 25.286 44.714C26.5362 45.9643 28.2319 46.6667 30 46.6667H50C51.7681 46.6667 53.4638 45.9643 54.714 44.714C55.9643 43.4638 56.6667 41.7681 56.6667 40V20C56.6667 18.2319 55.9643 16.5362 54.714 15.286C53.4638 14.0357 51.7681 13.3333 50 13.3333H45L43.3333 10H36.6667L35 13.3333H30Z" stroke="#3D667A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M85.924 30C85.924 35.5224 81.3464 40 75.6245 40C69.9025 40 65.3249 35.5224 65.3249 30C65.3249 24.4776 69.9025 20 75.6245 20C81.3464 20 85.924 24.4776 85.924 30Z" stroke="#FA5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M97.1224 33.3333L122.122 21.6667" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M130.49 33.3333L104.49 20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M113.306 26.6667C114.196 26.6667 114.906 25.9553 114.906 25.0833C114.906 24.2114 114.196 23.5 113.306 23.5C112.416 23.5 111.706 24.2114 111.706 25.0833C111.706 25.9553 112.416 26.6667 113.306 26.6667Z" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M142.122 40L150.49 30L157.157 36.6667L169.824 23.3333" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-gray-600 font-light text-2xl tracking-wide">
                  universo nómada
                  <span className="block text-xs text-primary-orange font-normal tracking-widest mt-[-2px]">AGENCIA DE VIAJES</span>
                </div>
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-800 mb-8"
            >
              Quienes somos
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-700 mb-8 leading-relaxed"
            >
              Somos una empresa familiar con más de 20 años de trayectoria, 
              enfocada en traer sueños y alegría a nuestros pasajeros. Trabajamos 
              por crear la comunidad de viajes más grande y feliz de todo Chile.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/about" 
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-primary-blue transition-colors duration-300"
              >
                Ver más
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={aboutUsImage} 
                alt="Familia Universo Nómada" 
                className="w-full h-auto object-cover rounded-2xl max-h-[500px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection; 