import axios from 'axios';

// URL base del servidor (debería estar en una variable de entorno)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Interfaces
interface CreateQuoteRequest {
  destinationId: number;
  startDate?: string;
  endDate?: string;
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

// Crear una cotización
export const createQuote = async (quoteData: CreateQuoteRequest): Promise<BookingResponse> => {
  try {
    const response = await axios.post(`${API_URL}/bookings/quote`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cotización:', error);
    throw error;
  }
};

// Obtener las reservas del usuario actual
export const getUserBookings = async (): Promise<BookingResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/bookings/user`);
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
    
    const response = await axios.get(url);
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
    const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, {
      status,
      bookingType
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
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de reserva:', error);
    throw error;
  }
}; 