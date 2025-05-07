import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import axios from "axios";
import { API_URL } from '../../utilities/apirest';

export default function UsuariosModal({ isOpen, setIsOpen, user }) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellidos: '',
        Email: '',
        Fecha_nacimiento: '',
        Tipo: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id_usuario: user.id,
                Nombre: user.Nombre,
                Apellidos: user.Apellidos,
                Email: user.Email,
                Fecha_nacimiento: user.Fecha_nacimiento,
                Tipo: user.Tipo
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        setIsLoading(true)
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        if (user != null) {
            axios.post(`${API_URL}api/usuarios/actualizar`, formData, { headers })
                .then((response) => {
                    console.log('Usuario actualizado', response.data);
                    setIsOpen(false); // Cerrar el modal
                })
                .catch((error) => {
                    console.error('Error al actualizar usuario', error);
                }).finally(() => {
                    setIsLoading(false);
                });
        } else {
            axios.post(`${API_URL}api/usuarios`, formData, { headers })
                .then((response) => {
                    console.log('Usuario guardado', response.data);
                    setIsOpen(false); // Cerrar el modal
                })
                .catch((error) => {
                    console.error('Error al actualizar usuario', error);
                }).finally(() => {
                    setIsLoading(false);
                });
        }

    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Modifica la información del usuario seleccionado.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                    <Input
                        label="Nombre"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                    />
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Apellidos</label>
                    <Input
                        label="Apellidos"
                        name="Apellidos"
                        value={formData.Apellidos}
                        onChange={handleChange}
                    />
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <Input
                        label="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                    />
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha de Nacimiento</label>
                    <Input
                        label="Fecha de Nacimiento"
                        name="Fecha_nacimiento"
                        type="date"
                        value={formData.Fecha_nacimiento}
                        onChange={handleChange}
                    />
                    {user === null && (
                        <>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
                            <Input
                                label="Contraseña"
                                name="Password"
                                type="password"
                                onChange={handleChange}
                            />
                        </>

                    )}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Rol</label>
                        <Select
                            value={formData.Tipo}
                            onValueChange={(value) =>
                                setFormData((prevData) => ({ ...prevData, Tipo: value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="usuario">Usuario</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <DialogFooter>
                    {isLoading ? (
                        <Button variant="outline">Guardando...</Button>
                    ) : (
                        <>
                            <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                            <Button variant="outline" onClick={handleSave}>Guardar cambios</Button>
                        </>
                    )}

                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}
