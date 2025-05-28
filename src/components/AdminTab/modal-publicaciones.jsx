/**
 * @file modal-publicaciones.jsx
 * @description Modal para crear o editar publicaciones (informativas o alquilables) en el panel de administración.
 * Permite gestionar imágenes, validar campos y actualizar la información.
 */

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
import { API_URL, IMAGE_URL } from "../../utilities/apirest"

/**
 * Modal para crear o editar una publicación.
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Object} [props.product] - Publicación a editar (si existe).
 * @param {Function} props.onUpdate - Callback al actualizar.
 * @param {boolean} [props.isAddMode=false] - Si es modo añadir.
 * @returns {JSX.Element}
 */
export default function ProductModal({ isOpen, onClose, product, onUpdate, isAddMode = false }) {
  /**
   * Estado del formulario de la publicación.
   *   {[Object, Function]}
   */
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_evento: "",
    tipo: "informativo",
    precio: 0,
    aforo_maximo: 1,
  })
  /**
   * Estado de carga para el botón de guardar.
   *   {[boolean, Function]}
   */
  const [isLoading, setIsLoading] = useState(false)
  /**
   * Estado de errores de validación.
   *   {[Object, Function]}
   */
  const [errors, setErrors] = useState({})
  /**
   * Estado para previsualización de imágenes (existentes y nuevas).
   *   {[Array, Function]}
   */
  const [imagePreviews, setImagePreviews] = useState([])
  /**
   * Estado para las nuevas imágenes seleccionadas.
   *   {[Array, Function]}
   */
  const [newImages, setNewImages] = useState([])
  /**
   * Número de imágenes existentes.
   *   {[number, Function]}
   */
  const [existingImageCount, setExistingImageCount] = useState(0)
  /**
   * Número requerido de imágenes.
   *   {number}
   */
  const REQUIRED_IMAGES = 4
  /**
   * Estado para controlar el cierre seguro del modal.
   *   {[boolean, Function]}
   */
  const [isClosing, setIsClosing] = useState(false)

  /**
   * Efecto para inicializar el formulario y las imágenes al abrir el modal.
   */
  useEffect(() => {
    if (product && !isAddMode) {
      // Formatear la fecha para el input de tipo date
      let fechaEvento = ""
      if (product.fecha_evento) {
        const date = new Date(product.fecha_evento)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        fechaEvento = `${year}-${month}-${day}`
      }

      setFormData({
        ...product,
        fecha_evento: fechaEvento,
      })

      // Preparar las previsualizaciones de imágenes
      if (product.imagen) {
        const existingImages = product.imagen.split(";").filter(Boolean)
        setExistingImageCount(existingImages.length)

        const imageUrls = existingImages.map((img) => ({
          url: IMAGE_URL + img,
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

    setNewImages([])
    setErrors({})
    setIsClosing(false)
  }, [product, isOpen, isAddMode])

  /**
   * Valida los campos del formulario y las imágenes.
   * @returns {boolean}
   */
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
    if (imagePreviews.length !== REQUIRED_IMAGES) {
      newErrors.images = `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${imagePreviews.length})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Maneja el cambio de los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e
   */
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

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  /**
   * Cambia el tipo de publicación.
   * @param {string} value
   */
  const handleTipoChange = (value) => {
    setFormData({
      ...formData,
      tipo: value,
      precio: value === "informativo" ? 0 : formData.precio,
    })
  }

  /**
   * Maneja la selección de imágenes nuevas.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
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

      const newImageObjects = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        isExisting: false,
        file: file,
      }))

      setImagePreviews([...imagePreviews, ...newImageObjects])

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

  /**
   * Elimina una imagen del array de previsualización.
   * @param {number} index
   */
  const removeImage = (index) => {
    const updatedPreviews = [...imagePreviews]
    const removedImage = updatedPreviews[index]
    updatedPreviews.splice(index, 1)
    setImagePreviews(updatedPreviews)

    if (!removedImage.isExisting) {
      const fileToRemove = removedImage.file
      const newImagesUpdated = newImages.filter((file) => file !== fileToRemove)
      setNewImages(newImagesUpdated)
    }

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

  /**
   * Cierra el modal de forma segura.
   */
  const handleClose = () => {
    setIsClosing(true)
    onClose()
  }

  /**
   * Envía el formulario para crear o actualizar la publicación.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (imagePreviews.length !== REQUIRED_IMAGES) {
      setErrors({
        ...errors,
        images: `Debe tener exactamente ${REQUIRED_IMAGES} imágenes (actualmente tiene ${imagePreviews.length})`,
      })
      return
    }

    try {
      setIsLoading(true)
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagen" && value !== undefined) {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
          formDataToSend.append(capitalizedKey, value)
        }
      })

      if (!isAddMode && product?.id) {
        formDataToSend.append("id_publicacion", product.id)
      }

      const existingImages = imagePreviews.filter((img) => img.isExisting)
      const newImageObjects = imagePreviews.filter((img) => !img.isExisting)

      newImageObjects.forEach((imgObj) => {
        formDataToSend.append("imagenes[]", imgObj.file)
      })

      existingImages.forEach((img) => {
        formDataToSend.append("imagenes_existentes[]", img.filename)
      })

      const token = localStorage.getItem("authToken")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const apiEndpoint = isAddMode ? API_URL + "api/publicaciones" : API_URL + "api/actualizar"

      const response = await axios.post(apiEndpoint, formDataToSend, { headers })

      // Si estamos en modo edición y la fecha ha cambiado, actualizar la fecha en las reservas
      if (!isAddMode && product?.id && formData.fecha_evento !== product.fecha_evento) {
        try {
          await axios.post(
            API_URL + "api/actualizarFechaPublicacion",
            {
              publicacion_id: product.id,
              nueva_fecha_evento: formData.fecha_evento,
            },
            { headers },
          )
        } catch (error) {
          setErrors({
            ...errors,
            general: "Ha ocurrido un error al actualizar la fecha del evento",
          })
          setIsLoading(false)
          return
        }
      }

      setIsClosing(true)
      onClose()
    } catch (error) {
      setErrors({
        ...errors,
        general: `Ha ocurrido un error al ${isAddMode ? "crear" : "actualizar"} la publicación`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Indica si se puede mostrar el botón para añadir imagen.
   *   {boolean}
   */
  const showAddImageButton = imagePreviews.length < REQUIRED_IMAGES

  /**
   * Número de imágenes existentes.
   *   {number}
   */
  const existingImagesCount = imagePreviews.filter((img) => img.isExisting).length
  /**
   * Número de imágenes nuevas.
   *   {number}
   */
  const newImagesCount = imagePreviews.filter((img) => !img.isExisting).length

  return (
    <Dialog open={isOpen} onOpenChange={isClosing ? onClose : handleClose}>
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

              {/* Campo título */}
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

              {/* Campo descripción */}
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

              {/* Campo fecha del evento */}
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

              {/* Selector de tipo de publicación */}
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

              {/* Campo precio solo si es alquilable */}
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

              {/* Campo aforo máximo */}
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

              {/* Gestión de imágenes */}
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

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 p-4 border-t mt-auto bg-white">
            <Button variant="outline" type="button" onClick={handleClose}>
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
