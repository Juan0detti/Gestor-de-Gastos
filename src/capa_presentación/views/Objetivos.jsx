import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
  validateGoalData,
  addGoal,
  editGoal,
  actualizarMontoActualGoal,
  eliminateGoal
} from "../../capa_lógica/ObjetivosService";
import '../components/components_styles/Modal.css';
import ListaObjetivosOrdenada from '../components/ListaObjetivosOrdenada';
import { getGoals } from '../../capa_persistencia/ObjetivosStorage';
import { getSaves } from "../../capa_persistencia/AhorrosStorage";
import PanelSaldo from '../components/PanelSaldo';

export default function Objetivos() {
  const [showModalRegistrar, setShowModalRegistrar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [objetivos, setObjetivos] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    descripcion: '',
    monto_objetivo: '',
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: '',
    etiquetas: [],
    instanciasAsociadas: []
  });
  const [validationErrors, setValidationErrors] = useState({});

  const cargarObjetivos = () => {
    const goals = getGoals();
    const ordenados = [...goals].sort((a, b) => new Date(a.fecha_fin) - new Date(b.fecha_fin));
    setObjetivos(ordenados);
  };

  useEffect(() => {
    cargarObjetivos();
  }, []);

  const limpiarForm = () => {
    setFormData({
      titulo: '',
      tipo: '',
      descripcion: '',
      monto_objetivo: '',
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_fin: '',
      etiquetas: [],
      instanciasAsociadas: []
    });
    setValidationErrors({});
  };

  const handleRegistro = () => {
    const errores = validateGoalData(formData);
    setValidationErrors(errores);

    const sinErrores = Object.values(errores).every(e => !e);
    if (sinErrores) {
      addGoal(
        formData.titulo,
        formData.tipo,
        formData.descripcion,
        formData.monto_objetivo,
        formData.fecha_inicio,
        formData.fecha_fin,
        formData.etiquetas,
        formData.instanciasAsociadas
      );
      cargarObjetivos();
      setShowModalRegistrar(false);
      limpiarForm();
    }
  };

  const handleEditar = () => {
    const errores = validateGoalData(formData);
    setValidationErrors(errores);

    const sinErrores = Object.values(errores).every(e => !e);
    if (sinErrores) {
      editGoal(editingId, formData);
      cargarObjetivos();
      setShowModalEditar(false);
      limpiarForm();
    }
  };

  const handleEliminar = (id) => {
    const confirmacion = confirm("¿Estás seguro de que querés eliminar este objetivo?");
    if (confirmacion) {
      eliminateGoal(id);
      cargarObjetivos();
    }
  };

  const abrirModalEditar = (goal) => {
    setEditingId(goal.id);
    setFormData({
      titulo: goal.titulo,
      tipo: goal.tipo,
      descripcion: goal.descripcion || '',
      monto_objetivo: goal.monto_objetivo,
      fecha_inicio: goal.fecha_inicio,
      fecha_fin: goal.fecha_fin,
      etiquetas: goal.etiquetas || [],
      instanciasAsociadas: goal.instanciasAsociadas || []
    });
    setShowModalEditar(true);
  };

  return (
    <div className="container">

      <nav>
          <ul className={"nav-links"}>
            <li><Link to='/ahorros'>Ahorros</Link></li>
            <li><Link to="/objetivos">Objetivos</Link></li>
            <li><Link to="/transacciones">Transacciones</Link></li>
            <li><Link to="/transaccionesProgramadas">Transacciones Programadas</Link></li>
          </ul>
        </nav>

      <div className='barra'>
        <PanelSaldo />
      </div>

      <div className="barra">
        <h1>Objetivos</h1>
        <div className='FiltrarAñadir'>
          <button onClick={() => { }}>Filtrar</button>
          <button onClick={() => setShowModalRegistrar(true)}>Registrar</button>
        </div>
      </div>

      <ListaObjetivosOrdenada
        objetivos={objetivos}
        onEditar={abrirModalEditar}
        onEliminar={handleEliminar}
      />

    {(showModalRegistrar || showModalEditar) &&
    <div className='modal'>
      <div className='modalContenido'>
        <h2>{showModalRegistrar ? "Registrar un objetivo" : "Editar objetivo"}</h2>

        <label>Título</label>
        <input
          type='text'
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
        />
        {validationErrors.titulo && <p className='error'>{validationErrors.titulo}</p>}

        <label>Tipo</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
        >
          <option value="">Seleccionar</option>
          <option value="saldo_minimo">Saldo mínimo</option>
          <option value="gasto_acumulado">Gasto acumulado</option>
          <option value="ahorro">Ahorro</option>
        </select>
        {validationErrors.tipo && <p className='error'>{validationErrors.tipo}</p>}

        {formData.tipo === "ahorro" && (
  <>
    <label>Seleccionar ahorro</label>
    <select
      value={formData.ahorroId || ""}
      onChange={(e) => {
        const ahorroId = e.target.value;
        const ahorroSeleccionado = getSaves().find(a => a.id === ahorroId);

        if (ahorroSeleccionado) {
          setFormData(prev => ({
            ...prev,
            ahorroId,
            monto_objetivo: ahorroSeleccionado.monto_objetivo,
            fecha_fin: ahorroSeleccionado.fecha_fin,
            instanciasAsociadas: [
              {
                ahorroId: ahorroSeleccionado.id, // ✅ aquí se guarda el ahorroId
                tipo: "ahorro",
                monto_objetivo: ahorroSeleccionado.monto_objetivo,
                monto_actual: ahorroSeleccionado.monto_actual ?? 0
              }
            ]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            ahorroId: "",
            monto_objetivo: "",
            fecha_fin: "",
            instanciasAsociadas: []
          }));
        }
      }}
    >
      <option value="">Seleccionar</option>
      {
        getSaves().map(ahorro => (
          <option key={ahorro.id} value={ahorro.id}>{ahorro.nombre}</option>
        ))
      }
    </select>
    {validationErrors.ahorroId && <p className='error'>{validationErrors.ahorroId}</p>}
  </>
)}


        <label>Monto objetivo</label>
        <input
          type='number'
          value={formData.monto_objetivo}
          onChange={(e) => setFormData(prev => ({ ...prev, monto_objetivo: e.target.value }))}
        />
        {validationErrors.monto_objetivo && <p className='error'>{validationErrors.monto_objetivo}</p>}

        <label>Fecha inicio</label>
        <input
          type='date'
          value={formData.fecha_inicio}
          onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
        />
        {validationErrors.fecha_inicio && <p className='error'>{validationErrors.fecha_inicio}</p>}

        <label>Fecha fin</label>
        <input
          type='date'
          value={formData.fecha_fin}
          onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
        />
        {validationErrors.fecha_fin && <p className='error'>{validationErrors.fecha_fin}</p>}

        <label>Descripción (opcional)</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
        />

        <div className='modal-buttons'>
          <button
            type='button'
            className='buttons'
            onClick={() => {
              setShowModalRegistrar(false);
              setShowModalEditar(false);
              limpiarForm();
            }}
          >
            Cancelar
          </button>
          <button
            className='buttons'
            onClick={showModalRegistrar ? handleRegistro : handleEditar}
          >
            {showModalRegistrar ? "Registrar" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  }
    </div>
  );
}