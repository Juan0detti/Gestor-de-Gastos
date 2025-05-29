import { getGoals, saveGoals } from "../capa_persistencia/ObjetivosStorage";
import { v4 as uuidv4 } from "uuid";

export function DataGoalValidation(name, date, amount)    {
    const errors = {};

    const hoy = new Date().toISOString().split("T")[0];

    if (!date) errors.date = "La fecha es obligatoria.";
    else if (date < hoy) errors.date = "La fecha no puede ser pasada.";

    if (!amount && amount !== 0) {
        errors.amount = "El monto es obligatorio.";
    } else if (parseFloat(amount) < 0) {
        errors.amount = "El monto no puede ser negativo.";
    }

    if (!name) errors.name = "El nombre no pude estar vacio o ser nulo";

    return errors;
}

export function addGoal(name, date, amount, description) {

    const newGoal = {
    id: uuidv4(),
    name: name,
    date: date,
    amount: amount,
    description: description,
    saved: 0,
  };

  const currentGoals = getGoals();
  const updatedGoals = [...currentGoals, newGoal];
  saveGoals(updatedGoals);

  return newGoal;
}

export function eliminateGoal(id) {
    const currentGoals = getGoals();
    const updatedGoal = [...currentGoals.filter((goal)=>goal.id!=id)];
    saveGoals(updatedGoal);

    return updatedGoal;
}

export function getTotalSaved() {
  const currentGoals = getGoals();
  return currentGoals.reduce((acc, goal) => acc + (goal.saved || 0), 0);
}
