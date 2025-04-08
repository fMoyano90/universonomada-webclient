import { motion } from 'framer-motion';

// SVG Icons
const PaymentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 13.3333H10C8.16667 13.3333 6.66667 14.8333 6.66667 16.6667V33.3333C6.66667 35.1667 8.16667 36.6667 10 36.6667H30C31.8333 36.6667 33.3333 35.1667 33.3333 33.3333V16.6667C33.3333 14.8333 31.8333 13.3333 30 13.3333Z" stroke="#3D667A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26.6667 36.6667V10C26.6667 9.11595 26.3155 8.2681 25.6904 7.64298C25.0652 7.01786 24.2174 6.66667 23.3333 6.66667H16.6667C15.7826 6.66667 14.9348 7.01786 14.3096 7.64298C13.6845 8.2681 13.3333 9.11595 13.3333 10V36.6667" stroke="#3D667A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 26.6667C21.8409 26.6667 23.3333 25.1743 23.3333 23.3333C23.3333 21.4924 21.8409 20 20 20C18.159 20 16.6667 21.4924 16.6667 23.3333C16.6667 25.1743 18.159 26.6667 20 26.6667Z" stroke="#3D667A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TravelClubIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.3333 33.3333V31.6667C33.3333 29.8986 32.631 28.2029 31.3807 26.9526C30.1305 25.7024 28.4348 25 26.6667 25H13.3333C11.5652 25 9.86953 25.7024 8.61929 26.9526C7.36905 28.2029 6.66667 29.8986 6.66667 31.6667V33.3333" stroke="#FA5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 18.3333C23.6819 18.3333 26.6667 15.3486 26.6667 11.6667C26.6667 7.98477 23.6819 5 20 5C16.3181 5 13.3333 7.98477 13.3333 11.6667C13.3333 15.3486 16.3181 18.3333 20 18.3333Z" stroke="#FA5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36.6667 20L30 13.3333L33.3333 10L40 16.6667L36.6667 20Z" stroke="#FA5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33334 20L10 13.3333L6.66667 10L0 16.6667L3.33334 20Z" stroke="#FA5F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PersonalizedIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.3333 35V31.6667C33.3333 29.8986 32.631 28.2029 31.3807 26.9526C30.1305 25.7024 28.4348 25 26.6667 25H13.3333C11.5652 25 9.86953 25.7024 8.61929 26.9526C7.36905 28.2029 6.66667 29.8986 6.66667 31.6667V35" stroke="#00A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 18.3333C23.6819 18.3333 26.6667 15.3486 26.6667 11.6667C26.6667 7.98477 23.6819 5 20 5C16.3181 5 13.3333 7.98477 13.3333 11.6667C13.3333 15.3486 16.3181 18.3333 20 18.3333Z" stroke="#00A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 10L33.3333 13.3333" stroke="#00A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 30L18.3333 33.3333L23.3333 28.3333" stroke="#00A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SustainabilityIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.3333 18.3333C33.3385 20.3979 32.8638 22.4343 31.9465 24.2877C31.0293 26.141 29.6938 27.7611 28.0443 29.0164C26.3948 30.2717 24.4747 31.1247 22.4322 31.5067C20.3897 31.8886 18.2885 31.7894 16.2926 31.2167C14.2968 30.644 12.4648 29.6145 10.9417 28.2116C9.41862 26.8087 8.24609 25.0722 7.51856 23.1381C6.79103 21.204 6.52759 19.1282 6.74826 17.0777C6.96893 15.0273 7.66827 13.0599 8.79159 11.3333" stroke="#7A553D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.3333 8.33334L20 21.6667" stroke="#7A553D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.3333 8.33334L25 38.3333L20 21.6667L3.33334 16.6667L33.3333 8.33334Z" stroke="#7A553D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50/50 relative">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 opacity-5 z-0" 
           style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Lo mejor de viajar con Universo Nómada</h2>
          <div className="w-72 h-1 bg-primary-orange mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sistema de Pagos Flexible */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(61, 102, 122, 0.1)' }}
            className="bg-white rounded-xl p-6 h-full flex flex-col shadow-sm backdrop-blur-sm bg-opacity-70 relative overflow-hidden group"
          >
            {/* Decoración circular sutil */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-blue/5 transition-all duration-300 group-hover:scale-125"></div>
            
            <div className="mb-4 text-primary-blue">
              <PaymentIcon />
            </div>
            <h3 className="text-lg font-semibold text-primary-blue mb-3">Sistema de Pagos Flexible</h3>
            <p className="text-gray-700 flex-grow text-sm z-10 relative">
              Reserva con un abono inicial (50% del viaje) y paga el saldo en cuotas hasta un mes antes de tu salida.
            </p>
          </motion.div>

          {/* Club Universo Nómada */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(250, 95, 0, 0.1)' }}
            className="bg-white rounded-xl p-6 h-full flex flex-col shadow-sm backdrop-blur-sm bg-opacity-70 relative overflow-hidden group"
          >
            {/* Decoración circular sutil */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-orange/5 transition-all duration-300 group-hover:scale-125"></div>
            
            <div className="mb-4 text-primary-orange">
              <TravelClubIcon />
            </div>
            <h3 className="text-lg font-semibold text-primary-orange mb-3">Club Universo Nómada</h3>
            <p className="text-gray-700 flex-grow text-sm z-10 relative">
              Únete a nuestra familia de viajeros y disfruta de descuentos exclusivos en tu segundo viaje y en futuros tours.
            </p>
          </motion.div>

          {/* Experiencias Personalizadas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 165, 250, 0.1)' }}
            className="bg-white rounded-xl p-6 h-full flex flex-col shadow-sm backdrop-blur-sm bg-opacity-70 relative overflow-hidden group"
          >
            {/* Decoración circular sutil */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-cyan/5 transition-all duration-300 group-hover:scale-125"></div>
            
            <div className="mb-4 text-primary-cyan">
              <PersonalizedIcon />
            </div>
            <h3 className="text-lg font-semibold text-primary-cyan mb-3">Experiencias Personalizadas</h3>
            <p className="text-gray-700 flex-grow text-sm z-10 relative">
              En Universo Nómada diseñamos cada viaje de forma única, brindando atención personalizada y cercana para experiencias memorables.
            </p>
          </motion.div>

          {/* Conexión Local y Sostenibilidad */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(122, 85, 61, 0.1)' }}
            className="bg-white rounded-xl p-6 h-full flex flex-col shadow-sm backdrop-blur-sm bg-opacity-70 relative overflow-hidden group"
          >
            {/* Decoración circular sutil */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-brown/5 transition-all duration-300 group-hover:scale-125"></div>
            
            <div className="mb-4 text-primary-brown">
              <SustainabilityIcon />
            </div>
            <h3 className="text-lg font-semibold text-primary-brown mb-3">Conexión Local y Sostenibilidad</h3>
            <p className="text-gray-700 flex-grow text-sm z-10 relative">
              Viajes conectados con culturas locales respetando el medio ambiente, asegurando experiencias de alta calidad y sostenibles.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 