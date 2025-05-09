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
                  Reservar Ahora
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
        <ReservaDestinationForm destinationName={destination.title} destinationId={destination.id} />
      </div>

      {/* Tours Recomendados */}
      <ToursRecomendados />
    </div>
  );
};

// Componente de formulario de reserva específico para la página de destino
const ReservaDestinationForm = ({
  destinationName,
  destinationId,
}: {
  destinationName: string;
  destinationId: number;
}) => {
  const [fechaEstablecida, setFechaEstablecida] = useState(true);
  const [fechaSalida, setFechaSalida] = useState("");
  const [fechaRetorno, setFechaRetorno] = useState("");
  const [adultos, setAdultos] = useState(1);
  const [infantes, setInfantes] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);
  const [necesitaHotel, setNecesitaHotel] = useState(false);
  const [solicitudEspecial, setSolicitudEspecial] = useState("");

  // Datos de contacto
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  
  // Estado de envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (fechaEstablecida) {
      if (!fechaSalida) {
        errors.fechaSalida = "Por favor selecciona una fecha de salida";
      }
      if (!fechaRetorno) {
        errors.fechaRetorno = "Por favor selecciona una fecha de retorno";
      }
      if (fechaSalida && fechaRetorno && new Date(fechaSalida) >= new Date(fechaRetorno)) {
        errors.fechas = "La fecha de retorno debe ser posterior a la fecha de salida";
      }
    }

    if (!nombre.trim()) {
      errors.nombre = "Por favor ingresa tu nombre";
    }

    if (!email.trim()) {
      errors.email = "Por favor ingresa tu email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Por favor ingresa un email válido";
    }

    if (!telefono.trim()) {
      errors.telefono = "Por favor ingresa tu teléfono";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Importamos dinámicamente para evitar problemas de carga circular
      const { createBooking } = await import("../services/booking.service");
      
      // Preparar datos para la API
      const bookingData = {
        destinationId: destinationId,
        startDate: fechaEstablecida ? fechaSalida : null,
        endDate: fechaEstablecida ? fechaRetorno : null,
        adults: adultos,
        children: ninos,
        infants: infantes,
        seniors: adultosMayores,
        needsAccommodation: necesitaHotel,
        specialRequests: solicitudEspecial,
        contactInfo: {
          name: nombre,
          email: email,
          phone: telefono
        }
      };

      // Enviar al backend
      await createBooking(bookingData);
      
      // Resetear el formulario
      setFechaSalida("");
      setFechaRetorno("");
      setAdultos(1);
      setInfantes(0);
      setNinos(0);
      setAdultosMayores(0);
      setNecesitaHotel(false);
      setSolicitudEspecial("");
      setNombre("");
      setEmail("");
      setTelefono("");
      
      // Mostrar mensaje de éxito con diálogo personalizado
      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 flex items-center justify-center z-50';
      dialog.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        <div class="relative bg-white rounded-lg max-w-md mx-auto p-8 shadow-xl transform transition-all">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 class="text-2xl leading-7 font-bold text-gray-900 mb-2">¡Increíble elección!</h3>
            <div class="mt-3">
              <p class="text-lg text-gray-600 mb-4">
                Tu aventura está a punto de comenzar. Hemos recibido tu solicitud y estamos emocionados de ser parte de tu próxima experiencia inolvidable.
              </p>
              <p class="text-base text-gray-500 mb-5">
                Uno de nuestros expertos en viajes se pondrá en contacto contigo muy pronto para personalizar cada detalle de esta maravillosa aventura.
              </p>
              <button type="button" class="mt-2 inline-flex justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
      
      // Evento para el botón de aceptar
      const button = dialog.querySelector('button');
      if (button) {
        button.addEventListener('click', () => {
          document.body.removeChild(dialog);
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      
      // Mostrar mensaje de error con diálogo personalizado
      const dialogError = document.createElement('div');
      dialogError.className = 'fixed inset-0 flex items-center justify-center z-50';
      dialogError.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        <div class="relative bg-white rounded-lg max-w-md mx-auto p-8 shadow-xl transform transition-all">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-amber-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h3 class="text-2xl leading-7 font-bold text-gray-900 mb-2">¡Ups! Algo salió mal</h3>
            <div class="mt-3">
              <p class="text-lg text-gray-600 mb-4">
                Parece que ha ocurrido un problema al procesar tu solicitud de reserva.
              </p>
              <p class="text-base text-gray-500 mb-5">
                Por favor, intenta nuevamente en unos minutos o contáctanos directamente por teléfono para ayudarte con tu reserva.
              </p>
              <button type="button" class="mt-2 inline-flex justify-center rounded-md border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none">
                Entendido
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialogError);
      
      // Evento para el botón de aceptar en el error
      const buttonError = dialogError.querySelector('button');
      if (buttonError) {
        buttonError.addEventListener('click', () => {
          document.body.removeChild(dialogError);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
                          type="date" 
                          value={fechaSalida}
                          onChange={(e) => setFechaSalida(e.target.value)}
                          className={`border ${formErrors.fechaSalida ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {formErrors.fechaSalida && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.fechaSalida}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Fecha de retorno
                      </label>
                      <div className="relative">
                        <input
                          type="date" 
                          value={fechaRetorno}
                          onChange={(e) => setFechaRetorno(e.target.value)}
                          className={`border ${formErrors.fechaRetorno ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3`}
                          min={fechaSalida || new Date().toISOString().split('T')[0]}
                        />
                        {formErrors.fechaRetorno && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.fechaRetorno}</p>
                        )}
                      </div>
                    </div>
                    
                    {formErrors.fechas && (
                      <p className="text-red-500 text-sm mt-1 mb-4">{formErrors.fechas}</p>
                    )}
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

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Solicitudes especiales</label>
                  <textarea 
                    placeholder="Escribe aquí si tienes alguna solicitud especial" 
                    value={solicitudEspecial}
                    onChange={(e) => setSolicitudEspecial(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-3 h-32 resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Pasajeros
                  </label>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Adultos</p>
                        <p className="text-sm text-gray-500">Mayor de 18 años</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero('adultos')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">{adultos}</span>
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero('adultos')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Niños</p>
                        <p className="text-sm text-gray-500">De 3 a 17 años</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero('ninos')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">{ninos}</span>
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero('ninos')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Infantes</p>
                        <p className="text-sm text-gray-500">Menor de 3 años</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero('infantes')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">{infantes}</span>
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero('infantes')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Adultos mayores</p>
                        <p className="text-sm text-gray-500">Mayor de 65 años</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero('adultosMayores')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">{adultosMayores}</span>
                        <button 
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero('adultosMayores')}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Datos de contacto</label>
                    
                    <div className="mb-4">
                      <input 
                        type="text" 
                        placeholder="Nombre completo" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={`border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.nombre && (
                        <p className="text-red-500 text-sm">{formErrors.nombre}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <input 
                        type="tel" 
                        placeholder="Teléfono" 
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={`border ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.telefono && (
                        <p className="text-red-500 text-sm">{formErrors.telefono}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                type="submit" 
                className={`bg-primary-green hover:bg-primary-green-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Reservar Ahora'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationDetailPage;
