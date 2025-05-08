import axios, { AxiosProgressEvent } from 'axios';
import { Testimonial, PaginationResult } from '../components/interfaces';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Definir la interfaz para la respuesta de carga de archivos
interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

class TestimonialService {
  private static instance: TestimonialService;
  private constructor() {}

  static getInstance(): TestimonialService {
    if (!TestimonialService.instance) {
      TestimonialService.instance = new TestimonialService();
    }
    return TestimonialService.instance;
  }

  private getAuthHeaders() {
    const token = authService.getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Método para subir imágenes
  async uploadImage(formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<UploadResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/uploads/testimonials`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new Error('Error al subir la imagen');
    }
  }

  // Método alternativo para almacenar la imagen temporalmente como base64
  async previewImageAsBase64(file: File, onProgress?: (percent: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        if (onProgress) onProgress(0);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    });
  }

  async getAllTestimonials(
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  ): Promise<PaginationResult<Testimonial>> {
    try {
      const response = await axios.get(
        `${API_URL}/testimonials?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      // Asegurarse de que la respuesta tenga la estructura esperada
      if (response.data && typeof response.data === 'object') {
        // Manejar estructura anidada compleja
        if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data.data)) {
          return {
            data: response.data.data.data.data,
            total: response.data.data.data.total || 0,
            page: parseInt(response.data.data.data.page) || page,
            limit: parseInt(response.data.data.data.limit) || limit,
            totalPages: response.data.data.data.totalPages || 1,
          };
        }
        // Manejar estructura anidada: success -> data -> data
        if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          return {
            data: response.data.data.data,
            total: response.data.data.total || 0,
            page: parseInt(response.data.data.page) || page,
            limit: parseInt(response.data.data.limit) || limit,
            totalPages: response.data.data.totalPages || 1,
          };
        }
        // Manejar estructura anidada: data -> data
        if (response.data.data && Array.isArray(response.data.data.data)) {
          return {
            data: response.data.data.data,
            total: response.data.data.total || 0,
            page: parseInt(response.data.data.page) || page,
            limit: parseInt(response.data.data.limit) || limit,
            totalPages: response.data.data.totalPages || 1,
          };
        }
        // Si la respuesta es un objeto pero no tiene la estructura esperada,
        // la convertimos para que cumpla con la interfaz PaginationResult
        return {
          data: Array.isArray(response.data.data) ? response.data.data : [],
          total: response.data.total || 0,
          page: response.data.page || page,
          limit: response.data.limit || limit,
          totalPages: response.data.totalPages || 1,
        };
      }
      
      // Si la respuesta es completamente inesperada, devolvemos un resultado vacío
      console.error('Respuesta de API inesperada:', response.data);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 1,
      };
    } catch (error) {
      console.error('Error al obtener los testimonios', error);
      throw new Error('Error al obtener los testimonios');
    }
  }

  async getLatestTestimonials(limit = 6): Promise<Testimonial[]> {
    try {
      const response = await axios.get(
        `${API_URL}/testimonials/latest?limit=${limit}`
      );
      
      // Verificar estructura anidada compleja
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }
      
      // Verificar estructura anidada success -> data -> data
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }
      
      // Verificar que la respuesta sea un array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si la respuesta no es un array pero tiene una propiedad data que es un array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Si no hay datos válidos, devolvemos un array vacío
      console.error('Respuesta de API inesperada en getLatestTestimonials:', response.data);
      return [];
    } catch (error) {
      console.error('Error al obtener los testimonios recientes', error);
      throw new Error('Error al obtener los testimonios recientes');
    }
  }

  async getTestimonialById(id: number): Promise<Testimonial> {
    try {
      const response = await axios.get(
        `${API_URL}/testimonials/${id}`
      );
      
      // Verificar que la respuesta sea un objeto válido
      if (response.data && typeof response.data === 'object') {
        return response.data;
      }
      
      throw new Error(`Respuesta inesperada para testimonio con ID ${id}`);
    } catch (error) {
      console.error(`Error al obtener el testimonio con ID ${id}`, error);
      throw new Error(`Error al obtener el testimonio con ID ${id}`);
    }
  }

  /**
   * Convierte un archivo de imagen a base64 para vista previa antes de enviar al servidor
   */
  async previewImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        if (onProgress) onProgress(0);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    });
  }

  async createTestimonial(testimonial: Testimonial, imageFile?: File): Promise<Testimonial> {
    try {
      // Si hay un archivo de imagen, usamos FormData para enviar los datos
      if (imageFile) {
        const formData = new FormData();
        
        // Agregar los datos del testimonio
        formData.append('name', testimonial.name);
        formData.append('rating', testimonial.rating.toString());
        formData.append('testimonial_text', testimonial.testimonial_text);
        
        // Agregar la imagen
        formData.append('image', imageFile);
        
        const response = await axios.post(
          `${API_URL}/testimonials`,
          formData,
          {
            headers: {
              ...this.getAuthHeaders().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
      } else {
        // Si no hay imagen, enviamos los datos como JSON
        const response = await axios.post(
          `${API_URL}/testimonials`,
          testimonial,
          this.getAuthHeaders()
        );
        
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
      }
      
      throw new Error('Respuesta inesperada al crear testimonio');
    } catch (error) {
      console.error('Error al crear el testimonio', error);
      throw new Error('Error al crear el testimonio');
    }
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>, imageFile?: File): Promise<Testimonial> {
    try {
      // Si hay un archivo de imagen, usamos FormData para enviar los datos
      if (imageFile) {
        const formData = new FormData();
        
        // Agregar los datos del testimonio
        if (testimonial.name) formData.append('name', testimonial.name);
        if (testimonial.rating) formData.append('rating', testimonial.rating.toString());
        if (testimonial.testimonial_text) formData.append('testimonial_text', testimonial.testimonial_text);
        
        // Agregar la imagen
        formData.append('image', imageFile);
        
        const response = await axios.patch(
          `${API_URL}/testimonials/${id}`,
          formData,
          {
            headers: {
              ...this.getAuthHeaders().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
      } else {
        // Si no hay imagen, enviamos los datos como JSON
        const response = await axios.patch(
          `${API_URL}/testimonials/${id}`,
          testimonial,
          this.getAuthHeaders()
        );
        
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
      }
      
      throw new Error(`Respuesta inesperada al actualizar testimonio con ID ${id}`);
    } catch (error) {
      console.error(`Error al actualizar el testimonio con ID ${id}`, error);
      throw new Error(`Error al actualizar el testimonio con ID ${id}`);
    }
  }

  async deleteTestimonial(id: number): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/testimonials/${id}`,
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error(`Error al eliminar el testimonio con ID ${id}`, error);
      throw new Error(`Error al eliminar el testimonio con ID ${id}`);
    }
  }
}

export default TestimonialService.getInstance(); 