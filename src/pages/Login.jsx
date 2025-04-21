import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../utilities/apiComunicator";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, loading, error, setUri, setError, setOptions, currentOptions } = useApi("login", false);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("authToken", data.token);
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
        body: { email, contrasena: password },
      });
    } else {
      setErrorMessage("Por favor, ingresa tus credenciales.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-500 font-sans px-4">
        <div className="mb-6">
          <img
            src="logo.png"
            alt="Login Header"
            className="w-60 h-auto rounded-t-2xl"
          />
        </div>

        <div className="bg-white w-full max-w-md rounded-2xl shadow-[0px_14px_80px_rgba(34,35,58,0.2)] p-10 transition-all">
          <h3 className="text-center text-xl font-semibold mb-6">Iniciar Sesión</h3>
          {errorMessage && (
            <p className="text-center text-sm text-black mt-2 bg-red-300 mb-4 py-4 rounded">
              {errorMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Introduce dirección de correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-900 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
