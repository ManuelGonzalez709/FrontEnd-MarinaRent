import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@headlessui/react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { API_URL } from '../../utilities/apirest';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UsuariosModal from './modal-usuarios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        axios.get(API_URL + "api/usuarios", { headers })
            .then((response) => { setUsuarios(response.data); console.log(response.data); })
            .catch((error) => { console.error("Error al cargar los informativos:", error); })
            .finally(() => { setLoading(false); });
    }, [isModalOpen,confirmDialogOpen]);

    const handleEditClick = (user) => {
        setSelectedUser(user); // Guardar el usuario seleccionado
        setIsModalOpen(true); // Abrir el modal
    };

    const handleEnviarRestablecimientoClick = (user) => {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        axios.post(API_URL + "api/enviar-restablecimiento", { email: user.Email }, { headers })
            .then((response) => { console.log(response) })
            .catch((error) => { console.error("Error al cargar los informativos:", error); })
    };

    const handleDelete = () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios.delete(`${API_URL}api/usuarios/${userToDelete.id}`, { headers })
            .then(() => {
                setUsuarios((prev) => prev.filter((u) => u.id !== userToDelete.id));
                setConfirmDialogOpen(false);
                setUserToDelete(null);
            })
            .catch((error) => {
                console.error("Error al eliminar usuario:", error);
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };


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
                            <Input type="search" placeholder="Buscar usuarios..." className="pl-10 pr-4 py-2 w-full" />
                        </div>
                        <Button
                            size="sm"
                            onClick={() => handleEditClick(null)} // Llamar a la función cuando se haga clic en Editar
                        >
                            Añadir Usuario
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nacimiento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restablecer Contraseña</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {usuarios.map((user, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {user.Nombre.split(" ").map((n) => n[0]).join("")}
                                                            {user.Apellidos.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.Nombre}</div>
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

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEnviarRestablecimientoClick(user)} // Llamar a la función cuando se haga clic en Editar
                                            >
                                                Enviar Restablecimiento
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-1 justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditClick(user)} // Llamar a la función cuando se haga clic en Editar
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setConfirmDialogOpen(true);
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
                </>
            )}
            {isModalOpen && (
                <UsuariosModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    user={selectedUser}
                />
            )}

            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 12v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
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
    );
}
