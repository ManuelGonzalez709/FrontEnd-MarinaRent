"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsuariosModal({ isOpen, setIsOpen, user, isProfileEdit = false }) {
  const [isLoading, setIsLoading] = useState(false)
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState(false)
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellidos: "",
    Fecha_nacimiento: "",
  })

  useEffect(() => {
    if (user) {
        console.log("user", user)
      setFormData({
        id_usuario: user.id,
        Nombre: user.Nombre,
        Apellidos: user.Apellidos,
        Fecha_nacimiento: user.Fecha_nacimiento,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSave = () => {
    setIsLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    if (user != null) {
      axios
        .post(`${API_URL}api/usuarios/actualizar`, formData, { headers })
        .then((response) => {
          console.log("Usuario actualizado", response.data)
          setIsOpen(false) // Cerrar el modal
        })
        .catch((error) => {
          console.error("Error al actualizar usuario", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      axios
        .post(`${API_URL}api/usuarios`, formData, { headers })
        .then((response) => {
          console.log("Usuario guardado", response.data)
          setIsOpen(false) // Cerrar el modal
        })
        .catch((error) => {
          console.error("Error al actualizar usuario", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const handleResetPassword = () => {
    setResetPasswordLoading(true)
    setResetSuccess(false)
    setResetError(false)

    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(`${API_URL}api/enviar-restablecimiento`, { email: user.Email }, { headers })
      .then((response) => {
        console.log("Solicitud de restablecimiento enviada", response.data)
        setResetSuccess(true)
      })
      .catch((error) => {
        console.error("Error al solicitar restablecimiento", error)
        setResetError(true)
      })
      .finally(() => {
        setResetPasswordLoading(false)
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>Modifica tu información personal.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
          <Input name="Nombre" value={formData.Nombre} onChange={handleChange} />
          <label className="text-sm font-medium text-gray-700 mb-1 block">Apellidos</label>
          <Input name="Apellidos" value={formData.Apellidos} onChange={handleChange} />
          <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha de Nacimiento</label>
          <Input name="Fecha_nacimiento" type="date" value={formData.Fecha_nacimiento} onChange={handleChange} />

          {user && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Seguridad</h3>
              {resetSuccess && (
                <Alert className="mb-3 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-700">
                    Se ha enviado un correo para restablecer tu contraseña.
                  </AlertDescription>
                </Alert>
              )}
              {resetError && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error al enviar la solicitud. Inténtalo de nuevo.</AlertDescription>
                </Alert>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResetPassword}
                disabled={resetPasswordLoading}
              >
                {resetPasswordLoading ? "Enviando..." : "Restablecer contraseña"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Se enviará un enlace a tu correo electrónico para restablecer tu contraseña.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {isLoading ? (
            <Button variant="outline">Guardando...</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar cambios</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
