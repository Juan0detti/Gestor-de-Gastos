import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/components_styles/Modal.css';
import PanelSaldo from '../components/PanelSaldo';
import { actualizarMontoActualGoal } from '../../capa_lógica/ObjetivosService';
// Asegúrate de importar lo siguiente correctamente:
import { getSaves, saveSaves } from '../../capa_persistencia/AhorrosStorage';
import { getGoals, saveGoals } from '../../capa_persistencia/ObjetivosStorage';
import Ahorro from '../../capa_lógica/AhorrosService';
import { getBalance } from '../../capa_persistencia/SaldoStorage';

export default function Ahorros() {
  const [ahorros, setAhorros] = useState(getSaves());
  const [showModalRegistrar, setShowModalRegistrar] = useState(false);
  const [showModalEdicion, setShowModalEdicion] = useState(false);
  const [showModalMasEtiquetas, setShowModalMasEtiquetas] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    nombre: '',
    objetivoId: '',
    monto_objetivo: '',
    fecha_fin: '',
    monto_actual: ''
  });

  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    objetivoId: '',
    monto_objetivo: 0,
    fecha_fin: new Date().toISOString().split("T")[0],
    monto_actual: 0
  });

  useEffect(() => {
    console.log('formData actualizado:', formData);
  }, [formData]);

  function actualizarTodosLosMontosDeObjetivos() {
    const goals = getGoals();
    const goalsActualizados = goals.map(goal => actualizarMontoActualGoal(goal));
    saveGoals(goalsActualizados);
  }

  const handleElimination = (id) => {
    const updated = Ahorro.eliminarAhorro(id);
    setAhorros(updated);
    actualizarTodosLosMontosDeObjetivos();
  };

 const handleRegistro = (e) => {
  e.preventDefault();

  const errors = Ahorro.validateData({
    nombre: formData.nombre,
    monto_objetivo: parseFloat(formData.monto_objetivo),
    fecha_fin: formData.fecha_fin,
  });

  setValidationErrors(errors);

  const noErrores = Object.values(errors).every(v => v === '');

  if (!noErrores) {
    return; // si hay errores, cortar ejecución
  }

  // Si no hay errores, guardás el nuevo ahorro
  const nuevoAhorro = new Ahorro(formData);
  const todos = getSaves();
  todos.push(nuevoAhorro);
  saveSaves(todos);
  setAhorros(getSaves());

  actualizarTodosLosMontosDeObjetivos();

  setShowModalRegistrar(false);

  setFormData({
    nombre: '',
    objetivoId: '',
    monto_objetivo: 0,
    fecha_fin: new Date().toISOString().split("T")[0],
    monto_actual: 0
  });

  setValidationErrors({
    nombre: '',
    objetivoId: '',
    monto_objetivo: '',
    fecha_fin: '',
    monto_actual: ''
  });
};


    {/*const handleFiltrar = () => {
        setFiltrando(true);

        const validations = DataTransationValidation(
            formData.transationDate,
            formData.transationAmount
        );

        setValidationErrors(validations);

        if (validations.date !== 'La fecha no puede ser futura.' && validations.amount !== 'El monto no puede ser negativo.') {
            const resultados = filterTransation(
                formData.transationDate,
                formData.transationAmount,
                formData.transationType,
                formData.transationLabels,
                formData.transationName
            );

            setTransactions(resultados);

            setShowModalFiltrar(false);

            setFormData({
                transationName: '',
                transationDate: '',
                transationAmount: '',
                transationType: 'Gasto',
                transationDescription: '',
                transationLabels: []
            });

            setValidationErrors({ date: '', amount: '', name: '' });
        }
    };
*/}


const handleEdicion = () => {
  const nuevosDatosTransformados = {
    nombre: formData.nombre,
    fecha_fin: formData.fecha_fin,
    monto_objetivo: parseFloat(formData.monto_objetivo),
    monto_actual: parseFloat(formData.monto_actual),
    descripcion: formData.descripcion || '',
    etiquetas: formData.etiquetas || [],
  };

  try {
    // Validación base (nombre, fecha, monto objetivo)
    Ahorro.validateData({
      nombre: nuevosDatosTransformados.nombre,
      monto_objetivo: nuevosDatosTransformados.monto_objetivo,
      fecha_fin: nuevosDatosTransformados.fecha_fin,
    });

    const balance = getBalance();

    // Validación personalizada para monto_actual
    if (isNaN(nuevosDatosTransformados.monto_actual) || nuevosDatosTransformados.monto_actual < 0) {
      throw new Error("El monto actual no puede ser negativo.");
    }

    if (nuevosDatosTransformados.monto_actual > nuevosDatosTransformados.monto_objetivo) {
      throw new Error("El monto actual no puede superar el monto objetivo.");
    }

    if (nuevosDatosTransformados.monto_actual > balance.montoLibre) {
      throw new Error("El monto actual no puede superar el saldo disponible.");
    }

    // Si todo es válido, procede
    Ahorro.editarAhorro(editingId, nuevosDatosTransformados);
    const updated = getSaves();
    setAhorros(updated);
    actualizarTodosLosMontosDeObjetivos();

    setShowModalEdicion(false);
    setEditingId('');
    setFormData({
      nombre: '',
      objetivoId: '',
      monto_objetivo: 0,
      fecha_fin: new Date().toISOString().split("T")[0],
      monto_actual: 0,
      descripcion: '',
      etiquetas: []
    });
    setValidationErrors({
      nombre: '',
      objetivoId: '',
      monto_objetivo: '',
      fecha_fin: '',
      monto_actual: ''
    });
  } catch (error) {
    setValidationErrors({
      nombre: error.message.includes('nombre') ? error.message : '',
      monto_objetivo: error.message.includes('monto objetivo') ? error.message : '',
      fecha_fin: error.message.includes('fecha') ? error.message : '',
      monto_actual: error.message.includes('monto actual') || error.message.includes('saldo') ? error.message : '',
      objetivoId: ''
    });
  }
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

    <div className="barra">
      <PanelSaldo />
    </div>

    <div className="barra">
      <h1>Ahorros</h1>
      <div className="FiltrarAñadir">
        <button onClick={() => setShowModalRegistrar(true)}>Registrar</button>
      </div>
    </div>

    {/* Listado de ahorros */}
<div className="ahorros-list">
  {ahorros.length === 0 ? (
    <p>No hay ahorros registrados.</p>
  ) : (
    ahorros.map((ahorro) => {
  const porcentaje = Math.min(100, (ahorro.monto_actual / ahorro.monto_objetivo) * 100);

  return (
    <div key={ahorro.id} className="ahorro-card" style={{boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'}}>
  <h3><strong>Título: </strong>{ahorro.nombre}</h3>

  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>Fecha límite: {ahorro.fecha_fin}</span>
    <span>${ahorro.monto_actual.toFixed(2)}/${ahorro.monto_objetivo.toFixed(2)}</span>
  </div>

  {/* Barra de progreso con sombra */}
  <div style={{
    backgroundColor: '#ddd',
    borderRadius: '8px',
    height: '12px',
    margin: '8px 0',
    overflow: 'hidden',
  }}>
    <div style={{
      width: `${porcentaje}%`,
      backgroundColor: 'green',
      height: '100%',
      transition: 'width 0.3s ease',
    }} />
  </div>

  <button
    onClick={() => {
      setEditingId(ahorro.id);
      setFormData({ ...ahorro });
      setShowModalEdicion(true);
    }}
    className="editarBoton"
    style={{ justifyContent: 'end' }}
  >
    Editar
  </button>
  <button
    className="eliminarBoton"
    style={{ justifyContent: 'end' }}
    onClick={() => handleElimination(ahorro.id)}
  >
    Eliminar
  </button>
</div>

  );
})

  )}
</div>

    {/* Modal Registrar */}
    {showModalRegistrar && (
      <form className="modal" onSubmit={handleRegistro}>
        <div className="modalContenido">
          <h2>Registrar un nuevo ahorro</h2>

          <label>Ingrese el título del ahorro</label>
          <input
            type="text"
            placeholder="Nombre:"
            value={formData.nombre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nombre: e.target.value }))
            }
            required
          />

          <label>Ingrese la fecha límite del ahorro</label>
          <input
            type="date"
            placeholder="Fecha:"
            value={formData.fecha_fin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fecha_fin: e.target.value }))
            }
          />
          {validationErrors.fecha_fin && (
            <p className="error">
              {validationErrors.fecha_fin}
              {validationErrors.fecha_fin === "La fecha no puede ser futura." && (
                <Link to="/transaccionesProgramadas">
                  <button
                    className="buttons"
                    style={{
                      fontSize: "0.6rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginLeft: "8px",
                    }}
                  >
                    Programar una transacción
                  </button>
                </Link>
              )}
            </p>
          )}

          <label>Ingrese el monto objetivo a ahorrar</label>
          <input
            type="number"
            placeholder="Monto:"
            value={formData.monto_objetivo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto_objetivo: e.target.value,
              }))
            }
          />
          {validationErrors.monto_objetivo && (
            <p className="error">{validationErrors.monto_objetivo}</p>
          )}

          <label>Ingrese el monto actual (asignado)</label>
          <input
            type="number"
            placeholder="Monto actual:"
            value={formData.monto_actual}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto_actual: e.target.value,
              }))
            }
          />
          {validationErrors.monto_actual && (
            <p className="error">{validationErrors.monto_actual}</p>
          )}

          <label>Ingrese una descripción (opcional)</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                descripcion: e.target.value,
              }))
            }
          ></textarea>

          <div className="modal-buttons">
            <button
              className="buttons"
              type="button"
              onClick={() => {
                setShowModalRegistrar(false);
                setFormData({
                  nombre: "",
                  objetivoId: '',
                  monto_objetivo: 0,
                  fecha_fin: new Date().toISOString().split("T")[0],
                  monto_actual: 0,
                  descripcion: "",
                  etiquetas: [],
                });
                setValidationErrors({
                  nombre: "",
                  objetivoId: "",
                  monto_objetivo: "",
                  fecha_fin: "",
                  monto_actual: "",
                });
              }}
            >
              Cancelar
            </button>{" "}
            <button className="buttons" type="submit">
              Registrar
            </button>
          </div>
        </div>
      </form>
    )}

    {/* Modal Edición */}
    {showModalEdicion && (
      <div className="modal">
        <div className="modalContenido">
          <h2>Editar ahorro</h2>

          <label>Ingrese el nuevo nombre del ahorro</label>
          <input
            type="text"
            placeholder="Nombre:"
            value={formData.nombre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nombre: e.target.value }))
            }
            required
          />

          <label>Ingrese la nueva fecha límite</label>
          <input
            type="date"
            placeholder="Fecha:"
            value={formData.fecha_fin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fecha_fin: e.target.value }))
            }
          />
          {validationErrors.fecha_fin && (
            <p className="error">{validationErrors.fecha_fin}</p>
          )}

          <label>Ingrese el nuevo monto objetivo</label>
          <input
            type="number"
            placeholder="Monto:"
            value={formData.monto_objetivo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto_objetivo: e.target.value,
              }))
            }
          />
          {validationErrors.monto_objetivo && (
            <p className="error">{validationErrors.monto_objetivo}</p>
          )}

          <label>Ingrese el nuevo monto actual</label>
          <input
            type="number"
            placeholder="Monto actual:"
            value={formData.monto_actual}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto_actual: e.target.value,
              }))
            }
          />
          {validationErrors.monto_actual && (
            <p className="error">{validationErrors.monto_actual}</p>
          )}

          <label>Ingrese una nueva descripción (opcional)</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                descripcion: e.target.value,
              }))
            }
          ></textarea>

          <div className="modal-buttons">
            <button
              className="buttons"
              type="button"
              onClick={() => {
                setShowModalEdicion(false);
                setFormData({
                  nombre: "",
                  objetivoId: '',
                  monto_objetivo: 0,
                  fecha_fin: new Date().toISOString().split("T")[0],
                  monto_actual: 0,
                  descripcion: "",
                  etiquetas: [],
                });
                setValidationErrors({
                  nombre: "",
                  objetivoId: "",
                  monto_objetivo: "",
                  fecha_fin: "",
                  monto_actual: "",
                });
              }}
            >
              Cancelar
            </button>{" "}
            <button className="buttons" onClick={handleEdicion}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}