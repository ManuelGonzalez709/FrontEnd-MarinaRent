import React, { useState, useEffect } from 'react';
import { API_URL } from "../utilities/apirest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Buscador from '../components/buscador';


export default function Informativos() {
    const [elementos, setElementos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        cargarElementos();
    }, []);

    function cargarElementos() {
        let url = API_URL + "api/informativos";
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios.get(url, { headers })
            .then((response) => {
                if (response.status === 200) {
                    setElementos(response.data);
                }
            })
            .catch((error) => {
                console.error("Error al cargar los informativos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    const handleClick = (elemento) => {
        navigate("/mostrador", { state: { elemento } });
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilter = (dateFilter) => {
        setFilterDate(dateFilter);
    };

    const handleReset = () => {
        setSearchTerm("");
        setFilterDate("");
    };

    const filtrarPorFecha = (fechaStr) => {
        if (!filterDate) return true;

        const fecha = new Date(fechaStr);
        const hoy = new Date();

        switch (filterDate) {
            case "today":
                return fecha.toDateString() === hoy.toDateString();
            case "week": {
                const primerDiaSemana = new Date(hoy);
                primerDiaSemana.setDate(hoy.getDate() - hoy.getDay());
                const ultimoDiaSemana = new Date(primerDiaSemana);
                ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
                return fecha >= primerDiaSemana && fecha <= ultimoDiaSemana;
            }
            case "month":
                return (
                    fecha.getMonth() === hoy.getMonth() &&
                    fecha.getFullYear() === hoy.getFullYear()
                );
            case "year":
                return fecha.getFullYear() === hoy.getFullYear();
            default:
                return true;
        }
    };

    const elementosFiltrados = elementos.filter((elemento) => {
        const coincideBusqueda = elemento.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const coincideFecha = filtrarPorFecha(elemento.fecha_evento);
        return coincideBusqueda && coincideFecha;
    });


    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">

                {/* Esto es para mostrar la animacion de Cargando */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <Buscador
                            onSearch={handleSearch}
                            onFilter={handleFilter}
                            onReset={handleReset}
                        />

                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Publicaciones de Tipo Informativo
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {elementosFiltrados.map((elemento) => (
                                <div
                                    key={elemento.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => handleClick(elemento)}
                                >
                                    <img
                                        src={API_URL + "storage/photos/" + elemento.imagen.split(";")[0]}
                                        alt={elemento.titulo}
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                {elemento.titulo}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatDate(elemento.fecha_evento)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
