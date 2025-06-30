const STORAGE_KEY = "ahorros";

export function getSaves() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSaves(saves) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}