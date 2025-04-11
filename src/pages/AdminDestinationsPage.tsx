import React, { useState } from 'react'; // Import useState
import AdminDestinationForm from '../components/AdminDestinationForm'; // Import the form

const AdminDestinationsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // TODO: Fetch and display the list of destinations from the backend
  // Adding more fields to placeholder data
  const destinations = [
    { id: 1, title: 'Patagonia Chilena', type: 'nacional', isRecommended: true, isSpecial: false, location: 'Torres del Paine, Chile', duration: '5 días, 4 noches', price: 850000, createdAt: '2024-10-15' },
    { id: 2, title: 'Salar de Uyuni Aventura', type: 'internacional', isRecommended: false, isSpecial: true, location: 'Uyuni, Bolivia', duration: '3 días, 2 noches', price: 450000, createdAt: '2024-09-20' },
    { id: 3, title: 'Valparaíso Bohemio', type: 'nacional', isRecommended: false, isSpecial: false, location: 'Valparaíso, Chile', duration: '2 días, 1 noche', price: 120000, createdAt: '2024-11-01' },
  ];

  // Helper to format currency (Chilean Pesos)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  // Helper to format date
   const formatDate = (dateString: string) => {
      // Basic formatting, consider using a library like date-fns for more robust parsing/formatting
      try {
        return new Date(dateString).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
      } catch { // Removed unused 'e' variable
        return dateString; // Fallback
      }
   };


  return (
    <div>
      {showForm ? (
        // Render the form view
        <>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-semibold">Crear Nuevo Destino</h2>
             <button 
               onClick={() => setShowForm(false)} // Button to go back to the list
               className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
             >
               Volver a la Lista
             </button>
          </div>
          <AdminDestinationForm /> 
        </>
      ) : (
        // Render the list view
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestionar Destinos</h2>
            <button 
              onClick={() => setShowForm(true)} // Button to show the form
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors"
            >
              + Crear Nuevo Destino
            </button>
          </div>

          <p className="text-gray-600 mb-4">Aquí puedes ver, editar y eliminar los destinos existentes.</p>
          
          {/* Destination list/table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
              {destinations.map((dest) => (
                <li key={dest.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  {/* Top row: Title and Badges */}
                  <div className="flex items-center justify-between mb-2">
                <p className="text-md font-semibold text-primary-blue truncate">{dest.title}</p>
                <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    dest.type === 'nacional' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dest.type}
                  </span>
                   {dest.isRecommended && <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Recomendado</span>}
                   {dest.isSpecial && <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Especial</span>}
                </div>
              </div>

              {/* Middle row: Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                 <div><span className="font-medium text-gray-800">Ubicación:</span> {dest.location}</div>
                 <div><span className="font-medium text-gray-800">Duración:</span> {dest.duration}</div>
                     <div><span className="font-medium text-gray-800">Precio:</span> {formatPrice(dest.price)}</div>
                     <div><span className="font-medium text-gray-800">Creado:</span> {formatDate(dest.createdAt)}</div>
                  </div>

                  {/* Bottom row: Actions */}
                  <div className="flex justify-end items-center text-sm text-gray-500 space-x-4">
                       {/* TODO: Add Edit/Delete buttons with functionality */}
                       {/* TODO: Edit button should also likely set showForm(true) and pass destination data */}
                       <button className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">Editar</button>
                       <button className="font-medium text-red-600 hover:text-red-800 transition-colors">Eliminar</button>
                  </div> 
                </li>
              ))}
            </ul>
          </div>
           {/* TODO: Add pagination if needed */}
        </>
      )}
    </div>
  );
};

export default AdminDestinationsPage;
