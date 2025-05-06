"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importa los componentes correctamente con nombres en mayúsculas
import Publicaciones from "../components/AdminTab/publicaciones";
import Reservas from "../components/AdminTab/reservas";
import Usuarios from "../components/AdminTab/usuarios";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-gray-600 mb-8">Gestiona usuarios, reservas y anuncios desde este panel</p>

        <Tabs defaultValue="anuncios" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="anuncios" className="text-base px-6">
              Publicaciones
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="text-base px-6">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="reservas" className="text-base px-6">
              Reservas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anuncios">
            <Publicaciones />
          </TabsContent>
          <TabsContent value="usuarios">
            <Usuarios />
          </TabsContent>
          <TabsContent value="reservas">
            <Reservas />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
