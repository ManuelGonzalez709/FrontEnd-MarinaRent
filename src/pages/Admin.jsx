"use client"

import { useState } from "react"
import { Search, Calendar } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center">
              <img
                src="/placeholder.svg?height=50&width=50"
                alt="Logo"
                width="50"
                height="50"
                className="rounded-full"
              />
            </a>
            <nav className="hidden md:flex items-center space-x-1">
              <a href="/" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Inicio
              </a>
              <a href="/informativos" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Informativos
              </a>
              <a href="/alquileres" className="px-4 py-2 bg-blue-700 text-white rounded-md">
                Alquileres
              </a>
              <a href="/reservas" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Mis Reservas
              </a>
              <a href="/admin" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Admin
              </a>
            </nav>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-gray-600 mb-8">Gestiona usuarios, reservas y anuncios desde este panel</p>

        <Tabs defaultValue="anuncios" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="anuncios" className="text-base px-6">
              Anuncios
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="text-base px-6">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="reservas" className="text-base px-6">
              Reservas
            </TabsTrigger>
          </TabsList>

          {/* Anuncios Tab */}
          <TabsContent value="anuncios">
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
              <Button className="ml-4">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por fecha
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Imagen de alquiler"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {item === 1 && "Quo maiores consectetur reiciendis consequatur"}
                      {item === 2 && "Praesentium rem earum ut et"}
                      {item === 3 && "Ut qui non nemo et quaerat"}
                      {item === 4 && "Autem alias ratione delectus vel"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item === 1 && "2025-05-30 00:00:00"}
                      {item === 2 && "2025-05-30 00:00:00"}
                      {item === 3 && "2025-07-12 00:00:00"}
                      {item === 4 && "2025-05-05 00:00:00"}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="font-bold">
                      {item === 1 && "5504 €"}
                      {item === 2 && "2916 €"}
                      {item === 3 && "9076 €"}
                      {item === 4 && "7197 €"}
                    </span>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button>Añadir nuevo anuncio</Button>
            </div>
          </TabsContent>

          {/* Usuarios Tab */}
          <TabsContent value="usuarios">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input type="search" placeholder="Buscar usuarios..." className="pl-10 pr-4 py-2 w-full" />
              </div>
              <Button className="ml-4">Añadir usuario</Button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Usuario
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rol
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: "Juan Pérez", email: "juan@example.com", role: "Admin", status: "Activo" },
                    { name: "María López", email: "maria@example.com", role: "Usuario", status: "Activo" },
                    { name: "Carlos Ruiz", email: "carlos@example.com", role: "Usuario", status: "Inactivo" },
                    { name: "Ana Martínez", email: "ana@example.com", role: "Usuario", status: "Activo" },
                  ].map((user, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Avatar>
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Reservas Tab */}
          <TabsContent value="reservas">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input type="search" placeholder="Buscar reservas..." className="pl-10 pr-4 py-2 w-full" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filtrar por fecha
                </Button>
                <Button>Nueva reserva</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Usuario
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Anuncio
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      id: "R-1234",
                      user: "Juan Pérez",
                      ad: "Quo maiores consectetur...",
                      date: "2025-05-30",
                      status: "Confirmada",
                    },
                    {
                      id: "R-1235",
                      user: "María López",
                      ad: "Praesentium rem earum...",
                      date: "2025-06-15",
                      status: "Pendiente",
                    },
                    {
                      id: "R-1236",
                      user: "Carlos Ruiz",
                      ad: "Ut qui non nemo et...",
                      date: "2025-07-12",
                      status: "Cancelada",
                    },
                    {
                      id: "R-1237",
                      user: "Ana Martínez",
                      ad: "Autem alias ratione...",
                      date: "2025-05-05",
                      status: "Confirmada",
                    },
                  ].map((reservation, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reservation.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{reservation.ad}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{reservation.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.status === "Confirmada"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
