import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    // Puedes limpiar otros datos si es necesario
    navigate('/login'); // Redirige a la página de login tras cerrar sesión
  };

  return (
    <button
      onClick={handleLogout}
      className="block px-4 py-2 text-sm text-black hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition-colors"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
