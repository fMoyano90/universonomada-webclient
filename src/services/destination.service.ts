/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Interfaces para manejo de destinos
interface DestinationResponse {
  id: number;
  title: string;
  slug: string;
  imageSrc: string;
  type: string;
  description: string;
  isRecommended?: boolean;
  isSpecial?: boolean;
  galleryImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para respuesta paginada
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class DestinationService {
  private static instance: DestinationService;
  
  private constructor() {}

  static getInstance(): DestinationService {
    if (!DestinationService.instance) {
      DestinationService.instance = new DestinationService();
    }
    return DestinationService.instance;
  }

  /**
   * Crea un nuevo destino
   * @param formData FormData con los datos del destino, incluyendo imágenes
   * @returns Promesa con la respuesta del destino creado
   */
  async createDestination(formData: FormData): Promise<DestinationResponse> {
    try {
      const token = authService.getAuthToken();
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/destinations`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Actualiza un destino existente
   * @param id ID del destino a actualizar
   * @param formData FormData con los datos actualizados del destino
   * @returns Promesa con la respuesta del destino actualizado
   */
  async updateDestination(id: number, formData: FormData): Promise<DestinationResponse> {
    try {
      const token = authService.getAuthToken();
      
      const response = await axios({
        method: 'put',
        url: `${API_URL}/destinations/${id}`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene los últimos destinos agregados
   * @param limit Número de destinos a obtener (por defecto 6)
   * @returns Promesa con los destinos más recientes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getLatestDestinations(limit = 6): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/destinations/latest`, {
        params: { limit }
      });
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene destinos paginados por tipo
   * @param type Tipo de destino ('nacional' o 'internacional')
   * @param page Número de página
   * @param limit Número de elementos por página
   * @returns Promesa con los destinos paginados
   */
  async getPaginatedDestinationsByType(
    type: string, 
    page = 1, 
    limit = 10
  ): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/destinations/type/${type}`, {
        params: { page, limit }
      });
      
      // Devolvemos la respuesta completa y dejamos que el componente maneje la estructura
      return response.data;
    } catch (error) {
      console.error('Error completo al obtener destinos:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene el último destino marcado como especial/destacado
   * @returns Promesa con el destino destacado
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getLatestSpecialDestination(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/destinations/special/latest`);
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Maneja los errores de las peticiones
   * @param error Error capturado
   */
  private handleError(error: unknown): void {
    console.error('Error en la operación de destino:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error?.message) {
        const errorMessages = error.response.data.error.message;
        if (Array.isArray(errorMessages)) {
          throw new Error(errorMessages.join('. '));
        } else {
          throw new Error(errorMessages);
        }
      }
    }
    
    throw new Error('Error en la operación. Por favor, inténtelo de nuevo.');
  }
}

export default DestinationService.getInstance(); 