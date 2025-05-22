"use client"

import { useNavigate } from "react-router-dom"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import MarbellaMap from "../components/MarbellaMap"
import { useEffect, useState } from "react"
import { API_URL, IMAGE_URL } from "../utilities/apirest"
import axios from "axios"

export default function Home() {
  const navigate = useNavigate()
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const url = API_URL + "api/publicacionesAleatorias"
        const token = localStorage.getItem("authToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        setLoading(true)
        const response = await axios.get(url, { headers })
        setPublicaciones(response.data)
      } catch (error) {
        console.error("Error al obtener publicaciones:", error)
      } finally {
        setLoading(false)
      }
    }
    obtenerPublicaciones()
  }, [])

  // Función para obtener la primera imagen de la cadena de imágenes
  const obtenerPrimeraImagen = (imagenes) => {
    if (!imagenes) return ""
    const primeraImagen = imagenes.split(";")[0]
    return `${IMAGE_URL}${primeraImagen}`
  }

  return (
    <>
      <main>
        <div className="relative w-full aspect-video">
          {/* Texto encima del video */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-black/20 px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center">
              Bienvenidos a Marina Rent
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mt-2 md:mt-4 text-center">
              Diversión desde el Principio
            </h2>
          </div>

          {/* Iframe responsive */}
          <iframe
            id="player"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            title="ScubaCaribe"
            src="https://www.youtube.com/embed/Hx785Tzm4UE?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playlist=Hx785Tzm4UE"
          />
        </div>

        <div className="w-full justify-center flex bg-green-400 py-2 md:py-0">
          <img src="tripadvaisor.png" alt="TripAdvisor" className="h-20 md:h-40" />
        </div>

        {/* Sección 10 razones - Responsiva */}
        <section className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex flex-col items-start py-8 md:py-16 px-4 md:px-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl">
              <span className="font-bold">10 RAZONES </span>POR QUÉ MARINARENT
            </h2>
            <p className="py-3 md:py-5 text-base md:text-xl">
              Desde 1991, MarinaRent ha brindado una gama completa de buceo, snorkel, tours y deportes acuáticos para
              los mejores destinos de playa del mundo.
            </p>

            <ul className="flex flex-row flex-wrap font-bold text-sm sm:text-base md:text-lg text-gray-700">
              {[
                "Más de 30 años de experiencia",
                "Embajadores ambientales",
                "Expansión global",
                "Familia y grupos",
                "Altos estándares de seguridad",
                "Amplia cartera de experiencias",
                "Calidad y atención al cliente",
                "Equipo de primera categoría",
                "Flota totalmente equipada",
                "Instructores plurilingües",
              ].map((text, index) => (
                <li key={index} className="w-full sm:w-1/2 py-2 md:py-3 flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <img src="barcoPortada.jpg" alt="Barco Marina Rent" className="w-full h-auto object-cover" />
          </div>
        </section>

        {/* Segunda sección - Publicaciones Aleatorias */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-blue-900">
              Publicaciones Destacadas
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {publicaciones.map((publicacion) => (
                  <div
                    key={publicacion.id}
                    className="flex flex-col items-center rounded-lg bg-white p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    onClick={() => {navigate("/mostrador", { state: { elemento:publicacion } })}}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="relative w-full">
                      <img
                        src={obtenerPrimeraImagen(publicacion.imagen) || "/placeholder.svg"}
                        alt={publicacion.titulo}
                        className="w-full h-48 sm:h-50 object-cover rounded mb-4 md:mb-6 hover:blur-sm scale-[1.01] transition duration-1000"
                        onError={(e) => {
                          // Imagen de respaldo si falla la carga
                          e.target.src = "placeholder.jpg"
                        }}
                      />

                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-blue-700 line-clamp-1">
                      {publicacion.titulo}
                    </h3>
                    <p className="text-center text-sm md:text-base text-gray-600 mt-2 line-clamp-3">
                      {publicacion.descripcion}
                    </p>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <MarbellaMap />
      </main>
    </>
  )
}
