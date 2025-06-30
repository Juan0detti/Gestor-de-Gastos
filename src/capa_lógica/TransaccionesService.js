import { getBalance } from "../capa_persistencia/SaldoStorage";
import { getTransations, saveTransations } from "../capa_persistencia/TransaccionesStorage";
import {actualizarSaldoPorTransaccion} from '../capa_lógica/SaldoService'
import { v4 as uuidv4 } from "uuid";

function soloFecha(fechaString) {
  return fechaString.split('T')[0]; // Extrae solo la parte de la fecha
}

class Transaction {
  constructor ( nombre, monto, fecha, tipo, descripcion, etiquetas ) {
    this.id = uuidv4();
    this.fecha = fecha;
    this.nombre = nombre;
    this.monto = monto;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.etiquetas = etiquetas;
  }
}

export function DataTransationValidation(date, amount)    {
    const errors = {};

    const hoy = new Date().toISOString().split("T")[0];

    if (!date) errors.date = "La fecha es obligatoria.";
    else if (date > hoy) errors.date = "La fecha no puede ser futura.";

    if (!amount && amount !== 0) {
        errors.amount = "El monto es obligatorio.";
    } else if (parseFloat(amount) < 0) {
        errors.amount = "El monto no puede ser negativo.";
    }

    return errors;
}

export function addTransation(nombre, monto, fecha, tipo, descripcion, etiquetas) {

    const newTransation = new Transaction (nombre, monto, fecha, tipo, descripcion, etiquetas);

  const currentTransation = getTransations();
  const updatedTransation = [...currentTransation, newTransation];
  saveTransations(updatedTransation);

  const saldo = getBalance();

  actualizarSaldoPorTransaccion(newTransation.id, null, 'creacion');

  return newTransation;
}

export function filterTransation(fecha_inicio, fecha_fin, monto, tipo, etiquetas) {
  const allTransactions = getTransations();

  return allTransactions.filter((transaction) => {
    const fecha = soloFecha(transaction.fecha);

    if (fecha_inicio && fecha_inicio !== 'sin seleccionar' && fecha < fecha_inicio) return false;
    if (fecha_fin && fecha_fin !== 'sin seleccionar' && fecha > fecha_fin) return false;

    if (monto && monto !== 'sin seleccionar' && parseFloat(transaction.monto) !== parseFloat(monto)) return false;

    if (tipo && tipo !== "sin-seleccionar" && transaction.tipo !== tipo) return false;

    if (etiquetas && etiquetas.length > 0) {
      const contieneTodas = etiquetas.every(etiqueta => transaction.etiquetas?.includes(etiqueta));
      if (!contieneTodas) return false;
    }

    return true;
  });
}

export function editTransation(id, nuevosDatos) {
  const transacciones = getTransations();
  let montoViejo;
  let tipoViejo;

  const transaccionesActualizadas = transacciones.map((trans) => {
    if (trans.id === id) {
      montoViejo = trans.monto;
      tipoViejo = trans.tipo;
      return {
        ...trans,
        nombre: nuevosDatos.nombre,
        fecha: nuevosDatos.fecha,
        monto: nuevosDatos.monto,
        tipo: nuevosDatos.tipo,
        descripcion: nuevosDatos.descripcion,
        etiquetas: nuevosDatos.etiquetas
      };

    }
    return trans;
  });
  saveTransations(transaccionesActualizadas);

  if (tipoViejo === nuevosDatos.tipo) {
    actualizarSaldoPorTransaccion(id, montoViejo, 'edicion');
  } else {
    actualizarSaldoPorTransaccion(id, -montoViejo, 'edicion');
  }
}

export function eliminateTransaction(id) {
    const currentTransation = getTransations();
    const updatedTransation = [...currentTransation.filter((transation)=>transation.id!=id)];
    
    actualizarSaldoPorTransaccion(id, null, 'eliminacion');
    saveTransations(updatedTransation);

    return updatedTransation;
}