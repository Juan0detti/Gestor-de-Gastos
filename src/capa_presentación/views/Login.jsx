import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../capa_lógica/UsuariosService"
import "../../styles/Login.css";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
    setGeneralError("");
  };

  const handleInicio = (e) => {
    e.preventDefault();

    const resultado = loginUser(formData);

    if (!resultado.success) {
      setErrors(resultado.errors);
      setGeneralError(resultado.errors.general || "");
    } else {
      // Login exitoso
      setErrors({});
      setGeneralError("");
      // Aquí se debe guardar el usuario en contexto, localStorage, ó demas.
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleInicio}>
        <h2>Iniciar sesión</h2>

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

        {generalError && <p className="error">{generalError}</p>}

        <button type="submit" className="login-button">
          Ingresar
        </button>
      </form>

      <p className="register-link">
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};