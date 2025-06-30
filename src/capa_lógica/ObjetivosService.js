import { getGoals, saveGoals } from "../capa_persistencia/ObjetivosStorage";
import { getTransations } from '../capa_persistencia/TransaccionesStorage'
import { getBalance } from "../capa_persistencia/SaldoStorage";
import { v4 as uuidv4 } from "uuid";

export function validateGoalData(goal) {
  const errors = {};
  const hoy = new Date().toISOString().split("T")[0];

  // Título
  if (!goal.titulo || goal.titulo.trim() === "") {
    errors.titulo = "El título es obligatorio.";
  }

  // Tipo
  const tiposPermitidos = ["ahorro", "gasto_acumulado", "saldo_minimo"];
  if (!goal.tipo || !tiposPermitidos.includes(goal.tipo)) {
    errors.tipo = "Tipo inválido. Debe ser 'ahorro', 'gasto_acumulado' o 'saldo_minimo'.";
  }

  // Monto objetivo
  if (goal.monto_objetivo === undefined || goal.monto_objetivo === null || goal.monto_objetivo === "") {
    errors.monto_objetivo = "El monto objetivo es obligatorio.";
  } else if (parseFloat(goal.monto_objetivo) <= 0) {
    errors.monto_objetivo = "El monto debe ser mayor que 0.";
  }

  // Fecha fin
  if (!goal.fecha_fin) {
    errors.fecha_fin = "La fecha de finalización es obligatoria.";
  }

  // Fecha inicio (solo debe ser posterior a la de fin si ambas existen)
  if (goal.fecha_inicio && goal.fecha_fin && goal.fecha_fin < goal.fecha_inicio) {
    errors.fecha_fin = "La fecha de finalización debe ser posterior a la de inicio.";
  }

  // Etiquetas
  if (goal.etiquetas && !Array.isArray(goal.etiquetas)) {
    errors.etiquetas = "Las etiquetas deben estar en una lista.";
  }

  // Instancias asociadas
  if (goal.instanciasAsociadas && !Array.isArray(goal.instanciasAsociadas)) {
    errors.instanciasAsociadas = "Las instancias asociadas deben estar en un arreglo.";
  }

  return errors;
}

export function addGoal(
  titulo,
  tipo,
  descripcion = '',
  monto_objetivo,
  fecha_inicio = new Date().toISOString().split("T")[0],
  fecha_fin,
  etiquetas = [],
  instanciasAsociadas = []
) {
  const hoy = new Date().toISOString().split("T")[0];

  const id = uuidv4();
  let monto_actual = 0;

  if (tipo === 'saldo_minimo') {
    monto_actual = getBalance().total;
  }

  if (tipo === 'gasto_acumulado') {
    const transacciones = getTransations ();
    
    instanciasAsociadas =  transacciones.filter(t => t.fecha >= fecha_inicio && t.fecha <= fecha_fin);
    
    const total = instanciasAsociadas.reduce((acc, t) => acc + parseFloat(t.monto), 0);
    monto_actual = total;
  }

  if (tipo === 'ahorro') {
    const existeInstanciaAhorro = instanciasAsociadas.some(inst => inst.tipo === 'ahorro');
    if (!existeInstanciaAhorro) {
      throw new Error("Los objetivos de tipo 'ahorro' deben tener una instancia de Ahorro asociada.");
    }
    monto_actual = instanciasAsociadas[0].monto_actual;
    monto_objetivo = instanciasAsociadas[0].monto_objetivo;
  }

  const newGoal = {
    id,
    titulo,
    tipo,
    descripcion,
    monto_objetivo: parseFloat(monto_objetivo),
    fecha_inicio,
    fecha_fin,
    estado: 'en progreso',
    etiquetas,
    instanciasAsociadas,
    monto_actual
  };

  const currentGoals = getGoals();
  const updatedGoals = [...currentGoals, newGoal];
  saveGoals(updatedGoals);

  return newGoal;
}

export function editGoal(
  id,
  {
    titulo,
    tipo,
    descripcion = '',
    monto_objetivo,
    fecha_inicio,
    fecha_fin,
    etiquetas = [],
    instanciasAsociadas = []
  }
) {
  const goals = getGoals();
  const goalIndex = goals.findIndex(g => g.id === id);

  if (goalIndex === -1) {
    throw new Error(`No se encontró el objetivo con ID: ${id}`);
  }

  let monto_actual = 0;

  if (tipo === 'saldo_minimo') {
    monto_actual = getBalance().getMontoTotal;
  }

  if (tipo === 'gasto_acumulado') {
    const transacciones = getTransations ();
    instanciasAsociadas = transacciones.filter(t => t.fecha >= fecha_inicio && t.fecha <= fecha_fin);
    const total = instanciasAsociadas.reduce((acc, t) => acc + parseFloat(t.monto), 0);
    monto_actual = total;
  }

  if (tipo === 'ahorro') {
    const existeInstanciaAhorro = instanciasAsociadas.some(inst => inst.tipo === 'ahorro');
    if (!existeInstanciaAhorro) {
      throw new Error("Los objetivos de tipo 'ahorro' deben tener una instancia de Ahorro asociada.");
    }
    monto_actual = instanciasAsociadas[0].monto_actual;
    monto_objetivo = instanciasAsociadas[0].monto_objetivo;
  }

  const updatedGoal = {
    ...goals[goalIndex],
    titulo,
    tipo,
    descripcion,
    monto_objetivo: parseFloat(monto_objetivo),
    fecha_inicio,
    fecha_fin,
    etiquetas,
    instanciasAsociadas,
    monto_actual
  };

  goals[goalIndex] = updatedGoal;
  saveGoals(goals);

  return updatedGoal;
}

export function actualizarMontoActualGoal(goal) {
  let monto_actual = 0;

  if (goal.tipo === 'saldo_minimo') {
    // Requiere actualizar desde el saldo actual
    const saldo = getBalance();
    monto_actual = saldo.total ?? 0;
  }

  else if (goal.tipo === 'gasto_acumulado') {
    // Requiere calcular nuevamente desde las transacciones dentro del rango
    const transacciones = getTransations();
    const relevantes = transacciones.filter(t =>
      t.fecha >= goal.fecha_inicio && t.fecha <= goal.fecha_fin
    );
    monto_actual = relevantes.reduce((acc, t) => acc + parseFloat(t.monto), 0);
    goal.instanciasAsociadas = relevantes;
  }

  else if (goal.tipo === 'ahorro') {
    const instancia = goal.instanciasAsociadas?.find(i => i.tipo === 'ahorro');
    if (!instancia) {
      throw new Error("Falta la instancia de ahorro en este objetivo.");
    }
    monto_actual = instancia.monto_actual;
    goal.monto_objetivo = instancia.monto_objetivo;
  }

  return {
    ...goal,
    monto_actual,
  };
}

export function eliminateGoal(id) {
    const currentGoals = getGoals();
    const updatedGoal = [...currentGoals.filter((goal)=>goal.id!=id)];
    saveGoals(updatedGoal);

    return updatedGoal;
}