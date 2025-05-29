import { saveLabels, getLabels } from "../capa_persistencia/EtiquetasStorage";
import { v4 as uuidv4 } from "uuid";

export function DataLabelValidation(name)    {
    const errors = {};

    if (name == '') errors.name = "El nombre no pude estar vacio";

    return errors;
}

export function addLabel(name) {

    const newLabel = {
    id: uuidv4(),
    name: name,
    frequency: 0
  };

  const currentLabels = getLabels();
  const updatedTLabels = [...currentLabels, newLabel];
  saveLabels(updatedTLabels);

  return newLabel;
}

export function editLabels(id) {
  const etiquetas = getLabels();

  const etiquetasActualizadas = etiquetas.map((etiqueta) => {
    if (etiqueta.id === id) {
      return {
        ...etiqueta,
        name: etiqueta.name,
        frequency: parseInt(etiqueta.frequency-1),
      };
    }
    return etiqueta;
  });

  saveLabels(transaccionesActualizadas);
}

export function orderLabels() {
  return [...getLabels()].sort((a, b) => b.frecuencia - a.frecuencia);
}

export function eliminateLabel(id) {
    const currentLabels = getLabels();
    const updatedLabels = [...currentLabels.filter((label)=>label.id!=id)];
    saveTransations(updatedLabels);

    return updatedTransation;
}