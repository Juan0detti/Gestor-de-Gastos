import React from 'react';

export const SelectorEtiquetasLimitado = ({ etiquetas, seleccionadas, onToggle, limite = 6 }) => {
  const etiquetasSeleccionadas = etiquetas.filter(et => seleccionadas.includes(et.name));
  const etiquetasNoSeleccionadas = etiquetas.filter(et => !seleccionadas.includes(et.name));

  const mostrar = limite == null
    ? [...etiquetasSeleccionadas, ...etiquetasNoSeleccionadas]
    : etiquetasSeleccionadas.length >= limite
      ? etiquetasSeleccionadas
      : [
          ...etiquetasSeleccionadas,
          ...etiquetasNoSeleccionadas.slice(0, limite - etiquetasSeleccionadas.length)
        ];

  return (
    <div className="selector-etiquetas">
      {mostrar.map(etiqueta => (
        <button
          key={etiqueta.name}
          type="button"
          className={`etiqueta ${seleccionadas.includes(etiqueta.name) ? 'seleccionada' : ''}`}
          onClick={() => onToggle(etiqueta.name)}
        >
          {etiqueta.name}
        </button>
      ))}
    </div>
  );
};

export default SelectorEtiquetasLimitado;
