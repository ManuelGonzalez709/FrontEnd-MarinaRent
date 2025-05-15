"use client"

import { useEffect, useState } from "react"
import { Search, Calendar } from "lucide-react"
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

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReserva, setSelectedReserva] = useState(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [reservaToCancel, setReservaToCancel] = useState(null)

  useEffect(() => {
    fetchReservas()
  }, [])

  const fetchReservas = () => {
    setLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .get(API_URL + "api/obtenerReservasDetalladas", { headers })
      .then((response) => {
        setReservas(response.data)
      })
      .catch((error) => {
        console.error("Error al cargar las reservas:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleEditClick = (reservation) => {
    // Get the complete reservation data if needed
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
        // Fallback to using the data we already have
        setSelectedReserva(reservation)
        setIsModalOpen(true)
      })
  }

  const handleNewReservation = () => {
    setSelectedReserva(null)
    setIsModalOpen(true)
  }

  const handleModalClose = (refresh = false) => {
    setIsModalOpen(false)
    setSelectedReserva(null)

    // Refresh the reservations list if needed
    if (refresh) {
      fetchReservas()
    }
  }

  const handleCancelReservation = (reservaId) => {
    setReservaToCancel(reservaId)
    setIsAlertDialogOpen(true)
  }

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
        fetchReservas()
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

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input type="search" placeholder="Buscar reservas..." className="pl-10 pr-4 py-2 w-full" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por fecha
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
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
                {reservas.map((reservation, i) => (
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

          {/* Reservation Modal */}
          <ReservasModal
            isOpen={isModalOpen}
            setIsOpen={(open) => {
              if (!open) handleModalClose()
              else setIsModalOpen(open)
            }}
            reserva={selectedReserva}
            onCancelReservation={handleCancelReservation}
          />

          {/* Confirmation Dialog for Cancellation */}
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
    