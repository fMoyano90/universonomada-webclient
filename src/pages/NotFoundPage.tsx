import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 flex flex-col items-center justify-center py-32">
        <div className="bg-white shadow-xl rounded-lg p-12 max-w-lg w-full text-center">
          <h1 className="text-7xl font-bold text-primary-orange mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-primary-blue mb-6">Página no encontrada</h2>
          <p className="text-gray-700 mb-8 text-center">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-primary-orange hover:bg-primary-orange-dark text-white rounded-md font-semibold transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage;
