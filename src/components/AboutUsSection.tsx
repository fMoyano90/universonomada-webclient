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
                <div className="text-gray-600 font-light text-2xl tracking-wide">
                  Universo Nómada
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