import { motion } from 'framer-motion';
import imagenEquipo from '../assets/images/nosotros-2.jpg';

export const AboutPage = () => {
  return (
    <div className="min-h-screen pt-48 pb-20 bg-primary-green-light/5">
      <main className="container mx-auto p-4 max-w-6xl">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-8">Universo Nómada</h1>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Somos un tour operador emisivo y receptivo <span className="font-semibold text-primary-blue">100% chileno</span>, que nació hace más de <span className="font-semibold text-primary-blue">5 años</span> en Los Andes. Desde entonces, nos hemos especializado en crear experiencias de viaje únicas y transformadoras para nuestros clientes.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Buscamos conectar a viajeros de todas las edades con la naturaleza, la cultura y la autenticidad de cada destino, ofreciendo experiencias diseñadas con pasión y dedicación que van más allá del turismo convencional.
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Nuestro equipo de expertos viajeros y conocedores de América Latina trabaja incansablemente para crear viajes que no solo sean memorables, sino que también generen un impacto positivo en las comunidades locales y el medio ambiente.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-full h-full bg-primary-green/20 rounded-[2.5rem] -z-10"></div>
            <img 
              src={imagenEquipo} 
              alt="Equipo de Universo Nómada" 
              className="w-full h-[600px] object-cover rounded-[2rem] shadow-xl"
            />
          </motion.div>
        </section>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="border border-gray-200 rounded-xl p-5 flex flex-col items-center bg-white shadow-sm"
          >
            <div className="rounded-full bg-primary-blue/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="font-semibold text-primary-blue text-center">+5 años</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="border border-gray-200 rounded-xl p-5 flex flex-col items-center bg-white shadow-sm"
          >
            <div className="rounded-full bg-primary-orange/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="font-semibold text-primary-orange text-center">+2000 viajeros felices</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="border border-gray-200 rounded-xl p-5 flex flex-col items-center bg-white shadow-sm"
          >
            <div className="rounded-full bg-primary-green/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5" />
              </svg>
            </div>
            <p className="font-semibold text-primary-green text-center">+5 países</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="border border-gray-200 rounded-xl p-5 flex flex-col items-center bg-white shadow-sm"
          >
            <div className="rounded-full bg-primary-brown/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="font-semibold text-primary-brown text-center">4.9 estrellas</p>
          </motion.div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl p-10 shadow-md mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-primary-blue mb-6 border-b border-primary-blue/20 pb-2">Misión</h2>
            <p className="text-gray-700 leading-relaxed">
              Crear viajes que conecten a las personas con la naturaleza, la cultura local y 
              consigo mismas, a través de experiencias diseñadas con cuidado, autenticidad y pasión.
              Buscamos transformar cada viaje en una oportunidad para descubrir, aprender y crecer,
              generando memorias que perduren toda la vida.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-primary-blue mb-6 border-b border-primary-blue/20 pb-2">Visión</h2>
            <p className="text-gray-700 leading-relaxed">
              Ser un referente en América Latina en el diseño de experiencias de viaje 
              transformadoras y sustentables. Aspiramos a liderar un cambio en la industria
              turística que equilibre la emoción de explorar con el respeto por los ecosistemas
              y las culturas locales.
            </p>
          </div>
        </section>
        
        <section className="bg-primary-orange/10 rounded-2xl p-10 shadow-md">
          <h2 className="text-2xl font-semibold text-primary-blue mb-6 text-center">Nuestros Valores</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Autenticidad</h3>
                <p className="text-gray-700 text-sm">Experiencias genuinas que conectan con la esencia de cada destino y su cultura.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Personalización</h3>
                <p className="text-gray-700 text-sm">Cada viaje es único, diseñado a medida de los intereses y necesidades de nuestros clientes.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Sostenibilidad</h3>
                <p className="text-gray-700 text-sm">Compromiso con prácticas responsables que respetan y benefician a las comunidades locales y al medio ambiente.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Excelencia</h3>
                <p className="text-gray-700 text-sm">Atención meticulosa a cada detalle para garantizar experiencias de la más alta calidad.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Innovación</h3>
                <p className="text-gray-700 text-sm">Búsqueda constante de nuevas formas de enriquecer la experiencia de viaje.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex items-start"
            >
              <span className="text-primary-orange text-2xl mr-3">✦</span>
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Pasión</h3>
                <p className="text-gray-700 text-sm">Amor genuino por los viajes y por compartir la belleza del mundo con nuestros clientes.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
