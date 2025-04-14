import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt: string;
  isApproved: boolean;
}

const AdminTestimonialsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Datos de ejemplo - se reemplazarán con datos reales del backend
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Marcelo P.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Excelente viaje los paisajes son sacados de una postal nuestro guía Raimundo y el chófer don Pablo hicieron que el viaje fuera 10 de 5 estrellas!!! Recomendado",
      images: ["/images/testimonials/sunset.jpg"],
      createdAt: "2024-04-15",
      isApproved: true
    },
    {
      id: 2,
      name: "Pamela",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Un muy buen tour a Campos de Hielo Sur con geoterra a cargo Raimundo González como guía y acompañado de don Pablo como chófer. Todo muy bien gestionando y coordinado.",
      images: ["/images/testimonials/waterfall-group.jpg"],
      createdAt: "2024-04-10",
      isApproved: true
    },
    {
      id: 3,
      name: "Maria H.",
      image: "/placeholder-avatar.jpg",
      rating: 4,
      text: "Excelente experiencia un viaje espectacular, buen tiempo lugares maravillosos y todo esto complementado con el impecable desempeño de Max Sue Wong nuestra brillante guía.",
      images: ["/images/testimonials/mountains.jpg"],
      createdAt: "2024-04-05",
      isApproved: false
    },
  ];

  // Renderizar estrellas de calificación
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Helper para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    // Implementar lógica para eliminar testimonios
    console.log(`Eliminar testimonio ${id}`);
    // Después actualizaría la lista de testimonios
  };

  const handleApprove = (id: number, currentStatus: boolean) => {
    // Implementar lógica para aprobar/desaprobar testimonios
    console.log(`Cambiar estado de aprobación del testimonio ${id} a ${!currentStatus}`);
    // Después actualizaría la lista de testimonios
  };

  return (
    <div>
      {showForm ? (
        // Formulario para crear/editar testimonios
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {editingTestimonial ? 'Editar Testimonio' : 'Añadir Nuevo Testimonio'}
            </h2>
            <button 
              onClick={() => {
                setShowForm(false);
                setEditingTestimonial(null);
              }}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
            >
              Volver a la Lista
            </button>
          </div>
          
          {/* Aquí iría el formulario para testimonios */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-gray-600 mb-4">Formulario para crear/editar testimonios (a implementar)</p>
          </div>
        </>
      ) : (
        // Lista de testimonios
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestionar Testimonios</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
            >
              + Añadir Nuevo Testimonio
            </button>
          </div>

          <p className="text-gray-600 mb-4">Aquí puedes ver, aprobar, editar y eliminar los testimonios de clientes.</p>
          
          {/* Lista de testimonios */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  {/* Encabezado del testimonio */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {testimonial.image && (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-md font-semibold text-gray-900">{testimonial.name}</p>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        testimonial.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testimonial.isApproved ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Contenido del testimonio */}
                  <div className="mb-3">
                    <p className="text-gray-700 text-sm">{testimonial.text}</p>
                  </div>
                  
                  {/* Imágenes (si las hay) */}
                  {testimonial.images && testimonial.images.length > 0 && (
                    <div className="flex space-x-2 mb-3 overflow-x-auto py-1">
                      {testimonial.images.map((img, index) => (
                        <div key={index} className="h-20 w-28 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          <img 
                            src={img} 
                            alt={`Foto ${index + 1}`} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Fecha y acciones */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                      <span className="font-medium">Recibido:</span> {formatDate(testimonial.createdAt)}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleApprove(testimonial.id, testimonial.isApproved)}
                        className={`font-medium ${testimonial.isApproved 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-green-600 hover:text-green-800'} transition-colors`}
                      >
                        {testimonial.isApproved ? 'Desaprobar' : 'Aprobar'}
                      </button>
                      <button 
                        onClick={() => handleEdit(testimonial)}
                        className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(testimonial.id)}
                        className="font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Paginación (a implementar) */}
        </>
      )}
    </div>
  );
};

export default AdminTestimonialsPage; 