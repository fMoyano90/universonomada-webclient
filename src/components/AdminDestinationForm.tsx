import React, { useState } from 'react';

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
  imageSrc: string; // URL or path for main image
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
  gallery: string[]; // URLs or paths for gallery images
  price: number;
  location: string;
  isRecommended: boolean;
  isSpecial: boolean;
  type: 'nacional' | 'internacional' | ''; // Type of destination
}

const initialDestinationData: DestinationData = {
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
  gallery: [''],
  price: 0,
  location: '',
  isRecommended: false,
  isSpecial: false,
  type: '',
};

const TOTAL_STEPS = 3;

const AdminDestinationForm: React.FC = () => {
  const [destination, setDestination] = useState<DestinationData>(initialDestinationData);
  const [currentStep, setCurrentStep] = useState(1);

  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save destination data
    console.log('Destination Data:', destination);
    alert('Destination data logged to console. Implement API call here.');
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
              {renderInput('URL Imagen Principal', 'imageSrc', 'text', true)}
              {renderInput('Duración (Ej: 5 días y 4 noches)', 'duration', 'text', true)}
              {renderInput('Nivel de Actividad', 'activityLevel', 'select', true, ['Baja', 'Moderada', 'Alta', 'Exigente'])}
              {renderInput('Tamaño del Grupo (Ej: 12 personas)', 'groupSize', 'text')}
              {renderInput('Precio Base (CLP)', 'price', 'number', true)}
              {renderInput('Tipo de Destino', 'type', 'select', true, ['nacional', 'internacional'])}
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
            {renderDynamicList<string>(
              'gallery', 'Galería de Imágenes', 'Imagen', [{ name: 'item', label: 'URL de la Imagen' }],
              () => addListItem('gallery'), (index) => removeListItem('gallery', index), (index, _field, value) => handleListChange('gallery', index, value)
            )}
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


  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg"> {/* Added shadow-lg and more padding */}
      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6"> {/* Reduced space-y */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-gray-200"> {/* Adjusted padding/margin */}
          <div className="flex justify-between items-center"> {/* Added items-center */}
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {/* Optional: Add icon like ChevronLeftIcon */}
              Anterior
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
              >
                Siguiente
                {/* Optional: Add icon like ChevronRightIcon */}
              </button>
            ) : (
              <button
                type="submit"
                className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Guardar Destino
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminDestinationForm;
