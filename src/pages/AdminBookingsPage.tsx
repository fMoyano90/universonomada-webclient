import React, { useState, useEffect } from 'react';
import { getAdminBookings, updateBookingStatus, updateBooking } from '../services/booking.service';
import { BookingStatus, BookingType } from '../utils/enums';
import { toast } from 'react-hot-toast';
import { 
  FiEdit, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiPhoneCall, 
  FiSend, 
  FiDollarSign,
  FiStar, 
  FiArrowRight, 
  FiMaximize2, 
  FiMinimize2,
  FiUsers,
  FiCalendar,
  FiPhone,
  FiMail,
  FiUser,
  FiHome,
  FiInfo,
  FiMessageSquare
} from 'react-icons/fi';

// Interfaz para el modelo local (con enums tipados)
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
  // Nuevos campos
  destinationName?: string;
  contactName?: string;
  contactPhone?: string;
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
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

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
      
      // Convertir las respuestas API (string) a enums tipados para uso local
      const typedBookings: Booking[] = result.data.map(booking => ({
        ...booking,
        status: booking.status as BookingStatus,
        bookingType: booking.bookingType as BookingType
      }));
      
      setBookings(typedBookings);
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
      await updateBooking(bookingId, { 
        bookingType: BookingType.BOOKING,
        status: BookingStatus.PENDING
      });
      
      // Actualizar el tipo localmente
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, bookingType: BookingType.BOOKING, status: BookingStatus.PENDING } 
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

  // Guardar cambios de la edición
  const saveBookingChanges = async () => {
    if (!editingBooking) return;
    
    setProcessingBookingId(editingBooking.id);
    try {
      await updateBooking(editingBooking.id, {
        totalPrice: editingBooking.totalPrice,
        startDate: editingBooking.startDate,
        endDate: editingBooking.endDate,
        numPeople: editingBooking.numPeople,
        specialRequests: editingBooking.specialRequests,
        status: editingBooking.status,
        bookingType: editingBooking.bookingType
      });
      
      // Actualizar localmente
      setBookings(bookings.map(booking => 
        booking.id === editingBooking.id 
          ? editingBooking
          : booking
      ));
      
      setEditingBooking(null);
      toast.success('Reserva actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar los cambios');
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

  // Obtener etiqueta del estado según el tipo de reserva
  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Pendiente';
      case BookingStatus.IN_REVIEW:
        return 'En revisión';
      case BookingStatus.SENT:
        return 'Enviado';
      case BookingStatus.IN_CONTACT:
        return 'En contacto';
      case BookingStatus.APPROVED:
        return 'Aprobado';
      case BookingStatus.APPROVED_AND_PAID:
        return 'Aprobado y pagado';
      case BookingStatus.REJECTED:
        return 'Rechazado';
      case BookingStatus.CANCELLED:
        return 'Cancelado';
      case BookingStatus.COMPLETED:
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  // Obtener color de fondo según el estado
  const getStatusBgColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.SENT:
        return 'bg-indigo-100 text-indigo-800';
      case BookingStatus.IN_CONTACT:
        return 'bg-purple-100 text-purple-800';
      case BookingStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.APPROVED_AND_PAID:
        return 'bg-emerald-100 text-emerald-800';
      case BookingStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case BookingStatus.COMPLETED:
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Estados disponibles según el tipo
  const getAvailableStatuses = (bookingType: BookingType) => {
    if (bookingType === BookingType.QUOTE) {
      return [
        BookingStatus.PENDING,
        BookingStatus.IN_REVIEW,
        BookingStatus.SENT,
        BookingStatus.CANCELLED
      ];
    } else {
      return [
        BookingStatus.PENDING,
        BookingStatus.IN_CONTACT,
        BookingStatus.APPROVED,
        BookingStatus.APPROVED_AND_PAID,
        BookingStatus.REJECTED,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED
      ];
    }
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
            <option value={BookingStatus.IN_REVIEW}>En revisión</option>
            <option value={BookingStatus.SENT}>Enviados</option>
            <option value={BookingStatus.IN_CONTACT}>En contacto</option>
            <option value={BookingStatus.APPROVED}>Aprobados</option>
            <option value={BookingStatus.APPROVED_AND_PAID}>Aprobados y pagados</option>
            <option value={BookingStatus.REJECTED}>Rechazados</option>
            <option value={BookingStatus.CANCELLED}>Cancelados</option>
            <option value={BookingStatus.COMPLETED}>Completados</option>
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

      {/* Modal de edición */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold">
                {editingBooking.bookingType === BookingType.QUOTE ? 
                  <span className="flex items-center"><FiClock className="mr-2 text-blue-600" /> Editar Cotización #{editingBooking.id}</span> : 
                  <span className="flex items-center"><FiStar className="mr-2 text-purple-600" /> Editar Reserva #{editingBooking.id}</span>
                }
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditingBooking(null)}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingBooking.bookingType}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    bookingType: e.target.value as BookingType
                  })}
                >
                  <option value={BookingType.QUOTE}>Cotización</option>
                  <option value={BookingType.BOOKING}>Reserva</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingBooking.status}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    status: e.target.value as BookingStatus
                  })}
                >
                  {getAvailableStatuses(editingBooking.bookingType).map(status => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center"><FiDollarSign className="mr-1" /> Precio Total</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={Math.round(editingBooking.totalPrice)}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    totalPrice: parseInt(e.target.value)
                  })}
                />
                <span className="text-xs text-gray-500">Pesos chilenos (sin decimales)</span>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">Número de Personas</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingBooking.numPeople}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    numPeople: parseInt(e.target.value)
                  })}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingBooking.startDate ? editingBooking.startDate.split('T')[0] : ''}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    startDate: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingBooking.endDate ? editingBooking.endDate.split('T')[0] : ''}
                  onChange={(e) => setEditingBooking({
                    ...editingBooking,
                    endDate: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="mb-4 space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Solicitudes Especiales</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={editingBooking.specialRequests || ''}
                onChange={(e) => setEditingBooking({
                  ...editingBooking,
                  specialRequests: e.target.value
                })}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                onClick={() => setEditingBooking(null)}
              >
                <FiX className="mr-2" /> Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                onClick={saveBookingChanges}
                disabled={processingBookingId === editingBooking.id}
              >
                {processingBookingId === editingBooking.id ? 
                  'Guardando...' : 
                  <><FiCheck className="mr-2" /> Guardar Cambios</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

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
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
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
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBgColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.destinationName || `Destino #${booking.destinationId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.contactName ? (
                        <div className="flex flex-col">
                          <span>{booking.contactName}</span>
                          {booking.contactPhone && (
                            <span className="text-xs text-gray-500">{booking.contactPhone}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin contacto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.startDate ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}` : 'Fechas flexibles'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{booking.numPeople}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {booking.totalPrice ? `$${Math.round(booking.totalPrice).toLocaleString('es-CL')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedBooking(expandedBooking === booking.id ? null : booking.id);
                        }}
                      >
                        {expandedBooking === booking.id ? 
                          <><FiMinimize2 className="mr-1" /> Ocultar</> : 
                          <><FiMaximize2 className="mr-1" /> Ver más</>}
                      </button>
                    </td>
                  </tr>
                  {expandedBooking === booking.id && (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 bg-gray-50">
                        <div className="p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                          <h4 className="font-semibold mb-4 text-lg border-b pb-2 flex items-center">
                            <FiInfo className="mr-2 text-indigo-600" /> Detalles de la {booking.bookingType === BookingType.QUOTE ? 'cotización' : 'reserva'}
                          </h4>
                          
                          {/* Información detallada unificada */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del grupo */}
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
                              <h5 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                                <FiUsers className="mr-2" /> Detalles del grupo
                              </h5>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                  <span className="text-gray-700 flex items-center"><FiUsers className="mr-2 text-indigo-500" /> Total personas:</span>
                                  <span className="font-medium text-indigo-800">{booking.numPeople}</span>
                                </div>
                                
                                {booking.specialRequests && (
                                  <>
                                    {booking.specialRequests.includes('Adultos:') && (
                                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                        <span className="text-gray-700 flex items-center"><FiUser className="mr-2 text-indigo-500" /> Adultos:</span>
                                        <span className="font-medium text-indigo-800">
                                          {booking.specialRequests.match(/Adultos:\s*(\d+)/)?.[1] || '-'}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {booking.specialRequests.includes('Niños:') && (
                                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                        <span className="text-gray-700 flex items-center"><FiUser className="mr-2 text-indigo-500" /> Niños:</span>
                                        <span className="font-medium text-indigo-800">
                                          {booking.specialRequests.match(/Niños:\s*(\d+)/)?.[1] || '-'}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {booking.specialRequests.includes('Infantes:') && (
                                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                        <span className="text-gray-700 flex items-center"><FiUser className="mr-2 text-indigo-500" /> Infantes:</span>
                                        <span className="font-medium text-indigo-800">
                                          {booking.specialRequests.match(/Infantes:\s*(\d+)/)?.[1] || '-'}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {booking.specialRequests.includes('Adultos mayores:') && (
                                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                        <span className="text-gray-700 flex items-center"><FiUser className="mr-2 text-indigo-500" /> Adultos mayores:</span>
                                        <span className="font-medium text-indigo-800">
                                          {booking.specialRequests.match(/Adultos mayores:\s*(\d+)/)?.[1] || '-'}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {booking.specialRequests.includes('Necesita alojamiento:') && (
                                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                        <span className="text-gray-700 flex items-center"><FiHome className="mr-2 text-indigo-500" /> Alojamiento:</span>
                                        <span className={`font-medium ${booking.specialRequests.includes('Necesita alojamiento: Sí') ? 'text-green-600' : 'text-gray-600'}`}>
                                          {booking.specialRequests.includes('Necesita alojamiento: Sí') ? 'Sí' : 'No'}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                                
                                <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                  <span className="text-gray-700 flex items-center"><FiCalendar className="mr-2 text-indigo-500" /> Fechas:</span>
                                  <span className="font-medium text-indigo-800">
                                    {booking.startDate ? `${formatDate(booking.startDate)} al ${formatDate(booking.endDate)}` : 'Fechas flexibles'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Información de contacto */}
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
                              <h5 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                                <FiPhoneCall className="mr-2" /> Información de contacto
                              </h5>
                              <div className="space-y-3">
                                {booking.contactName && (
                                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                    <span className="text-gray-700 flex items-center"><FiUser className="mr-2 text-indigo-500" /> Nombre:</span>
                                    <span className="font-medium text-indigo-800">{booking.contactName}</span>
                                  </div>
                                )}
                                
                                {booking.contactPhone && (
                                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                    <span className="text-gray-700 flex items-center"><FiPhone className="mr-2 text-indigo-500" /> Teléfono:</span>
                                    <span className="font-medium text-indigo-800">{booking.contactPhone}</span>
                                  </div>
                                )}
                                
                                {booking.specialRequests && booking.specialRequests.includes('Contacto:') && (
                                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-indigo-100">
                                    <span className="text-gray-700 flex items-center"><FiMail className="mr-2 text-indigo-500" /> Email:</span>
                                    <span className="font-medium text-indigo-800 overflow-hidden text-ellipsis">
                                      {booking.specialRequests.match(/Contacto:.*?([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/)?.[1] || '-'}
                                    </span>
                                  </div>
                                )}

                                {booking.specialRequests && (
                                  <div className="mt-3">
                                    <div className="text-gray-700 flex items-center mb-2">
                                      <FiMessageSquare className="mr-2 text-indigo-500" /> Solicitudes especiales:
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600 bg-white p-3 rounded border border-indigo-100 max-h-40 overflow-y-auto whitespace-pre-line">
                                      {/* Filtrar información que ya mostramos estructuradamente */}
                                      {booking.specialRequests
                                        .replace(/Adultos:\s*\d+/g, '')
                                        .replace(/Niños:\s*\d+/g, '')
                                        .replace(/Infantes:\s*\d+/g, '')
                                        .replace(/Adultos mayores:\s*\d+/g, '')
                                        .replace(/Necesita alojamiento:\s*(Sí|No)/g, '')
                                        .replace(/Contacto:\s*.*/g, '')
                                        .trim() || 'No hay solicitudes adicionales'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Acciones */}
                          <div className="mt-6">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Acciones disponibles:</h5>
                            <div className="flex flex-wrap gap-2">
                              {/* Botones de cambio de estado */}
                              {/* Para cotizaciones */}
                              {booking.bookingType === BookingType.QUOTE && booking.status === BookingStatus.PENDING && (
                                <button 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.IN_REVIEW, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiClock className="mr-2" /> Marcar En Revisión</>}
                                </button>
                              )}
                              
                              {booking.bookingType === BookingType.QUOTE && booking.status === BookingStatus.IN_REVIEW && (
                                <button 
                                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.SENT, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiSend className="mr-2" /> Marcar como Enviado</>}
                                </button>
                              )}
                              
                              {/* Para reservas */}
                              {booking.bookingType === BookingType.BOOKING && booking.status === BookingStatus.PENDING && (
                                <button 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.IN_CONTACT, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiPhoneCall className="mr-2" /> Marcar En Contacto</>}
                                </button>
                              )}
                              
                              {booking.bookingType === BookingType.BOOKING && booking.status === BookingStatus.IN_CONTACT && (
                                <button 
                                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.APPROVED, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiCheck className="mr-2" /> Aprobar</>}
                                </button>
                              )}
                              
                              {booking.bookingType === BookingType.BOOKING && booking.status === BookingStatus.APPROVED && (
                                <button 
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.APPROVED_AND_PAID, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiDollarSign className="mr-2" /> Marcar como Pagado</>}
                                </button>
                              )}
                              
                              {booking.bookingType === BookingType.BOOKING && 
                               (booking.status === BookingStatus.APPROVED_AND_PAID || booking.status === BookingStatus.APPROVED) && (
                                <button 
                                  className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.COMPLETED, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiStar className="mr-2" /> Marcar como Completada</>}
                                </button>
                              )}
                              
                              {booking.bookingType === BookingType.BOOKING && 
                               booking.status !== BookingStatus.REJECTED && booking.status !== BookingStatus.CANCELLED && (
                                <button 
                                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, BookingStatus.REJECTED, booking.bookingType);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiX className="mr-2" /> Rechazar</>}
                                </button>
                              )}

                              {/* Botones de edición y conversión */}
                              <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingBooking({...booking});
                                }}
                                disabled={processingBookingId === booking.id}
                              >
                                <FiEdit className="mr-2" /> Editar
                              </button>

                              {booking.bookingType === BookingType.QUOTE && (
                                <button 
                                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    convertToBooking(booking.id);
                                  }}
                                  disabled={processingBookingId === booking.id}
                                >
                                  {processingBookingId === booking.id ? 
                                    <>Procesando...</> : 
                                    <><FiArrowRight className="mr-2" /> Convertir a Reserva</>}
                                </button>
                              )}
                              
                            </div>
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
