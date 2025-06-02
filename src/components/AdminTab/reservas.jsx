/**
 * @file reservas.jsx
 * @description Vista de administración para listar, buscar, editar y cancelar reservas.
 * Incluye paginación, búsqueda y modales para edición/cancelación.
 */

import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { API_URL } from "../../utilities/apirest"
import ReservasModal from "./modal-reservas"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * Componente principal para la gestión de reservas.
 * Permite buscar, paginar, editar y cancelar reservas.
 * @component
 * @returns {JSX.Element}
 */
export default function Reservas() {
  /**
   * Lista de reservas cargadas.
   *   {[Array, Function]}
   */
  const [reservas, setReservas] = useState([])
  /**
   * Estado de carga.
   *   {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true)
  /**
   * Estado para mostrar el modal de edición.
   *   {[boolean, Function]}
   */
  const [isModalOpen, setIsModalOpen] = useState(false)
  /**
   * Reserva seleccionada para editar.
   *   {[Object|null, Function]}
   */
  const [selectedReserva, setSelectedReserva] = useState(null)
  /**
   * Estado para mostrar el diálogo de confirmación de cancelación.
   *   {[boolean, Function]}
   */
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  /**
   * ID de la reserva seleccionada para cancelar.
   *   {[number|null, Function]}
   */
  const [reservaToCancel, setReservaToCancel] = useState(null)
  /**
   * Estado de búsqueda.
   *   {(string|Function)[]}
   */
  const [searchQuery, setSearchQuery] = useState("")

  // Estados de paginación
  /**
   * Página actual.
   *   {[number, Function]}
   */
  const [currentPage, setCurrentPage] = useState(1)
  /**
   * Total de páginas.
   *   {[number, Function]}
   */
  const [totalPages, setTotalPages] = useState(1)

  /**
   * Efecto para cargar reservas al cambiar de página o cerrar el modal.
   */
  useEffect(() => {
    if (!isModalOpen)
      fetchReservas(currentPage)
  }, [currentPage, isModalOpen])

  /**
   * Obtiene las reservas paginadas desde la API.
   * @param {number} page
   */
  const fetchReservas = (page = 1) => {
    setLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(API_URL + "api/reservasPaginadas", { pagina: page }, { headers })
      .then((response) => {
        if (response.data.success) {
          setReservas(response.data.data)
          setCurrentPage(response.data.page)
          setTotalPages(response.data.totalPages)
        } else {
          console.error("Error en la respuesta:", response.data)
        }
      })
      .catch((error) => {
        console.error("Error al cargar las reservas:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * Maneja el click en el botón de editar reserva.
   * @param {Object} reservation
   */
  const handleEditClick = (reservation) => {
    // Obtener los datos completos de la reserva si es necesario
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .get(`${API_URL}api/reservas/${reservation.id}`, { headers })
      .then((response) => {
        setSelectedReserva(response.data)
        setIsModalOpen(true)
      })
      .catch((error) => {
        console.error("Error al obtener detalles de la reserva:", error)
        // Fallback a los datos que ya tenemos
        setSelectedReserva(reservation)
        setIsModalOpen(true)
      })
  }

  /**
   * Cierra el modal de edición y refresca la lista si es necesario.
   * @param {boolean} refresh
   */
  const handleModalClose = (refresh = false) => {
    setIsModalOpen(false)
    setSelectedReserva(null)
    // Refresca la lista si se indica
    if (refresh) {
      fetchReservas(currentPage)
    }
  }

  /**
   * Abre el diálogo de confirmación para cancelar una reserva.
   * @param {number} reservaId
   */
  const handleCancelReservation = (reservaId) => {
    setReservaToCancel(reservaId)
    setIsAlertDialogOpen(true)
  }

  /**
   * Confirma la cancelación de la reserva seleccionada.
   */
  const confirmCancelReservation = () => {
    if (!reservaToCancel) return

    setLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .delete(`${API_URL}api/reservas/${reservaToCancel}`, { headers })
      .then((response) => {
        console.log("Reserva cancelada", response.data)
        setIsModalOpen(false)
        fetchReservas(currentPage)
      })
      .catch((error) => {
        console.error("Error al cancelar la reserva:", error)
      })
      .finally(() => {
        setLoading(false)
        setIsAlertDialogOpen(false)
        setReservaToCancel(null)
      })
  }

  /**
   * Cambia la página actual de la paginación.
   * @param {number} newPage
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  /**
   * Filtra las reservas según la búsqueda.
   */
  const filteredReservas = reservas.filter(
    (reservation) =>
      reservation.nombre_usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.titulo_publicacion.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      {/* Loader mientras se cargan los datos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Barra de búsqueda */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Buscar reservas..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de reservas */}
          <div className="bg-white rounded-lg border overflow-sm-x-scroll overflow-y-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Anuncio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservas.map((reservation, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.nombre_usuario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{reservation.titulo_publicacion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{reservation.fecha_reserva.split(" ")[0]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.estado === "pendiente"
                            ? "bg-green-100 text-green-800"
                            : reservation.estado === "pasada"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reservation.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(reservation)}
                          disabled={reservation.estado === "pasada"}
                          className={reservation.estado === "pasada" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          {!searchQuery && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Modal para editar reservas */}
          <ReservasModal
            isOpen={isModalOpen}
            setIsOpen={(open) => {
              if (!open) handleModalClose()
              else setIsModalOpen(open)
            }}
            reserva={selectedReserva}
            onCancelReservation={handleCancelReservation}
          />

          {/* Diálogo de confirmación para cancelar */}
          <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cancelará la reserva y no se puede deshacer. Se notificará al usuario sobre la
                  cancelación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancelReservation} className="bg-red-600 hover:bg-red-700">
                  Confirmar cancelación
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  )
}
