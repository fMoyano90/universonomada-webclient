import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast"; // Importar toast para notificaciones
import destinationService from "../services/destination.service"; // Importar el nuevo servicio
import { Destination, ItineraryItem, FaqItem, BackendItineraryItem, BackendDetail } from "./interfaces"; // Importar interfaces compartidas

// Define the structure for a destination based on DestinationDetailPage.tsx
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
  price: number | string;
  location: string;
  isRecommended: boolean;
  isSpecial: boolean;
  type: "nacional" | "internacional" | "special" | ""; // Type of destination
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

const initialDestinationData: Destination = {
  title: "",
  imageSrc: "",
  duration: "",
  activityLevel: "",
  activityType: [],
  groupSize: "",
  description: "",
  itinerary: [{ day: "", title: "", details: [""] }],
  includes: [""],
  excludes: [""],
  tips: [""],
  faqs: [{ question: "", answer: "" }],
  gallery: [],
  price: 0,
  location: "",
  isRecommended: false,
  isSpecial: false,
  type: "",
};

const initialFiles: DestinationFormFiles = {
  imageSrcFile: null,
  galleryImageFiles: [],
};

const TOTAL_STEPS = 3;

const AdminDestinationForm: React.FC<AdminDestinationFormProps> = ({
  destinationToEdit,
  onSaveSuccess,
}) => {
  const [destination, setDestination] = useState<Destination>(
    destinationToEdit || initialDestinationData
  );
  const [originalDestination, setOriginalDestination] = useState<Destination | null>(null); // Para comparar cambios
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
      console.log("Datos originales recibidos:", destinationToEdit);
      
      // Extraer datos del objeto dependiendo de la estructura
      // Usamos 'as any' solo en esta parte para poder acceder a propiedades dinámicas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sourceData = { ...destinationToEdit } as any;
      
      // Crear una copia con los datos por defecto para asegurar que tenga todos los campos
      const transformedDestination: Destination = {
        ...initialDestinationData, // Datos por defecto para evitar undefined
        ...destinationToEdit // Datos recibidos de la API
      };
      
      // Asegurar que tenga el ID original
      if (destinationToEdit.id && !transformedDestination.id) {
        transformedDestination.id = destinationToEdit.id;
      }

      // 1. Manejar itinerario (puede estar en itineraryItems o dentro de un objeto anidado)
      // Primero, asegurar que itinerary sea un array
      if (!transformedDestination.itinerary) {
        transformedDestination.itinerary = [];
      }

      // Si está vacío pero tenemos itineraryItems, usarlos
      if (
        transformedDestination.itinerary.length === 0 &&
        sourceData.itineraryItems &&
        Array.isArray(sourceData.itineraryItems)
      ) {
        transformedDestination.itinerary = sourceData.itineraryItems.map(
          (item: BackendItineraryItem) => ({
            day: item.day || "",
            title: item.title || "",
            details: Array.isArray(item.details)
              ? item.details.map((d: BackendDetail) => d.detail || "")
              : [""],
          })
        );
      }

      // Si sigue vacío, inicializar con un elemento vacío
      if (transformedDestination.itinerary.length === 0) {
        transformedDestination.itinerary = [
          { day: "", title: "", details: [""] },
        ];
      }

      // 2. Manejar includes - procesar estructura específica del backend
      if (Array.isArray(sourceData.includes)) {
        // Si los includes vienen como objetos con propiedad 'item', extraer solo los valores
        if (sourceData.includes.length > 0 && typeof sourceData.includes[0] === 'object' && 'item' in sourceData.includes[0]) {
          console.log("Includes originales del backend:", sourceData.includes);
          transformedDestination.includes = sourceData.includes.map((item: unknown) => 
            typeof item === 'object' && item !== null && 'item' in item 
              ? (item as {item: string}).item.toString() 
              : ''
          ).filter((include: string) => include.trim() !== '');
          console.log("Includes procesados:", transformedDestination.includes);
        }
        // Si ya es un array de strings, no necesitamos hacer nada más
      }

      // Si después del procesamiento includes sigue vacío, inicializar con valor por defecto
      if (!transformedDestination.includes || !Array.isArray(transformedDestination.includes) || transformedDestination.includes.length === 0) {
        transformedDestination.includes = [""];
      }

      // 3. Manejar excludes - procesar estructura específica del backend
      if (Array.isArray(sourceData.excludes)) {
        // Si los excludes vienen como objetos con propiedad 'item', extraer solo los valores
        if (sourceData.excludes.length > 0 && typeof sourceData.excludes[0] === 'object' && 'item' in sourceData.excludes[0]) {
          console.log("Excludes originales del backend:", sourceData.excludes);
          transformedDestination.excludes = sourceData.excludes.map((item: unknown) => 
            typeof item === 'object' && item !== null && 'item' in item 
              ? (item as {item: string}).item.toString() 
              : ''
          ).filter((exclude: string) => exclude.trim() !== '');
          console.log("Excludes procesados:", transformedDestination.excludes);
        }
        // Si ya es un array de strings, no necesitamos hacer nada más
      }

      // Si después del procesamiento excludes sigue vacío, inicializar con valor por defecto
      if (!transformedDestination.excludes || !Array.isArray(transformedDestination.excludes) || transformedDestination.excludes.length === 0) {
        transformedDestination.excludes = [""];
      }

      // 4. Asegurar que tips sea un array de strings
      if (!Array.isArray(transformedDestination.tips)) {
        transformedDestination.tips = [""];
      }

      // 5. Manejar faqs
      if (!Array.isArray(transformedDestination.faqs)) {
        transformedDestination.faqs = [{ question: "", answer: "" }];
      }

      // 6. Manejar gallery - procesar objetos galleryImages del backend
      if (Array.isArray(sourceData.galleryImages)) {
        console.log("Imágenes de galería originales:", sourceData.galleryImages);
        
        // Si las imágenes vienen como objetos con propiedad 'imageUrl', extraer solo las URLs
        if (sourceData.galleryImages.length > 0 && 
            typeof sourceData.galleryImages[0] === 'object' && 
            sourceData.galleryImages[0] !== null) {
          
          transformedDestination.gallery = sourceData.galleryImages.map((item: unknown) => {
            if (typeof item === 'object' && item !== null) {
              // Intentar extraer imageUrl si existe
              if ('imageUrl' in item) {
                return (item as {imageUrl: string}).imageUrl;
              }
              // Alternativamente, buscar cualquier propiedad que parezca una URL
              for (const [, value] of Object.entries(item)) {
                if (typeof value === 'string' && 
                    (value.startsWith('http://') || value.startsWith('https://'))) {
                  return value;
                }
              }
            }
            return '';
          }).filter((url: string) => url.trim() !== '');
          
          console.log("Galería procesada:", transformedDestination.gallery);
        }
      }

      // Si después del procesamiento la galería sigue vacía, inicializar como array vacío
      if (!transformedDestination.gallery || !Array.isArray(transformedDestination.gallery)) {
        transformedDestination.gallery = [];
      }

      // 7. Asegurar que activityType sea un array
      if (!Array.isArray(transformedDestination.activityType)) {
        transformedDestination.activityType = [];
      }

      // 8. Asegurar campos booleanos
      transformedDestination.isRecommended =
        !!transformedDestination.isRecommended;
      transformedDestination.isSpecial = !!transformedDestination.isSpecial;

      // 4. Manejar tips - procesar estructura específica del backend
      if (Array.isArray(sourceData.tips)) {
        // Si los tips vienen como objetos con propiedad 'tip', extraer solo los valores de tip
        if (sourceData.tips.length > 0 && typeof sourceData.tips[0] === 'object' && 'tip' in sourceData.tips[0]) {
          console.log("Tips originales del backend:", sourceData.tips);
          transformedDestination.tips = sourceData.tips.map((item: unknown) => 
            typeof item === 'object' && item !== null && 'tip' in item 
              ? (item as {tip: string}).tip.toString() 
              : ''
          ).filter((tip: string) => tip.trim() !== '');
          console.log("Tips procesados:", transformedDestination.tips);
        }
      }

      // Si después del procesamiento tips sigue vacío, inicializar con valor por defecto
      if (!transformedDestination.tips || !Array.isArray(transformedDestination.tips) || transformedDestination.tips.length === 0) {
        transformedDestination.tips = [""];
      }

      console.log(
        "Datos transformados para el formulario:",
        transformedDestination
      );

      // Actualizar el estado con los datos transformados
      setDestination(transformedDestination);
      
      // Guardar una copia de los datos originales para comparar cambios
      setOriginalDestination(JSON.parse(JSON.stringify(transformedDestination)));

      // Actualizar previewUrls
      if (transformedDestination.imageSrc) {
        setPreviewUrls((prev) => ({
          ...prev,
          mainImage: transformedDestination.imageSrc,
        }));
      }

      if (
        transformedDestination.gallery &&
        transformedDestination.gallery.length > 0
      ) {
        setPreviewUrls((prev) => ({
          ...prev,
          galleryImages: transformedDestination.gallery,
        }));
      }
    }
  }, [destinationToEdit]);

  // Navigation functions
  const nextStep = (e?: React.MouseEvent) => {
    // Prevenir que el botón envíe el formulario
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = (e?: React.MouseEvent) => {
    // Prevenir que el botón envíe el formulario
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Manejador para la imagen principal
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      const file = filesList[0];

      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toast.error("El archivo seleccionado no es una imagen válida");
        return;
      }

      // Generar URL de vista previa
      const objectUrl = URL.createObjectURL(file);

      // Actualizar estado de archivos y previsualizaciones
      setFiles((prev) => ({ ...prev, imageSrcFile: file }));
      setPreviewUrls((prev) => ({ ...prev, mainImage: objectUrl }));

      // Limpiar el campo imageSrc si había una URL
      setDestination((prev) => ({ ...prev, imageSrc: "" }));
    }
  };

  // Manejador para imágenes de galería
  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      // Convertir FileList a Array para poder iterarlo
      const newFiles: File[] = Array.from(filesList);

      // Limitar a 1 imagen temporalmente para pruebas
      const limitedFiles = newFiles.slice(0, 1);

      // Validar que todos sean imágenes
      const allImages = limitedFiles.every((file) =>
        file.type.startsWith("image/")
      );
      if (!allImages) {
        toast.error("Todos los archivos deben ser imágenes válidas");
        return;
      }

      // Generar URLs de vista previa
      const objectUrls = limitedFiles.map((file) => URL.createObjectURL(file));

      // Actualizar estado de archivos y previsualizaciones
      setFiles((prev) => ({
        ...prev,
        galleryImageFiles: [...prev.galleryImageFiles, ...limitedFiles],
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...objectUrls],
      }));
    }
  };

  // Eliminar imagen principal
  const removeMainImage = () => {
    if (previewUrls.mainImage) {
      URL.revokeObjectURL(previewUrls.mainImage);
    }

    setFiles((prev) => ({ ...prev, imageSrcFile: null }));
    setPreviewUrls((prev) => ({ ...prev, mainImage: null }));
    setDestination((prev) => ({ ...prev, imageSrc: "" }));
  };

  // Eliminar imagen de galería - NUEVA LÓGICA MEJORADA
  const removeGalleryImage = (index: number) => {
    // Revocar URL de objeto si existe
    if (previewUrls.galleryImages[index]) {
      URL.revokeObjectURL(previewUrls.galleryImages[index]);
    }

    // Determinar si la imagen a eliminar es un archivo nuevo o una URL existente
    const totalExistingImages = destination.gallery?.length || 0;
    
    if (index < totalExistingImages) {
      // Es una imagen existente del backend - eliminarla de destination.gallery
      setDestination((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }));
    } else {
      // Es un archivo nuevo - eliminarla de galleryImageFiles
      const fileIndex = index - totalExistingImages;
      setFiles((prev) => ({
        ...prev,
        galleryImageFiles: prev.galleryImageFiles.filter((_, i) => i !== fileIndex),
      }));
    }

    // Siempre actualizar las URLs de preview
    setPreviewUrls((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      if (name === "activityType") {
        setDestination((prev) => ({
          ...prev,
          activityType: checked
            ? [...prev.activityType, value]
            : prev.activityType.filter((type) => type !== value),
        }));
      } else {
        setDestination((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (type === "number") {
      setDestination((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setDestination((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Handlers for dynamic lists (Itinerary, Includes, Excludes, Tips, FAQs, Gallery) ---

  // Itinerary Handlers
  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryItem,
    value: string | string[],
    detailIndex?: number
  ) => {
    // Asegurarse de que el itinerario exista y tenga elementos
    if (!destination.itinerary || !Array.isArray(destination.itinerary)) {
      // Si no existe o no es un array, crear uno nuevo con un elemento vacío
      setDestination((prev) => ({
        ...prev,
        itinerary: [{ day: "", title: "", details: [""] }],
      }));
      return;
    }

    const updatedItinerary = [...destination.itinerary];

    // Asegurar que el índice existe en el array
    if (index >= updatedItinerary.length) {
      // Si no existe el índice, añadir elementos vacíos hasta llegar al índice necesario
      while (updatedItinerary.length <= index) {
        updatedItinerary.push({ day: "", title: "", details: [""] });
      }
    }

    if (
      field === "details" &&
      detailIndex !== undefined &&
      Array.isArray(value)
    ) {
      // This case is for handling changes within the details array
      // For simplicity, we'll handle the details array as a single textarea for now
      // A more complex implementation would handle individual detail items
    } else if (field === "details" && typeof value === "string") {
      // Handle change in the details textarea (treat as one block for now)
      updatedItinerary[index].details = value
        .split("\n")
        .filter((line) => line.trim() !== "");
      // Si no hay detalles después de filtrar, asegurar que haya al menos un string vacío
      if (updatedItinerary[index].details.length === 0) {
        updatedItinerary[index].details = [""];
      }
    } else if (field !== "details") {
      updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
    }

    setDestination((prev) => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addItineraryItem = () => {
    setDestination((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: "", title: "", details: [""] }],
    }));
  };

  const removeItineraryItem = (index: number) => {
    setDestination((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  // Generic Handlers for simple string arrays (Includes, Excludes, Tips, Gallery)
  const handleListChange = (
    listName: keyof DestinationData,
    index: number,
    value: string
  ) => {
    // Asegurarse de que la lista exista y sea un array
    if (!destination[listName] || !Array.isArray(destination[listName])) {
      // Si no existe o no es un array, crear uno nuevo con un string vacío
      setDestination((prev) => ({ ...prev, [listName]: [""] }));
      return;
    }

    const list = destination[listName] as string[];
    const updatedList = [...list];

    // Asegurar que el índice existe en el array
    if (index >= updatedList.length) {
      // Si no existe el índice, añadir strings vacíos hasta llegar al índice necesario
      while (updatedList.length <= index) {
        updatedList.push("");
      }
    }

    updatedList[index] = value;
    setDestination((prev) => ({ ...prev, [listName]: updatedList }));
  };

  const addListItem = (listName: keyof DestinationData) => {
    const list = destination[listName] as string[];
    setDestination((prev) => ({ ...prev, [listName]: [...list, ""] }));
  };

  const removeListItem = (listName: keyof DestinationData, index: number) => {
    const list = destination[listName] as string[];
    setDestination((prev) => ({
      ...prev,
      [listName]: list.filter((_, i) => i !== index),
    }));
  };

  // FAQ Handlers
  const handleFaqChange = (
    index: number,
    field: keyof FaqItem,
    value: string
  ) => {
    // Asegurarse de que la lista de FAQs exista y sea un array
    if (!destination.faqs || !Array.isArray(destination.faqs)) {
      // Si no existe o no es un array, crear uno nuevo con un elemento vacío
      setDestination((prev) => ({
        ...prev,
        faqs: [{ question: "", answer: "" }],
      }));
      return;
    }

    const updatedFaqs = [...destination.faqs];

    // Asegurar que el índice existe en el array
    if (index >= updatedFaqs.length) {
      // Si no existe el índice, añadir elementos vacíos hasta llegar al índice necesario
      while (updatedFaqs.length <= index) {
        updatedFaqs.push({ question: "", answer: "" });
      }
    }

    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setDestination((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFaqItem = () => {
    setDestination((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaqItem = (index: number) => {
    setDestination((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Función para comparar si dos arrays son iguales
  const arraysEqual = (a: unknown[], b: unknown[]): boolean => {
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Función para determinar qué campos han cambiado
  const getChangedFields = () => {
    if (!originalDestination || !destinationToEdit) {
      // Si es creación nueva, enviar todos los campos
      return {
        basicFields: destination,
        hasItineraryChanged: true,
        hasIncludesChanged: true,
        hasExcludesChanged: true,
        hasTipsChanged: true,
        hasFaqsChanged: true,
        hasGalleryChanged: true,
      };
    }

    const changes = {
      basicFields: {} as Partial<Destination>,
      hasItineraryChanged: false,
      hasIncludesChanged: false,
      hasExcludesChanged: false,
      hasTipsChanged: false,
      hasFaqsChanged: false,
      hasGalleryChanged: false,
    };

    // Comparar campos básicos
    const basicFieldsToCheck = [
      'title', 'duration', 'activityLevel', 'description', 'price', 
      'location', 'isRecommended', 'isSpecial', 'type', 'groupSize'
    ] as const;

    basicFieldsToCheck.forEach(field => {
      if (destination[field] !== originalDestination[field]) {
        (changes.basicFields as Record<string, unknown>)[field] = destination[field];
      }
    });

    // Comparar activityType (array)
    if (!arraysEqual(destination.activityType, originalDestination.activityType)) {
      changes.basicFields.activityType = destination.activityType;
    }

    // Comparar relaciones
    changes.hasItineraryChanged = !arraysEqual(destination.itinerary, originalDestination.itinerary);
    changes.hasIncludesChanged = !arraysEqual(destination.includes, originalDestination.includes);
    changes.hasExcludesChanged = !arraysEqual(destination.excludes, originalDestination.excludes);
    changes.hasTipsChanged = !arraysEqual(destination.tips, originalDestination.tips);
    changes.hasFaqsChanged = !arraysEqual(destination.faqs, originalDestination.faqs);
    changes.hasGalleryChanged = !arraysEqual(destination.gallery, originalDestination.gallery);

    return changes;
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!destination.title || !destination.type || !destination.location) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }

    // Validar que haya una imagen principal (ya sea archivo o URL)
    if (
      !files.imageSrcFile &&
      (!destination.imageSrc || !destination.imageSrc.trim())
    ) {
      toast.error("Debe proporcionar una imagen principal para el destino");
      return;
    }

    if (submitLockRef.current) return; // Prevenir envíos duplicados
    submitLockRef.current = true;

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      destinationToEdit ? "Actualizando destino..." : "Guardando destino..."
    );

    try {
      // Determinar qué campos han cambiado
      const changedFields = getChangedFields();
      
      console.log("=== ANÁLISIS DE CAMBIOS ===");
      console.log("Campos básicos cambiados:", changedFields.basicFields);
      console.log("¿Itinerario cambió?", changedFields.hasItineraryChanged);
      console.log("¿Includes cambió?", changedFields.hasIncludesChanged);
      console.log("¿Excludes cambió?", changedFields.hasExcludesChanged);
      console.log("¿Tips cambió?", changedFields.hasTipsChanged);
      console.log("¿FAQs cambió?", changedFields.hasFaqsChanged);
      console.log("¿Galería cambió?", changedFields.hasGalleryChanged);
      console.log("========================");

      // Crear un FormData para enviar
      const formData = new FormData();

      // Solo enviar campos básicos que han cambiado
      Object.entries(changedFields.basicFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'isRecommended' || key === 'isSpecial') {
            // Manejar booleanos correctamente
            const boolValue = value ? "1" : "0";
            formData.append(key, boolValue);
            console.log(`${key}: ${value} → Enviando: ${boolValue}`);
          } else if (key === 'activityType' && Array.isArray(value)) {
            // Manejar activityType como array
            if (value.length > 0) {
              value.forEach((type, index) => {
                formData.append(`activityType[${index}]`, String(type));
              });
            } else {
              formData.append("activityType", JSON.stringify([]));
            }
          } else if (typeof value === 'string' || typeof value === 'number') {
            formData.append(key, String(value));
          }
        }
      });

      // Siempre generar slug si el título cambió
      if (changedFields.basicFields.title) {
        formData.append(
          "slug",
          String(changedFields.basicFields.title).toLowerCase().replace(/\s+/g, "-")
        );
      }

      // Imagen principal
      if (files.imageSrcFile) {
        // 1. Adjuntar el archivo para que el interceptor lo reciba
        formData.append("imageSrc", files.imageSrcFile);

        // 2. Adjuntar también una URL válida AL MISMO CAMPO 'imageSrc'
        //    para pasar la validación @IsUrl() del DTO.
        //    El interactor priorizará el archivo si existe.
        let urlParaDto = "https://placeholder-required.com/image.jpg"; // URL temporal por defecto
        if (destination.imageSrc && destination.imageSrc.trim() !== "") {
          try {
            new URL(destination.imageSrc); // Validar si la existente es válida
            urlParaDto = destination.imageSrc.trim();
          } catch {
            /* Ignorar URL inválida existente, usar temporal */
          }
        }
        // ¡Importante! Adjuntamos la URL al mismo campo que el archivo.
        formData.append("imageSrc", urlParaDto);
      } else if (destination.imageSrc && destination.imageSrc.trim() !== "") {
        // Si no hay archivo nuevo pero sí URL existente
        try {
          new URL(destination.imageSrc); // Validar que sea una URL válida
          formData.append("imageSrc", destination.imageSrc.trim()); // Enviamos solo la URL para el DTO
        } catch {
          toast.error("La URL de la imagen principal no es válida");
          toast.dismiss(loadingToast);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Si no hay archivo ni URL, mostramos un error
        toast.error("Debe proporcionar una imagen principal");
        toast.dismiss(loadingToast);
        setIsSubmitting(false);
        return;
      }

      // Manejar galería solo si cambió o hay archivos nuevos
      if (changedFields.hasGalleryChanged || files.galleryImageFiles.length > 0) {
        // Preparar las URLs que el usuario quiere MANTENER (después de eliminaciones)
        const finalExistingImages = destination.gallery && destination.gallery.length > 0
          ? destination.gallery
              .map((url) => {
                return url && url.trim() !== "" ? { imageUrl: url.trim() } : null;
              })
              .filter((item): item is { imageUrl: string } => item !== null)
          : [];

        // Caso 1: Hay archivos nuevos para subir
        if (files.galleryImageFiles.length > 0) {
          // 1. Adjuntar los archivos nuevos para que el backend los procese
          files.galleryImageFiles.forEach((file) => {
            formData.append("galleryImages", file);
          });

          // 2. Enviar las URLs existentes que el usuario quiere MANTENER
          // (esto ya refleja las eliminaciones hechas por el usuario)
          if (finalExistingImages.length > 0) {
            finalExistingImages.forEach((imageData, index) => {
              formData.append(`existingGalleryImages[${index}][imageUrl]`, imageData.imageUrl);
            });
          }
        }
        // Caso 2: No hay archivos nuevos, pero hay cambios en URLs existentes
        // (el usuario pudo haber eliminado algunas fotos existentes)
        else if (changedFields.hasGalleryChanged) {
          // Solo enviar si realmente cambió la galería
          finalExistingImages.forEach((imageData, index) => {
            formData.append(`galleryImages[${index}][imageUrl]`, imageData.imageUrl);
          });
          
          // Si no hay imágenes finales, enviar un indicador explícito de que se quiere limpiar la galería
          if (finalExistingImages.length === 0) {
            formData.append("clearGallery", "true");
          }
        }
      }

      // Solo enviar relaciones que han cambiado
      
      // Manejar itinerario solo si cambió
      if (changedFields.hasItineraryChanged && destination.itinerary && destination.itinerary.length > 0) {
        destination.itinerary.forEach((item, itemIndex) => {
          if (item.day.trim() !== "" && item.title.trim() !== "") {
            formData.append(`itineraryItems[${itemIndex}][day]`, item.day);
            formData.append(`itineraryItems[${itemIndex}][title]`, item.title);

            // Detalles del itinerario
            item.details.forEach((detail, detailIndex) => {
              if (detail.trim() !== "") {
                formData.append(
                  `itineraryItems[${itemIndex}][details][${detailIndex}][detail]`,
                  detail
                );
              }
            });
          }
        });
      }

      // Manejar includes solo si cambió
      if (changedFields.hasIncludesChanged && destination.includes && destination.includes.length > 0) {
        destination.includes.forEach((item, index) => {
          const itemString = typeof item === 'string' ? item : String(item || '');
          if (itemString.trim() !== "") {
            formData.append(`includes[${index}][item]`, itemString);
          }
        });
      }

      // Manejar excludes solo si cambió
      if (changedFields.hasExcludesChanged && destination.excludes && destination.excludes.length > 0) {
        destination.excludes.forEach((item, index) => {
          const itemString = typeof item === 'string' ? item : String(item || '');
          if (itemString.trim() !== "") {
            formData.append(`excludes[${index}][item]`, itemString);
          }
        });
      }

      // Manejar tips solo si cambió
      if (changedFields.hasTipsChanged && destination.tips && destination.tips.length > 0) {
        destination.tips.forEach((item, index) => {
          const itemString = typeof item === 'string' ? item : String(item || '');
          if (itemString.trim() !== "") {
            formData.append(`tips[${index}][tip]`, itemString);
          }
        });
      }

      // Manejar FAQs solo si cambió
      if (changedFields.hasFaqsChanged && destination.faqs && destination.faqs.length > 0) {
        destination.faqs.forEach((faq, index) => {
          if (faq.question.trim() !== "" && faq.answer.trim() !== "") {
            formData.append(`faqs[${index}][question]`, faq.question);
            formData.append(`faqs[${index}][answer]`, faq.answer);
          }
        });
      }

      // Imprimir el contenido de FormData para depuración
      console.log("==== ENVIANDO SOLO CAMPOS CAMBIADOS ====");
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(
            `${pair[0]}: File - ${(pair[1] as File).name} (${
              (pair[1] as File).size
            } bytes)`
          );
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      console.log("========================================");

      // Verificar si no hay cambios
      const hasAnyChanges = Object.keys(changedFields.basicFields).length > 0 ||
                           changedFields.hasItineraryChanged ||
                           changedFields.hasIncludesChanged ||
                           changedFields.hasExcludesChanged ||
                           changedFields.hasTipsChanged ||
                           changedFields.hasFaqsChanged ||
                           changedFields.hasGalleryChanged ||
                           files.imageSrcFile ||
                           files.galleryImageFiles.length > 0;

      if (!hasAnyChanges && destinationToEdit) {
        toast.success("No hay cambios que guardar", { id: loadingToast });
        return;
      }

      // Usar el servicio de destinos en lugar de la llamada directa a Axios
      let response;

      if (destinationToEdit?.id) {
        // Actualizar destino existente
        response = await destinationService.updateDestination(
          destinationToEdit.id,
          formData
        );
      } else {
        // Crear nuevo destino
        response = await destinationService.createDestination(formData);
      }

      console.log("Respuesta del servidor:", response);

      toast.success(
        destinationToEdit
          ? "Destino actualizado correctamente"
          : "Destino creado correctamente",
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
      console.error("Error al procesar destino:", error);

      // Asegurarnos de que se cancele el toast pendiente
      toast.dismiss(loadingToast);

      // Mostrar el mensaje de error
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      // Garantizar que estos se ejecuten siempre
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // --- Helper function for input fields ---
  const renderInput = (
    label: string,
    name: keyof DestinationData,
    type = "text",
    required = false,
    options?: string[]
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={destination[name] as string}
          onChange={handleInputChange}
          required={required}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
        />
      ) : type === "select" && options ? (
        <select
          id={name}
          name={name}
          value={destination[name] as string}
          onChange={handleInputChange}
          required={required}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2"
        >
          <option value="">Selecciona...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "checkbox-group" && options ? (
        <div className="mt-1 space-y-2">
          {options.map((option) => {
            // Asegurar que activityType sea un array antes de llamar a includes
            const activityTypeArray = Array.isArray(destination.activityType)
              ? destination.activityType
              : [];

            return (
              <div key={option} className="flex items-center">
                <input
                  id={`${name}-${option}`}
                  name={name}
                  type="checkbox"
                  value={option}
                  checked={activityTypeArray.includes(option)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label
                  htmlFor={`${name}-${option}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {option}
                </label>
              </div>
            );
          })}
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
    name: keyof ItineraryItem | keyof FaqItem | "item"; // 'item' for simple string lists
    label: string;
    type?: "text" | "textarea";
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
    changeFn: (
      index: number,
      field: T extends string ? "item" : keyof T,
      value: string
    ) => void
  ) => {
    // Asegurar que destination[listName] sea un array, incluso si es undefined
    const items = (destination[listName] as T[] | undefined) || [];

    return (
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{label}</h3>
        {items.map((item, index) => (
          <div
            key={`${listName}-${index}`}
            className="mb-4 p-3 border border-gray-100 rounded relative bg-gray-50"
          >
            <button
              type="button"
              onClick={() => removeFn(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
            >
              Eliminar {itemLabelSingular}
            </button>
            <h4 className="text-md font-medium mb-2 text-gray-600">
              {itemLabelSingular} {index + 1}
            </h4>
            {fields.map((fieldConfig) => {
              // Determine the value based on whether it's a simple string list or an object list
              const value =
                typeof item === "string"
                  ? item // For simple string lists like includes, excludes, tips, gallery
                  : (item as ItineraryItem | FaqItem)[
                      fieldConfig.name as keyof (ItineraryItem | FaqItem)
                    ] || "";

              // Determine the correct field name for the change handler ('item' for simple lists)
              // Cast the field name appropriately based on whether T is a string or an object
              const changeFieldName = (
                typeof item === "string" ? "item" : fieldConfig.name
              ) as T extends string ? "item" : keyof T;

              return (
                <div key={fieldConfig.name as string} className="mb-2">
                  <label
                    htmlFor={`${listName}-${index}-${fieldConfig.name}`}
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    {fieldConfig.label}
                  </label>
                  {fieldConfig.type === "textarea" ? (
                    <textarea
                      id={`${listName}-${index}-${fieldConfig.name}`}
                      value={value as string} // Value is always string here after check
                      onChange={(e) =>
                        changeFn(index, changeFieldName, e.target.value)
                      } // Use determined field name with correct type
                      // Adjust rows based on field name, check if item is complex object first
                      rows={
                        typeof item === "object" &&
                        item !== null &&
                        (fieldConfig.name === "details" ||
                          fieldConfig.name === "answer")
                          ? 5
                          : 3
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      id={`${listName}-${index}-${fieldConfig.name}`}
                      value={value as string} // Value is always string here after check
                      onChange={(e) =>
                        changeFn(index, changeFieldName, e.target.value)
                      } // Use determined field name with correct type
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
  };

  // --- Render Step Content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Paso 1: Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Título del Destino", "title", "text", true)}
              {renderInput(
                "Ubicación (Ej: Patagonia, Chile)",
                "location",
                "text",
                true
              )}

              {/* Nuevo componente para subir la imagen principal */}
              <div className="col-span-1 md:col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen Principal
                </label>

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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
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

              {renderInput(
                "Duración (Ej: 5 días y 4 noches)",
                "duration",
                "text",
                true
              )}
              {renderInput(
                "Nivel de Actividad",
                "activityLevel",
                "select",
                true,
                ["Baja", "Moderada", "Alta", "Exigente"]
              )}
              {renderInput(
                "Tamaño del Grupo (Ej: 12 personas)",
                "groupSize",
                "text"
              )}
              {renderInput("Precio Base (CLP)", "price", "number", true)}
              {renderInput("Tipo de Destino", "type", "select", true, [
                "nacional",
                "internacional",
                "special",
              ])}
            </div>
            {renderInput(
              "Tipo de Actividad",
              "activityType",
              "checkbox-group",
              false,
              [
                "Naturaleza",
                "Cultura",
                "Aventura",
                "Gastronomía",
                "Relajo",
                "Urbano",
              ]
            )}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Paso 2: Detalles y Contenido
            </h3>
            {renderInput(
              "Descripción Detallada",
              "description",
              "textarea",
              true
            )}
            {renderDynamicList<ItineraryItem>(
              "itinerary",
              "Itinerario",
              "Día",
              [
                { name: "day", label: "Día (Ej: Día 1)" },
                { name: "title", label: "Título del Día" },
                {
                  name: "details",
                  label: "Detalles (uno por línea)",
                  type: "textarea",
                },
              ],
              addItineraryItem,
              removeItineraryItem,
              (index, field, value) =>
                handleItineraryChange(
                  index,
                  field as keyof ItineraryItem,
                  value
                )
            )}
            {renderDynamicList<string>(
              "includes",
              "Incluye",
              "Ítem",
              [{ name: "item", label: "Descripción" }],
              () => addListItem("includes"),
              (index) => removeListItem("includes", index),
              (index, _field, value) =>
                handleListChange("includes", index, value)
            )}
            {renderDynamicList<string>(
              "excludes",
              "No Incluye",
              "Ítem",
              [{ name: "item", label: "Descripción" }],
              () => addListItem("excludes"),
              (index) => removeListItem("excludes", index),
              (index, _field, value) =>
                handleListChange("excludes", index, value)
            )}
            {renderDynamicList<string>(
              "tips",
              "Tips de Viaje",
              "Tip",
              [{ name: "item", label: "Descripción" }],
              () => addListItem("tips"),
              (index) => removeListItem("tips", index),
              (index, _field, value) => handleListChange("tips", index, value)
            )}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Paso 3: Avanzado y Metadatos
            </h3>
            {renderDynamicList<FaqItem>(
              "faqs",
              "Preguntas Frecuentes (FAQ)",
              "Pregunta",
              [
                { name: "question", label: "Pregunta" },
                { name: "answer", label: "Respuesta", type: "textarea" },
              ],
              addFaqItem,
              removeFaqItem,
              (index, field, value) =>
                handleFaqChange(index, field as keyof FaqItem, value)
            )}

            {/* Componente de galería con carga de imágenes */}
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Galería de Imágenes
              </h3>

              {/* Previsualizaciones de imágenes */}
              {previewUrls.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {previewUrls.galleryImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Eliminar imagen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
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
                <input
                  id="isRecommended"
                  name="isRecommended"
                  type="checkbox"
                  checked={destination.isRecommended}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="isRecommended"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Marcar como Recomendado
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="isSpecial"
                  name="isSpecial"
                  type="checkbox"
                  checked={destination.isSpecial}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="isSpecial"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Marcar como Especial (Destacado)
                </label>
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
                <span className="text-sm font-medium text-primary-blue transition-colors ">
                  Paso {step}
                </span>
                {/* <span className="text-sm font-medium">Description</span> */}
              </div>
            ) : step === currentStep ? (
              // Current step
              <div
                className="flex w-full flex-col border-l-4 border-primary-blue py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary-blue">
                  Paso {step}
                </span>
                {/* <span className="text-sm font-medium">Description</span> */}
              </div>
            ) : (
              // Upcoming step
              <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 transition-colors">
                  Paso {step}
                </span>
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
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {destinationToEdit ? "Actualizar Destino" : "Crear Destino"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg relative">
      {renderStepIndicator()}

      <form
        onSubmit={(e) => {
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
        }}
        className="space-y-6"
      >
        {" "}
        {/* Reduced space-y */}
        {renderStepContent()}
        {/* Navigation Buttons */}
        {renderStepNavigation()}
      </form>
    </div>
  );
};

export default AdminDestinationForm;
