const STORAGE_KEY = "transacciones";

export function getTransations() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransations(transations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transations));
}