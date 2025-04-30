import React from 'react';
import { API_URL } from '../utilities/apirest';

export default function Carrito({ cart, setCart }) {
  return (
    
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-semibold mb-6">Carrito</h1>
      {console.log(cart)}
      {/* Contenedor principal: lista y resumen lado a lado */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Contenedor scrollable para productos */}
        <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 space-y-6">
          {cart.map((producto) => (
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
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          ))}
        </div>

        {/* Resumen de orden fijo al lado derecho */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg h-fit  md:top-10">
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
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
