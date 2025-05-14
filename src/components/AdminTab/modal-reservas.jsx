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
import { AlertCircle, Mail, BookOpen, Calendar, AlertTriangle } from "lucide-react"

export default function ReservasModal({ isOpen, setIsOpen, reserva, onCancelReservation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    usuario_id: "",
    publicacion_id: "",
    fecha_reserva: "",
    total_pagar: "",
    personas: "",
  })
  const [horaInicio, setHoraInicio] = useState(0)
  const [hora, setHora] = useState(15)
  const [disponibilidadHora, setDisponibilidadHora] = useState(true)
  const [horaPasada, setHoraPasada] = useState(false)
  const [personasDisponibles, setPersonasDisponibles] = useState(4)
  const [notificarCambio, setNotificarCambio] = useState(true)
  const [emailUsuario, setEmailUsuario] = useState("")
  const [publicacionTitulo, setPublicacionTitulo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [confirmSaveDialogOpen, setConfirmSaveDialogOpen] = useState(false)

  useEffect(() => {
    if (!reserva || !isOpen) return

    const fetchData = async () => {
      try {
        let currentReserva = reserva
        console.log("Reserva recibida:", reserva)
        // Si sólo tenemos un ID y no todos los datos de reserva
        if (typeof reserva === "number") {
          const res = await axios.get(`${API_URL}api/reservas/${reserva}`)
          currentReserva = res.data
        }

        // Fecha y hora
        const formattedDate = currentReserva.fecha_reserva?.split(" ")[0] || ""
        const formattedTime = Number.parseInt(currentReserva.fecha_reserva?.split(" ")[1]?.split(":")[0]) || 15
        setHora(formattedTime)
        setHoraInicio(formattedTime)

        // Actualiza form
        setFormData({
          id: currentReserva.id,
          usuario_id: currentReserva.usuario_id?.toString() || "",
          publicacion_id: currentReserva.publicacion_id?.toString() || "",
          fecha_reserva: formattedDate,
          total_pagar: currentReserva.total_pagar?.toString() || "",
          personas: currentReserva.personas?.toString() || "",
        })

        // Establecer el número de personas seleccionadas
        if (currentReserva.personas) {
          handlePersonasChange(currentReserva.personas)
        }

        // Email
        if (currentReserva.email_usuario) {
          setEmailUsuario(currentReserva.email_usuario)
        } else if (currentReserva.usuario_id) {
          fetchUserEmail(currentReserva.usuario_id)
        }
        // Publicación
        if (currentReserva.titulo_publicacion) {
          setPublicacionTitulo(currentReserva.titulo_publicacion)
        } else if (currentReserva.publicacion_id) {
          fetchPublicationTitle(currentReserva.publicacion_id)
        }
        checkCapacity(currentReserva.publicacion_id)
      } catch (error) {
        console.error("Error al cargar datos de la reserva", error)
      }
    }

    fetchData()
  }, [reserva, isOpen])

  useEffect(() => {
    if (!formData.fecha_reserva || !formData.publicacion_id) return
    const checkHora = async () => {
      try {
        // Verificar si la hora ya ha pasado
        const horaRes = await axios.get(API_URL + "api/horaFecha")
        if (horaRes.data.fecha === formData.fecha_reserva) {
          const horaActual = Number.parseInt(horaRes.data.hora.split(":")[0], 10)
          setHoraPasada(horaActual >= hora)
        } else {
          setHoraPasada(false)
        }
        console.log("Hora actual:", hora, "Hora Inicio:", horaInicio)
        if (hora != horaInicio) checkTimeAvailability(formData.publicacion_id, hora)
        else setDisponibilidadHora(true)
      } catch (error) {
        console.error("Error al comprobar hora y disponibilidad:", error)
      }
    }

    checkHora()
  }, [hora, formData.fecha_reserva, formData.publicacion_id])

  const checkTimeAvailability = (publicacionId, hora) => {
    console.log("Comprobando disponibilidad de hora:", publicacionId, hora)
    if (!publicacionId) return
    const url = API_URL + "api/disponibilidadReserva"
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(url, { idPublicacion: publicacionId, horaReserva: hora + ":00" }, { headers })
      .then((response) => {
        console.log("Disponibilidad de hora:", response.data)
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
        console.log("Capacidad disponible:", response.data)
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
        console.log(response)
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
    setConfirmSaveDialogOpen(true)
  }

  const intercambiarFechas = (publicationId,fecha) => {
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
    .post(`${API_URL}api/intercambiarFechas`, { id: publicationId,nueva_fecha_reserva:fecha }, { headers })
      .then((response) => {
        if (response.status == 200) 
          return         
      })
      .catch((error) => {
        console.error("Error al obtener título de publicación:", error)
      })
  }
 

  const confirmSave = () => {
    setIsLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const horaFormateada = hora.toString().padStart(2, "0")
    const dataToSubmit = {
      ...formData,
      id: formData.id,
      usuario_id: Number.parseInt(formData.usuario_id),
      publicacion_id: Number.parseInt(formData.publicacion_id),
      total_pagar: Number.parseFloat(formData.total_pagar),
      personas: Number.parseInt(formData.personas),
      fecha_reserva: `${formData.fecha_reserva} ${horaFormateada}:00:00`,
      notificar: notificarCambio,
    }
    if(!disponibilidadHora)intercambiarFechas(formData.id,dataToSubmit.fecha_reserva)
    setDisponibilidadHora(true)
    const url = `${API_URL}api/actualizarReservas`

    axios
      .post(url, dataToSubmit, { headers })
      .then((response) => {
        console.log("Reserva guardada", response.data)
        setIsOpen(false)
      })
      .catch((error) => {
        console.error("Error al guardar reserva", error)
      })
      .finally(() => {
        setIsLoading(false)
        setConfirmSaveDialogOpen(false)
      })
  }

  const handleCancelReservation = () => {
    if (reserva && onCancelReservation) {
      onCancelReservation(reserva.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="w-[1000px] !max-w-none">
        <DialogHeader>
          <DialogTitle>{reserva ? "Editar Reserva" : "Nueva Reserva"}</DialogTitle>
          <DialogDescription>
            {reserva ? "Modifica la información de la reserva seleccionada." : "Crea una nueva reserva."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario</label>
              <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{emailUsuario}</span>
              </div>
            </div>

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

            <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha de Reserva</label>
            <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">{formData.fecha_reserva}</span>
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
                <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                  <AlertCircle className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Atención</p>
                    <p className="text-sm">Esta hora ya está reservada la hora será intercambiada.</p>
                  </div>
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
                personasDisponibles > 0 ? (
                  <SelectorPersonas
                    personasDisponibles={personasDisponibles}
                    setPersonas={handlePersonasChange}
                    selected={formData.personas?.toString()}
                  />
                ) : (
                  <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-200 text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Aforo completo. No es posible cambiar el número de personas.</span>
                  </div>
                )
              ) : (
                <Select
                  value={formData.personas}
                  onValueChange={(value) => setFormData((prevData) => ({ ...prevData, personas: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona número de personas" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} persona{n > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {mensaje && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                <span>{mensaje}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <div className="flex gap-2">
            {isLoading ? (
              <Button disabled>Guardando...</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handleSave} disabled={reserva && horaPasada}>
                  Guardar cambios
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
      {/* Diálogo de confirmación para guardar */}
      <Dialog open={confirmSaveDialogOpen} onOpenChange={setConfirmSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirmar cambios
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro que deseas guardar los cambios en esta reserva?
              {!disponibilidadHora && (
                <span className="block mt-2 font-medium text-yellow-600">
                  Recuerda que la hora seleccionada ya está reservada y será intercambiada.
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSave} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Sí, guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
