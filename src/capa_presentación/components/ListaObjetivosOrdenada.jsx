import React from "react";
import ObjetivoCard from "./ObjetivosCard";

export default function ListaObjetivosOrdenada({
  objetivos,
  onEditar,
  onEliminar,
  onVer,
}) {
  if (!objetivos || objetivos.length === 0) {
    return <p>No hay objetivos registrados.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {objetivos.map((objetivo) => (
        <>
          {console.log(objetivo)}

          <ObjetivoCard
            key={objetivo.id}
            objetivo={objetivo}
            onEditar={(id) => {
              const objetivoSeleccionado = objetivos.find((g) => g.id === id);
              if (objetivoSeleccionado) onEditar(objetivoSeleccionado);
            }}
            onEliminar={onEliminar}
            onVer={/*onVer*/ console.log(objetivo)}
          />
        </>
      ))}
    </div>
  );
}
