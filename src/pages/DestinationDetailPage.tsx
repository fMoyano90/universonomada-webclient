import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import DestinationDetailHeader from '../components/DestinationDetailHeader';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { FaCalendarAlt, FaCamera, FaInfoCircle, FaQuestion, FaFileAlt, FaListUl } from 'react-icons/fa';
import sanPedroAtacama from '../assets/images/san pedro de atacama/san pedro de atacama.jpg';

const DestinationDetailPage = () => {
  // Estado para el menú activo
  const [activeSection, setActiveSection] = useState('descripcion');
  
  // Referencias para cada sección
  const sectionRefs = {
    descripcion: useRef<HTMLDivElement>(null),
    itinerario: useRef<HTMLDivElement>(null),
    incluye: useRef<HTMLDivElement>(null),
    tips: useRef<HTMLDivElement>(null),
    galeria: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };

  // Efecto para actualizar la sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(key);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para scroll suave a sección
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs[sectionId as keyof typeof sectionRefs].current;
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Datos de ejemplo - en una implementación real vendrían de una API o props
  const destination = {
    id: 1,
    title: 'Tour San Pedro de Atacama',
    imageSrc: sanPedroAtacama,
    duration: '5 días y 4 noches',
    activityLevel: 'Moderada',
    activityType: ['Naturaleza', 'Cultura', 'Aventura'],
    groupSize: '12 personas',
    description: 'Descubre los paisajes más surrealistas del planeta en un viaje que conecta con los elementos, las estrellas y el alma. Este viaje está diseñado para quienes buscan una aventura profunda, paisajes inolvidables y momentos de desconexión total en uno de los desiertos más mágicos del mundo. San Pedro de Atacama no solo impresiona con su belleza, sino que transforma.',
    itinerary: [
      {
        day: 'Día 1',
        title: 'Bienvenida y noche estrellada',
        details: [
          'Llegada al aeropuerto de Calama.',
          'Transfer compartido hacia tu alojamiento en San Pedro de Atacama.',
          'Día libre para aclimatarse, recorrer el pueblo, visitar el mercado artesanal o simplemente relajarte.',
          'Por la noche: Tour Astronómico: Observa las estrellas como nunca antes en un cielo considerado uno de los más limpios del mundo.',
          'Incluye charla astronómica, observación con telescopios, snack y sesión de fotos con la Vía Láctea.'
        ]
      },
      {
        day: 'Día 2',
        title: 'Termas y paisajes lunares',
        details: [
          'Mañana: Termas de Puritama: Relájate en aguas termales enclavadas en una quebrada. Un oasis entre el desierto.',
          'Tarde: Valle de la Luna: Caminata por dunas y formaciones de otro planeta. Atardecer épico.'
        ]
      },
      {
        day: 'Día 3',
        title: 'Colores altiplánicos',
        details: [
          'Full Day: Piedras Rojas + Lagunas Altiplánicas: Visita Socaire, Laguna Chaxa, Piedras Rojas y las Lagunas Miscanti y Miñiques.',
          'Almuerzo en restaurante local.',
          'Paisajes con volcanes, flamencos y salares.'
        ]
      },
      {
        day: 'Día 4',
        title: 'Amanecer geotérmico',
        details: [
          'Muy temprano: Géiser del Tatio: Admira los chorros de vapor a más de 4.000 msnm al amanecer.',
          'Incluye desayuno en el campo geotérmico.',
          'Parada en el pueblo de Machuca.'
        ]
      },
      {
        day: 'Día 5',
        title: 'Último día libre y regreso',
        details: [
          'Tiempo libre para compras, fotos o una caminata tranquila.',
          'Transfer compartido hacia el aeropuerto de Calama.'
        ]
      }
    ],
    includes: [
      '4 noches de alojamiento en San Pedro de Atacama',
      'Transfers aeropuerto – hotel – aeropuerto',
      'Tours mencionados con transporte y guía bilingüe',
      'Entradas a parques y reservas',
      'Desayunos día 3 y 4 y snacks en tours (según tour)',
      'Almuerzo día 3',
      'Seguro de asistencia en ruta',
      'Fotografías astronómicas'
    ],
    excludes: [
      'Vuelos domésticos e internacionales',
      'Comidas no mencionadas',
      'Propinas',
      'Gastos personales'
    ],
    tips: [
      'Llevar ropa de abrigo, especialmente para los tours en la madrugada',
      'Usar protector solar y labial hidratante',
      'Llevar botella reutilizable y snacks personales',
      'No olvides el pasaporte',
      '¡Y muchas ganas de dejarte sorprender!'
    ],
    faqs: [
      {
        question: '¿Cuál es la mejor época para visitar San Pedro de Atacama?',
        answer: 'San Pedro se puede visitar todo el año gracias a su clima desértico. Sin embargo, los meses más recomendados son de marzo a mayo y de septiembre a noviembre, cuando las temperaturas son agradables y hay menos afluencia de turistas. En invierno puede hacer frío en las mañanas y noches, especialmente en zonas altas.'
      },
      {
        question: '¿Necesito estar en buena condición física?',
        answer: 'No necesitas ser atleta, pero sí estar en buena salud general. Algunas excursiones se realizan a más de 4.000 metros de altitud, por lo que es importante aclimatarse bien el primer día (por eso lo dejamos libre). Si tienes alguna condición médica, consúltanos y adaptamos el plan a ti.'
      },
      {
        question: '¿Es un viaje apto para niños o personas mayores?',
        answer: '¡Sí! Solo ajustamos el itinerario dependiendo de la edad y condiciones físicas. Hemos tenido familias con niños y personas mayores que disfrutan muchísimo. Cuéntanos tus necesidades y diseñamos la experiencia ideal.'
      },
      {
        question: '¿Qué pasa si hay mal clima o no se puede hacer un tour?',
        answer: 'La mayoría de los tours se realiza con normalidad, pero en caso de cancelación por razones climáticas o de fuerza mayor, te ofreceremos una alternativa o la devolución correspondiente, según el servicio afectado.'
      },
      {
        question: '¿Qué documentos necesito para viajar?',
        answer: 'Si eres chileno/a, solo necesitas tu cédula de identidad vigente. Si vienes desde el extranjero, asegúrate de tener tu pasaporte vigente. Si tienes dudas sobre requisitos migratorios, escríbenos y te ayudamos.'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1489724800701-76e4bc20121a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596395463910-4c0fcf466866?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1970&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540963115015-cb99f6e2bbe7?q=80&w=1974&auto=format&fit=crop'
    ]
  };

  // Animación para elementos al aparecer
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="bg-white pt-32">
      {/* Header con imagen y datos principales */}
      <DestinationDetailHeader 
        title={destination.title}
        imageSrc={destination.imageSrc}
        duration={destination.duration}
        activityLevel={destination.activityLevel}
        activityType={destination.activityType}
        groupSize={destination.groupSize}
      />
      
      {/* Contenido principal */}
      <div id="destination-content" className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna principal (2/3) */}
          <div className="lg:col-span-2 space-y-12 mt-9">
            {/* Descripción */}
            <motion.section 
              ref={sectionRefs.descripcion}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaFileAlt /></span> Descripción
              </h2>
              <p className="text-gray-600 leading-relaxed">{destination.description}</p>
            </motion.section>
            
            {/* Itinerario */}
            <motion.section 
              ref={sectionRefs.itinerario}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaCalendarAlt /></span> Itinerario Detallado
              </h2>
              <div className="space-y-8">
                {destination.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-primary-green pl-5 pb-6">
                    <h3 className="font-bold text-primary-green-dark text-xl">{day.day}: {day.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {day.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary-green mr-2 mt-1 text-lg">•</span>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>
            
            {/* Incluye/No incluye */}
            <motion.section 
              ref={sectionRefs.incluye}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaListUl /></span> Detalles del programa
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-primary-green-dark">Incluye</h3>
                  <ul className="space-y-3">
                    {destination.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-green flex-shrink-0 mt-1 mr-2 text-lg"><IoCheckmarkCircleOutline /></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-red-500">No Incluye</h3>
                  <ul className="space-y-3">
                    {destination.excludes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 flex-shrink-0 mt-1 mr-2 text-lg"><RxCross2 /></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>
            
            {/* Tips de viaje */}
            <motion.section 
              ref={sectionRefs.tips}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaInfoCircle /></span> Tips de viaje
              </h2>
              <ul className="space-y-3">
                {destination.tips.map((tip, index) => (
                  <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                    <span className="text-primary-orange mr-2 mt-1">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
            
            {/* Galería */}
            <motion.section 
              ref={sectionRefs.galeria}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaCamera /></span> Galería de fotos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.gallery.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`Imagen de ${destination.title} ${index + 1}`} 
                    className="rounded-lg h-64 w-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </motion.section>
            
            {/* FAQ */}
            <motion.section 
              ref={sectionRefs.faq}
              className="bg-white p-8 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-primary-green mr-3"><FaQuestion /></span> Preguntas Frecuentes
              </h2>
              <div className="space-y-6">
                {destination.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">
                    <h3 className="font-bold text-primary-green-dark text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
          
          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-8">
            {/* CTA Móvil (visible solo en dispositivos móviles) */}
            <div className="lg:hidden mb-8">
              <button className="w-full bg-primary-green text-black font-medium py-4 px-6 rounded-xl hover:bg-primary-green-dark transition-colors">
                Reservar ahora
              </button>
            </div>
            
            {/* CTA Desktop (visible solo en desktop) - Sin posición sticky */}
            <motion.div 
              className="hidden lg:block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-2xl font-bold mb-3">¿Listo para la aventura?</h3>
                <p className="text-gray-600 mb-4">Realiza tu reserva ahora y prepárate para una experiencia inolvidable en San Pedro de Atacama.</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2 flex-col">
                    <span className="font-medium">Precio por persona desde</span>
                    <span className="font-bold">CLP $450.000</span>
                  </div>
                  <div className="text-sm text-gray-500">En base a habitación doble</div>
                </div>
                
                <button className="w-full bg-primary-green text-black font-medium py-4 px-6 rounded-xl hover:bg-primary-green-dark transition-colors mb-3">
                  Reservar ahora
                </button>
                
                <button className="w-full bg-white text-primary-green border border-primary-green font-medium py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors">
                  Consultar disponibilidad
                </button>
              </div>
            </motion.div>
            
            {/* Menú de navegación (sidebar) - Con posición sticky */}
            <div className="hidden lg:block sticky top-24 bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Explorar este destino</h3>
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => scrollToSection('descripcion')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'descripcion' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaFileAlt /></span>
                  Descripción
                </button>
                <button 
                  onClick={() => scrollToSection('itinerario')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'itinerario' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaCalendarAlt /></span>
                  Itinerario
                </button>
                <button 
                  onClick={() => scrollToSection('incluye')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'incluye' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaListUl /></span>
                  Incluye/No incluye
                </button>
                <button 
                  onClick={() => scrollToSection('tips')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'tips' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaInfoCircle /></span>
                  Tips de viaje
                </button>
                <button 
                  onClick={() => scrollToSection('galeria')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'galeria' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaCamera /></span>
                  Galería
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeSection === 'faq' ? 'bg-primary-green text-black' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2"><FaQuestion /></span>
                  FAQ
                </button>
              </nav>
            </div>
            
            {/* Mini contacto móvil */}
            <div className="block lg:hidden bg-white p-6 rounded-xl shadow-sm mt-6">
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://wa.me/56912345678" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a 
                  href="mailto:info@universo-nomada.com" 
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                  </svg>
                  Enviar email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de reserva */}
      <ReservaDestinationForm destinationName={destination.title} />

      {/* Tours Recomendados */}
      <ToursRecomendados />
    </div>
  );
};

// Componente de formulario de reserva específico para la página de destino
const ReservaDestinationForm = ({ destinationName }: { destinationName: string }) => {
  const [fechaEstablecida, setFechaEstablecida] = useState(true);
  const [adultos, setAdultos] = useState(1);
  const [infantes, setInfantes] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);

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
        setAdultos(prev => Math.max(prev - 1, 1)); // Mínimo 1 adulto
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
      destino: destinationName,
      fechaEstablecida,
      pasajeros: {
        adultos,
        infantes,
        ninos,
        adultosMayores
      }
    });
    alert('Tu solicitud de reserva ha sido enviada. Nos contactaremos contigo a la brevedad.');
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Listo para vivir esta experiencia?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Completa el formulario para solicitar tu reserva y un asesor te contactará para confirmar
            disponibilidad y detalles de pago.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-5xl"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Destino</label>
                  <div className="border border-gray-300 rounded-lg w-full p-3 flex items-center bg-gray-50">
                    <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {destinationName}
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
                className="w-full bg-primary-orange hover:bg-primary-orange-dark text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                RESERVAR AHORA
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Al hacer clic en "Reservar ahora", aceptas nuestros términos y condiciones de servicio.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// Componente de Tours Recomendados
const ToursRecomendados = () => {
  // Datos de ejemplo para tours recomendados
  const toursRecomendados = [
    {
      id: 1,
      title: 'Torres del Paine',
      description: 'Explora la magia de la Patagonia en 5 días inolvidables',
      price: 520000,
      duration: '5 días',
      location: 'Patagonia, Chile',
      image: 'https://images.unsplash.com/photo-1539233025432-389a5c25d838?q=80&w=1949&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Salar de Uyuni',
      description: 'Un viaje surrealista al espejo más grande del mundo',
      price: 380000,
      duration: '3 días',
      location: 'Bolivia',
      image: 'https://images.unsplash.com/photo-1626082372682-5a6ca46cc513?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Valle Sagrado y Machu Picchu',
      description: 'La esencia del imperio inca en una aventura cultural',
      price: 620000,
      duration: '7 días',
      location: 'Cusco, Perú',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  // Animación para las cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Otros destinos que te podrían interesar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Continúa explorando experiencias únicas en los destinos más impresionantes de Sudamérica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {toursRecomendados.map((tour, index) => (
            <motion.div
              key={tour.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <div className="relative h-48">
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-primary-orange text-white text-sm font-medium px-3 py-1 rounded-bl-lg">
                  {tour.duration}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tour.location}
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    <div className="text-xs text-gray-500">Desde</div>
                    <div className="text-primary-orange">CLP ${tour.price.toLocaleString()}</div>
                  </div>
                  <button className="bg-primary-orange hover:bg-primary-orange-dark text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationDetailPage; 