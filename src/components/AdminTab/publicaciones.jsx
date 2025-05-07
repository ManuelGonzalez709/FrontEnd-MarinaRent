import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import axios from "axios"
import { API_URL } from '../../utilities/apirest'
import ProductModal from "./modal-publicaciones" // Asegúrate de importar este correctamente

export default function Publicaciones() {
    const [searchQuery, setSearchQuery] = useState("")
    const [publicaciones, setPublicaciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [publication, setPublication] = useState()

    const [addModalOpen, setAddModalOpen] = useState(false) // <-- Estado para el modal de agregar producto

    useEffect(() => {
        console.log("Recargando datos")
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        axios.get(API_URL + "api/publicaciones", { headers })
            .then((response) => setPublicaciones(response.data))
            .catch((error) => {
                console.error("Error al cargar los informativos:", error)
            }).finally(() => setLoading(false))
    }, [isModalOpen, addModalOpen]) // <-- Recarga cuando se cierra cualquier modal

    const handleUpdate = (updatedPublication) => {
        console.log("Publicación actualizada:", updatedPublication)
        setPublication(updatedPublication)
    }

    const handleProductAdded = (newProduct) => {
        console.log("Nuevo producto agregado:", newProduct)
        // Opcional: recargar lista manualmente o usar efecto
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
                        {publicaciones.map((item) => (
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
                </>
            )}
        </>
    )
}
