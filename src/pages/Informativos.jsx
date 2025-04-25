import React, { useState, useEffect } from 'react';
import { API_URL } from "../utilities/apirest";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Informativos() {
    const [elementos, setElementos] = useState([]);
    const [loading, setLoading] = useState(true); // 👈 nuevo estado de carga
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
                setLoading(false); // 👈 quitar loading al final
            });
    }
    const handleClick = (elemento) => {
        navigate("/mostrador", { state: { elemento } });
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                {/* Esto es para mostrar la animacion de Cargando */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Publicaciones de Tipo Informativo
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {elementos.map((elemento) => (
                                <div
                                    key={elemento.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => handleClick(elemento)}
                                >
                                    <img
                                        src={API_URL + "storage/photos/" + elemento.Imagen.split(";")[0]}
                                        alt={elemento.Titulo}
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                {elemento.Titulo}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{elemento.Fecha_publicacion}</p>
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
