export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Almacen
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Inventario
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Tareas
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contacto@empresa.com"
                  className="text-gray-300 hover:text-white"
                >
                  contacto@qualicard.com
                </a>
              </li>
              <li>
                <p className="text-gray-300">Teléfono: +34 612 345 678</p>
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
              >
                <i className="fab fa-instagram h-6 w-6"></i>
              </a>

              <a
                href="https://www.facebook.com"
                className="text-gray-300 hover:text-white"
              >
                <i className="fab fa-facebook-f h-6 w-6"></i>
              </a>

              <a
                href="https://x.com"
                className="text-gray-300 hover:text-white"
              >
                <i className="fab fa-x h-6 w-6"></i> {/* X (anteriormente Twitter) */}
              </a>

              <a
                href="https://www.linkedin.com"
                className="text-gray-300 hover:text-white"
              >
                <i className="fab fa-linkedin h-6 w-6"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Qualica-RD. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
