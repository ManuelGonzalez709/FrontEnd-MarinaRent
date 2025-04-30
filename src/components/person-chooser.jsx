import { useState } from 'react';

const SelectorPersonas = () => {
  // Estado para almacenar la persona seleccionada
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Función que maneja el cambio de selección
  const handleSelect = (e) => {
    setSelectedPerson(e.target.value); // Establece el valor seleccionado
  };

  return (
    <fieldset aria-label="Choose a size" className="mt-4">
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
        {/* Persona 1 */}
        <label className="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 uppercase shadow-xs hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
          <input
            type="radio"
            name="size-choice"
            value="1"
            className="sr-only"
            onChange={handleSelect} // Captura el clic
            checked={selectedPerson === '1'} // Marca el radio si es el seleccionado
          />
          <span>1</span>
          <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
        </label>

        {/* Persona 2 */}
        <label className="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 uppercase shadow-xs hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
          <input
            type="radio"
            name="size-choice"
            value="2"
            className="sr-only"
            onChange={handleSelect}
            checked={selectedPerson === '2'}
          />
          <span>2</span>
          <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
        </label>

        {/* Persona 3 (No disponible) */}
        <label className="group relative flex cursor-not-allowed items-center justify-center rounded-md border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-200 uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
          <input
            type="radio"
            name="size-choice"
            value="3"
            className="sr-only"
            disabled // Desactivado
          />
          <span>3</span>
          <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
            <svg className="absolute inset-0 size-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
              <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
            </svg>
          </span>
        </label>

        {/* Persona 4 (No disponible) */}
        <label className="group relative flex cursor-not-allowed items-center justify-center rounded-md border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-200 uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6">
          <input
            type="radio"
            name="size-choice"
            value="4"
            className="sr-only"
            disabled // Desactivado
          />
          <span>4</span>
          <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
            <svg className="absolute inset-0 size-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
              <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
            </svg>
          </span>
        </label>
      </div>

      {/* Mostrar persona seleccionada */}
      <div className="mt-4">
        {selectedPerson ? <p>Persona seleccionada: {selectedPerson}</p> : <p>Por favor, selecciona una persona.</p>}
      </div>
    </fieldset>
  );
};

export default SelectorPersonas;
