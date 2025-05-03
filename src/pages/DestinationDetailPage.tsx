/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import DestinationDetailHeader from "../components/DestinationDetailHeader";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import {
  FaCalendarAlt,
  FaCamera,
  FaInfoCircle,
  FaQuestion,
  FaFileAlt,
  FaListUl,
} from "react-icons/fa";
import sanPedroAtacama from "../assets/images/san pedro de atacama/san pedro de atacama.jpg";
import destinationService from "../services/destination.service";
import ToursRecomendados from "../components/ToursRecomendados";

// Interfaces para los tipos de datos
interface ItineraryItem {
  day: string;
  title: string;
  details: string[];
}

interface Faq {
  question: string;
  answer: string;
}

interface DestinationDetail {
  id: number;
  title: string;
  imageSrc: string;
  duration: string;
  activityLevel: string;
  activityType: string[];
  groupSize: string;
  description: string;
  price: number;
  itinerary: ItineraryItem[];
  includes: string[];
  excludes: string[];
  tips: string[];
  faqs: Faq[];
  gallery: string[];
}

const DestinationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<DestinationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el menú activo
  const [activeSection, setActiveSection] = useState("descripcion");

  // Referencia al formulario de reserva
  const reservaFormRef = useRef<HTMLDivElement>(null);

  // Referencias para cada sección
  const sectionRefs = {
    descripcion: useRef<HTMLDivElement>(null),
    itinerario: useRef<HTMLDivElement>(null),
    incluye: useRef<HTMLDivElement>(null),
    tips: useRef<HTMLDivElement>(null),
    galeria: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };

  // Cargar datos del destino
  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await destinationService.getDestinationById(Number(id));
        
        if (!data) {
          throw new Error('No se pudo obtener la información del destino');
        }
        
        console.log('Datos del destino recibidos:', data);

        // Mapear la respuesta del API a la estructura que esperamos
        const mappedDestination: DestinationDetail = {
          id: data.id,
          title: data.title || 'Sin título',
          imageSrc: data.imageSrc || sanPedroAtacama,
          duration: data.duration || "Consultar duración",
          activityLevel: data.activityLevel || "Moderada",
          activityType: Array.isArray(data.activityType) ? data.activityType : ["Aventura"],
          groupSize: data.groupSize || "Consultar",
          description: data.description || 'Sin descripción disponible',
          price: data.price ? parseFloat(data.price) : 0,

          // Mapear el itinerario con verificación de datos
          itinerary:
            data.itineraryItems?.map((item: any) => ({
              day: item.day || `Día`,
              title: item.title || 'Actividad',
              details: Array.isArray(item.details) 
                ? item.details.map((detail: any) => detail.detail || '') 
                : [],
            })) || [],

          // Mapear includes, excludes, tips con verificación
          includes: data.includes?.map((item: any) => item.item || '') || [],
          excludes: data.excludes?.map((item: any) => item.item || '') || [],
          tips: data.tips?.map((item: any) => item.tip || '') || [],

          // Mapear FAQs con verificación
          faqs:
            data.faqs?.map((item: any) => ({
              question: item.question || '¿Pregunta?',
              answer: item.answer || 'Sin respuesta disponible',
            })) || [],

          // Mapear galería con verificación
          gallery: data.galleryImages?.map((item: any) => item.imageUrl || '') || [],
        };

        setDestination(mappedDestination);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el destino:", err);
        setError(
          "No pudimos cargar la información del destino. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // Efecto para actualizar la sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para scroll suave a sección
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs[sectionId as keyof typeof sectionRefs].current;
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Función para scroll al formulario de reserva
  const scrollToReservaForm = () => {
    if (reservaFormRef.current) {
      // Usamos getBoundingClientRect para obtener la posición exacta
      const rect = reservaFormRef.current.getBoundingClientRect();
      // Calculamos la posición absoluta del elemento
      const absoluteTop = window.pageYOffset + rect.top;
      // Ajustamos para que el formulario esté completamente visible
      const scrollPosition = absoluteTop - 100; // 100px de margen superior
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Función para abrir WhatsApp
  const openWhatsApp = () => {
    // Número de teléfono con formato internacional
    const phoneNumber = "56974636396";
    // Mensaje predefinido
    const message = encodeURIComponent(`Hola, estoy interesado en consultar la disponibilidad del destino "${destination?.title}". ¿Podrían proporcionarme más información?`);
    // URL para abrir WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    
    // Abre WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  // Animación para elementos al aparecer
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Si está cargando, mostramos un indicador o usamos datos de respaldo
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-green mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            Cargando información del destino...
          </p>
        </div>
      </div>
    );
  }

  // Si hay un error, mostramos un mensaje
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white pt-32">
        <div className="text-center p-8 max-w-2xl">
          <div className="text-red-500 text-6xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-green text-black px-6 py-3 rounded-lg hover:bg-primary-green-dark transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Si no hay destino, no mostramos nada
  if (!destination) {
    return null;
  }

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
        onReserveClick={scrollToReservaForm}
      />

      {/* Contenido principal */}
      <div
        id="destination-content"
        className="container mx-auto max-w-6xl px-6 py-16 pt-0"
      >
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
                <span className="text-primary-green mr-3">
                  <FaFileAlt />
                </span>{" "}
                Descripción
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {destination.description}
              </p>
            </motion.section>

            {/* Itinerario */}
            {destination.itinerary && destination.itinerary.length > 0 && (
              <motion.section
                ref={sectionRefs.itinerario}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="text-primary-green mr-3">
                    <FaCalendarAlt />
                  </span>{" "}
                  Itinerario Detallado
                </h2>
                <div className="space-y-8">
                  {destination.itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-primary-green pl-5 pb-6"
                    >
                      <h3 className="font-bold text-primary-green-dark text-xl">
                        {day.day}: {day.title}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {day.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary-green mr-2 mt-1 text-lg">
                              •
                            </span>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Incluye/No incluye */}
            {(destination.includes?.length > 0 ||
              destination.excludes?.length > 0) && (
              <motion.section
                ref={sectionRefs.incluye}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="text-primary-green mr-3">
                    <FaListUl />
                  </span>{" "}
                  Detalles del programa
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {destination.includes?.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4 text-primary-green-dark">
                        Incluye
                      </h3>
                      <ul className="space-y-3">
                        {destination.includes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-green flex-shrink-0 mt-1 mr-2 text-lg">
                              <IoCheckmarkCircleOutline />
                            </span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {destination.excludes?.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4 text-red-500">
                        No Incluye
                      </h3>
                      <ul className="space-y-3">
                        {destination.excludes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 flex-shrink-0 mt-1 mr-2 text-lg">
                              <RxCross2 />
                            </span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Tips de viaje */}
            {destination.tips && destination.tips.length > 0 && (
              <motion.section
                ref={sectionRefs.tips}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="text-primary-green mr-3">
                    <FaInfoCircle />
                  </span>{" "}
                  Tips de viaje
                </h2>
                <ul className="space-y-3">
                  {destination.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start bg-gray-50 p-3 rounded-md"
                    >
                      <span className="text-primary-orange mr-2 mt-1">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Galería */}
            {destination.gallery && destination.gallery.length > 0 && (
              <motion.section
                ref={sectionRefs.galeria}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="text-primary-green mr-3">
                    <FaCamera />
                  </span>{" "}
                  Galería de fotos
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
            )}

            {/* FAQ */}
            {destination.faqs && destination.faqs.length > 0 && (
              <motion.section
                ref={sectionRefs.faq}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="text-primary-green mr-3">
                    <FaQuestion />
                  </span>{" "}
                  Preguntas Frecuentes
                </h2>
                <div className="space-y-6">
                  {destination.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-5 last:border-b-0 last:pb-0"
                    >
                      <h3 className="font-bold text-primary-green-dark text-lg mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-8">
            {/* CTA Móvil (visible solo en dispositivos móviles) */}
            <div className="lg:hidden mb-8">
              <button 
                onClick={openWhatsApp} 
                className="w-full bg-[#25D366] text-white font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="flex-shrink-0"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                Consultar disponibilidad
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
                <h3 className="text-2xl font-bold mb-3">
                  ¿Listo para la aventura?
                </h3>
                <p className="text-gray-600 mb-4">
                  Realiza tu reserva ahora y prepárate para una experiencia
                  inolvidable en {destination.title}.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2 flex-col">
                    <span className="font-medium">
                      Precio por persona desde
                    </span>
                    <span className="font-bold">
                      CLP ${destination.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    En base a habitación doble
                  </div>
                </div>

                <button 
                  onClick={scrollToReservaForm} 
                  className="w-full bg-primary-green text-black font-medium py-4 px-6 rounded-xl hover:bg-primary-green-dark transition-colors mb-3"
                >
                  Reservar ahora
                </button>

                <button 
                  onClick={openWhatsApp} 
                  className="w-full bg-white text-primary-green border border-primary-green font-medium py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Consultar disponibilidad
                </button>
              </div>
            </motion.div>

            {/* Menú de navegación (sidebar) - Con posición sticky */}
            <div className="hidden lg:block sticky top-24 bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Explorar este destino
              </h3>
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection("descripcion")}
                  className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === "descripcion"
                      ? "bg-primary-green text-black"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">
                    <FaFileAlt />
                  </span>
                  Descripción
                </button>
                {destination.itinerary?.length > 0 && (
                  <button
                    onClick={() => scrollToSection("itinerario")}
                    className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "itinerario"
                        ? "bg-primary-green text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">
                      <FaCalendarAlt />
                    </span>
                    Itinerario
                  </button>
                )}
                {(destination.includes?.length > 0 ||
                  destination.excludes?.length > 0) && (
                  <button
                    onClick={() => scrollToSection("incluye")}
                    className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "incluye"
                        ? "bg-primary-green text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">
                      <FaListUl />
                    </span>
                    Incluye/No incluye
                  </button>
                )}
                {destination.tips?.length > 0 && (
                  <button
                    onClick={() => scrollToSection("tips")}
                    className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "tips"
                        ? "bg-primary-green text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">
                      <FaInfoCircle />
                    </span>
                    Tips de viaje
                  </button>
                )}
                {destination.gallery?.length > 0 && (
                  <button
                    onClick={() => scrollToSection("galeria")}
                    className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "galeria"
                        ? "bg-primary-green text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">
                      <FaCamera />
                    </span>
                    Galería
                  </button>
                )}
                {destination.faqs?.length > 0 && (
                  <button
                    onClick={() => scrollToSection("faq")}
                    className={`flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "faq"
                        ? "bg-primary-green text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">
                      <FaQuestion />
                    </span>
                    FAQ
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de reserva */}
      <div ref={reservaFormRef}>
        <ReservaDestinationForm destinationName={destination.title} />
      </div>

      {/* Tours Recomendados */}
      <ToursRecomendados />
    </div>
  );
};

// Componente de formulario de reserva específico para la página de destino
const ReservaDestinationForm = ({
  destinationName,
}: {
  destinationName: string;
}) => {
  const [fechaEstablecida, setFechaEstablecida] = useState(true);
  const [adultos, setAdultos] = useState(1);
  const [infantes, setInfantes] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);

  const incrementarPasajero = (tipo: string) => {
    switch (tipo) {
      case "adultos":
        setAdultos((prev) => Math.min(prev + 1, 10));
        break;
      case "infantes":
        setInfantes((prev) => Math.min(prev + 1, 5));
        break;
      case "ninos":
        setNinos((prev) => Math.min(prev + 1, 8));
        break;
      case "adultosMayores":
        setAdultosMayores((prev) => Math.min(prev + 1, 5));
        break;
    }
  };

  const decrementarPasajero = (tipo: string) => {
    switch (tipo) {
      case "adultos":
        setAdultos((prev) => Math.max(prev - 1, 1)); // Mínimo 1 adulto
        break;
      case "infantes":
        setInfantes((prev) => Math.max(prev - 1, 0));
        break;
      case "ninos":
        setNinos((prev) => Math.max(prev - 1, 0));
        break;
      case "adultosMayores":
        setAdultosMayores((prev) => Math.max(prev - 1, 0));
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
        adultosMayores,
      },
    });
    alert(
      "Tu solicitud de reserva ha sido enviada. Nos contactaremos contigo a la brevedad."
    );
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
            Completa el formulario para solicitar tu reserva y un asesor te
            contactará para confirmar disponibilidad y detalles de pago.
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
                  <label className="block text-gray-700 font-medium mb-2">
                    Destino
                  </label>
                  <div className="border border-gray-300 rounded-lg w-full p-3 flex items-center bg-gray-50">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
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
                    <label
                      htmlFor="fechaFlexible"
                      className="ml-2 text-gray-700"
                    >
                      No tengo fecha establecida
                    </label>
                  </div>
                </div>

                {fechaEstablecida && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Fecha de salida
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd/mm/aaaa"
                          className="border border-gray-300 rounded-lg w-full p-3"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                        />
                        <svg
                          className="absolute right-3 top-3 h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Fecha de retorno
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd/mm/aaaa"
                          className="border border-gray-300 rounded-lg w-full p-3"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                        />
                        <svg
                          className="absolute right-3 top-3 h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-4">
                    Pasajeros
                  </label>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Infantes (0-2)</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero("infantes")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{infantes}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero("infantes")}
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
                          onClick={() => decrementarPasajero("ninos")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{ninos}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero("ninos")}
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
                          onClick={() => decrementarPasajero("adultos")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{adultos}</span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero("adultos")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Adultos mayores (65+)
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementarPasajero("adultosMayores")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">
                          {adultosMayores}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementarPasajero("adultosMayores")}
                          className="w-8 h-8 flex items-center justify-center bg-primary-orange text-white rounded-md focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      className="border border-gray-300 rounded-lg w-full p-3 pl-10"
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
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
                Al hacer clic en "Reservar ahora", aceptas nuestros términos y
                condiciones de servicio.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationDetailPage;
