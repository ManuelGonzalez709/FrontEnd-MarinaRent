import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
  };

  return (
    <a onClick={handleLogout}
    href="/"
    className="block px-4 py-2 text-sm text-black data-focus:bg-red-200 data-focus:outline-hidden"
    >
    Logout
     </a>
  );
};

export default LogoutButton;
