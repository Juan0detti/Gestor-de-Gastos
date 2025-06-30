import { saveLabels, getLabels } from "../capa_persistencia/EtiquetasStorage";
import { v4 as uuidv4 } from "uuid";

export function DataLabelValidation(label) {
    const errors = {};

    if (!label.nombre || label.nombre.trim() === '') {
        errors.nombre = "El nombre no puede estar vacío";
    }

    if (label.tipo !== 'Gasto' && label.tipo !== 'Ingreso') {
        errors.tipo = "El tipo debe ser 'Gasto' o 'Ingreso'";
    }

    return errors;
}

export function addLabel(nombre, tipo) {
    const newLabel = {
        id: uuidv4(),
        nombre: nombre,
        tipo: tipo,
        frequencia: 0
    };

    const currentLabels = getLabels();
    const updatedLabels = [...currentLabels, newLabel];
    saveLabels(updatedLabels);

    return newLabel;
}

export function editLabel(id, nuevoNombre, nuevoTipo) {
    const etiquetas = getLabels();

    const etiquetasActualizadas = etiquetas.map((etiqueta) => {
        if (etiqueta.id === id) {
            return {
                ...etiqueta,
                nombre: nuevoNombre ?? etiqueta.nombre,
                tipo: nuevoTipo ?? etiqueta.tipo,
            };
        }
        return etiqueta;
    });

    saveLabels(etiquetasActualizadas);
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