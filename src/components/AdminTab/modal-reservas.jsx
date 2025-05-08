"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import axios from "axios"
import { API_URL } from "../../utilities/apirest"
import TimeSlider from "../time-slider"
import SelectorPersonas from "../person-chooser"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, BookOpen } from "lucide-react"

export default function ReservasModal({ isOpen, setIsOpen, reserva, onCancelReservation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    usuario_id: "",
    publicacion_id: "",
    fecha_reserva: "",
    total_pagar: "",
    personas: "",
  })
  const [hora, setHora] = useState(15)
  const [disponibilidadHora, setDisponibilidadHora] = useState(true)
  const [horaPasada, setHoraPasada] = useState(false)
  const [personasDisponibles, setPersonasDisponibles] = useState(4)
  const [notificarCambio, setNotificarCambio] = useState(false)
  const [emailUsuario, setEmailUsuario] = useState("")
  const [publicacionTitulo, setPublicacionTitulo] = useState("")

  // Load reservation data when the component receives a reservation
  useEffect(() => {
    if (reserva) {
      // Format the date to be compatible with the datetime-local input
      const formattedDate = reserva.fecha_reserva ? reserva.fecha_reserva.split(" ")[0] : ""
      const formattedTime = reserva.fecha_reserva
        ? Number.parseInt(reserva.fecha_reserva.split(" ")[1].split(":")[0])
        : 15

      setHora(formattedTime)

      setFormData({
        id: reserva.id,
        usuario_id: reserva.usuario_id?.toString() || "",
        publicacion_id: reserva.publicacion_id?.toString() || "",
        fecha_reserva: formattedDate,
        total_pagar: reserva.total_pagar?.toString() || "",
        personas: reserva.personas?.toString() || "",
      })

      // Fetch user email if available
      if (reserva.email_usuario) {
        setEmailUsuario(reserva.email_usuario)
      } else if (reserva.usuario_id) {
        fetchUserEmail(reserva.usuario_id)
      }

      // Fetch publication title if available
      if (reserva.titulo_publicacion) {
        setPublicacionTitulo(reserva.titulo_publicacion)
      } else if (reserva.publicacion_id) {
        fetchPublicationTitle(reserva.publicacion_id)
      }

      checkTimeAvailability(reserva.publicacion_id, formattedTime)
      checkCapacity(reserva.publicacion_id)
    } else {
      // Reset form when creating a new reservation
      setFormData({
        usuario_id: "",
        publicacion_id: "",
        fecha_reserva: "",
        total_pagar: "",
        personas: "",
      })
      setEmailUsuario("")
      setPublicacionTitulo("")
    }
  }, [reserva, isOpen,hora])

  // Check if the selected time is in the past
  useEffect(() => {
    if (reserva && formData.fecha_reserva) {
      axios
        .get(API_URL + "api/horaFecha")
        .then((response) => {
          if (response.data.fecha === formData.fecha_reserva) {
            const horaEntera = Number.parseInt(response.data.hora.split(":")[0], 10)
            if (horaEntera < hora) setHoraPasada(false)
            else setHoraPasada(true)
          } else setHoraPasada(false)
        })
        .catch((error) => {
          console.error("Error al comprobar la hora:", error)
        })
    }
  }, [hora, formData.fecha_reserva, reserva])

  // Check time availability when hour changes
  useEffect(() => {
    if (reserva && formData.publicacion_id) {
      checkTimeAvailability(formData.publicacion_id, hora)
    }
  }, [hora, reserva])

  const checkTimeAvailability = (publicacionId, hora) => {
    if (!publicacionId) return

    const url = API_URL + "api/disponibilidadReserva"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(url, { idPublicacion: publicacionId, horaReserva: hora + ":00" }, { headers })
      .then((response) => {
        console.log("Disponibilidad de Hora --> "+response.data+" "+ publicacionId, hora + ":00")
        setDisponibilidadHora(response.data.disponible)
      })
      .catch((error) => {
        console.error("Error al comprobar disponibilidad:", error)
      })
  }

  const checkCapacity = (publicacionId) => {
    if (!publicacionId) return

    const url = API_URL + "api/capacidadDisponible"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(url, { idPublicacion: publicacionId }, { headers })
      .then((response) => {
        console.log("Disponibilidad de Personas --> "+response.data+" "+ publicacionId)
        setPersonasDisponibles(response.data.max_reservables)
      })
      .catch((error) => {
        console.error("Error al comprobar capacidad:", error)
      })
  }

  const fetchUserEmail = (userId) => {
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .get(`${API_URL}api/usuarios/${userId}`, { headers })
      .then((response) => {
        if (response.data && response.data.Email) {
          setEmailUsuario(response.data.Email)
        }
      })
      .catch((error) => {
        console.error("Error al obtener email de usuario:", error)
      })
  }

  const fetchPublicationTitle = (publicationId) => {
    axios
      .get(`${API_URL}api/publicaciones/${publicationId}`)
      .then((response) => {
        if (response.data && response.data.titulo) {
          setPublicacionTitulo(response.data.titulo)
        }
      })
      .catch((error) => {
        console.error("Error al obtener título de publicación:", error)
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handlePersonasChange = (value) => {
    setFormData((prevData) => ({ ...prevData, personas: value }))
  }

  const handleSave = () => {
    setIsLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    // Prepare data for submission
    const dataToSubmit = {
      ...formData,
      usuario_id: Number.parseInt(formData.usuario_id),
      publicacion_id: Number.parseInt(formData.publicacion_id),
      total_pagar: Number.parseFloat(formData.total_pagar),
      personas: Number.parseInt(formData.personas),
      fecha_reserva: `${formData.fecha_reserva} ${hora}:00:00`,
      notificar: notificarCambio,
    }

    if (reserva) {
      // Update existing reservation
      axios
        .post(`${API_URL}api/reservas/actualizar`, dataToSubmit, { headers })
        .then((response) => {
          console.log("Reserva actualizada", response.data)
          setIsOpen(false) // Close the modal
        })
        .catch((error) => {
          console.error("Error al actualizar reserva", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // Create new reservation
      axios
        .post(`${API_URL}api/reservas`, dataToSubmit, { headers })
        .then((response) => {
          console.log("Reserva guardada", response.data)
          setIsOpen(false) // Close the modal
        })
        .catch((error) => {
          console.error("Error al crear reserva", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const handleCancelReservation = () => {
    if (reserva && onCancelReservation) {
      onCancelReservation(reserva.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="max-w-6xl w-[9000px]">
        <DialogHeader>
          <DialogTitle>{reserva ? "Editar Reserva" : "Nueva Reserva"}</DialogTitle>
          <DialogDescription>
            {reserva ? "Modifica la información de la reserva seleccionada." : "Crea una nueva reserva."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Usuario (read-only email) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario</label>
              {emailUsuario ? (
                <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">{emailUsuario}</span>
                </div>
              ) : (
                <Input
                  name="usuario_id"
                  type="number"
                  value={formData.usuario_id}
                  onChange={handleChange}
                  placeholder="ID de usuario"
                />
              )}
            </div>

            {/* Publicación (read-only title) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Publicación</label>
              {publicacionTitulo ? (
                <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
                  <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">{publicacionTitulo}</span>
                </div>
              ) : (
                <Input
                  name="publicacion_id"
                  type="number"
                  value={formData.publicacion_id}
                  onChange={handleChange}
                  placeholder="ID de publicación"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha de Reserva</label>
              <Input name="fecha_reserva" type="date" value={formData.fecha_reserva} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Total a Pagar</label>
              <Input name="total_pagar" type="number" value={formData.total_pagar} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="notificar" checked={notificarCambio} onCheckedChange={setNotificarCambio} />
              <Label htmlFor="notificar" className="text-sm font-medium text-gray-700">
                Notificar cambio al usuario
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hora de Reserva</label>
              {reserva && (
                <TimeSlider
                  id={formData.publicacion_id}
                  hora={hora}
                  setHora={setHora}
                  disponible={disponibilidadHora}
                  horaPasada={horaPasada}
                />
              )}

              {!disponibilidadHora && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Esta hora no está disponible</span>
                </div>
              )}

              {horaPasada && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Esta hora ya ha pasado</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Número de Personas</label>
              {reserva ? (
                <SelectorPersonas personasDisponibles={personasDisponibles} setPersonas={handlePersonasChange} />
              ) : (
                <Select
                  value={formData.personas}
                  onValueChange={(value) => setFormData((prevData) => ({ ...prevData, personas: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona número de personas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    <SelectItem value="2">2 personas</SelectItem>
                    <SelectItem value="3">3 personas</SelectItem>
                    <SelectItem value="4">4 personas</SelectItem>
                    <SelectItem value="5">5 personas</SelectItem>
                    <SelectItem value="6">6 personas</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            {reserva && (
              <Button variant="destructive" onClick={handleCancelReservation}>
                Cancelar Reserva
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <Button disabled>Guardando...</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handleSave} disabled={reserva && (!disponibilidadHora || horaPasada)}>
                  Guardar cambios
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
