const STORAGE_KEY = "transacciones_programadas";

export function getProgramedTransations() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProgramedTransations(transations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transations));
}