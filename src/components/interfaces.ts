// Interfaces compartidas para el sistema de destinos

export interface ItineraryItem {
  day: string;
  title: string;
  details: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BackendDetail {
  detail: string;
}

export interface BackendItineraryItem {
  day: string;
  title: string;
  details: BackendDetail[];
}

export interface BackendGalleryImage {
  imageUrl: string;
}

export interface BackendData {
  itineraryItems?: BackendItineraryItem[];
  includes?: Array<{ item: string }> | string[];
  excludes?: Array<{ item: string }> | string[];
  tips?: Array<{ tip: string }> | string[];
  faqs?: FaqItem[];
  galleryImages?: BackendGalleryImage[] | string[];
  [key: string]: unknown;
}

export interface Destination {
  id?: number;
  title: string;
  slug?: string;
  imageSrc: string;
  duration: string;
  activityLevel: string;
  activityType: string[];
  groupSize: string;
  description: string;
  itinerary: ItineraryItem[];
  includes: string[];
  excludes: string[];
  tips: string[];
  faqs: FaqItem[];
  gallery: string[];
  price: number | string;
  location: string;
  isRecommended: boolean;
  isSpecial: boolean;
  type: 'nacional' | 'internacional' | 'special' | '';
  createdAt?: string;
  updatedAt?: string;
  // Propiedades que pueden venir del backend
  data?: BackendData;
  itineraryItems?: BackendItineraryItem[];
  galleryImages?: BackendGalleryImage[];
}

// Interfaz para los testimonios
export interface Testimonial {
  id?: number;
  name: string;
  rating: number;
  testimonial_text: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Interfaz para la paginación
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 