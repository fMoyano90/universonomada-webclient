import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoAdd, IoTrash, IoCreate, IoArrowUp, IoArrowDown } from 'react-icons/io5';
import axios from 'axios';
import authService from '../services/auth.service';

interface Slider {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  imageUrl: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

const AdminSlidersPage: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlider, setCurrentSlider] = useState<Slider | null>(null);

  // Formulario para nuevo/editar slider
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    isActive: true
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/sliders`);
      setSliders(response.data.data || []);
    } catch (err) {
      console.error("Error fetching sliders:", err);
      setError('Error al cargar los sliders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (currentSlider) {
        // Actualizar slider existente
        await axios.put(
          `${API_URL}/sliders/${currentSlider.id}`,
          formData,
          { headers }
        );
      } else {
        // Crear nuevo slider
        await axios.post(
          `${API_URL}/sliders`,
          formData,
          { headers }
        );
      }

      // Cerrar modal y refrescar datos
      setIsModalOpen(false);
      resetForm();
      fetchSliders();

    } catch (err) {
      console.error("Error saving slider:", err);
      setError('Error al guardar el slider');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este slider?')) {
      try {
        const token = authService.getAuthToken();
        await axios.delete(`${API_URL}/sliders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        fetchSliders();
      } catch (err) {
        console.error("Error deleting slider:", err);
        setError('Error al eliminar el slider');
      }
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    try {
      const token = authService.getAuthToken();
      await axios.put(
        `${API_URL}/sliders/${id}/reorder`,
        { direction },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      fetchSliders();
    } catch (err) {
      console.error("Error reordering slider:", err);
      setError('Error al reordenar los sliders');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      location: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      isActive: true
    });
    setCurrentSlider(null);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionar Sliders</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center"
        >
          <IoAdd className="mr-2" /> Nuevo Slider
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {sliders.length === 0 && !isLoading ? (
        <div className="bg-gray-100 p-8 text-center rounded-lg">
          <p className="text-gray-500">No hay sliders disponibles. Crea el primero haciendo clic en "Nuevo Slider".</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sliders.map((slider) => (
                <tr key={slider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={slider.imageUrl} 
                      alt={slider.title} 
                      className="h-20 w-32 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {slider.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {slider.subtitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {slider.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      slider.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slider.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReorder(slider.id, 'up')}
                        className="text-gray-400 hover:text-gray-600"
                        title="Subir"
                      >
                        <IoArrowUp />
                      </button>
                      <button
                        onClick={() => handleReorder(slider.id, 'down')}
                        className="text-gray-400 hover:text-gray-600"
                        title="Bajar"
                      >
                        <IoArrowDown />
                      </button>
                      <span className="text-gray-500">{slider.displayOrder}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentSlider(slider);
                        setFormData({
                          title: slider.title,
                          subtitle: slider.subtitle,
                          location: slider.location,
                          imageUrl: slider.imageUrl,
                          buttonText: slider.buttonText || '',
                          buttonUrl: slider.buttonUrl || '',
                          isActive: slider.isActive
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-primary-blue hover:text-primary-blue-dark mr-4"
                    >
                      <IoCreate className="inline mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <IoTrash className="inline mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para crear/editar slider */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {currentSlider ? 'Editar Slider' : 'Nuevo Slider'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Vista previa" 
                      className="h-32 object-cover rounded border border-gray-200" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error+de+imagen';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Botón
                </label>
                <input
                  type="url"
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Activo
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue-dark"
                >
                  {currentSlider ? 'Guardar Cambios' : 'Crear Slider'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSlidersPage;
