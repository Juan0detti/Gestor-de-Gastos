// userServices.js
import { getUsers, saveUsers } from "../capa_persistencia/UsuariosStorage";

// Validaciones
function validateRegisterData({ nombre, email, password, confirmPassword }) {
  const errors = {};

  if (!nombre || nombre.trim().length < 3) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Ingrese un email válido.";
  }

  if (!password || password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
}

function validateLoginData({ email, password }) {
  const errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Ingrese un email válido.";
  }

  if (!password || password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errors;
}

// Registrar
export function registerUser({ name, email, password, confirmPassword }) {
  const errors = {};

  // Validaciones
  if (!name || name.trim() === "") {
    errors.name = "El nombre es obligatorio.";
  }

  if (!email || email.trim() === "") {
    errors.email = "El correo es obligatorio.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "El correo no es válido.";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Obtener usuarios existentes
  const users = getUsers();

  // Verificar si el email ya está registrado
  if (users.some((u) => u.email === email)) {
    return {
      success: false,
      errors: { email: "Ya existe una cuenta con este correo." }
    };
  }

  // Registrar nuevo usuario
  const nuevoUsuario = {
    id: crypto.randomUUID(),
    name,
    email,
    password
  };

  users.push(nuevoUsuario);
  saveUsers(users);

  return { success: true };
}

// Login
export function loginUser({ email, password }) {
  const errors = validateLoginData({ email, password });
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, errors: { general: "Email o contraseña incorrectos." } };
  }

  return { success: true, user };
}
