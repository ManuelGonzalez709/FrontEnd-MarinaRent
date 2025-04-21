import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <main>
        <div className="relative w-full aspect-video">
          {/* Texto encima del video */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-black/20">
            <h1 className="text-3xl md:text-6xl font-bold text-white text-center">Bienvenidos a Marina Rent</h1>
            <h2 className="text-lg md:text-xl font-semibold text-white mt-4 text-center">Diversión desde el Principio</h2>
          </div>

          {/* Iframe responsive */}
          <iframe
            id="player"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            title="ScubaCaribe"
            src="https://www.youtube.com/embed/Hx785Tzm4UE?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playlist=Hx785Tzm4UE"
          />
        </div>
        <div className='w-full justify-center flex bg-green-400'>
          <img src="tripadvaisor.png" alt="" className='h-40' />
        </div>
        <section className='flex flex-row'>
          <div className='w-200 flex flex-col items-start py-23 px-5'>
            <h2 className='text-5xl'><span className='font-bold'>10 RAZONES </span>POR QUÉ MARINARENT</h2>
            <p className='py-5 text-1xl'>Desde 1991, MarinaRent ha brindado una gama completa de buceo, snorkel, tours y deportes acuáticos para los mejores destinos de playa del mundo.</p>

            <ul className="flex flex-row flex-wrap font-bold text-1xl text-gray-700">
              {[
                "Más de 30 años de experiencia",
                "Embajadores ambientales",
                "Expansión global",
                "Familia y grupos",
                "Altos estándares de seguridad",
                "Amplia cartera de experiencias",
                "Calidad y atención al cliente",
                "Equipo de primera categoría",
                "Flota totalmente equipada",
                "Instructores plurilingües"
              ].map((text, index) => (
                <li key={index} className="w-full sm:w-1/2 py-3 flex items-center gap-2">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div><img src="barcoPortada.jpg" className='w-200' /></div>
        </section>
        {/* Segunda sección */}
        <section className="py-16 bg-gray-50">

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center text-blue-900">
              ¿Qué ofrecemos?
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {/* Tarjeta 1 - Snorkel */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <img src="snorkel.jpg" alt="Snorkel" className="h-50 w-80 object-cover rounded mb-6" />
                <h3 className="text-xl font-semibold text-blue-700">Snorkel</h3>
                <p className="text-center text-gray-600 mt-2">
                  Sumérgete en un mundo submarino lleno de vida marina y colores vibrantes. ¡Una experiencia inolvidable para toda la familia!
                </p>
              </div>

              {/* Tarjeta 2 - Buceo */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <img src="buceo.jpg" alt="Buceo" className="h-50 w-80 object-cover rounded mb-6" />
                <h3 className="text-xl font-semibold text-blue-700">Buceo</h3>
                <p className="text-center text-gray-600 mt-2">
                  Explora las profundidades del océano con nuestros guías expertos. Ideal para principiantes y buzos certificados.
                </p>
              </div>

              {/* Tarjeta 3 - Excursiones */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <img src="excursion.jpg" alt="Excursiones" className="h-50 w-80 object-cover rounded mb-6" />
                <h3 className="text-xl font-semibold text-blue-700">Excursiones</h3>
                <p className="text-center text-gray-600 mt-2">
                  Aventúrate en recorridos únicos por playas paradisíacas, islas escondidas y paisajes que te dejarán sin aliento.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}
