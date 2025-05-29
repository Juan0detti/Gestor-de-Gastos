import { getTransations, saveTransations } from "../capa_persistencia/TransaccionesStorage";
import { v4 as uuidv4 } from "uuid";

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

export function addTransation(date, amount, type, description, labels) {

    const newTransation = {
    id: uuidv4(),
    date: date,
    amount: amount,
    type: type,
    description: description,
    labels: labels
  };

  const currentTransation = getTransations();
  const updatedTransation = [...currentTransation, newTransation];
  saveTransations(updatedTransation);

  return newTransation;
}

export function filterTransation(date, amount, type, labels) {
  const allTransactions = getTransations();

  return allTransactions.filter((transaction) => {

    if (date && date != 'sin seleccionar' && transaction.date !== date) return false;

    if (amount && amount != 'sin seleccionar' && parseFloat(transaction.amount) !== parseFloat(amount)) return false;

    if (type && type !== "sin-seleccionar" && transaction.type !== type) return false;

    if (labels && labels.length > 0) {
      const contieneTodas = labels.every(label => transaction.labels?.includes(label));
      if (!contieneTodas) return false;
    }

    return true;
  });
}

export function editTransation(id, nuevosDatos) {
  const transacciones = getTransations();

  const transaccionesActualizadas = transacciones.map((trans) => {
    if (trans.id === id) {
      return {
        ...trans,
        date: nuevosDatos.date,
        amount: parseFloat(nuevosDatos.amount),
        type: nuevosDatos.type,
        description: nuevosDatos.description,
        labels: nuevosDatos.labels
      };
    }
    return trans;
  });

  saveTransations(transaccionesActualizadas);
}

export function eliminateTransaction(id) {
    const currentTransation = getTransations();
    const updatedTransation = [...currentTransation.filter((transation)=>transation.id!=id)];
    saveTransations(updatedTransation);

    return updatedTransation;
}