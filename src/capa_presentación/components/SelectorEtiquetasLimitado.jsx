import React, { useEffect, useState } from 'react';

export const SelectorEtiquetasLimitado = ({
  etiquetas,
  seleccionadas = [],
  onToggle,
  limite = 6,
  tipo // ← viene de formData.tipo
}) => {
  const [etiquetasFiltradas, setEtiquetasFiltradas] = useState([]);

  useEffect(() => {
    if (tipo) {
      const filtradas = etiquetas.filter(et => et.tipo === tipo);
      setEtiquetasFiltradas(filtradas);
    } else {
      setEtiquetasFiltradas(etiquetas);
    }
  }, [etiquetas, tipo]); // se actualiza si cambian las etiquetas o el tipo

  const etiquetasSeleccionadas = etiquetasFiltradas.filter(et => seleccionadas.includes(et.nombre));
  const etiquetasNoSeleccionadas = etiquetasFiltradas.filter(et => !seleccionadas.includes(et.nombre));

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
          key={etiqueta.id}
          type="button"
          className={`etiqueta ${seleccionadas.includes(etiqueta.nombre) ? 'seleccionada' : ''}`}
          onClick={() => onToggle(etiqueta.nombre)}
        >
          {etiqueta.nombre}
        </button>
      ))}
    </div>
  );
};

export default SelectorEtiquetasLimitado;