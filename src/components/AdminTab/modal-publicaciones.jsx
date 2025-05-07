"use client"

import { useState, useEffect } from "react"
import { ImageIcon, Save, X, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from "axios"
import { API_URL } from "../../utilities/apirest"

export default function ProductModal({ isOpen, onClose, product, onUpdate, isAddMode = false }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_evento: "",
    tipo: "informativo",
    precio: 0,
    aforo_maximo: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [imagePreviews, setImagePreviews] = useState([])
  const [newImages, setNewImages] = useState([])
  const [existingImageCount, setExistingImageCount] = useState(0)
  const REQUIRED_IMAGES = 4

  useEffect(() => {
    if (product && !isAddMode) {
      // Formatear la fecha para el input de tipo date
      const fechaEvento = product.fecha_evento ? new Date(product.fecha_evento).toISOString().split("T")[0] : ""

      setFormData({
        ...product,
        fecha_evento: fechaEvento,
      })

      // Preparar las previsualizaciones de imágenes
      if (product.imagen) {
        const existingImages = product.imagen.split(";").filter(Boolean)
        setExistingImageCount(existingImages.length)

        const imageUrls = existingImages.map((img) => ({
          url: API_URL + "storage/photos/" + img,
          isExisting: true,
          filename: img,
        }))

        setImagePreviews(imageUrls)
      } else {
        setImagePreviews([])
        setExistingImageCount(0)
      }
    } else {
      // Reset form for add mode
      setFormData({
        titulo: "",
        descripcion: "",
        fecha_evento: "",
        tipo: "informativo",
        precio: 0,
        aforo_maximo: 1,
      })
      setImagePreviews([])
      setExistingImageCount(0)
    }

    // Resetear nuevas imágenes y errores al abrir el modal
    setNewImages([])
    setErrors({})
  }, [product, isOpen, isAddMode])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.titulo?.trim()) {
      newErrors.titulo = "El título es obligatorio"
    }

    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    }

    if (!formData.fecha_evento) {
      newErrors.fecha_evento = "La fecha del evento es obligatoria"
    }

    if (formData.tipo === "alquilable" && (!formData.precio || formData.precio <= 0)) {
      newErrors.precio = "El precio debe ser mayor que 0 para eventos alquilables"
    }

    if (!formData.aforo_maximo || formData.aforo_maximo <= 0) {
      newErrors.aforo_maximo = "El aforo máximo debe ser mayor que 0"
    }

    // Validar que haya exactamente 4 imágenes
    if (imagePreviews.length !== REQUIRED_IMAGES) {
      newErrors.images = `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${imagePreviews.length})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Limpiar error cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleTipoChange = (value) => {
    setFormData({
      ...formData,
      tipo: value,
      // Si cambia a informativo, el precio es 0
      precio: value === "informativo" ? 0 : formData.precio,
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Verificar si se excede el límite de 4 imágenes
      const totalImages = imagePreviews.length + e.target.files.length

      if (totalImages > REQUIRED_IMAGES) {
        setErrors({
          ...errors,
          images: `Solo se permiten exactamente ${REQUIRED_IMAGES} imágenes (${imagePreviews.length} actuales)`,
        })
        return
      }

      const filesArray = Array.from(e.target.files)
      const newFilesArray = [...newImages, ...filesArray]
      setNewImages(newFilesArray)

      // Crear objetos para las nuevas imágenes
      const newImageObjects = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        isExisting: false,
        file: file,
      }))

      setImagePreviews([...imagePreviews, ...newImageObjects])

      // Limpiar error de imágenes si ahora hay exactamente 4
      if (imagePreviews.length + newImageObjects.length === REQUIRED_IMAGES) {
        setErrors({
          ...errors,
          images: "",
        })
      } else {
        setErrors({
          ...errors,
          images: `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${imagePreviews.length + newImageObjects.length})`,
        })
      }
    }
  }

  const removeImage = (index) => {
    const updatedPreviews = [...imagePreviews]
    const removedImage = updatedPreviews[index]
    updatedPreviews.splice(index, 1)
    setImagePreviews(updatedPreviews)

    // Si es una imagen nueva (no existente), actualizar el array de nuevas imágenes
    if (!removedImage.isExisting) {
      // Encontrar el índice correspondiente en newImages
      const fileToRemove = removedImage.file
      const newImagesUpdated = newImages.filter((file) => file !== fileToRemove)
      setNewImages(newImagesUpdated)
    }

    // Actualizar mensaje de error si no hay exactamente 4 imágenes
    if (updatedPreviews.length !== REQUIRED_IMAGES) {
      setErrors({
        ...errors,
        images: `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${updatedPreviews.length})`,
      })
    } else {
      setErrors({
        ...errors,
        images: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Verificar que haya exactamente 4 imágenes
    if (imagePreviews.length !== REQUIRED_IMAGES) {
      setErrors({
        ...errors,
        images: `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${imagePreviews.length})`,
      })
      return
    }

    try {
      setIsLoading(true)

      // Preparar FormData para enviar archivos
      const formDataToSend = new FormData()

      // Añadir todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagen" && value !== undefined) {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
          formDataToSend.append(capitalizedKey, value)
        }
      })

      // Si estamos en modo edición, añadir el ID
      if (!isAddMode && product?.id) {
        formDataToSend.append("id_publicacion", product.id)
      }

      // Separar las imágenes existentes y nuevas
      const existingImages = imagePreviews.filter((img) => img.isExisting)
      const newImageObjects = imagePreviews.filter((img) => !img.isExisting)

      // Añadir las nuevas imágenes con el nombre "imagenes[]"
      newImageObjects.forEach((imgObj) => {
        formDataToSend.append("imagenes[]", imgObj.file)
      })

      // Añadir las imágenes existentes como array con el nombre "imagenes_existentes[]"
      existingImages.forEach((img) => {
        formDataToSend.append("imagenes_existentes[]", img.filename)
      })

      // Configurar la petición
      const token = localStorage.getItem("authToken")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Determinar la URL de la API según el modo (añadir o editar)
      const apiEndpoint = isAddMode ? API_URL + "api/publicaciones" : API_URL + "api/actualizar"

      // Realizar la petición POST a la API
      const response = await axios.post(apiEndpoint, formDataToSend, { headers })

      if (response.data && onUpdate) {
        onUpdate(response.data)
      }

      onClose()
    } catch (error) {
      console.error(`Error al ${isAddMode ? "crear" : "actualizar"} la publicación:`, error)
      setErrors({
        ...errors,
        general: `Ha ocurrido un error al ${isAddMode ? "crear" : "actualizar"} la publicación`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar si se ha alcanzado el límite de imágenes
  const showAddImageButton = imagePreviews.length < REQUIRED_IMAGES

  // Contar imágenes existentes y nuevas para depuración
  const existingImagesCount = imagePreviews.filter((img) => img.isExisting).length
  const newImagesCount = imagePreviews.filter((img) => !img.isExisting).length
  console.log(product)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isAddMode ? "Añadir Producto" : "Editar Publicación"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-scroll">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 pb-4">
              {errors.general && <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">{errors.general}</div>}

              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo || ""}
                  onChange={handleInputChange}
                  className={errors.titulo ? "border-red-500" : ""}
                />
                {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className={errors.descripcion ? "border-red-500" : ""}
                />
                {errors.descripcion && <p className="text-red-500 text-xs">{errors.descripcion}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_evento">Fecha del Evento</Label>
                <Input
                  id="fecha_evento"
                  name="fecha_evento"
                  type="date"
                  value={formData.fecha_evento || ""}
                  onChange={handleInputChange}
                  className={errors.fecha_evento ? "border-red-500" : ""}
                />
                {errors.fecha_evento && <p className="text-red-500 text-xs">{errors.fecha_evento}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tipo de Publicación</Label>
                <RadioGroup
                  value={formData.tipo || "informativo"}
                  onValueChange={handleTipoChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="informativo" id="informativo" />
                    <Label htmlFor="informativo">Informativo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alquilable" id="alquilable" />
                    <Label htmlFor="alquilable">Alquilable</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.tipo === "alquilable" && (
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio || 0}
                    onChange={handleInputChange}
                    className={errors.precio ? "border-red-500" : ""}
                  />
                  {errors.precio && <p className="text-red-500 text-xs">{errors.precio}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="aforo_maximo">Aforo Máximo</Label>
                <Input
                  id="aforo_maximo"
                  name="aforo_maximo"
                  type="number"
                  min="1"
                  value={formData.aforo_maximo || ""}
                  onChange={handleInputChange}
                  className={errors.aforo_maximo ? "border-red-500" : ""}
                />
                {errors.aforo_maximo && <p className="text-red-500 text-xs">{errors.aforo_maximo}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Imágenes <span className="text-xs text-gray-500">(Obligatorio {REQUIRED_IMAGES})</span>
                  </Label>
                  <span
                    className={`text-xs ${imagePreviews.length === REQUIRED_IMAGES ? "text-green-500 font-semibold" : "text-red-500"}`}
                  >
                    {imagePreviews.length}/{REQUIRED_IMAGES} (Existentes: {existingImagesCount}, Nuevas:{" "}
                    {newImagesCount})
                  </span>
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative group">
                      <div
                        className={`aspect-square bg-gray-100 rounded-md overflow-hidden ${image.isExisting ? "border-2 border-green-500" : "border-2 border-blue-500"}`}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg text-white text-xs p-1 text-center">
                          {image.isExisting ? "Existente" : "Nueva"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {showAddImageButton && (
                    <label className="aspect-square bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Añadir imagen</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} multiple />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 p-4 border-t mt-auto bg-white">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || imagePreviews.length !== REQUIRED_IMAGES}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {isAddMode ? "Creando..." : "Guardando..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isAddMode ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {isAddMode ? "Crear Producto" : "Guardar Cambios"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
