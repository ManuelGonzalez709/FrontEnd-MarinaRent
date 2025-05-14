"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios"
import { API_URL } from "../utilities/apirest"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Mail, Phone, Shield, Clock, Anchor, Ship, Compass } from 'lucide-react';

export default function PerfilPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("perfil");
    const [reservas, setReservas] = useState([]);
    const [imagenes, setImagenes] = useState([]);


    useEffect(() => {
        fetchProfile();
        fetchReservas();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const response = await axios.get(API_URL + "api/getData", { headers });
            setProfile(response.data);
        } catch (error) {
            console.error("Error al cargar los datos del perfil:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchReservas = async () => {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const response = await axios.get(API_URL + "api/obtenerReservasUsuario", { headers });
            setReservas(response.data);
        } catch (error) {
            console.error("Error al cargar los datos del perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calcular edad a partir de la fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Error al cargar el perfil</h1>
                <p className="text-gray-600 mt-2">No se pudieron obtener los datos del usuario</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Intentar de nuevo
                </Button>
            </div>
        );
    }
    const updated_at = profile.updated_at.split("T")[0] + " " + profile.updated_at.split("T")[1].split(".")[0];
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                    <img
                        src="banner.jpg"
                        alt="Portada de perfil"
                        width={1200}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h1 className="text-3xl font-bold">{profile.Nombre} {profile.Apellidos}</h1>
                        <p className="text-sm opacity-90">Miembro desde 2023</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Detalles de tu cuenta</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center mb-6">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.Nombre} ${profile.Apellidos}`} alt={profile.Nombre} />
                                    <AvatarFallback>{profile.Nombre.charAt(0)}{profile.Apellidos.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold">{profile.Nombre} {profile.Apellidos}</h2>
                                <Badge className="mt-2" variant={profile.Tipo === "admin" ? "destructive" : "default"}>
                                    {profile.Tipo === "admin" ? "Administrador" : "Usuario"}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{profile.Email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha de nacimiento</p>
                                        <p className="text-sm text-muted-foreground">{formatearFecha(profile.Fecha_nacimiento)} ({calcularEdad(profile.Fecha_nacimiento)} años)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Tipo de cuenta</p>
                                        <p className="text-sm text-muted-foreground capitalize">{profile.Tipo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Última modificación del perfil</p>
                                        <p className="text-sm text-muted-foreground">{updated_at}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Editar perfil</Button>
                        </CardFooter>
                    </Card>


                </div>

                <div className="md:col-span-2">
                    <Tabs defaultValue="actividad" className="w-full">
                        <TabsList className="grid grid-cols-1 mb-6">
                            <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
                        </TabsList>

                        <TabsContent value="actividad">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actividad Reciente</CardTitle>
                                    <CardDescription>Historial de tus últimas actividades</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {reservas.map((item) => {
                                            const publicacion = item.publicacion;
                                            const imagenes = publicacion?.imagen?.split(";") || [];

                                            return (
                                                <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                                                    <div className="rounded-md overflow-hidden w-16 h-16 flex-shrink-0">
                                                        <img
                                                            src={imagenes[0] ? API_URL + "storage/photos/" + imagenes[0] : "/placeholder.svg"}
                                                            alt={publicacion?.titulo || "Sin título"}
                                                            width={100}
                                                            height={100}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">Reserva: {publicacion?.titulo}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Total pagado: {item.total_pagar} € | Personas: {item.personas}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <CalendarDays className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                Fecha: {new Date(item.fecha_reserva).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </CardContent>

                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}