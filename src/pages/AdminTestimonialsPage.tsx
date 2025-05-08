import { useState, useEffect, useRef } from 'react';
import testimonialService from '../services/testimonial.service';
import { Testimonial } from '../components/interfaces';
import { FaEdit, FaTrash, FaPlus, FaStar, FaStarHalfAlt, FaRegStar, FaUpload, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Extender la interfaz Testimonial para incluir el campo _imageFile
interface TestimonialFormData extends Testimonial {
  _imageFile?: File;
}

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    rating: 5,
    testimonial_text: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialService.getAllTestimonials(page, 10);
      
      // Verificar que response.data es un array
      if (Array.isArray(response.data)) {
        setTestimonials(response.data);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.page || 1);
      } else {
        // Si no es un array, establecer un array vacío
        console.error('La respuesta de la API no contiene un array:', response);
        setTestimonials([]);
        setError('La respuesta del servidor no tiene el formato esperado');
        toast.error('Error en el formato de datos del servidor');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
      setError('Error al cargar los testimonios. Inténtelo de nuevo más tarde.');
      toast.error('Error al cargar los testimonios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTestimonials(page);
  };

  const openCreateModal = () => {
    setCurrentTestimonial(null);
    setFormData({
      name: '',
      rating: 5,
      testimonial_text: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      rating: testimonial.rating,
      testimonial_text: testimonial.testimonial_text,
      image_url: testimonial.image_url || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Resetear el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (newRating: number) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar el tipo de archivo
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('El archivo debe ser una imagen (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validar el tamaño del archivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Generar una vista previa en base64 para mostrar temporalmente
      const imagePreview = await testimonialService.previewImageAsBase64(file, (percent) => {
        setUploadProgress(percent);
      });
      
      // Almacenar la imagen temporalmente como base64 para la vista previa
      setFormData(prev => ({
        ...prev,
        image_url: imagePreview,
        // Guardamos el archivo de imagen para enviarlo cuando se envíe el formulario
        _imageFile: file
      }));

      toast.success('Imagen preparada para subir');
    } catch (error) {
      console.error('Error al preparar la imagen:', error);
      toast.error('Error al preparar la imagen. Inténtelo de nuevo.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.testimonial_text) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Extraer el archivo de imagen si existe
      const imageFile = formData._imageFile;
      
      // Crear una copia limpia de los datos sin el archivo
      const cleanFormData: Testimonial = {
        name: formData.name,
        rating: formData.rating,
        testimonial_text: formData.testimonial_text,
        image_url: formData.image_url && !formData.image_url.startsWith('data:') ? formData.image_url : '', // Ignorar imágenes base64
      };
      
      if (currentTestimonial) {
        // Actualizar testimonio existente usando el método que acepta un archivo de imagen
        await testimonialService.updateTestimonial(currentTestimonial.id!, cleanFormData, imageFile);
        toast.success('Testimonio actualizado correctamente');
      } else {
        // Crear nuevo testimonio usando el método que acepta un archivo de imagen
        await testimonialService.createTestimonial(cleanFormData, imageFile);
        toast.success('Testimonio creado correctamente');
      }
      
      closeModal();
      fetchTestimonials(currentPage);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      setError('Error al guardar el testimonio. Inténtelo de nuevo más tarde.');
      toast.error('Error al guardar el testimonio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este testimonio?')) {
      try {
        setError(null);
        await testimonialService.deleteTestimonial(id);
        toast.success('Testimonio eliminado correctamente');
        fetchTestimonials(currentPage);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        setError('Error al eliminar el testimonio. Inténtelo de nuevo más tarde.');
        toast.error('Error al eliminar el testimonio');
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administrar Testimonios</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary-orange hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Nuevo Testimonio
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando testimonios...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Testimonio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay testimonios disponibles
                    </td>
                  </tr>
                ) : (
                  // Asegurarnos de que testimonials es un array antes de usar map
                  Array.isArray(testimonials) && testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(testimonial.rating)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{testimonial.testimonial_text}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url}
                            alt="Imagen del viaje"
                            className="h-10 w-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                        ) : (
                          <span className="text-sm text-gray-500">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(testimonial)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Anterior
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? 'bg-primary-orange text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal para crear/editar testimonio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {currentTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-orange focus:border-primary-orange"
                    />
                  </div>
                  
                  {/* URL de imagen / Carga de archivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen del testimonio
                    </label>
                    
                    {/* Sección de subida de archivos */}
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-4">
                      <div className="flex flex-col items-center">
                        <div className="flex justify-center mb-3">
                          <FaUpload className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Arrastra una imagen o haz clic aquí para seleccionarla
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm flex items-center"
                          disabled={isUploading}
                        >
                          <FaImage className="mr-2" /> Seleccionar imagen
                        </button>
                        {isUploading && (
                          <div className="mt-3 w-full">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-orange" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% subido</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Campo URL manual */}
                    <div className="mt-3">
                      <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                        URL de imagen (opcional)
                      </label>
                      <input
                        type="text"
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-orange focus:border-primary-orange"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Este campo se actualiza automáticamente al subir una imagen o puedes ingresar una URL manualmente.
                      </p>
                    </div>
                    
                    {/* Vista previa */}
                    {formData.image_url && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Vista previa:</p>
                        <div className="relative">
                          <img
                            src={formData.image_url}
                            alt="Vista previa de imagen"
                            className="h-32 w-full max-w-xs object-cover rounded border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                          {formData.image_url.startsWith('data:') && (
                            <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 border-yellow-400 text-yellow-700 p-1 text-xs">
                              Imagen en formato base64 (temporal)
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.image_url.startsWith('data:') 
                            ? 'Esta imagen se almacenará como base64 en la base de datos. Para mejor rendimiento, considere implementar un servicio de almacenamiento de archivos.' 
                            : 'URL de imagen externa'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Calificación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calificación *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="text-2xl focus:outline-none"
                        >
                          {star <= formData.rating ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar className="text-yellow-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Testimonio */}
                  <div>
                    <label htmlFor="testimonial_text" className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonio *
                    </label>
                    <textarea
                      id="testimonial_text"
                      name="testimonial_text"
                      value={formData.testimonial_text}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-orange focus:border-primary-orange"
                      placeholder="Escribe el testimonio del cliente aquí..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-orange text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400"
                    disabled={isSubmitting || isUploading}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Guardando...
                      </div>
                    ) : currentTestimonial ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonialsPage; 