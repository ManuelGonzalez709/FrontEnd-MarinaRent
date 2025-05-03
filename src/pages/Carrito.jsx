import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../utilities/apirest';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Carrito({ cart, setCart }) {
  const [carritoDesfase, setCarritoDesfase] = useState([]);
  const [carritoNormal, setCarritoNormal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alquilerDisponible, setAlquilerDisponible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length > 0) {
      verificarDisponibilidad();
    } else {
      setCarritoNormal([]);
      setCarritoDesfase([]);
      setLoading(false);
      setAlquilerDisponible(true);
    }
  }, [cart]);

  const verificarDisponibilidad = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const nuevosCarritoNormal = [];
    const nuevosCarritoDesfase = [];
    let disponible = true;

    await Promise.all(
      cart.map(async (item) => {
        try {
          const response1 = await axios.post(API_URL + "api/disponibilidadReserva", {
            idPublicacion: item.id,
            horaReserva: item.horaReserva + ":00"
          }, { headers });

          const response2 = await axios.post(API_URL + "api/capacidadDisponible", {
            idPublicacion: item.id
          }, { headers });

          const disponibilidad = response1.data.disponible;
          const maxReservables = response2.data.personas_disponibles;

          if (maxReservables >= item.personas && disponibilidad) {
            nuevosCarritoNormal.push(item);
          } else {
            let causas = [];
            if (!disponibilidad) causas.push("No disponible en la hora seleccionada");
            if (item.personas > maxReservables) causas.push(`Solo hay ${maxReservables} plazas disponibles`);

            item.causaDesfase = causas.join(" y ");
            nuevosCarritoDesfase.push(item);
            disponible = false;
          }
        } catch (error) {
          console.error("Error al verificar disponibilidad para el item:", item.id, error);
        }
      })
    );

    setCarritoNormal(nuevosCarritoNormal);
    setCarritoDesfase(nuevosCarritoDesfase);
    setAlquilerDisponible(disponible);
    setLoading(false);
  };

  const handleEliminarProducto = (id) => {
    const nuevoCart = cart.filter(item => item.id !== id);
    setCart(nuevoCart);
    localStorage.setItem("cart", JSON.stringify(nuevoCart));
  };

  const handleRealizarPedido = async () => {
    const url = API_URL + "api/reservas";
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setLoading(true);

    const peticiones = cart.map((elemento) => {
      return axios.post(url, {
        publicacion_id: elemento.id,
        hora_reserva: elemento.horaReserva + ":00",
        total_pagar: elemento.precio,
        personas: elemento.personas
      }, { headers });
    });

    try {
      const respuestas = await Promise.all(peticiones);
      console.log("Reservas creadas:", respuestas.map(r => r.data.reserva));

      setCart([]);
      localStorage.setItem("cart", []);
      setCarritoDesfase([]);
      setCarritoNormal([]);
    } catch (error) {
      console.error("Error al crear una o más reservas:", error);
      alert("Hubo un problema al registrar alguna reserva.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      {carritoDesfase.length == 0 && carritoNormal.length == 0 && !loading ? (
        <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-gray-800 mb-2">Carrito Vacío</h2>
            <div className="w-20 h-1 bg-blue-600 mb-6"></div>
            <p className="text-gray-600 mb-8">
              Aún no has añadido ningún evento al carrito. Descubre nuestras sombrillas, tumbonas, paddle surf y mucho más para disfrutar del sol al máximo.
            </p>
            <Button
              onClick={() => navigate("/alquilables")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md font-medium text-lg"
            >
              ¡ALQUILA AHORA!
            </Button>
          </div>
          <motion.div
            className="md:w-1/2 relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/869/869869.png" alt="Sombrilla de playa" />
          </motion.div>
        </motion.div>
      </div>
      
      ) : (
        <>

          <h1 className="text-4xl font-semibold mb-6">Carrito</h1>
          <div className="flex flex-col md:flex-row gap-8">

            {/* Contenedor scrollable para productos */}
            <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 space-y-6">
              {carritoNormal.map((producto) => (
                <div key={producto.id} className="flex items-center gap-6 border-b pb-6">
                  <img
                    src={API_URL + "storage/photos/" + producto.imagen.split(";")[0]}
                    alt={producto.titulo}
                    className="h-24 w-24 rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{producto.titulo}</h2>
                    <p className="text-gray-500">{producto.personas} Personas | {producto.horaReserva}:00 h</p>
                    <p className="font-semibold mt-2">${producto.precio}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEliminarProducto(producto.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {carritoDesfase.map((producto) => (
                <div key={producto.id} className="flex items-center gap-6 border-b pb-6">
                  <img
                    src={API_URL + "storage/photos/" + producto.imagen.split(";")[0]}
                    alt={producto.titulo}
                    className="h-24 w-24 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-red-500">Elemento Desfasado {producto.causaDesfase}</p>
                    <h2 className="text-lg font-medium">{producto.titulo}</h2>
                    <p className="text-gray-500">{producto.personas} Personas | {producto.horaReserva}:00 h</p>
                    <p className="font-semibold mt-2">${producto.precio}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEliminarProducto(producto.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {/* Resumen u loading */}
            {loading ? (
              <div className="flex justify-center items-center w-full md:w-1/3">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg h-fit md:top-10">
                <h2 className="text-xl font-semibold mb-4">Order summary</h2>
                <div className="flex justify-between text-sm mb-2">
                  <span>Seguro de Riesgos</span>
                  <span>$99.00</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>Taxas estimadas</span>
                  <span>$8.32</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Precio Reserva</span>
                  <span>$112.32</span>
                </div>
                {alquilerDisponible ? (
                  <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    onClick={handleRealizarPedido}>
                    Realizar Pedido
                  </button>
                ) : (
                  <button className="w-full bg-indigo-300 text-white py-2 rounded cursor-not-allowed">
                    Realizar Pedido
                  </button>)}
              </div>
            )}
          </div>

        </>

      )}

    </div>
  );
}
