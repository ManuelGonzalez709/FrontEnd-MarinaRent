"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utilities/apirest"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [showRecoveryLink, setShowRecoveryLink] = useState(false)

  function realizarSolicitud(event) {
    setIsLoading(true)
    event.preventDefault()
    const url = API_URL + "api/login"
    axios
      .post(url, { email: email, password: password })
      .then((response) => {
        if (response.status == 200) {
          const token = response.data.token.split("|")[1]
          localStorage.setItem("authToken", token)
          setErrorMessage(null)
          setFailedAttempts(0)
          navigate("/home")
        }
      })
      .catch((error) => {
        if (error.response) {
          const newFailedAttempts = failedAttempts + 1
          setFailedAttempts(newFailedAttempts)

          if (newFailedAttempts >= 3) {
            setShowRecoveryLink(true)
          }

          setErrorMessage("Credenciales incorrectas. Inténtalo de nuevo.")
        } else {
          setErrorMessage("Error de conexión. Por favor, intenta más tarde.")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleRecoveryClick() {
    navigate("/recuperar")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="logo3PNG.png" alt="Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Bienvenido a Marina Rent</h2>

        {errorMessage && (
          <div className="text-sm text-center text-red-700 bg-red-100 rounded py-2 mb-4">{errorMessage}</div>
        )}

        {showRecoveryLink && (
          <div className="text-sm text-center text-blue-700 bg-blue-50 rounded py-2 mb-4">
            ¿Olvidaste tu contraseña?
            <span
              onClick={handleRecoveryClick}
              className="underline cursor-pointer font-medium ml-1 hover:text-blue-800"
            >
              Recuperar contraseña
            </span>
          </div>
        )}

        <form onSubmit={realizarSolicitud} className="space-y-5">
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
            {isLoading ? (
              <>
                <div className="flex justify-center items-center">
                  <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?
          <span onClick={() => navigate("/registro")} className="underline cursor-pointer hover:text-blue-700 ms-1">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
