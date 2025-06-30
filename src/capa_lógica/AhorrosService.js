import { v4 as uuidv4 } from "uuid"; // Si usás uuid para id
import { getGoals } from "../capa_persistencia/ObjetivosStorage";
import { getSaves, saveSaves } from "../capa_persistencia/AhorrosStorage";
import { getBalance } from '../capa_persistencia/SaldoStorage';
import { actualizarSaldoPorAhorro } from '../capa_lógica/SaldoService'

// Simular persistencia simple con localStorage (puede ser otro medio)
const STORAGE_KEY = "ahorros";

export default class Ahorro {
  constructor({ objetivoId = null, monto_objetivo, fecha_fin, nombre}) {
    this.id = uuidv4();
    this.nombre = nombre,
    this.objetivoId = objetivoId || null;
    this.monto_objetivo = parseFloat(monto_objetivo);
    this.fecha_fin = fecha_fin;
    this.monto_actual = 0;
    actualizarSaldoPorAhorro(this.id, 0, 'creacion')
  }

 static validateData({ monto_objetivo, fecha_fin, nombre }) {
  const hoy = new Date().toISOString().split("T")[0];
  const errors = {};

  if (
    monto_objetivo === undefined ||
    isNaN(monto_objetivo) ||
    monto_objetivo < 0
  ) {
    errors.monto_objetivo = "El monto objetivo es obligatorio y debe ser un número positivo.";
  }

  if (fecha_fin && fecha_fin <= hoy) {
    errors.fecha_fin = "La fecha fin debe ser futura.";
  }

  if (!nombre || nombre.trim() === '') {
    errors.nombre = "El nombre no debe ser vacío.";
  }

  return errors;
}


  asignarObjetivo(objetivoId) {
    this.objetivoId = objetivoId;
  }

  aportar(monto) {
    monto = parseFloat(monto);
    if (!monto || monto <= 0) {
      throw new Error("El monto debe ser mayor que cero.");
    }

    const nuevoTotal = this.monto_actual + monto;

    if (this.monto_objetivo && nuevoTotal > this.monto_objetivo) {
      throw new Error("El monto total superaría el objetivo de ahorro.");
    }

    this.monto_actual = nuevoTotal;
  }

  quitar(monto) {
    monto = parseFloat(monto);
    if (!monto || monto <= 0) {
      throw new Error("Monto inválido para quitar.");
    }

    const nuevoTotal = this.monto_actual - monto;

    if (nuevoTotal < 0) {
      throw new Error("No se puede quitar más de lo ahorrado.");
    }

    this.monto_actual = nuevoTotal;
  }

  porcentaje() {
    if (!this.monto_objetivo) return null;
    return (this.monto_actual / this.monto_objetivo) * 100;
  }

  estado() {
    if (!this.monto_objetivo || !this.fecha_fin) return "libre";

    const hoy = new Date().toISOString().split("T")[0];
    if (this.monto_actual >= this.monto_objetivo) return "cumplido";
    if (hoy > this.fecha_fin) return "fallido";
    return "en_progreso";
  }

  // --------------- Funciones estáticas para manejo de colección ------------------

  static editarAhorro(id, nuevosValores) {
    const ahorros = getSaves();
    const index = ahorros.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Ahorro no encontrado para editar.");
    }

    actualizarSaldoPorAhorro(this.id, ahorros[index].monto_actual, 'edicion')

    // Editar propiedades
    if (nuevosValores.monto_objetivo !== undefined) {
      ahorros[index].monto_objetivo = parseFloat(nuevosValores.monto_objetivo);
    }
    if (nuevosValores.fecha_fin !== undefined) {
      ahorros[index].fecha_fin = nuevosValores.fecha_fin;
    }

    if (nuevosValores.descripcion !== undefined) {
      ahorros[index].descripcion = nuevosValores.descripcion;
    }

    if (nuevosValores.monto_actual !== undefined) {
      ahorros[index].monto_actual = nuevosValores.monto_actual;
    }

    if (nuevosValores.nombre !== undefined) {
      ahorros[index].nombre = nuevosValores.nombre;
    }

    saveSaves(ahorros);
  }

  static eliminarAhorro(id) {
    const ahorros = getSaves();
    const nuevosAhorros = ahorros.filter((a) => a.id !== id);

    if (nuevosAhorros.length === ahorros.length) {
      throw new Error("Ahorro no encontrado para eliminar.");
    }

    actualizarSaldoPorAhorro(id, 0, 'eliminacion');
    saveSaves(nuevosAhorros);
  }

}
