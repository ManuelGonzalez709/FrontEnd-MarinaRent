import React, { useEffect, useState } from "react"
import { Search, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from "axios"
import { API_URL } from '../../utilities/apirest'
import ProductModal from "./modal-publicaciones"

export default function Publicaciones() {
    const [searchQuery, setSearchQuery] = useState("")
    const [publicaciones, setPublicaciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [publication, setPublication] = useState()
    const [addModalOpen, setAddModalOpen] = useState(false)

    // Estados para eliminar con confirmación
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [selectedPublicationId, setSelectedPublicationId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("authToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        axios.get(API_URL + "api/publicaciones", { headers })
            .then((response) => setPublicaciones(response.data))
            .catch((error) => {
                console.error("Error al cargar los informativos:", error)
            }).finally(() => setLoading(false))
    }, [isModalOpen, addModalOpen,isDeleting])

    const handleUpdate = (updatedPublication) => {
        setPublication(updatedPublication)
    }

    const handleProductAdded = (newProduct) => {
        console.log("Borrando Producto: "+newProduct)
    }

    const handleDelete = async () => {
        if (!selectedPublicationId) return
        setIsDeleting(true)

        try {
            const token = localStorage.getItem("authToken")
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            await axios.delete(`${API_URL}api/publicaciones/${selectedPublicationId}`, { headers })

            setPublicaciones((prev) => prev.filter(pub => pub.id !== selectedPublicationId))
            setConfirmDialogOpen(false)
            setSelectedPublicationId(null)
        } catch (error) {
            console.error("Error al eliminar la publicación:", error)
            alert("Ocurrió un error al intentar eliminar la publicación.")
        } finally {
            setIsDeleting(false)
        }
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
                            <Input
                                type="search"
                                placeholder="Buscar publicaciones..."
                                className="pl-10 pr-4 py-2 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setAddModalOpen(true)}>
                            Añadir nuevo producto
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {publicaciones
                            .filter((item) =>
                                item.titulo.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={API_URL + "storage/photos/" + item.imagen.split(";")[0]}
                                            alt="Imagen de alquiler"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {item.fecha_evento}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                        <span className="font-bold">
                                            {item.precio !== 0 ? "$" + item.precio : "Gratuito"}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setPublication(item)
                                                    setIsModalOpen(true)
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedPublicationId(item.id)
                                                    setConfirmDialogOpen(true)
                                                }}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>

                    {/* Modal para editar publicaciones existentes */}
                    <ProductModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={publication}
                        onUpdate={handleUpdate}
                    />

                    {/* Modal para agregar un nuevo producto */}
                    <ProductModal
                        isOpen={addModalOpen}
                        onClose={() => setAddModalOpen(false)}
                        onUpdate={handleProductAdded}
                        isAddMode={true}
                    />

                    {/* Diálogo de confirmación */}
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
                                    ¿Estás seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer.
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
            )}
        </>
    )
}
