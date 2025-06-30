import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../capa_lógica/UsuariosService";
import "../../styles/Register.css";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors({});
    setGeneralError("");
  };

  const handleRegistro = (e) => {
    e.preventDefault();

    const result = registerUser(formData);

    if (!result.success) {
      setErrors(result.errors || {});
      setGeneralError(result.errors?.general || "Error en el registro");
    } else {
      setErrors({});
      setGeneralError("");
      navigate("/"); // Redirige al login tras éxito
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegistro}>
        <h2>Crear una cuenta</h2>

        <label htmlFor="name">Nombre completo</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="********"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        {generalError && <p className="error">{generalError}</p>}

        <button type="submit" className="register-button">
          Registrarse
        </button>
      </form>

      <p className="login-link">
        ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
      </p>
    </div>
  );
};