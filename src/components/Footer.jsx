// Indica que este componente es del lado del cliente (Next.js, pero aquí es React puro)
"use client" 

// Importa componentes y hooks de React Router y los iconos de lucide-react
import { Link, useNavigate } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react"

// Componente funcional Footer
export default function Footer() {
  const navigate = useNavigate() // Hook para navegación programática (no se usa en este componente)

  return (
    // Contenedor principal del footer con estilos de fondo y texto
    <footer className="bg-blue-700 text-white py-8">
      {/* Contenedor centrado y con padding */}
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {/* Grid para organizar las 3 columnas del footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Columna 1: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {/* Enlace a la página de inicio */}
              <li>
                <Link to="/home" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              {/* Enlace a informativos */}
              <li>
                <Link to="/informativos" className="text-gray-300 hover:text-white">
                  Informativos
                </Link>
              </li>
              {/* Enlace a reservables */}
              <li>
                <Link to="/alquilables" className="text-gray-300 hover:text-white">
                  Reservables
                </Link>
              </li>
              {/* Enlace a mis reservas */}
              <li>
                <Link to="/reservas" className="text-gray-300 hover:text-white">
                  Mis Reservas
                </Link>
              </li>
              {/* Enlace al carrito */}
              <li>
                <Link to="/carrito" className="text-gray-300 hover:text-white">
                  Carrito
                </Link>
              </li>
              {/* Enlace al chatbox de IA */}
              <li>
                <Link to="/iacohere" className="text-gray-300 hover:text-white">
                  IA Chatbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              {/* Correo electrónico con icono */}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <a href="mailto:manuel5365@gmail.com" className="text-gray-300 hover:text-white">
                  manuel5365@gmail.com
                </a>
              </li>
              {/* Teléfono con icono */}
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <p className="text-gray-300">Teléfono: +34 641 130 893</p>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            {/* Iconos de redes sociales con enlaces externos */}
            <div className="flex space-x-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              {/* Twitter */}
              <a
                href="https://x.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </a>
              {/* Linkedin */}
              <a
                href="https://www.linkedin.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Pie de página con derechos de autor */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Marina Rent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
