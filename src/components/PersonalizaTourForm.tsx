import { useState } from "react";
import { motion } from "framer-motion";
import { createQuote } from "../services/booking.service";
import { toast } from "react-hot-toast";

// Destinos disponibles con sus IDs correspondientes
const destinos = [
  { id: 1, name: "San Pedro de Atacama" },
  { id: 2, name: "Torres del Paine" },
  { id: 3, name: "Machu Picchu" },
  { id: 4, name: "Salar de Uyuni" },
  { id: 5, name: "Isla de Pascua" },
  { id: 6, name: "Valparaíso" },
  { id: 7, name: "Carretera Austral" },
  { id: 8, name: "Cusco" },
  { id: 9, name: "Lima" },
  { id: 10, name: "La Paz" },
];

const PersonalizaTourForm = () => {
  // Estado para el formulario
  const [selectedDestinoId, setSelectedDestinoId] = useState<number | null>(
    null
  );
  const [selectedDestinoName, setSelectedDestinoName] = useState("");
  const [showDestinos, setShowDestinos] = useState(false);
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

    if (!selectedDestinoId) {
      errors.destino = "Por favor selecciona un destino";
    }

    if (fechaEstablecida) {
      if (!fechaSalida) {
        errors.fechaSalida = "Por favor selecciona una fecha de salida";
      }
      if (!fechaRetorno) {
        errors.fechaRetorno = "Por favor selecciona una fecha de retorno";
      }
      if (
        fechaSalida &&
        fechaRetorno &&
        new Date(fechaSalida) >= new Date(fechaRetorno)
      ) {
        errors.fechas =
          "La fecha de retorno debe ser posterior a la fecha de salida";
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
      // Preparar datos para la API
      const quoteData = {
        destinationId: selectedDestinoId!,
        startDate: fechaEstablecida ? fechaSalida : undefined,
        endDate: fechaEstablecida ? fechaRetorno : undefined,
        adults: adultos,
        children: ninos,
        infants: infantes,
        seniors: adultosMayores,
        needsAccommodation: necesitaHotel,
        specialRequests: solicitudEspecial,
        contactInfo: {
          name: nombre,
          email: email,
          phone: telefono,
        },
      };

      // Enviar al backend
      const response = await createQuote(quoteData);

      // Resetear el formulario
      setSelectedDestinoId(null);
      setSelectedDestinoName("");
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

      // Mostrar mensaje de éxito
      toast.success(
        "¡Recibimos tu solicitud! Nos pondremos en contacto contigo pronto."
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tu Próxima Aventura Empieza Aquí
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vive la libertad de viajar a destinos auténticos, diseñados a tu
            medida, donde la naturaleza y la cultura se unen para cumplir tus
            sueños.
          </p>
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary-green-dark animate-bounce cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => {
                const formElement = document.getElementById(
                  "personalizaTourForm"
                );
                if (formElement) {
                  formElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          id="personalizaTourForm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-5xl"
        >
          <div className="bg-primary-orange-dark text-white rounded-lg py-3 px-6 inline-block mb-8">
            <h3 className="font-bold text-lg">PERSONALIZA TU TOUR</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Destino
                  </label>
                  <div className="relative">
                    <div
                      className={`border ${
                        formErrors.destino
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg w-full p-3 flex items-center cursor-pointer`}
                      onClick={() => setShowDestinos(!showDestinos)}
                    >
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
                      {selectedDestinoName || "Selecciona un destino"}
                      <svg
                        className={`h-5 w-5 ml-auto text-gray-500 transition-transform ${
                          showDestinos ? "transform rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {formErrors.destino && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.destino}
                      </p>
                    )}

                    {showDestinos && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                        {destinos.map((destino) => (
                          <div
                            key={destino.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedDestinoId(destino.id);
                              setSelectedDestinoName(destino.name);
                              setShowDestinos(false);
                            }}
                          >
                            {destino.name}
                          </div>
                        ))}
                      </div>
                    )}
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
                          className={`border ${
                            formErrors.fechaSalida
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg w-full p-3`}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {formErrors.fechaSalida && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.fechaSalida}
                          </p>
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
                          className={`border ${
                            formErrors.fechaRetorno
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg w-full p-3`}
                          min={
                            fechaSalida ||
                            new Date().toISOString().split("T")[0]
                          }
                        />
                        {formErrors.fechaRetorno && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.fechaRetorno}
                          </p>
                        )}
                      </div>
                    </div>

                    {formErrors.fechas && (
                      <p className="text-red-500 text-sm mt-1 mb-4">
                        {formErrors.fechas}
                      </p>
                    )}
                  </>
                )}

                <div className="mb-6">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <label className="text-gray-700 font-medium">
                      Alojamiento
                    </label>
                    <input
                      type="checkbox"
                      id="necesitaHotel"
                      className="ml-auto w-4 h-4"
                      checked={necesitaHotel}
                      onChange={() => setNecesitaHotel(!necesitaHotel)}
                    />
                    <label
                      htmlFor="necesitaHotel"
                      className="ml-2 text-gray-700"
                    >
                      Necesito hotel
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Solicitudes especiales
                  </label>
                  <textarea
                    placeholder="Escribe aquí si tienes alguna solicitud especial"
                    value={solicitudEspecial}
                    onChange={(e) => setSolicitudEspecial(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-3 h-32 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Segunda columna */}
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Pasajeros
                  </label>

                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Adultos</p>
                        <p className="text-sm text-gray-500">
                          Mayor de 18 años
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero("adultos")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">
                          {adultos}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero("adultos")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
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
                          onClick={() => decrementarPasajero("ninos")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">
                          {ninos}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero("ninos")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
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
                          onClick={() => decrementarPasajero("infantes")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">
                          {infantes}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero("infantes")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div>
                        <p className="font-medium">Adultos mayores</p>
                        <p className="text-sm text-gray-500">
                          Mayor de 65 años
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => decrementarPasajero("adultosMayores")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-4 font-medium w-4 text-center">
                          {adultosMayores}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          onClick={() => incrementarPasajero("adultosMayores")}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Datos de contacto
                    </label>

                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={`border ${
                          formErrors.nombre
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.nombre && (
                        <p className="text-red-500 text-sm">
                          {formErrors.nombre}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`border ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={`border ${
                          formErrors.telefono
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg w-full p-3 mb-1`}
                      />
                      {formErrors.telefono && (
                        <p className="text-red-500 text-sm">
                          {formErrors.telefono}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className={`bg-primary-orange-dark hover:bg-primary-orange-light text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Solicitar Cotización"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalizaTourForm;
