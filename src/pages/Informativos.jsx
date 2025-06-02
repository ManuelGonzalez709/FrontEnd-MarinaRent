/**
 * @file Informativos.jsx
 * @description Página para mostrar publicaciones de tipo informativo con búsqueda, filtrado y paginación.
 */

import { useState, useEffect } from "react"
import { API_URL, IMAGE_URL } from "../utilities/apirest"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Buscador from "../components/buscador"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Página de publicaciones informativas.
 * Permite buscar, filtrar por fecha, paginar y navegar a la vista de detalle.
 * @component
 * @returns {JSX.Element}
 */
export default function Informativos() {
    /**
     * Lista de elementos informativos cargados desde la API.
     *   {[Array, Function]}
     */
    const [elementos, setElementos] = useState([])
    /**
     * Estado de carga de la página.
     *   {[boolean, Function]}
     */
    const [loading, setLoading] = useState(true)
    /**
     * Término de búsqueda.
     *   {(string|Function)[]}
     */
    const [searchTerm, setSearchTerm] = useState("")
    /**
     * Filtro de fecha seleccionado.
     *   {(string|Function)[]}
     */
    const [filterDate, setFilterDate] = useState("")
    /**
     * Página actual de la paginación.
     *   {[number, Function]}
     */
    const [currentPage, setCurrentPage] = useState(1)
    /**
     * Total de páginas disponibles.
     *   {[number, Function]}
     */
    const [totalPages, setTotalPages] = useState(1)
    /**
     * Hook de navegación de React Router.
     */
    const navigate = useNavigate()

    /**
     * Efecto para cargar elementos al cambiar de página.
     */
    useEffect(() => {
        cargarElementos(currentPage)
    }, [currentPage])

    /**
     * Carga los elementos informativos desde la API.
     * @param {number} pagina - Página a cargar.
     */
    function cargarElementos(pagina) {
        setLoading(true)
        const url = API_URL + "api/informativosPaginados"
        const token = localStorage.getItem("authToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        axios
            .post(url, { pagina }, { headers })
            .then((response) => {
                if (response.data.success) {
                    setElementos(response.data.data)
                    setTotalPages(response.data.totalPages)
                }
            })
            .catch((error) => {
                console.error("Error al cargar los informativos:", error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    /**
     * Navega a la página de mostrador con el elemento seleccionado.
     * @param {Object} elemento
     */
    const handleClick = (elemento) => {
        navigate("/mostrador", { state: { elemento } })
    }

    /**
     * Formatea la fecha a formato legible en español.
     * @param {string} dateString
     * @returns {string}
     */
    function formatDate(dateString) {
        const date = new Date(dateString)
        const options = { year: "numeric", month: "long", day: "numeric" }
        return date.toLocaleDateString("es-ES", options)
    }

    /**
     * Maneja la búsqueda por término.
     * @param {string} term
     */
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1) // Reinicia a la primera página al buscar
    }

    /**
     * Maneja el filtrado por fecha.
     * @param {string} dateFilter
     */
    const handleFilter = (dateFilter) => {
        setFilterDate(dateFilter)
        setCurrentPage(1) // Reinicia a la primera página al filtrar
    }

    /**
     * Resetea los filtros y búsqueda.
     */
    const handleReset = () => {
        setSearchTerm("")
        setFilterDate("")
        setCurrentPage(1) // Reinicia a la primera página al limpiar filtros
        cargarElementos(1)
    }

    /**
     * Cambia la página actual.
     * @param {number} newPage
     */
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    /**
     * Filtra los elementos por fecha según el filtro seleccionado.
     * @param {string} fechaStr
     * @returns {boolean}
     */
    const filtrarPorFecha = (fechaStr) => {
        if (!filterDate) return true

        const fecha = new Date(fechaStr)
        const hoy = new Date()

        switch (filterDate) {
            case "today":
                return fecha.toDateString() === hoy.toDateString()
            case "week": {
                const primerDiaSemana = new Date(hoy)
                primerDiaSemana.setDate(hoy.getDate() - hoy.getDay())
                const ultimoDiaSemana = new Date(primerDiaSemana)
                ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6)
                return fecha >= primerDiaSemana && fecha <= ultimoDiaSemana
            }
            case "month":
                return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
            case "year":
                return fecha.getFullYear() === hoy.getFullYear()
            default:
                return true
        }
    }

    /**
     * Elementos filtrados por fecha y búsqueda.
     * Solo muestra eventos futuros o actuales.
     */
    const elementosFiltrados = elementos
        // Primero: filtrar publicaciones futuras o actuales
        .filter((elemento) => {
            const fechaEvento = new Date(elemento.fecha_evento)
            const hoy = new Date()
            hoy.setHours(0, 0, 0, 0) // para ignorar la hora
            return fechaEvento >= hoy
        })
        // Segundo: aplicar filtro de búsqueda y fecha
        .filter((elemento) => {
            const coincideBusqueda = elemento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            const coincideFecha = filtrarPorFecha(elemento.fecha_evento)
            return coincideBusqueda && coincideFecha
        })

    /**
     * Efecto para intentar cargar más datos si el filtrado no arroja resultados y hay más páginas.
     */
    useEffect(() => {
        if (searchTerm || filterDate) {
            if (elementosFiltrados.length === 0 && currentPage < totalPages) {
                setCurrentPage(currentPage + 1)
            }
        }
    }, [elementosFiltrados.length])

    /**
     * Renderiza los botones de paginación.
     * @returns {JSX.Element}
     */
    const renderPaginationButtons = () => {
        return (
            <div className="flex justify-center items-center mt-8 gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Publicaciones de Tipo Informativo</h1>
                    <p className="text-gray-500 text-sm">Encuentra información actualizada sobre eventos y noticias gratuitos</p>
                </div>

                {/* Buscador de publicaciones y filtros */}
                <div className="mb-10">
                    <Buscador onSearch={handleSearch} onFilter={handleFilter} onReset={handleReset} />
                </div>

                {/* Loader de carga */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Grid de elementos filtrados */}
                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {elementosFiltrados.length > 0 ? (
                                elementosFiltrados.map((elemento) => (
                                    <div
                                        key={elemento.id}
                                        className="group relative cursor-pointer"
                                        onClick={() => handleClick(elemento)}
                                    >
                                        {/* Imagen principal del elemento */}
                                        <img
                                            src={IMAGE_URL + elemento.imagen.split(";")[0] || "/placeholder.svg"}
                                            alt={elemento.titulo}
                                            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                        />
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                {/* Título y fecha del evento */}
                                                <h3 className="text-sm text-gray-700">{elemento.titulo}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{formatDate(elemento.fecha_evento)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Mensaje cuando no hay resultados
                                <div className="col-span-full text-center py-10">
                                    <p className="text-gray-500">
                                        No se encontraron resultados que coincidan con los criterios de búsqueda.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Controles de paginación */}
                        {!loading && totalPages > 1 && <div className="mt-10">{renderPaginationButtons()}</div>}
                    </>
                )}
            </div>
        </div>
    )
}
