import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import logoSernatur from "../assets/sernatur.png";
import subscriptionService from "../services/subscription.service";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Por favor, ingresa un email válido");
      return;
    }

    setIsSubmitting(true);

    try {
      await subscriptionService.createSubscription(email);
      toast.success("¡Te has suscrito exitosamente!", {
        duration: 4000,
        icon: "🎉",
      });
      setEmail("");
    } catch (error) {
      console.error("Error al suscribirse:", error);
      toast.error(
        "No se pudo completar tu suscripción. Por favor, inténtalo más tarde."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm font-medium" }}
      />

      {/* Sección de suscripción */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-primary-green-light rounded-xl p-6 mb-12 -mt-20 relative shadow-xl">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-semibold text-black mb-2">
              ¡Suscríbete y obtén los mejores descuentos!
            </h3>
            <p className="text-gray-700">
              Recibe descuentos exclusivos, ofertas especiales y consejos de
              viaje directamente en tu correo.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-stretch gap-3"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue text-black"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Procesando..." : "Suscribirme"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo y botones de contacto */}
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <a
                href="https://serviciosturisticos.sernatur.cl/63063-universo-nomada"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-orange transition-colors font-bold"
              >
                <img
                  src={logoSernatur}
                  alt="Universo Nómada"
                  className="w-auto h-36"
                />
                77.928.278-3
              </a>
            </div>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="text-primary-green-dark font-medium mb-4">
              Políticas
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="text-white hover:text-primary-orange transition-colors text-left"
                >
                  Políticas de Seguridad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowCancellationModal(true)}
                  className="text-white hover:text-primary-orange transition-colors text-left"
                >
                  Políticas de Cancelación
                </button>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-primary-green-dark font-medium mb-4">
              Información
            </h3>
            <ul className="space-y-3">
              <li className="text-white">Chile</li>
              <li>
                <p className="text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                  </svg>
                  +56 9 7463 6396
                </p>
              </li>
              <li>
                <a
                  href="mailto:contacto@universonomada.cl"
                  className="text-white hover:text-primary-orange transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                  </svg>
                  contacto@universonomada.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright y créditos */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>Universo Nómada © {new Date().getFullYear()}</div>
          <div>
            <Link
              to="/admin/login"
              className="text-gray-500 hover:text-primary-orange transition-colors text-xs"
            >
              Acceso Administrador
            </Link>
          </div>
        </div>

        {/* Botón de WhatsApp flotante */}
        <motion.a
          href="https://api.whatsapp.com/send?phone=56974636396"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-[#25d366] p-4 rounded-full shadow-lg z-50 hover:bg-[#1da851] transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
          </svg>
        </motion.a>

        {/* Modal de Políticas de Seguridad */}
        {showSecurityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  Políticas de Seguridad
                </h2>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-primary-green-dark mb-2">
                    TT. OO UNIVERSO NÓMADA
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    En Universo Nómada, la seguridad y bienestar de nuestros
                    viajeros es nuestra principal prioridad. Trabajamos de
                    manera diligente para garantizar que cada experiencia sea
                    segura, organizada y memorable. A continuación, presentamos
                    nuestras políticas de seguridad que rigen nuestras
                    operaciones y tours:
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      1. Selección Rigurosa de Proveedores y Colaboradores
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Colaboramos únicamente con agencias y proveedores que
                      estén debidamente registrados y acreditados por las
                      autoridades correspondientes en sus respectivas áreas. Nos
                      aseguramos de que sus guías también cuenten con registro
                      oficial y certificaciones de primeros auxilios al día,
                      para garantizar que los viajeros estén en manos de
                      profesionales capacitados.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2. Revisión de Políticas de Seguridad de Nuestros
                      Colaboradores
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Solicitamos a cada empresa con la que trabajamos que nos
                      proporcione sus políticas de seguridad para cada
                      actividad. Esto nos permite asegurarnos de que las
                      actividades ofrecidas cumplen con estándares de seguridad
                      adecuados y que nuestros viajeros están protegidos en todo
                      momento.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3. Equipamiento de Seguridad
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      En cada actividad, garantizamos que los viajeros tengan
                      acceso a equipamiento de seguridad apropiado, como
                      botiquines de primeros auxilios, chalecos salvavidas,
                      cascos y otros elementos necesarios, asegurando que se
                      encuentren en buen estado y listos para su uso.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      4. Información y Comunicación Constante
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Antes de iniciar cualquier actividad, proporcionamos a los
                      viajeros información detallada sobre las medidas de
                      seguridad y los procedimientos a seguir. Mantenemos una
                      comunicación constante para atender cualquier inquietud y
                      garantizar que todos se sientan informados y seguros
                      durante el viaje.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      5. Adaptación a las Condiciones del Entorno
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Monitoreamos constantemente las condiciones climáticas y
                      ambientales de cada destino. En caso de que las
                      condiciones representen un riesgo, adaptamos o
                      reprogramamos las actividades para proteger la integridad
                      de nuestros viajeros.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      6. Identificación y Manejo de Riesgos
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Evaluamos cada actividad y destino para identificar
                      posibles riesgos y establecer medidas preventivas.
                      Nuestros guías están preparados para manejar situaciones
                      imprevistas y minimizar cualquier peligro que pudiera
                      surgir.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      7. Respeto por la Capacidad Física de los Viajeros
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Nos aseguramos de que cada actividad se adapte a la
                      capacidad física y nivel de experiencia de nuestros
                      viajeros. Los guías brindan asistencia y apoyo para
                      garantizar que cada experiencia sea cómoda y segura.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      8. Recomendación de Seguro de Viaje
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Si bien no ofrecemos seguros de viaje, recomendamos
                      encarecidamente a nuestros viajeros que cuenten con su
                      propio seguro antes de iniciar su aventura, para estar
                      cubiertos ante cualquier eventualidad.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      9. Compromiso con la Mejora Continua
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Revisamos y actualizamos constantemente nuestras políticas
                      de seguridad para asegurarnos de que estén alineadas con
                      las mejores prácticas y los estándares más altos del
                      sector turístico.
                    </p>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowSecurityModal(false)}
                    className="bg-primary-green text-black px-6 py-2 rounded-lg hover:bg-primary-green-dark transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Políticas de Cancelación */}
        {showCancellationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  Políticas de Cancelación
                </h2>
                <button
                  onClick={() => setShowCancellationModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-primary-green-dark mb-2">
                    UNIVERSO NÓMADA
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    En Universo Nómada, entendemos que pueden surgir situaciones
                    imprevistas que requieran modificar o cancelar tu viaje. Por
                    ello, hemos establecido las siguientes políticas de
                    cancelación para garantizar un proceso justo y claro para
                    nuestros viajeros.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      1. Cancelación del Viaje
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      La cancelación de un viaje debe ser notificada por escrito
                      al correo electrónico de Universo Nómada y estará sujeta a
                      las siguientes condiciones, según el tiempo de antelación
                      respecto a la fecha de inicio del tour:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-2 ml-4">
                      <li>
                        •{" "}
                        <strong>
                          Cancelación con más de 120 días de antelación:
                        </strong>{" "}
                        Se reembolsará el 80% del primer abono y el 100% de las
                        siguientes cuotas.
                      </li>
                      <li>
                        • <strong>Cancelación entre 120 y 90 días:</strong> Se
                        reembolsará el 60% del primer abono y el 100% de las
                        siguientes cuotas.
                      </li>
                      <li>
                        • <strong>Cancelación entre 90 y 60 días:</strong> Se
                        reembolsará el 40% del primer abono y el 100% de las
                        siguientes cuotas.
                      </li>
                      <li>
                        • <strong>Cancelación entre 60 y 30 días:</strong> Se
                        reembolsará el 20% del primer abono y el 100% de las
                        siguientes cuotas.
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          Cancelación con menos de 30 días de antelación:
                        </strong>{" "}
                        No se reembolsará el primer abono, pero se reembolsará
                        el 100% de las siguientes cuotas ya pagadas.
                      </li>
                    </ul>
                    <p className="text-gray-600 text-xs mt-3 italic">
                      Nota: El primer abono corresponde al 50% del valor total
                      del viaje que fue abonado al momento de la reserva.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2. No Show (No Presentación)
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Si el pasajero no se presenta en la fecha y hora
                      estipuladas para el inicio del viaje, no habrá reembolso
                      del primer abono ni de las cuotas pagadas. Esto se
                      considerará una cancelación con menos de 30 días de
                      antelación.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      3. Cancelación o Retraso del Vuelo del Pasajero
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      En caso de cancelación o retraso del vuelo del pasajero
                      que afecte el inicio del tour, se deberán considerar las
                      siguientes disposiciones:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-700 text-sm font-medium">
                          • Evidencia:
                        </p>
                        <p className="text-gray-700 text-sm ml-4">
                          El pasajero debe presentar evidencia oficial emitida
                          por la aerolínea que confirme la cancelación o retraso
                          del vuelo.
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm font-medium">
                          • Retraso del vuelo:
                        </p>
                        <ul className="text-gray-700 text-sm ml-4 space-y-1">
                          <li>
                            - Si el retraso es menor a 12 horas, se hará todo lo
                            posible para reprogramar actividades.
                          </li>
                          <li>
                            - Si el retraso es mayor a 12 horas y no es posible
                            reprogramar, no habrá reembolso por actividades
                            perdidas.
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm font-medium">
                          • Cancelación del vuelo:
                        </p>
                        <p className="text-gray-700 text-sm ml-4">
                          No habrá reembolso del primer abono. El pasajero
                          tendrá opción de reagendar con cargo adicional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      4. Cambios Solicitados por el Pasajero
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-2">
                      <li>
                        • <strong>Modificaciones:</strong> Los cambios están
                        sujetos a disponibilidad y podrían incurrir en cargos
                        adicionales. Deben solicitarse por escrito con al menos
                        30 días de antelación.
                      </li>
                      <li>
                        • <strong>Cambio de Fecha:</strong> Con más de 30 días
                        de antelación, se evaluará sin costo adicional. Con
                        menos de 30 días, estará sujeto a cargos adicionales.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      5. Cancelación por Parte de Universo Nómada
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      En caso de que Universo Nómada deba cancelar un viaje
                      debido a fuerza mayor, condiciones climáticas extremas o
                      cualquier evento que ponga en riesgo la seguridad del
                      pasajero, se reembolsará el 100% de lo pagado o se
                      ofrecerá la opción de reprogramar el viaje.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      6. Consideraciones Generales
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-2">
                      <li>
                        • <strong>Comprobantes:</strong> Todas las cancelaciones
                        y modificaciones deben realizarse por escrito.
                      </li>
                      <li>
                        • <strong>Tarifas No Reembolsables:</strong> Algunos
                        servicios pueden estar sujetos a políticas específicas
                        de proveedores.
                      </li>
                      <li>
                        • <strong>Seguros de Viaje:</strong> Recomendamos
                        contratar un seguro que cubra posibles cancelaciones.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary-green-light p-4 rounded-lg border-l-4 border-primary-green">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Contacto para Cancelaciones y Modificaciones
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Para realizar cualquier modificación o cancelación, envía
                      un correo electrónico a:
                      <strong> contacto@universonomada.cl</strong> indicando el
                      nombre completo, número de reserva y motivo de la
                      cancelación o cambio.
                    </p>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCancellationModal(false)}
                    className="bg-primary-green text-black px-6 py-2 rounded-lg hover:bg-primary-green-dark transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
