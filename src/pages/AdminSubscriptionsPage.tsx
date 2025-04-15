import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsTrash, BsCheck2, BsX } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import authService from "../services/auth.service";

// Interfaces
interface Subscription {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminSubscriptionsPage: React.FC = () => {
  // Estados
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

  // Cargar suscripciones
  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = authService.getAuthToken();

      // Construir URL con parámetros de paginación y filtro
      let url = `${API_URL}/subscriptions?page=${page}&limit=${limit}`;
      if (filterActive !== null) {
        url += `&isActive=${filterActive}`;
      }

      console.log("Fetching subscriptions from:", url); // Para depuración

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Manejar la estructura específica de la respuesta
      if (response.data && response.data.success && response.data.data) {
        const responseData = response.data.data;

        if (
          responseData.success &&
          responseData.data &&
          responseData.data.data
        ) {
          // Estructura: { success: true, data: { success: true, data: { data: [...], meta: {...} } } }
          const subscriptionData = responseData.data;

          setSubscriptions(subscriptionData.data);
          setTotalPages(subscriptionData.meta.totalPages);
          setTotalItems(subscriptionData.meta.total);
        } else {
          throw new Error("Formato de datos inesperado");
        }
      } else {
        throw new Error("Respuesta sin datos o estructura incorrecta");
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Error al cargar las suscripciones");
      toast.error("Error al cargar las suscripciones");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente o cambiar página/filtro
  useEffect(() => {
    fetchSubscriptions();
  }, [page, limit, filterActive]);

  // Cambiar estado de una suscripción
  const toggleSubscriptionStatus = async (
    id: number,
    currentStatus: boolean
  ) => {
    const loadingToast = toast.loading("Actualizando estado...");

    try {
      const token = authService.getAuthToken();
      await axios.patch(
        `${API_URL}/subscriptions/${id}/toggle-status`,
        {}, // No necesitamos enviar datos, el backend maneja el toggle
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar estado localmente para evitar recargar toda la página
      setSubscriptions((prevSubscriptions) =>
        prevSubscriptions.map((sub) =>
          sub.id === id ? { ...sub, isActive: !currentStatus } : sub
        )
      );

      toast.success(
        `Suscripción ${
          !currentStatus ? "activada" : "desactivada"
        } correctamente`,
        { id: loadingToast }
      );
    } catch (err) {
      console.error("Error updating subscription status:", err);
      toast.error("Error al actualizar el estado de la suscripción", {
        id: loadingToast,
      });
    }
  };

  // Eliminar una suscripción
  const deleteSubscription = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta suscripción?")
    ) {
      const loadingToast = toast.loading("Eliminando suscripción...");

      try {
        const token = authService.getAuthToken();
        await axios.delete(`${API_URL}/subscriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Actualizar lista localmente
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.filter((sub) => sub.id !== id)
        );

        // Actualizar contadores
        setTotalItems((prev) => prev - 1);
        if (subscriptions.length === 1 && page > 1) {
          setPage(page - 1); // Volver a la página anterior si eliminamos el último elemento
        }

        toast.success("Suscripción eliminada correctamente", {
          id: loadingToast,
        });
      } catch (err) {
        console.error("Error deleting subscription:", err);
        toast.error("Error al eliminar la suscripción", { id: loadingToast });
      }
    }
  };

  // Componente de paginación
  const PaginationComponent = () => (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            page === 1
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            page === totalPages
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Siguiente
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">
              {Math.min((page - 1) * limit + 1, totalItems)}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {Math.min(page * limit, totalItems)}
            </span>{" "}
            de <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">Anterior</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Generar botones de páginas */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Lógica para mostrar páginas cercanas a la actual
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === pageNum
                      ? "z-10 bg-primary-blue text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">Siguiente</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionar Suscripciones</h1>

        <div className="flex space-x-2">
          <div className="relative inline-block">
            <button
              onClick={() =>
                setFilterActive(filterActive === true ? null : true)
              }
              className={`px-4 py-2 rounded-lg flex items-center ${
                filterActive === true
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <BsCheck2 className="mr-2" /> Activas
            </button>
          </div>

          <div className="relative inline-block">
            <button
              onClick={() =>
                setFilterActive(filterActive === false ? null : false)
              }
              className={`px-4 py-2 rounded-lg flex items-center ${
                filterActive === false
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <BsX className="mr-2" /> Inactivas
            </button>
          </div>

          <button
            onClick={() => {
              setFilterActive(null);
              fetchSubscriptions();
            }}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center"
          >
            Actualizar
          </button>
        </div>
      </div>

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
      ) : subscriptions.length === 0 ? (
        <div className="bg-gray-100 p-8 text-center rounded-lg">
          <p className="text-gray-500">
            No hay suscripciones disponibles con los filtros actuales.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha de suscripción
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {subscription.name || "No proporcionado"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscription.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.createdAt).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        toggleSubscriptionStatus(
                          subscription.id,
                          subscription.isActive
                        )
                      }
                      className={`inline-flex items-center px-3 py-1 rounded mr-2 ${
                        subscription.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {subscription.isActive ? (
                        <>
                          <BsX className="mr-1" /> Desactivar
                        </>
                      ) : (
                        <>
                          <BsCheck2 className="mr-1" /> Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteSubscription(subscription.id)}
                      className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      <BsTrash className="mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && <PaginationComponent />}
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
