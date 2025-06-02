/**
 * @file Register.jsx
 * @description Página de registro de usuario para Marina Rent.
 * Permite crear una cuenta nueva, valida la seguridad de la contraseña y muestra mensajes de error.
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utilities/apirest"

/**
 * Componente de formulario de registro.
 * Gestiona el estado del usuario, validaciones, errores y navegación.
 * @component
 * @returns {JSX.Element}
 */
export default function Registro() {
  /**
   * Nombre del usuario.
   *   {(string|Function)[]}
   */
  const [nombre, setNombre] = useState("")
  /**
   * Apellidos del usuario.
   *   {(string|Function)[]}
   */
  const [apellidos, setApellidos] = useState("")
  /**
   * Email del usuario.
   *   {(string|Function)[]}
   */
  const [email, setEmail] = useState("")
  /**
   * Fecha de nacimiento del usuario.
   *   {(string|Function)[]}
   */
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  /**
   * Contraseña introducida por el usuario.
   *   {(string|Function)[]}
   */
  const [password, setPassword] = useState("")
  /**
   * Confirmación de la contraseña.
   *   {(string|Function)[]}
   */
  const [password_confirmation, setPasswordConfirmation] = useState("")
  /**
   * Mensaje de error a mostrar.
   *   {[string|null, Function]}
   */
  const [errorMessage, setErrorMessage] = useState(null)
  /**
   * Estado de carga mientras se realiza la petición.
   *   {[boolean, Function]}
   */
  const [isLoading, setIsLoading] = useState(false)
  /**
   * Hook de navegación de React Router.
   */
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de registro.
   * Realiza validaciones de contraseña y envía los datos a la API.
   * @param {React.FormEvent} event
   */
  function realizarRegistro(event) {
    setIsLoading(true);
    event.preventDefault()

    // Validación de coincidencia de contraseñas
    if (password !== password_confirmation) {
      setIsLoading(false);
      setErrorMessage("Las contraseñas no coinciden. Inténtalo de nuevo.")
      return
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setIsLoading(false);
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    // Validar seguridad de la contraseña
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setIsLoading(false);
      setErrorMessage("La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales.")
      return
    }

    // Enviar datos a la API de registro
    const url = API_URL + "api/register"
    axios
      .post(url, {
        Nombre: nombre,
        Apellidos: apellidos,
        Fecha_nacimiento: fecha_nacimiento,
        Email: email,
        Password: password,
        Password_confirmation: password_confirmation,
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          // Si el registro es exitoso, guarda el token si la API lo devuelve
          if (response.data.token) {
            const token = response.data.token.split("|")[1]
            localStorage.setItem("authToken", token)
          }
          setErrorMessage(null)
          navigate("/home"); // Redirigir al home después del registro exitoso
        }
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            setErrorMessage("El email ya está registrado o los datos son inválidos.")
          } else {
            setErrorMessage("Error al registrar. Inténtalo de nuevo.")
          }
        } else {
          setErrorMessage("Error de conexión. Por favor, intenta más tarde.")
        }
      }).finally(() => {
        setIsLoading(false);
      });
  }

  /**
   * Calcula la fortaleza de la contraseña para mostrar feedback visual.
   * @param {string} password
   * @returns {{text: string, color: string}}
   */
  function getPasswordStrength(password) {
    let strength = 0

    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 1

    if (strength <= 2) return { text: "Débil", color: "bg-red-500" }
    if (strength <= 4) return { text: "Media", color: "bg-yellow-500" }
    return { text: "Fuerte", color: "bg-green-500" }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-10 my-3 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Logo de la aplicación */}
        <div className="flex justify-center mb-6">
          <img src="logo3PNG.png" alt="Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Regístrate en Marina Rent</h2>

        {/* Mensaje de error si existe */}
        {errorMessage && (
          <div className="text-sm text-center text-red-700 bg-red-100 rounded py-2 mb-4">{errorMessage}</div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={realizarRegistro} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="Tus apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
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
              required
            />
            {/* Indicador visual de fortaleza de contraseña */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="text-xs">Seguridad:</div>
                  <div className={`h-2 w-full rounded ${getPasswordStrength(password).color}`}></div>
                  <div className="text-xs">{getPasswordStrength(password).text}</div>
                </div>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li className={password.length >= 6 ? "text-green-600" : "text-gray-600"}>✓ Mínimo 6 caracteres</li>
                  <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-600"}>
                    ✓ Al menos una mayúscula
                  </li>
                  <li className={/[a-z]/.test(password) ? "text-green-600" : "text-gray-600"}>
                    ✓ Al menos una minúscula
                  </li>
                  <li className={/\d/.test(password) ? "text-green-600" : "text-gray-600"}>✓ Al menos un número</li>
                  <li
                    className={
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? "text-green-600" : "text-gray-600"
                    }
                  >
                    ✓ Al menos un carácter especial
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              placeholder="••••••••"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="flex justify-center items-center">
                  <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              </>
            ) : (
              <span>Registrate</span>
            )}
          </button>
        </form>

        {/* Enlace para usuarios ya registrados */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <span className="underline cursor-pointer hover:text-blue-700">
            <span className="underline cursor-pointer hover:text-blue-700">
              <span
                onClick={() => navigate("/")}
                className="underline cursor-pointer hover:text-blue-700"
              >
                Iniciar Sesión
              </span>
            </span>
          </span>
        </p>
      </div>
    </div>
  )
}
