import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Commented out as it's not used yet

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const navigate = useNavigate(); // Commented out as it's not used yet

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!username || !password) {
      setError('Por favor, ingresa usuario y contraseña.');
      return;
    }

    try {
      // TODO: Implement actual login logic here
      // Example: Call an API endpoint
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      // if (!response.ok) {
      //   throw new Error('Credenciales inválidas');
      // }
      // const data = await response.json();
      // Store token, redirect, etc.
      
      console.log('Login attempt with:', { username, password });
      // Simulate successful login for now
      alert('Inicio de sesión exitoso (simulado)');
      // Redirect to an admin dashboard (replace '/admin/dashboard' with the actual path)
      // navigate('/admin/dashboard'); 

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Acceso Administrador</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-blue border border-transparent rounded-md shadow-sm hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
