/**
 * @file Navbar.jsx
 * @description Barra de navegación principal del sitio. Incluye enlaces a las páginas principales, menú de usuario y control de visibilidad para el enlace de administración.
 * @module components/Navbar
 */


import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import LogoutButton from "../utilities/auth"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Link, useLocation, useNavigate } from "react-router-dom"

/**
 * Devuelve una cadena de clases CSS unidas por espacio, ignorando valores falsy.
 * @param  {...string} classes
 * @returns {string}
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Componente Navbar.
 * Muestra la barra de navegación superior con enlaces, menú de usuario y control de visibilidad para Admin.
 *
 * @param {Object} props
 * @param {boolean} props.admin - Indica si el usuario es administrador.
 * @returns {JSX.Element} La barra de navegación.
 */
export default function Example({ admin }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Incluir siempre todos los elementos de navegación, incluyendo Admin
  const navigation = [
    { name: "Inicio", href: "/home" },
    { name: "Informativos", href: "/informativos" },
    { name: "Reservables", href: "/alquilables" },
    { name: "Mis Reservas", href: "/reservas" },
    { name: "Carrito", href: "/carrito" },
    { name: "IA Chatbox", href: "/iacohere" },
    { name: "Admin", href: "/admin" }, // Siempre incluido pero se ocultará con CSS
  ].map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }))

  return (
    <Disclosure as="nav" className="bg-white">
      {({ close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img alt="Your Company" src="logo3PNG.png" className="h-12 w-auto" />
                </div>
                <div className="hidden sm:flex sm:items-center sm:justify-center flex-1">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      // Ocultar el elemento Admin si admin es false
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? "bg-blue-900 text-white" : "text-black hover:bg-blue-900 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium transition-opacity duration-300",
                          // Ocultar Admin si no es admin
                          item.name === "Admin" && !admin ? "opacity-0 invisible absolute" : "opacity-100 visible",
                        )}
                        aria-hidden={item.name === "Admin" && !admin ? "true" : "false"}
                        tabIndex={item.name === "Admin" && !admin ? -1 : 0}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("/perfil")}
                          className={classNames(
                            active ? "bg-blue-200" : "",
                            "w-full text-left px-4 py-2 text-sm text-black",
                          )}
                        >
                          Mi Perfil
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      <LogoutButton />
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                // Changed to use navigate instead of href for mobile menu
                <DisclosureButton
                  key={item.name}
                  as="button" // Changed from "a" to "button"
                  onClick={() => {
                    navigate(item.href)
                    close() // Close the mobile menu after navigation
                  }}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current ? "bg-blue-900 text-white" : "text-black hover:bg-blue-900 hover:text-white",
                    "block w-full text-left rounded-md px-3 py-2 text-base font-medium transition-opacity duration-300",
                    // Ocultar Admin si no es admin
                    item.name === "Admin" && !admin ? "hidden" : "block",
                  )}
                  aria-hidden={item.name === "Admin" && !admin ? "true" : "false"}
                  tabIndex={item.name === "Admin" && !admin ? -1 : 0}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
