import { motion } from 'framer-motion';
import imagenEquipo from '../assets/images/nosotros-2.jpg';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-48 pb-20 bg-primary-green-light/5">
      <main className="container mx-auto p-4 max-w-6xl">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-8">Universo Nómada</h1>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              En Universo Nómada somos más que una agencia de viajes: somos un equipo apasionado
por diseñar experiencias únicas y memorables. Nos dedicamos al turismo personalizado,
receptivo y emisivo, con un enfoque en el bienestar del viajero, la autenticidad del destino y el
respeto por la cultura y la naturaleza.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Universo Nómada nace en uno de nuestros propios viajes a la Amazonía, cuando descubrimos
que viajar no solo es conocer, sino conectar profundamente con los lugares, las personas y
con uno mismo. Desde entonces, nos propusimos crear rutas que inspiren, transformen y
dejen huella.
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Somos una empresa chilena comprometida con el turismo responsable, que diseña cada viaje
con dedicación, profesionalismo y un fuerte vínculo con las culturas locales y el entorno
natural.
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
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl p-10 shadow-md mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-primary-blue mb-6 border-b border-primary-blue/20 pb-2">Misión</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Crear viajes que generen un vínculo profundo entre las personas, los territorios y sus
culturas. Diseñamos experiencias auténticas que invitan a reconectar con la naturaleza,
descubrir lo local y vivir cada destino con sentido.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Queremos que cada viaje sea una oportunidad para crecer, emocionarse y guardar memorias
que acompañen toda la vida.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-primary-blue mb-6 border-b border-primary-blue/20 pb-2">Visión</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
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
