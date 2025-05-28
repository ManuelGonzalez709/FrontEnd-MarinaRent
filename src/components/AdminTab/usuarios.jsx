"use client"

/**
 * @file usuarios.jsx
 * @description Vista de administración para listar, buscar, crear, editar y eliminar usuarios.
 * Incluye paginación, búsqueda, restablecimiento de contraseña y modales para edición/creación.
 */

import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { API_URL } from "../../utilities/apirest"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import UsuariosModal from "./modal-usuarios"

export default function Usuarios() {
  /**
   * Lista de usuarios cargados.
   *   {[Array, Function]}
   */
  const [usuarios, setUsuarios] = useState([])
  /**
   * Estado de carga.
   *   {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true)
  /**
   * Estado para mostrar el modal de edición/creación.
   *   {[boolean, Function]}
   */
  const [isModalOpen, setIsModalOpen] = useState(false)
  /**
   * Usuario seleccionado para editar.
   *   {[Object|null, Function]}
   */
  const [selectedUser, setSelectedUser] = useState(null)
  /**
   * Estado para mostrar el diálogo de confirmación de borrado.
   *   {[boolean, Function]}
   */
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  /**
   * Usuario seleccionado para eliminar.
   *   {[Object|null, Function]}
   */
  const [userToDelete, setUserToDelete] = useState(null)
  /**
   * Estado de carga para el borrado.
   *   {[boolean, Function]}
   */
  const [isDeleting, setIsDeleting] = useState(false)
  /**
   * Estado de búsqueda.
   *   {(string|Function)[]}
   */
  const [searchQuery, setSearchQuery] = useState("")
  /**
   * Mensaje de feedback tras acciones.
   *   {(string|Function)[]}
   */
  const [feedbackMsg, setFeedbackMsg] = useState("")

  // Pagination states
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

  useEffect(() => {
    fetchUsuarios(currentPage)
    setFeedbackMsg("")
  }, [isModalOpen, confirmDialogOpen, currentPage])

  /**
   * Obtiene los usuarios paginados desde la API.
   * @param {number} page
   */
  const fetchUsuarios = (page = 1) => {
    setLoading(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .post(API_URL + "api/usuariosPaginados", { pagina: page }, { headers })
      .then((response) => {
        if (response.data.success) {
          setUsuarios(response.data.data)
          setCurrentPage(response.data.page)
          setTotalPages(response.data.totalPages)
        } else {
          console.error("Error en la respuesta:", response.data)
        }
      })
      .catch((error) => {
        console.error("Error al cargar los usuarios:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * Abre el modal para editar o crear usuario.
   * @param {Object|null} user
   */
  const handleEditClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  /**
   * Envía un correo de restablecimiento de contraseña.
   * @param {Object} user
   */
  const handleEnviarRestablecimientoClick = (user) => {
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    axios
      .post(API_URL + "api/enviar-restablecimiento", { email: user.Email }, { headers })
      .then(() => {
        setFeedbackMsg("Correo de restablecimiento enviado correctamente.")
        setTimeout(() => setFeedbackMsg(""), 2000)
      })
      .catch((error) => {
        setFeedbackMsg("Error al enviar el correo de restablecimiento.")
        setTimeout(() => setFeedbackMsg(""), 2000)
        console.error("Error al enviar restablecimiento:", error)
      })
  }

  /**
   * Elimina el usuario seleccionado.
   */
  const handleDelete = () => {
    if (!userToDelete) return

    setIsDeleting(true)
    const token = localStorage.getItem("authToken")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios
      .delete(`${API_URL}api/usuarios/${userToDelete.id}`, { headers })
      .then(() => {
        fetchUsuarios(currentPage)
        setConfirmDialogOpen(false)
        setUserToDelete(null)
        setFeedbackMsg("Usuario eliminado correctamente.")
        setTimeout(() => setFeedbackMsg(""), 2000)
      })
      .catch((error) => {
        setFeedbackMsg("Error al eliminar usuario.")
        setTimeout(() => setFeedbackMsg(""), 2000)
        console.error("Error al eliminar usuario:", error)
      })
      .finally(() => {
        setIsDeleting(false)
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

  // Filtra usuarios según la búsqueda
  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <Input
                type="search"
                placeholder="Buscar usuarios..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={() => handleEditClick(null)}>
              Añadir Usuario
            </Button>
          </div>

          {/* Mensaje de feedback */}
          {feedbackMsg && (
            <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 border border-green-200 text-center font-medium">
              {feedbackMsg}
            </div>
          )}

          <div className="bg-white rounded-lg border overflow-sm-x-scroll overflow-y-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Nacimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restablecer Contraseña
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((user, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar>
                            <AvatarFallback>
                              {user.Nombre.split(" ")
                                .map((n) => n[0])
                                .join("")}
                              {user.Apellidos.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.Nombre} {user.Apellidos}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.Email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.Fecha_nacimiento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.Tipo === "admin" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {user.Tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => handleEnviarRestablecimientoClick(user)}>
                        Enviar Restablecimiento
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-1 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setUserToDelete(user)
                          setConfirmDialogOpen(true)
                        }}
                      >
                        Borrar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
        </>
      )}

      {isModalOpen && <UsuariosModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} user={selectedUser} />}

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
