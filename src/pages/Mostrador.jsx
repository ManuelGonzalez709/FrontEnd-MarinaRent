/**
 * @file Mostrador.jsx
 * @description Página de detalle de una publicación seleccionada. Permite ver información, imágenes, seleccionar hora y personas, y añadir al carrito si es reservable.
 */


import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { API_URL, IMAGE_URL } from "../utilities/apirest"
import TimeSlider from "../components/time-slider"
import SelectorPersonas from "../components/person-chooser"
import axios from "axios"

/**
 * Componente de detalle de publicación (Mostrador).
 * Muestra información, imágenes, permite seleccionar hora/personas y añadir al carrito.
 * @component
 * @param {Object} props
 * @param {Array} props.cart - Carrito de compras global.
 * @param {Function} props.setCart - Setter para actualizar el carrito.
 * @returns {JSX.Element}
 */
export default function Mostrador({ cart, setCart }) {
  /**
   * Hook de React Router para obtener el estado de navegación.
   */
  const location = useLocation()
  /**
   * Hook de navegación para redireccionar.
   */
  const navigate = useNavigate()
  /**
   * Hora seleccionada para la reserva.
   *   {[number, Function]}
   */
  const [hora, setHora] = useState(15)
  /**
   * Indica si la hora seleccionada está disponible.
   *   {[boolean, Function]}
   */
  const [disponibilidadHora, setDisponibilidadHora] = useState(true)
  /**
   * Número de personas seleccionadas.
   *   {[number, Function]}
   */
  const [personas, setPersonas] = useState(1)
  /**
   * Número máximo de personas disponibles para reservar.
   *   {[number, Function]}
   */
  const [personasDisponibles, setPersonasDisponibles] = useState(4)
  /**
   * Estado de carga de la página.
   *   {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true)
  /**
   * Indica si el producto ya fue añadido al carrito.
   *   {[boolean, Function]}
   */
  const [añadido, setAñadido] = useState(false)
  /**
   * Precio total calculado según personas.
   *   {[number, Function]}
   */
  const [precioTotal, setPrecioTotal] = useState()
  /**
   * Indica si la hora seleccionada ya ha pasado.
   *   {[boolean, Function]}
   */
  const [horaPasada, setHoraPasada] = useState(false)

  // Si no hay elemento en el estado de navegación, no renderiza nada
  if (!location.state || !location.state.elemento) return null

  // Obtiene el elemento seleccionado desde la navegación
  const { elemento } = location.state

  /**
   * Efecto para mostrar en consola el número de personas seleccionadas.
   */
  useEffect(() => {
    console.log("Personas seleccionadas: ", personas)
  }, [personas])

  /**
   * Efecto para comprobar si el producto ya está en el carrito.
   */
  useEffect(() => {
    const existeEnCarrito = cart.some((item) => item.id === elemento.id)
    setAñadido(existeEnCarrito)
  }, [cart, elemento, hora])

  /**
   * Efecto para obtener la capacidad máxima disponible para la publicación.
   */
  useEffect(() => {
    const url = API_URL + "api/capacidadDisponible"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .post(url, { idPublicacion: elemento.id }, { headers })
      .then((response) => {
        setPersonasDisponibles(response.data.max_reservables)
      })
      .catch((error) => {
        console.error("Error al cargar la capacidad disponible:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [personasDisponibles])

  /**
   * Efecto para actualizar el precio total al cambiar el número de personas.
   */
  useEffect(() => {
    setPrecioTotal(elemento.precio * personas)
  }, [personas])

  /**
   * Efecto para comprobar si la hora seleccionada ya ha pasado según la fecha/hora del servidor.
   */
  useEffect(() => {
    axios
      .get(API_URL + "api/horaFecha")
      .then((response) => {
        if (response.data.fecha == elemento.fecha_evento.split(" ")[0]) {
          const horaEntera = Number.parseInt(response.data.hora.split(":")[0], 10)
          setHoraPasada(!(horaEntera < hora))
        } else setHoraPasada(false)
      })
      .catch((error) => {
        console.error("Error al comprobar hora pasada:", error)
      })
  }, [disponibilidadHora, hora])

  /**
   * Efecto para comprobar la disponibilidad de la hora seleccionada.
   */
  useEffect(() => {
    const url = API_URL + "api/disponibilidadReserva"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .post(url, { idPublicacion: elemento.id, horaReserva: hora + ":00" }, { headers })
      .then((response) => {
        setDisponibilidadHora(response.data.disponible)
      })
      .catch((error) => {
        console.error("Error al comprobar disponibilidad de hora:", error)
      })
  }, [hora, disponibilidadHora])

  /**
   * Efecto para redirigir si no hay elemento en el estado de navegación.
   */
  useEffect(() => {
    if (!location.state || !location.state.elemento) navigate("/notFound")
  }, [location.state, navigate])

  /**
   * Maneja el evento de añadir el producto al carrito.
   * @param {React.FormEvent} e
   */
  const handleAddToCart = (e) => {
    e.preventDefault()
    if (disponibilidadHora) {
      const nuevoElemento = {
        ...elemento,
        horaReserva: hora,
        precio: precioTotal,
        personas: Number.parseInt(personas),
      }
      setCart((prev) => [...prev, nuevoElemento])
      setAñadido(true)
    }
  }

  /**
   * Formatea una fecha a formato legible en español.
   * @param {string} dateString
   * @returns {string}
   */
  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("es-ES", options)
  }

  // Array de imágenes del elemento
  const imagenes = elemento.imagen.split(";")

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumb de navegación */}
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div className="flex items-center">
                <p className="mr-2 text-sm font-medium text-gray-900">
                  Publicaciones
                </p>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a href={"/" + elemento.tipo + "s"} className="mr-2 text-sm font-medium text-gray-900 capitalize">
                  {elemento.tipo + "s"}
                </a>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <p aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {elemento.titulo}
              </p>
            </li>
          </ol>
        </nav>

        {/* Galería de imágenes del producto */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <img
            src={IMAGE_URL + imagenes[0] || "/placeholder.svg"}
            alt="Imagen principal"
            className="hidden size-full rounded-lg object-cover lg:block"
          />
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <img
              src={IMAGE_URL + imagenes[1] || "/placeholder.svg"}
              alt="Imagen secundaria 1"
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
            <img
              src={IMAGE_URL + imagenes[2] || "/placeholder.svg"}
              alt="Imagen secundaria 2"
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
          </div>
          <img
            src={IMAGE_URL + imagenes[3] || "/placeholder.svg"}
            alt="Imagen secundaria 3"
            className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
          />
        </div>

        {/* Información y formulario de reserva */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{elemento.titulo}</h1>
          </div>
          {/* Loader de carga */}
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              {/* Si el producto es reservable muestra el formulario, si es informativo muestra mensaje */}
              {elemento.tipo !== "informativo" ? (
                <form className="mt-5" onSubmit={handleAddToCart}>
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900">${precioTotal}</p>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Momento del Día</h3>
                    {/* Slider de selección de hora */}
                    <TimeSlider
                      id={elemento.id}
                      setHora={setHora}
                      hora={hora}
                      disponible={disponibilidadHora}
                      horaPasada={horaPasada}
                    />
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Personas</h3>
                    </div>
                    {/* Selector de personas */}
                    <SelectorPersonas personasDisponibles={personasDisponibles} setPersonas={setPersonas} />
                  </div>

                  {/* Mensaje de añadido al carrito */}
                  {añadido && <p className="mt-4 text-green-600 font-medium text-center">Añadido al carrito</p>}

                  {/* Botón de añadir al carrito, solo si hay disponibilidad y la hora no ha pasado */}
                  {disponibilidadHora && personasDisponibles > 0 && !añadido && !horaPasada ? (
                    <button
                      type="submit"
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                    >
                      Añadir al Carrito
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-300 px-8 py-3 text-base font-medium text-white cursor-not-allowed"
                    >
                      Añadir al Carrito
                    </button>
                  )}
                </form>
              ) : (
                // Si es informativo, muestra mensaje
                <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 font-medium">Este producto no está disponible para alquiler</p>
                  <p className="text-gray-500 text-sm mt-2">Este artículo es de tipo informativo</p>
                </div>
              )}
            </div>
          )}

          {/* Descripción y detalles del producto */}
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{elemento.descripcion}</p>
              </div>
              <div className="space-y-6 mt-4">
                <p className="text-base text-gray-500">{formatDate(elemento.fecha_evento)}</p>
              </div>
            </div>

            {/* Lista de highlights */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  <li className="text-gray-400 flex items-center">
                    <i className="fas fa-sun text-yellow-500 mr-2"></i>
                    <span className="text-gray-600">Te lo Pasarás de Lujo</span>
                  </li>
                  <li className="text-gray-400 flex items-center">
                    <i className="fas fa-money-check-alt text-green-500 mr-2"></i>
                    <span className="text-gray-600">100% Reembolsable</span>
                  </li>
                  <li className="text-gray-400 flex items-center">
                    <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
                    <span className="text-gray-600">Portal de compra 100% seguro</span>
                  </li>
                  <li className="text-gray-400 flex items-center">
                    <i className="fas fa-times-circle text-red-500 mr-2"></i>
                    <span className="text-gray-600">Cancela cuando Quieras</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Detalles</h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  Disfruta de tu día en la playa con nuestros artículos de alquiler, pensados para ofrecerte la máxima
                  comodidad y funcionalidad. Todos nuestros productos están cuidadosamente seleccionados para adaptarse
                  a tus necesidades, ya sea que busques relajarte bajo el sol, practicar actividades acuáticas o
                  disfrutar de un paseo junto al mar. Reserva el tuyo con antelación y asegúrate de tener lo mejor para
                  tu experiencia costera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
