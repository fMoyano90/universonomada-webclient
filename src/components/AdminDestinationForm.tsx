import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast'; // Importar toast para notificaciones
import destinationService from '../services/destination.service'; // Importar el nuevo servicio

// Define the structure for a destination based on DestinationDetailPage.tsx
interface ItineraryItem {
  day: string;
  title: string;
  details: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface DestinationData {
  title: string;
  imageSrc: string; // URL para imagen principal si ya está subida
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
  gallery: string[]; // URLs para imágenes de galería ya subidas
  price: number;
  location: string;
  isRecommended: boolean;
  isSpecial: boolean;
  type: 'nacional' | 'internacional' | 'special' | ''; // Type of destination
}

// Interfaz para los archivos
interface DestinationFormFiles {
  imageSrcFile: File | null; // Archivo de imagen principal
  galleryImageFiles: File[]; // Archivos de imágenes para la galería
}

// Interfaces para las props
interface AdminDestinationFormProps {
  destinationToEdit?: Destination | null;
  onSaveSuccess?: () => void;
}

// Interfaz para un destino completo
interface Destination {
  id?: number;
  title: string;
  slug?: string; // Agregamos slug como opcional ya que lo generaremos automáticamente
  imageSrc: string; // URL para imagen principal si ya está subida
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
  gallery: string[]; // URLs para imágenes de galería ya subidas
  price: number;
  location: string;
  isRecommended: boolean;
  isSpecial: boolean;
  type: 'nacional' | 'internacional' | 'special' | ''; // Type of destination
}

const initialDestinationData: Destination = {
  title: '',
  imageSrc: '',
  duration: '',
  activityLevel: '',
  activityType: [],
  groupSize: '',
  description: '',
  itinerary: [{ day: '', title: '', details: [''] }],
  includes: [''],
  excludes: [''],
  tips: [''],
  faqs: [{ question: '', answer: '' }],
  gallery: [],
  price: 0,
  location: '',
  isRecommended: false,
  isSpecial: false,
  type: '',
};

const initialFiles: DestinationFormFiles = {
  imageSrcFile: null,
  galleryImageFiles: [],
};

const TOTAL_STEPS = 3;

const AdminDestinationForm: React.FC<AdminDestinationFormProps> = ({ destinationToEdit, onSaveSuccess }) => {
  const [destination, setDestination] = useState<Destination>(
    destinationToEdit || initialDestinationData
  );
  const [files, setFiles] = useState<DestinationFormFiles>(initialFiles);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false); // Para prevenir envíos duplicados
  const [previewUrls, setPreviewUrls] = useState<{
    mainImage: string | null;
    galleryImages: string[];
  }>({
    mainImage: destinationToEdit?.imageSrc || null,
    galleryImages: destinationToEdit?.gallery || [],
  });

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (destinationToEdit) {
      setDestination(destinationToEdit);
      if (destinationToEdit.imageSrc) {
        setPreviewUrls(prev => ({
          ...prev,
          mainImage: destinationToEdit.imageSrc
        }));
      }
      if (destinationToEdit.gallery && destinationToEdit.gallery.length > 0) {
        setPreviewUrls(prev => ({
          ...prev,
          galleryImages: destinationToEdit.gallery
        }));
      }
    }
  }, [destinationToEdit]);

  // Navigation functions
  const nextStep = (e?: React.MouseEvent) => {
    // Prevenir que el botón envíe el formulario
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = (e?: React.MouseEvent) => {
    // Prevenir que el botón envíe el formulario
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Manejador para la imagen principal
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      const file = filesList[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo seleccionado no es una imagen válida');
        return;
      }
      
      // Generar URL de vista previa
      const objectUrl = URL.createObjectURL(file);
      
      // Actualizar estado de archivos y previsualizaciones
      setFiles(prev => ({ ...prev, imageSrcFile: file }));
      setPreviewUrls(prev => ({ ...prev, mainImage: objectUrl }));
      
      // Limpiar el campo imageSrc si había una URL
      setDestination(prev => ({ ...prev, imageSrc: '' }));
    }
  };

  // Manejador para imágenes de galería
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      // Convertir FileList a Array para poder iterarlo
      const newFiles: File[] = Array.from(filesList);
      
      // Limitar a 1 imagen temporalmente para pruebas
      const limitedFiles = newFiles.slice(0, 1);
      
      // Validar que todos sean imágenes
      const allImages = limitedFiles.every(file => file.type.startsWith('image/'));
      if (!allImages) {
        toast.error('Todos los archivos deben ser imágenes válidas');
        return;
      }
      
      // Generar URLs de vista previa
      const objectUrls = limitedFiles.map(file => URL.createObjectURL(file));
      
      // Actualizar estado de archivos y previsualizaciones
      setFiles(prev => ({ 
        ...prev, 
        galleryImageFiles: [...prev.galleryImageFiles, ...limitedFiles] 
      }));
      
      setPreviewUrls(prev => ({ 
        ...prev, 
        galleryImages: [...prev.galleryImages, ...objectUrls] 
      }));
    }
  };

  // Eliminar imagen principal
  const removeMainImage = () => {
    if (previewUrls.mainImage) {
      URL.revokeObjectURL(previewUrls.mainImage);
    }
    
    setFiles(prev => ({ ...prev, imageSrcFile: null }));
    setPreviewUrls(prev => ({ ...prev, mainImage: null }));
    setDestination(prev => ({ ...prev, imageSrc: '' }));
  };

  // Eliminar imagen de galería
  const removeGalleryImage = (index: number) => {
    if (previewUrls.galleryImages[index]) {
      URL.revokeObjectURL(previewUrls.galleryImages[index]);
    }
    
    setFiles(prev => ({
      ...prev,
      galleryImageFiles: prev.galleryImageFiles.filter((_, i) => i !== index)
    }));
    
    setPreviewUrls(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === 'activityType') {
            setDestination(prev => ({
                ...prev,
                activityType: checked 
                    ? [...prev.activityType, value] 
                    : prev.activityType.filter(type => type !== value)
            }));
        } else {
            setDestination(prev => ({ ...prev, [name]: checked }));
        }
    } else if (type === 'number') {
        setDestination(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
     else {
      setDestination(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- Handlers for dynamic lists (Itinerary, Includes, Excludes, Tips, FAQs, Gallery) ---

  // Itinerary Handlers
  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string | string[], detailIndex?: number) => {
    const updatedItinerary = [...destination.itinerary];
    if (field === 'details' && detailIndex !== undefined && Array.isArray(value)) {
      // This case is for handling changes within the details array
      // For simplicity, we'll handle the details array as a single textarea for now
      // A more complex implementation would handle individual detail items
    } else if (field === 'details' && typeof value === 'string') {
       // Handle change in the details textarea (treat as one block for now)
       updatedItinerary[index].details = value.split('\n');
    }
     else if (field !== 'details') {
      updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
    }
    setDestination(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addItineraryItem = () => {
    setDestination(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: '', title: '', details: [''] }]
    }));
  };

  const removeItineraryItem = (index: number) => {
    setDestination(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  // Generic Handlers for simple string arrays (Includes, Excludes, Tips, Gallery)
  const handleListChange = (listName: keyof DestinationData, index: number, value: string) => {
    const list = destination[listName] as string[];
    const updatedList = [...list];
    updatedList[index] = value;
    setDestination(prev => ({ ...prev, [listName]: updatedList }));
  };

  const addListItem = (listName: keyof DestinationData) => {
    const list = destination[listName] as string[];
    setDestination(prev => ({ ...prev, [listName]: [...list, ''] }));
  };

  const removeListItem = (listName: keyof DestinationData, index: number) => {
    const list = destination[listName] as string[];
    setDestination(prev => ({ ...prev, [listName]: list.filter((_, i) => i !== index) }));
  };

  // FAQ Handlers
  const handleFaqChange = (index: number, field: keyof FaqItem, value: string) => {
    const updatedFaqs = [...destination.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setDestination(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFaqItem = () => {
    setDestination(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaqItem = (index: number) => {
    setDestination(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!destination.title || !destination.type || !destination.location) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }
    
    // Validar que haya una imagen principal (ya sea archivo o URL)
    if (!files.imageSrcFile && (!destination.imageSrc || !destination.imageSrc.trim())) {
      toast.error('Debe proporcionar una imagen principal para el destino');
      return;
    }
    
    if (submitLockRef.current) return; // Prevenir envíos duplicados
    submitLockRef.current = true;

    setIsSubmitting(true);
    const loadingToast = toast.loading(destinationToEdit ? 'Actualizando destino...' : 'Guardando destino...');
    
    try {
      // Crear un FormData para enviar
      const formData = new FormData();
      
      // Datos básicos mínimos para prueba
      formData.append('title', destination.title);
      formData.append('slug', destination.title.toLowerCase().replace(/\s+/g, '-'));
      formData.append('duration', destination.duration);
      formData.append('activityLevel', destination.activityLevel);
      formData.append('description', destination.description);
      formData.append('price', destination.price.toString());
      formData.append('location', destination.location);
      
      // VALORES CORRECTOS: Asegurarnos de enviar "1" y "0" (sin posibilidad de error)
      const recomValue = destination.isRecommended ? '1' : '0';
      const specValue = destination.isSpecial ? '1' : '0';
      
      // Asignaciones claras y directas
      formData.delete('isRecommended'); // Eliminar valores previos si existieran
      formData.delete('isSpecial');
      
      formData.append('isRecommended', recomValue);
      formData.append('isSpecial', specValue);
      
      // Logs para asegurarnos
      console.log('======= VALORES BOOLEANOS FINALES =======');
      console.log('isRecommended:', destination.isRecommended, '→ Enviando:', recomValue);
      console.log('isSpecial:', destination.isSpecial, '→ Enviando:', specValue);
      console.log('=========================================');
      
      formData.append('type', destination.type);
      formData.append('groupSize', destination.groupSize || '');
      
      // Enviar activityType como array - asegurar que se envía incluso vacío
      if (destination.activityType && destination.activityType.length > 0) {
        destination.activityType.forEach((type, index) => {
          formData.append(`activityType[${index}]`, type);
        });
      } else {
        // Enviar un array vacío como fallback
        formData.append('activityType', JSON.stringify([]));
      }
      
      // Imagen principal
      if (files.imageSrcFile) {
        // 1. Adjuntar el archivo para que el interceptor lo reciba
        formData.append('imageSrc', files.imageSrcFile);
        
        // 2. Adjuntar también una URL válida AL MISMO CAMPO 'imageSrc' 
        //    para pasar la validación @IsUrl() del DTO.
        //    El interactor priorizará el archivo si existe.
        let urlParaDto = 'https://placeholder-required.com/image.jpg'; // URL temporal por defecto
        if (destination.imageSrc && destination.imageSrc.trim() !== '') {
          try {
            new URL(destination.imageSrc); // Validar si la existente es válida
            urlParaDto = destination.imageSrc.trim();
          } catch { /* Ignorar URL inválida existente, usar temporal */ }
        }
        // ¡Importante! Adjuntamos la URL al mismo campo que el archivo.
        formData.append('imageSrc', urlParaDto);

      } else if (destination.imageSrc && destination.imageSrc.trim() !== '') {
        // Si no hay archivo nuevo pero sí URL existente
        try {
          new URL(destination.imageSrc); // Validar que sea una URL válida
          formData.append('imageSrc', destination.imageSrc.trim()); // Enviamos solo la URL para el DTO
        } catch {
          toast.error('La URL de la imagen principal no es válida');
          toast.dismiss(loadingToast);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Si no hay archivo ni URL, mostramos un error
        toast.error('Debe proporcionar una imagen principal');
        toast.dismiss(loadingToast);
        setIsSubmitting(false);
        return;
      }
      
      // Imágenes de galería
      if (files.galleryImageFiles.length > 0) {
        // 1. Adjuntar solo los archivos para el interceptor
        files.galleryImageFiles.forEach((file) => {
          formData.append('galleryImages', file);
        });
        // 2. NO enviar el JSON string '[]' si estamos enviando archivos.
        //    El backend procesará los archivos y generará las URLs para el DTO.
      } 
      // Si no hay archivos nuevos pero sí URLs existentes
      else if (destination.gallery && destination.gallery.length > 0) {
        // Preparar el array de objetos con formato { imageUrl: string }
        const galleryImagesData = destination.gallery
          .map(url => { /* ... validación ... */ return url ? { imageUrl: url.trim() } : null; })
          .filter(Boolean);
          
        // Enviar solo si hay URLs válidas en formato JSON string para el DTO
        if (galleryImagesData.length > 0) {
           formData.append('galleryImages', JSON.stringify(galleryImagesData));
        }
        // Si no hay URLs válidas, no enviamos el campo galleryImages (es opcional)
      }
      // Si no hay ni archivos ni URLs existentes, no enviamos nada para galleryImages.
      
      // Manejar itinerario
      if (destination.itinerary && destination.itinerary.length > 0) {
        destination.itinerary.forEach((item, itemIndex) => {
          if (item.day.trim() !== '' && item.title.trim() !== '') {
            formData.append(`itineraryItems[${itemIndex}][day]`, item.day);
            formData.append(`itineraryItems[${itemIndex}][title]`, item.title);
            
            // Detalles del itinerario
            item.details.forEach((detail, detailIndex) => {
              if (detail.trim() !== '') {
                formData.append(`itineraryItems[${itemIndex}][details][${detailIndex}][detail]`, detail);
              }
            });
          }
        });
      }
      
      // Manejar includes
      if (destination.includes && destination.includes.length > 0) {
        destination.includes.forEach((item, index) => {
          if (item.trim() !== '') {
            formData.append(`includes[${index}][item]`, item);
          }
        });
      }
      
      // Manejar excludes
      if (destination.excludes && destination.excludes.length > 0) {
        destination.excludes.forEach((item, index) => {
          if (item.trim() !== '') {
            formData.append(`excludes[${index}][item]`, item);
          }
        });
      }
      
      // Manejar tips
      if (destination.tips && destination.tips.length > 0) {
        destination.tips.forEach((item, index) => {
          if (item.trim() !== '') {
            formData.append(`tips[${index}][tip]`, item);
          }
        });
      }
      
      // Manejar FAQs
      if (destination.faqs && destination.faqs.length > 0) {
        destination.faqs.forEach((faq, index) => {
          if (faq.question.trim() !== '' && faq.answer.trim() !== '') {
            formData.append(`faqs[${index}][question]`, faq.question);
            formData.append(`faqs[${index}][answer]`, faq.answer);
          }
        });
      }
      
      // Imprimir el contenido de FormData para depuración
      console.log('==== Enviando FormData con los siguientes campos: ====');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${(pair[1] as File).name} (${(pair[1] as File).size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      console.log('============================================');
      
      console.log('SOLUCIÓN RADICAL - CAMPOS SEPARADOS:');
      console.log('isRecommended (valor JS):', destination.isRecommended);
      console.log('isSpecial (valor JS):', destination.isSpecial);
      
      // Usar el servicio de destinos en lugar de la llamada directa a Axios
      let response;
      
      if (destinationToEdit?.id) {
        // Actualizar destino existente
        response = await destinationService.updateDestination(destinationToEdit.id, formData);
      } else {
        // Crear nuevo destino
        response = await destinationService.createDestination(formData);
      }
      
      console.log('Respuesta del servidor:', response);
      
      toast.success(
        destinationToEdit ? 'Destino actualizado correctamente' : 'Destino creado correctamente', 
        { id: loadingToast }
      );
      
      // Opción: Limpiar el formulario
      if (!destinationToEdit) {
        setDestination(initialDestinationData);
        setFiles(initialFiles);
        setPreviewUrls({ mainImage: null, galleryImages: [] });
        setCurrentStep(1);
      }
      
      // Si hay una función de éxito proporcionada, llamarla
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
    } catch (error: unknown) {
      console.error('Error al procesar destino:', error);
      
      // Asegurarnos de que se cancele el toast pendiente
      toast.dismiss(loadingToast);
      
      // Mostrar el mensaje de error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(errorMessage, { duration: 5000 });
      
    } finally {
      // Garantizar que estos se ejecuten siempre
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // --- Helper function for input fields ---
  const renderInput = (label: string, name: keyof DestinationData, type = 'text', required = false, options?: string[]) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={destination[name] as string}
          onChange={handleInputChange}
          required={required}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
        />
      ) : type === 'select' && options ? (
         <select
            id={name}
            name={name}
            value={destination[name] as string}
            onChange={handleInputChange}
            required={required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2"
          >
            <option value="">Selecciona...</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
      ) : type === 'checkbox-group' && options ? (
        <div className="mt-1 space-y-2">
            {options.map(option => (
                <div key={option} className="flex items-center">
                    <input
                        id={`${name}-${option}`}
                        name={name}
                        type="checkbox"
                        value={option}
                        checked={(destination[name] as string[]).includes(option)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                    />
                    <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-gray-900">
                        {option}
                    </label>
                </div>
            ))}
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={destination[name] as string | number}
          onChange={handleInputChange}
          required={required}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2"
        />
      )}
    </div>
  );

  // --- Helper function for dynamic list sections ---
  interface FieldConfig {
    name: keyof ItineraryItem | keyof FaqItem | 'item'; // 'item' for simple string lists
    label: string;
    type?: 'text' | 'textarea';
  }

  // Generic function for rendering dynamic lists (Itinerary, Includes, Excludes, Tips, FAQs, Gallery)
  const renderDynamicList = <T extends string | ItineraryItem | FaqItem>(
    listName: keyof DestinationData,
    label: string,
    itemLabelSingular: string,
    fields: FieldConfig[],
    addFn: () => void,
    removeFn: (index: number) => void,
    // Change function signature needs to handle both simple strings and complex objects
    // Use a more specific type for the field parameter based on T
    changeFn: (index: number, field: T extends string ? 'item' : keyof T, value: string) => void
  ) => (
    <div className="mb-6 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{label}</h3>
      {(destination[listName] as T[]).map((item, index) => (
        <div key={`${listName}-${index}`} className="mb-4 p-3 border border-gray-100 rounded relative bg-gray-50">
          <button
            type="button"
            onClick={() => removeFn(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
          >
            Eliminar {itemLabelSingular}
          </button>
          <h4 className="text-md font-medium mb-2 text-gray-600">{itemLabelSingular} {index + 1}</h4>
          {fields.map(fieldConfig => {
            // Determine the value based on whether it's a simple string list or an object list
            const value = typeof item === 'string'
              ? item // For simple string lists like includes, excludes, tips, gallery
              : (item as ItineraryItem | FaqItem)[fieldConfig.name as keyof (ItineraryItem | FaqItem)];

            // Determine the correct field name for the change handler ('item' for simple lists)
            // Cast the field name appropriately based on whether T is a string or an object
            const changeFieldName = (typeof item === 'string' ? 'item' : fieldConfig.name) as T extends string ? 'item' : keyof T;

            return (
              <div key={fieldConfig.name as string} className="mb-2">
                <label htmlFor={`${listName}-${index}-${fieldConfig.name}`} className="block text-sm font-medium text-gray-600 mb-1">{fieldConfig.label}</label>
                {fieldConfig.type === 'textarea' ? (
                  <textarea
                    id={`${listName}-${index}-${fieldConfig.name}`}
                    value={value as string} // Value is always string here after check
                    onChange={(e) => changeFn(index, changeFieldName, e.target.value)} // Use determined field name with correct type
                    // Adjust rows based on field name, check if item is complex object first
                    rows={(typeof item === 'object' && item !== null && (fieldConfig.name === 'details' || fieldConfig.name === 'answer')) ? 5 : 3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    id={`${listName}-${index}-${fieldConfig.name}`}
                    value={value as string} // Value is always string here after check
                    onChange={(e) => changeFn(index, changeFieldName, e.target.value)} // Use determined field name with correct type
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        type="button"
        onClick={addFn}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        + Añadir {itemLabelSingular}
      </button>
    </div>
  );

  // --- Render Step Content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Paso 1: Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('Título del Destino', 'title', 'text', true)}
              {renderInput('Ubicación (Ej: Patagonia, Chile)', 'location', 'text', true)}
              
              {/* Nuevo componente para subir la imagen principal */}
              <div className="col-span-1 md:col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
                
                {/* Mostrar preview si hay imagen */}
                {(previewUrls.mainImage || destination.imageSrc) && (
                  <div className="relative mb-2 inline-block">
                    <img 
                      src={previewUrls.mainImage || destination.imageSrc} 
                      alt="Vista previa"
                      className="h-40 w-auto object-cover rounded-md" 
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    <span>Subir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  O, alternativamente, proporciona una URL:
                </p>
                <input
                  type="text"
                  name="imageSrc"
                  value={destination.imageSrc}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2"
                />
              </div>
              
              {renderInput('Duración (Ej: 5 días y 4 noches)', 'duration', 'text', true)}
              {renderInput('Nivel de Actividad', 'activityLevel', 'select', true, ['Baja', 'Moderada', 'Alta', 'Exigente'])}
              {renderInput('Tamaño del Grupo (Ej: 12 personas)', 'groupSize', 'text')}
              {renderInput('Precio Base (CLP)', 'price', 'number', true)}
              {renderInput('Tipo de Destino', 'type', 'select', true, ['nacional', 'internacional', 'special'])}
            </div>
            {renderInput('Tipo de Actividad', 'activityType', 'checkbox-group', false, ['Naturaleza', 'Cultura', 'Aventura', 'Gastronomía', 'Relajo', 'Urbano'])}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Paso 2: Detalles y Contenido</h3>
            {renderInput('Descripción Detallada', 'description', 'textarea', true)}
            {renderDynamicList<ItineraryItem>(
              'itinerary', 'Itinerario', 'Día',
              [{ name: 'day', label: 'Día (Ej: Día 1)' }, { name: 'title', label: 'Título del Día' }, { name: 'details', label: 'Detalles (uno por línea)', type: 'textarea' }],
              addItineraryItem, removeItineraryItem, (index, field, value) => handleItineraryChange(index, field as keyof ItineraryItem, value)
            )}
            {renderDynamicList<string>(
              'includes', 'Incluye', 'Ítem', [{ name: 'item', label: 'Descripción' }],
              () => addListItem('includes'), (index) => removeListItem('includes', index), (index, _field, value) => handleListChange('includes', index, value)
            )}
            {renderDynamicList<string>(
              'excludes', 'No Incluye', 'Ítem', [{ name: 'item', label: 'Descripción' }],
              () => addListItem('excludes'), (index) => removeListItem('excludes', index), (index, _field, value) => handleListChange('excludes', index, value)
            )}
            {renderDynamicList<string>(
              'tips', 'Tips de Viaje', 'Tip', [{ name: 'item', label: 'Descripción' }],
              () => addListItem('tips'), (index) => removeListItem('tips', index), (index, _field, value) => handleListChange('tips', index, value)
            )}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Paso 3: Avanzado y Metadatos</h3>
            {renderDynamicList<FaqItem>(
              'faqs', 'Preguntas Frecuentes (FAQ)', 'Pregunta',
              [{ name: 'question', label: 'Pregunta' }, { name: 'answer', label: 'Respuesta', type: 'textarea' }],
              addFaqItem, removeFaqItem, (index, field, value) => handleFaqChange(index, field as keyof FaqItem, value)
            )}
            
            {/* Componente de galería con carga de imágenes */}
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Galería de Imágenes</h3>
              
              {/* Previsualizaciones de imágenes */}
              {previewUrls.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {previewUrls.galleryImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Imagen ${index+1}`} 
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Eliminar imagen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Input de carga de archivos */}
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span>Subir imágenes</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="sr-only"
                  />
                </label>
                <span className="ml-2 text-xs text-gray-500">
                  Puedes seleccionar múltiples imágenes
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-center">
                  <input id="isRecommended" name="isRecommended" type="checkbox" checked={destination.isRecommended} onChange={handleInputChange} className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded" />
                  <label htmlFor="isRecommended" className="ml-2 block text-sm font-medium text-gray-700">Marcar como Recomendado</label>
              </div>
              <div className="flex items-center">
                  <input id="isSpecial" name="isSpecial" type="checkbox" checked={destination.isSpecial} onChange={handleInputChange} className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded" />
                  <label htmlFor="isSpecial" className="ml-2 block text-sm font-medium text-gray-700">Marcar como Especial (Destacado)</label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // --- Modern Step Indicator ---
  const renderStepIndicator = () => (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-center space-x-4">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <li key={step} className="relative flex-1">
            {step < currentStep ? (
              // Completed step
              <div className="group flex w-full flex-col border-l-4 border-primary-blue py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary-blue transition-colors ">Paso {step}</span>
                {/* <span className="text-sm font-medium">Description</span> */}
              </div>
            ) : step === currentStep ? (
              // Current step
              <div className="flex w-full flex-col border-l-4 border-primary-blue py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                <span className="text-sm font-medium text-primary-blue">Paso {step}</span>
                {/* <span className="text-sm font-medium">Description</span> */}
              </div>
            ) : (
              // Upcoming step
              <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 transition-colors">Paso {step}</span>
                {/* <span className="text-sm font-medium">Description</span> */}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  // Navegación entre pasos
  const renderStepNavigation = () => (
    <div className="flex justify-between mt-4">
      {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Anterior
            </button>
      )}
      
      <div className="flex space-x-2 ml-auto">
        {/* Botón para rellenar formulario automáticamente */}
        <button
          type="button"
          onClick={fillFormWithDummyData}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Rellenar Automáticamente
        </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
              >
            {destinationToEdit ? 'Actualizar Destino' : 'Crear Destino'}
              </button>
            )}
          </div>
        </div>
  );

  // Función para rellenar el formulario con datos de prueba
  const fillFormWithDummyData = () => {
    // Generar nombre único para evitar duplicados
    const timestamp = new Date().getTime().toString().slice(-4);
    
    // Crear un destino de prueba con todos los campos necesarios
    const dummyDestination: Destination = {
      title: `Destino de Prueba ${timestamp}`,
      imageSrc: 'https://via.placeholder.com/800x600',
      duration: '7 días',
      activityLevel: 'Moderado',
      activityType: ['Senderismo', 'Cultural'],
      groupSize: '4-12 personas',
      description: 'Esta es una descripción de prueba para el destino. Incluye detalles sobre actividades y atracciones.',
      price: 1200,
      location: 'Barcelona, España',
      isRecommended: true,  // Aseguramos valores correctos
      isSpecial: false,     // Aseguramos valores correctos
      type: 'nacional',
      // Arrays para listas
      includes: ['Alojamiento', 'Desayuno', 'Guía local'],
      excludes: ['Vuelos internacionales', 'Propinas', 'Seguro de viaje'],
      tips: ['Lleva ropa cómoda', 'No olvides protector solar'],
      // Itinerario
      itinerary: [
        {
          day: 'Día 1',
          title: 'Llegada a Barcelona',
          details: ['Recepción en el aeropuerto', 'Traslado al hotel', 'Tiempo libre']
        },
        {
          day: 'Día 2',
          title: 'Tour por la ciudad',
          details: ['Visita a la Sagrada Familia', 'Almuerzo en restaurante local', 'Paseo por Las Ramblas']
        }
      ],
      // FAQs
      faqs: [
        {
          question: '¿Necesito visa para este viaje?',
          answer: 'Depende de tu nacionalidad. Consulta los requisitos específicos para tu país.'
        },
        {
          question: '¿Cuál es la mejor época para visitar?',
          answer: 'La primavera (abril-junio) y el otoño (septiembre-octubre) ofrecen el clima más agradable.'
        }
      ],
      gallery: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300']
    };
    
    // Actualizar el estado con los datos de prueba
    setDestination(dummyDestination);
    
    // También actualizar las previsualizaciones
    setPreviewUrls({
      mainImage: dummyDestination.imageSrc,
      galleryImages: dummyDestination.gallery
    });
    
    // Mostrar confirmación con el estado de los booleanos para verificar
    toast.success(`Formulario rellenado con datos de prueba (isRecommended: ${dummyDestination.isRecommended ? 'SÍ' : 'NO'}, isSpecial: ${dummyDestination.isSpecial ? 'SÍ' : 'NO'})`);
    
    console.log('DATOS DE PRUEBA CARGADOS:');
    console.log('- isRecommended:', dummyDestination.isRecommended);
    console.log('- isSpecial:', dummyDestination.isSpecial);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg relative">
      {renderStepIndicator()}

      <form onSubmit={(e) => {
        // Solo permitir enviar el formulario cuando estamos en el último paso
        if (currentStep !== TOTAL_STEPS) {
          e.preventDefault();
          return;
        }
        
        // Prevenir múltiples envíos
        if (submitLockRef.current || isSubmitting) {
          e.preventDefault();
          return;
        }
        
        handleSubmit(e);
      }} className="space-y-6"> {/* Reduced space-y */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {renderStepNavigation()}
      </form>
    </div>
  );
};

export default AdminDestinationForm;
