"use client"

import { Link, useNavigate } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react"

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-blue-700 text-white py-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/informativos" className="text-gray-300 hover:text-white">
                  Informativos
                </Link>
              </li>
              <li>
                <Link to="/alquilables" className="text-gray-300 hover:text-white">
                  Reservables
                </Link>
              </li>
              <li>
                <Link to="/reservas" className="text-gray-300 hover:text-white">
                  Mis Reservas
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="text-gray-300 hover:text-white">
                  Carrito
                </Link>
              </li>
               <li>
                <Link to="/iacohere" className="text-gray-300 hover:text-white">
                  IA Chatbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <a href="mailto:manuel5365@gmail.com" className="text-gray-300 hover:text-white">
                  manuel5365@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <p className="text-gray-300">Teléfono: +34 641 130 893</p>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.facebook.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://x.com"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </a>

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

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Marina Rent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
