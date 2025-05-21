"use client"

import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utilities/apirest"


export default function RecuperarPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [step, setStep] = useState(1) 
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function enviarSolicitud(event) {
        event.preventDefault()
        setIsLoading(true)

        const url = API_URL + "api/enviar-restablecimiento"
        const token = localStorage.getItem("authToken")
        axios
            .post(url,{email: email})
            .then((response) => {
                setStep(2)
                setErrorMessage(null)
                setDisponibilidadHora(response.data.disponible)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage("Error al enviar el correo. Por favor, intenta más tarde.")
            }).finally(() => {
                setIsLoading(false)
            })


    }

    const handleNavigateToLogin = (e) => {
        e.preventDefault()
        navigate("/")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md p-10 my-3 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-center mb-6">
                    <img src="logo3PNG.png" alt="Logo" className="w-32 h-auto" />
                </div>

                {step === 1 ? (
                    <>
                        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Recuperar Contraseña</h2>

                        <p className="text-center text-gray-600 mb-6">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        {errorMessage && (
                            <div className="text-sm text-center text-red-700 bg-red-100 rounded py-2 mb-4">{errorMessage}</div>
                        )}

                        <form onSubmit={enviarSolicitud} className="space-y-5">
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

                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Send size={16} />
                                        Enviar Instrucciones
                                    </span>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Correo Enviado</h2>
                            <p className="text-gray-600 mb-6">
                                Hemos enviado instrucciones para restablecer tu contraseña a <strong>{email}</strong>. Por favor, revisa
                                tu bandeja de entrada y sigue las instrucciones.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
                            </p>
                            <button
                                onClick={() => setStep(1)}
                                className="text-blue-700 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
                            >
                                <ArrowLeft size={16} className="mr-1" />
                                Volver a intentar
                            </button>
                        </div>
                    </>
                )}

                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿Ya recordaste tu contraseña?{" "}
                    <button
                        onClick={handleNavigateToLogin}
                        className="underline cursor-pointer hover:text-blue-700 font-normal text-sm"
                    >
                        Iniciar Sesión
                    </button>
                </p>
            </div>
        </div>
    )
}
