import React from 'react'
import { useNavigate } from "react-router-dom";

/**
 * Página de error 404.
 * Se muestra cuando la ruta no existe.
 * Permite volver a la página principal.
 * @component
 * @returns {JSX.Element}
 */
export default function NotFound() {
    /**
     * Hook de navegación de React Router.
     */
    const navigate = useNavigate();

    /**
     * Maneja el click para volver a la página principal.
     */
    const handleGoHome = () => {
        navigate("/home");
    };

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Código de error */}
                <p className="text-base font-semibold text-indigo-600">404</p>
                {/* Título del error */}
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
                {/* Mensaje descriptivo */}
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                {/* Botón para volver a home */}
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={handleGoHome}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go back home
                    </button>
                </div>
            </div>
        </main>
    );
}

