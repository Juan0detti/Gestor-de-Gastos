import React, { useEffect, useState } from 'react';
import { DataGoalValidation, addGoal, getTotalSaved } from "../../capa_lógica/ObjetivosService";
import '../components/components_styles/Modal.css';
import ListaObjetivosOrdenada from '../components/ListaObjetivosOrdenada';
import { getGoals } from '../../capa_persistencia/ObjetivosStorage';

export default function Objetivos() {
  const [saldo, setSaldo] = useState(0);
  const [showModalRegistrar, setShowModalRegistrar] = useState(false);
  const [formData, setFormData] = useState({ name: '', date: '', amount: '', description: '', saved: 0 });
  const [validationErrors, setValidationErrors] = useState({ date: '', amount: '', name: '' });
  const [objetivos, setObjetivos] = useState([]);

  // Función para cargar y ordenar objetivos
  const cargarObjetivos = () => {
    const goals = getGoals();
    const ordenados = [...goals].sort((a, b) => new Date(a.date) - new Date(b.date));
    setObjetivos(ordenados);

    const saldoTotal = getTotalSaved();
    setSaldo(saldoTotal);
  };

  useEffect(() => {
    cargarObjetivos();
  }, []);

  const handleRegistro = (e) => {
    e.preventDefault();

    const errores = DataGoalValidation(formData.name, formData.date, formData.amount);
    setValidationErrors(errores);

    // Si no hay errores, agrega objetivo y recarga lista
    if (!errores.date && !errores.amount && !errores.name) {
      addGoal(
        formData.name,
        formData.date,
        formData.amount,
        formData.description
      );

      cargarObjetivos();

      setShowModalRegistrar(false);

      setFormData({ name: '', date: '', amount: '', description: '', saved: 0 });

      setValidationErrors({ date: '', amount: '', name: '' });
    }
  };

  return (
    <div className="container">
      <div className='barra'>
        <h2>Saldo actual:</h2> <h3>${saldo.toFixed(2)}</h3>
      </div>

      <div className="barra">
        <h1>Transacciones</h1>
        <div className='FiltrarAñadir'>
          <button onClick={() => { }}>Filtrar</button> <button onClick={() => setShowModalRegistrar(true)}>Registrar</button>
        </div>
      </div>

      <ListaObjetivosOrdenada objetivos={objetivos} />

      {showModalRegistrar &&
        <form className='modal' onSubmit={handleRegistro}>
          <div className='modalContenido'>
            <h2>Registrar un objetivo</h2>

            <label>Ingrese un nombre al objetivo</label>
            <input
              type='text'
              placeholder='Nombre:'
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            {validationErrors.name && <p className='error'>{validationErrors.name}</p>}

            <label>Ingrese la fecha de límite del objetivo</label>
            <input
              type='date'
              placeholder='Fecha:'
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
            {validationErrors.date && <p className='error'>{validationErrors.date}</p>}

            <label>Ingrese el monto a alcanzar</label>
            <input
              type='number'
              placeholder='Monto:'
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
            {validationErrors.amount && <p className='error'>{validationErrors.amount}</p>}

            <label>Ingrese una descripción (Opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <div className='modal-buttons'>
              <button
                type='button'
                className='buttons'
                onClick={() => {
                  setShowModalRegistrar(false);
                  setFormData({ name: '', date: '', amount: '', description: '', saved: 0 });
                  setValidationErrors({ date: '', amount: '', name: '' });
                }}
              >
                Cancelar
              </button>
              <button className='buttons' type='submit'>Registrar</button>
            </div>
          </div>
        </form>
      }
    </div>
  );
}
