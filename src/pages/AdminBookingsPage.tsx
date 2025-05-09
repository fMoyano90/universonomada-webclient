import React, { useState, useEffect } from 'react';
import { getAdminBookings, updateBookingStatus } from '../services/booking.service';
import { BookingStatus, BookingType } from '../utils/enums';
import { toast } from 'react-hot-toast';

interface Booking {
  id: number;
  userId: number;
  destinationId: number;
  status: BookingStatus;
  bookingType: BookingType;
  startDate: string;
  endDate: string;
  numPeople: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [selectedType, setSelectedType] = useState<BookingType | ''>('');
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  const [processingBookingId, setProcessingBookingId] = useState<number | null>(null);

  // Cargar las reservas
  useEffect(() => {
    loadBookings();
  }, [selectedStatus, selectedType, meta.page]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const result = await getAdminBookings(
        meta.page, 
        meta.limit, 
        selectedStatus || undefined, 
        selectedType || undefined
      );
      setBookings(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      toast.error('Error al cargar las reservas y cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de estado de una reserva
  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus, bookingType: BookingType) => {
    setProcessingBookingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus, bookingType);
      
      // Actualizar el estado localmente
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setProcessingBookingId(null);
    }
  };

  // Convertir cotización a reserva
  const convertToBooking = async (bookingId: number) => {
    setProcessingBookingId(bookingId);
    try {
      await updateBookingStatus(bookingId, BookingStatus.PENDING, BookingType.BOOKING);
      
      // Actualizar el tipo localmente
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, bookingType: BookingType.BOOKING } 
          : booking
      ));
      
      toast.success('Cotización convertida a reserva');
    } catch (error) {
      console.error('Error al convertir cotización:', error);
      toast.error('Error al convertir la cotización');
    } finally {
      setProcessingBookingId(null);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No establecida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reservas y Cotizaciones</h2>
      
      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as BookingType | '')}
          >
            <option value="">Todos</option>
            <option value={BookingType.QUOTE}>Cotizaciones</option>
            <option value={BookingType.BOOKING}>Reservas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | '')}
          >
            <option value="">Todos</option>
            <option value={BookingStatus.PENDING}>Pendientes</option>
            <option value={BookingStatus.CONFIRMED}>Confirmadas</option>
            <option value={BookingStatus.CANCELLED}>Canceladas</option>
            <option value={BookingStatus.COMPLETED}>Completadas</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-end">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => {
              setSelectedStatus('');
              setSelectedType('');
              setMeta({ ...meta, page: 1 });
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de reservas */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="loader">Cargando...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay reservas o cotizaciones que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <tr 
                    className={`hover:bg-gray-50 ${expandedBooking === booking.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.bookingType === BookingType.QUOTE 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {booking.bookingType === BookingType.QUOTE ? 'Cotización' : 'Reserva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === BookingStatus.PENDING 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : booking.status === BookingStatus.CONFIRMED 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === BookingStatus.CANCELLED 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === BookingStatus.PENDING ? 'Pendiente' : 
                         booking.status === BookingStatus.CONFIRMED ? 'Confirmada' : 
                         booking.status === BookingStatus.CANCELLED ? 'Cancelada' : 'Completada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.destinationId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.startDate ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}` : 'Fechas flexibles'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{booking.numPeople}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.totalPrice ? `$${booking.totalPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedBooking(expandedBooking === booking.id ? null : booking.id);
                        }}
                      >
                        {expandedBooking === booking.id ? 'Ocultar' : 'Ver más'}
                      </button>
                    </td>
                  </tr>
                  {expandedBooking === booking.id && (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 bg-gray-50">
                        <div className="p-4 border border-gray-200 rounded-md">
                          <h4 className="font-semibold mb-2">Detalles adicionales</h4>
                          
                          {booking.specialRequests && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700">Solicitudes especiales:</h5>
                              <div className="mt-1 whitespace-pre-line text-sm text-gray-600 bg-white p-3 rounded border">
                                {booking.specialRequests}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            {booking.bookingType === BookingType.QUOTE && (
                              <button 
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
                                onClick={() => convertToBooking(booking.id)}
                                disabled={processingBookingId === booking.id}
                              >
                                {processingBookingId === booking.id ? 'Procesando...' : 'Convertir a Reserva'}
                              </button>
                            )}
                            
                            {booking.status === BookingStatus.PENDING && (
                              <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
                                onClick={() => handleStatusChange(booking.id, BookingStatus.CONFIRMED, booking.bookingType)}
                                disabled={processingBookingId === booking.id}
                              >
                                {processingBookingId === booking.id ? 'Procesando...' : 'Confirmar'}
                              </button>
                            )}
                            
                            {booking.status !== BookingStatus.CANCELLED && (
                              <button 
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
                                onClick={() => handleStatusChange(booking.id, BookingStatus.CANCELLED, booking.bookingType)}
                                disabled={processingBookingId === booking.id}
                              >
                                {processingBookingId === booking.id ? 'Procesando...' : 'Cancelar'}
                              </button>
                            )}
                            
                            {booking.status === BookingStatus.CONFIRMED && (
                              <button 
                                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
                                onClick={() => handleStatusChange(booking.id, BookingStatus.COMPLETED, booking.bookingType)}
                                disabled={processingBookingId === booking.id}
                              >
                                {processingBookingId === booking.id ? 'Procesando...' : 'Marcar como Completada'}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {meta.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {(meta.page - 1) * meta.limit + 1} a {Math.min(meta.page * meta.limit, meta.total)} de {meta.total} resultados
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
              disabled={meta.page === 1}
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
              disabled={meta.page === meta.totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
