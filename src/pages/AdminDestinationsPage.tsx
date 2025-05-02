/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import AdminDestinationForm from "../components/AdminDestinationForm";
import authService from "../services/auth.service";
import { Destination } from "../components/interfaces";

// Interfaces
// Ya no necesitamos redefinir estas interfaces

const AdminDestinationsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

  // Cargar destinos desde el backend
  const fetchDestinations = async (page = 1, limit = 100) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = authService.getAuthToken();

      // Llamar al nuevo endpoint paginado general
      const response = await axios.get(`${API_URL}/destinations`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      // Manejar la estructura anidada específica de la respuesta
      console.log("Estructura de respuesta:", response.data);

      // Navegación segura a través de los niveles anidados
      let destinationsArray: Destination[] = [];

      if (response.data?.data?.data?.data) {
        // Estructura exacta del ejemplo proporcionado: success→data→success→data→data[]
        destinationsArray = response.data.data.data.data;
        console.log("Meta información:", response.data.data.data.meta);
      } else if (response.data?.data?.data) {
        // Estructura alternativa: success→data→data[]
        destinationsArray = response.data.data.data;
      } else if (response.data?.data) {
        // Estructura simple: data→data[]
        destinationsArray = response.data.data;
      } else {
        // Fallback: asumir que es un array directamente
        destinationsArray = Array.isArray(response.data) ? response.data : [];
      }

      console.log("Destinos extraídos:", destinationsArray.length);

      // Ordenar por fecha de creación descendente (si existe createdAt)
      destinationsArray.sort((a: Destination, b: Destination) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setDestinations(destinationsArray);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Error al cargar los destinos");
      toast.error("Error al cargar los destinos");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar destinos al montar el componente
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Eliminar un destino
  const handleDeleteDestination = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este destino? Esta acción no se puede deshacer."
      )
    ) {
      const loadingToast = toast.loading("Eliminando destino...");

      try {
        const token = authService.getAuthToken();
        await axios.delete(`${API_URL}/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Actualizar lista localmente
        setDestinations((prev) => prev.filter((dest) => dest.id !== id));

        toast.success("Destino eliminado correctamente", { id: loadingToast });
      } catch (err) {
        console.error("Error deleting destination:", err);
        toast.error("Error al eliminar el destino", { id: loadingToast });
      }
    }
  };

  // Editar un destino
  const handleEditDestination = async (destination: Destination) => {
    try {
      // Siempre vamos a cargar los datos completos del destino desde el servidor
      if (destination.id) {
        setIsLoading(true);
        const token = authService.getAuthToken();

        // Obtener los detalles completos del destino usando el endpoint GET /destinations/:id
        const response = await axios.get(
          `${API_URL}/destinations/${destination.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Respuesta del servidor para el destino:", response.data);

        // Verificar que tenemos datos y extraer correctamente los datos anidados
        if (response.data) {
          // Navegamos a través de la estructura anidada para obtener los datos reales
          let destinoCompleto;

          // Caso 1: Respuesta en response.data.data.data
          if (response.data.data && response.data.data.data) {
            destinoCompleto = response.data.data.data;
          }
          // Caso 2: Respuesta en response.data.data
          else if (response.data.data) {
            destinoCompleto = response.data.data;
          }
          // Caso 3: Respuesta directa en response.data
          else {
            destinoCompleto = response.data;
          }

          // Aseguramos que destinoCompleto tenga los campos necesarios
          if (typeof destinoCompleto === "object" && destinoCompleto) {
            // Preservar el ID original
            if (!destinoCompleto.id) {
              destinoCompleto.id = destination.id;
            }

            // Asegurar que todos los arrays existan para evitar errores posteriores
            destinoCompleto.itinerary = destinoCompleto.itinerary || [];
            destinoCompleto.includes = destinoCompleto.includes || [];
            destinoCompleto.excludes = destinoCompleto.excludes || [];
            destinoCompleto.tips = destinoCompleto.tips || [];
            destinoCompleto.faqs = destinoCompleto.faqs || [];
            destinoCompleto.gallery = destinoCompleto.gallery || [];
            destinoCompleto.activityType = destinoCompleto.activityType || [];

            // Actualizar estado y mostrar formulario
            toast.success("Datos del destino cargados");
            setSelectedDestination(destinoCompleto);
            setShowForm(true);
          } else {
            throw new Error("La estructura de datos recibida no es válida");
          }
        } else {
          throw new Error("No se recibieron datos del destino");
        }
      } else {
        throw new Error("El destino no tiene un ID válido");
      }
    } catch (error) {
      console.error("Error al cargar los detalles del destino:", error);
      toast.error("No se pudieron cargar los detalles del destino");

      // En caso de error, intentar editar con los datos mínimos que tenemos
      setSelectedDestination(destination);
      setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para formatear moneda (Pesos Chilenos)
  const formatPrice = (price: number | string) => {
    // Asegurarse de que price sea un número
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numericPrice)) return "Precio no disponible";

    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0, // Sin decimales para pesos chilenos
    }).format(numericPrice);
  };

  // Helper para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // Fallback
    }
  };

  return (
    <div className="p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: "#E6F4EA",
              color: "#0F5132",
              border: "1px solid #0F5132",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#FEE2E2",
              color: "#B91C1C",
              border: "1px solid #B91C1C",
            },
          },
          loading: {
            style: {
              background: "#EFF6FF",
              color: "#1E40AF",
              border: "1px solid #1E40AF",
            },
          },
        }}
      />

      {showForm ? (
        // Render the form view
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {selectedDestination
                ? `Editar Destino: ${selectedDestination.title}`
                : "Crear Nuevo Destino"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedDestination(null); // Limpiar selección al volver
              }}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
            >
              Volver a la Lista
            </button>
          </div>
          <AdminDestinationForm
            destinationToEdit={selectedDestination}
            onSaveSuccess={() => {
              setShowForm(false);
              setSelectedDestination(null);
              fetchDestinations(); // Recargar lista después de guardar
            }}
          />
        </>
      ) : (
        // Render the list view
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestionar Destinos</h2>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
            >
              + Crear Nuevo Destino
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Aquí puedes ver, editar y eliminar los destinos existentes.
          </p>

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="bg-gray-100 p-8 text-center rounded-lg">
              <p className="text-gray-500">
                No hay destinos disponibles. ¡Crea uno nuevo!
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul role="list" className="divide-y divide-gray-200">
                {destinations.map((dest) => (
                  <li
                    key={dest.id}
                    className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Top row: Title and Badges */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {dest.imageSrc && (
                          <img
                            src={dest.imageSrc}
                            alt={dest.title}
                            className="h-10 w-10 mr-3 object-cover rounded"
                          />
                        )}
                        <p className="text-md font-semibold text-primary-blue truncate">
                          {dest.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dest.type === "nacional"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {dest.type}
                        </span>
                        {dest.isRecommended && (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Recomendado
                          </span>
                        )}
                        {dest.isSpecial && (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Especial
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle row: Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium text-gray-800">
                          Ubicación:
                        </span>{" "}
                        {dest.location}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">
                          Duración:
                        </span>{" "}
                        {dest.duration}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">
                          Precio:
                        </span>{" "}
                        {formatPrice(dest.price)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">
                          Creado:
                        </span>{" "}
                        {dest.createdAt
                          ? formatDate(dest.createdAt)
                          : "Fecha desconocida"}
                      </div>
                    </div>

                    {/* Bottom row: Actions */}
                    <div className="flex justify-end items-center text-sm text-gray-500 space-x-4">
                      <button
                        onClick={() => handleEditDestination(dest)}
                        className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          dest.id !== undefined &&
                          handleDeleteDestination(dest.id)
                        }
                        disabled={dest.id === undefined}
                        className="font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDestinationsPage;
