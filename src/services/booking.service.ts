import axios from 'axios';
import authService from './auth.service';

// URL base del servidor (usando la variable de entorno de Vite)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Interfaces
interface BookingRequest {
  destinationId: number;
  startDate?: string | null;
  endDate?: string | null;
  adults: number;
  children?: number;
  infants?: number;
  seniors?: number;
  needsAccommodation: boolean;
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  bookingType?: string; // Tipo de reserva (QUOTE o BOOKING)
}

interface BookingResponse {
  id: number;
  userId: number;
  destinationId: number;
  status: string;
  bookingType: string;
  startDate: string;
  endDate: string;
  numPeople: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Crear una cotización (desde la página principal)
export const createQuote = async (quoteData: BookingRequest): Promise<BookingResponse> => {
  try {
    // Enviamos el valor real del enum
    const requestData = {
      ...quoteData,
      bookingType: "quote" // Valor real del enum
    };
    
    console.log('Enviando datos de cotización:', requestData);
    console.log('Fechas enviadas (cotización) - inicio:', requestData.startDate, 'fin:', requestData.endDate);
    
    const response = await axios.post(`${API_URL}/bookings/quote`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cotización:', error);
    throw error;
  }
};

// Crear una reserva directa (desde la página de detalle de destino)
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    // Enviamos el valor real del enum
    const requestData = {
      ...bookingData,
      bookingType: "booking" // Valor real del enum
    };
    
    console.log('Enviando datos de reserva directa:', requestData);
    
    const response = await axios.post(`${API_URL}/bookings/quote`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error al crear reserva directa:', error);
    throw error;
  }
};

// Obtener las reservas del usuario actual
export const getUserBookings = async (): Promise<BookingResponse[]> => {
  try {
    const token = authService.getAuthToken();
    const response = await axios.get(`${API_URL}/bookings/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    throw error;
  }
};

// Para uso en la página de administración - obtener todas las reservas
export const getAdminBookings = async (
  page = 1, 
  limit = 10, 
  status?: string, 
  bookingType?: string
): Promise<{
  data: BookingResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    let url = `${API_URL}/bookings?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    if (bookingType) {
      url += `&bookingType=${bookingType}`;
    }
    
    const token = authService.getAuthToken();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Manejar diferentes estructuras de respuesta
    if (response.data?.success && response.data?.data) {
      // Si tiene la estructura: { success: true, data: { data: [...], meta: {...} } }
      if (response.data.data.data && response.data.data.meta) {
        return {
          data: response.data.data.data,
          meta: response.data.data.meta
        };
      }
      // Si tiene la estructura: { success: true, data: [...], meta: {...} }
      else if (Array.isArray(response.data.data)) {
        return {
          data: response.data.data,
          meta: response.data.meta || { total: response.data.data.length, page, limit, totalPages: 1 }
        };
      }
    }
    
    // Estructura directa
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas para administración:', error);
    throw error;
  }
};

// Actualizar el estado de una reserva (para administradores)
export const updateBookingStatus = async (
  bookingId: number, 
  status: string,
  bookingType: string
): Promise<BookingResponse> => {
  try {
    const token = authService.getAuthToken();
    const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, {
      status,
      bookingType
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado de reserva:', error);
    throw error;
  }
};

// Obtener detalles de una reserva específica
export const getBookingById = async (bookingId: number): Promise<BookingResponse> => {
  try {
    const token = authService.getAuthToken();
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de reserva:', error);
    throw error;
  }
}; 