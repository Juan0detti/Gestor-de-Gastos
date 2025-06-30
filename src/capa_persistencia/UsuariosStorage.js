// Función para obtener usuarios desde localStorage
const USERS_KEY = "users_local";

export function getUsers() {
  const usersStr = localStorage.getItem(USERS_KEY);
  if (!usersStr) return [];
  return JSON.parse(usersStr);
}

// Guardar usuarios en localStorage
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}