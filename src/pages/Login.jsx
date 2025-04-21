import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../utilities/apiComunicator";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, loading, error, setUri, setError, setOptions, currentOptions } = useApi("api/login", false);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (data) {
      let tokenNuevo = data.token.split("|")
      localStorage.setItem("authToken", tokenNuevo[1]);
      navigate("/home");
    }
  }, [data, navigate]);

  useEffect(() => {
    if (error) {
        setErrorMessage("Error al iniciar sesión. Por favor verifica tus credenciales.");
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      setOptions({
        method: "POST",
        body: JSON.stringify({ email, password }), // Asegúrate de enviar los datos como un JSON stringificado
      });
      
    } else {
      setErrorMessage("Por favor, ingresa tus credenciales.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="logo3PNG.png" alt="Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
          Bienvenido a Marina Rent
        </h2>

        {errorMessage && (
          <div className="text-sm text-center text-red-700 bg-red-100 rounded py-2 mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta? <span className="underline cursor-pointer hover:text-blue-700">Regístrate</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
