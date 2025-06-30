import { v4 as uuidv4 } from "uuid";
import { getProgramedTransations, saveProgramedTransations } from '../capa_persistencia/TransaccionesProgramadasStorage'

class TransaccionProgramada {
  constructor(nombre, monto, fecha, tipo, descripcion, etiquetas) {
    this.id = uuidv4();
    this.nombre = nombre;
    this.monto = monto;
    this.fecha = fecha; // ISO con fecha y hora
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.etiquetas = etiquetas;
  }
}

export function validarTransaccionProgramada(dateString, amount) {
  const errors = {};
  const now = new Date();
  const inputDate = new Date(dateString);

  if (!dateString) errors.date = "La fecha y hora son obligatorias.";
  else if (inputDate <= now) errors.date = "La fecha y hora deben ser futuras.";

  if (!amount && amount !== 0) {
    errors.amount = "El monto es obligatorio.";
  } else if (parseFloat(amount) < 0) {
    errors.amount = "El monto no puede ser negativo.";
  }

  return errors;
}

export function agregarTransaccionProgramada(nombre, monto, fecha, tipo, descripcion, etiquetas) {
  const nueva = new TransaccionProgramada(nombre, monto, fecha, tipo, descripcion, etiquetas);
  const actuales = getProgramedTransations();
  const actualizadas = [...actuales, nueva];
  saveProgramedTransations(actualizadas);
  return nueva;
}

export function editarTransaccionProgramada(id, nuevosDatos) {
  const actuales = getProgramedTransations();
  const actualizadas = actuales.map((tx) =>
    tx.id === id ? { ...tx, ...nuevosDatos } : tx
  );
  saveProgramedTransations(actualizadas);
}

export function filtrarTransaccionesProgramadas({ fecha_inicio, fecha_fin, monto, tipo, etiquetas }) {
  const todas = getTransaccionesProgramadas();

  return todas.filter((tx) => {
    const fechaTx = new Date(tx.fecha).toISOString();

    if (fecha_inicio && fecha_inicio !== 'sin seleccionar' && fechaTx < fecha_inicio) return false;
    if (fecha_fin && fecha_fin !== 'sin seleccionar' && fechaTx > fecha_fin) return false;

    if (monto && monto !== 'sin seleccionar' && parseFloat(tx.monto) !== parseFloat(monto)) return false;

    if (tipo && tipo !== 'sin-seleccionar' && tx.tipo !== tipo) return false;

    if (etiquetas && etiquetas.length > 0) {
      const tieneTodas = etiquetas.every((et) => tx.etiquetas?.includes(et));
      if (!tieneTodas) return false;
    }

    return true;
  });
}

export function eliminarTransaccionProgramada(id) {
  const actuales = getProgramedTransations();
  const actualizadas = actuales.filter((tx) => tx.id !== id);
  saveProgramedTransations(actualizadas);
  return actualizadas;
}

export function obtenerTransaccionesVencidas() {
  const ahora = new Date();
  return getProgramedTransations().filter((tx) => new Date(tx.fecha) <= ahora);
}