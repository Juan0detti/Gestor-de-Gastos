import React, { useEffect, useState } from 'react';

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  const [camposIncompletos, setCamposIncompletos] = useState(false);
  const [fechaInvalida, setFechaInvalida] = useState(false);
  const [montoInvalida, setMontoInvalida] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saldo, setSaldo] = useState(parseFloat(localStorage.getItem('saldo')));

  useEffect(() => {
    const saved = localStorage.getItem('objetivos');
    if (saved) {
      setObjetivos(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('objetivos', JSON.stringify(objetivos));
    }
  }, [objetivos, isLoaded]);

  const handleGuardar = () => {
    const { startDate, endDate, amount } = formData;

    if (!startDate || !endDate || !amount) {
      setCamposIncompletos(true);
      return;
    }
    if (parseFloat(amount) < 0) {
      setMontoInvalida(true);
      return;
    }
    if (startDate >= endDate) {
      setFechaInvalida(true);
      return;
    }

    const existente = objetivos.find(
      (obj) => obj.startDate === startDate && obj.endDate === endDate
    );

    if (existente && existente.id !== editingId) {
      alert('Ya existe un objetivo con ese rango de fechas.');
      return;
    }

    if (editingId) {
      setObjetivos((prev) =>
        prev.map((obj) =>
          obj.id === editingId ? { ...formData, id: editingId } : obj
        )
      );
    } else {
      const nuevo = { ...formData, id: Date.now().toString() };
      setObjetivos((prev) => [...prev, nuevo]);
    }

    setFormData({ startDate: '', endDate: '', amount: '' });
    setEditingId(null);
    setMostrarFormulario(false);
    setFechaInvalida(false)
    setCamposIncompletos(false)
    setMontoInvalida(false)
    
  };

  const handleEditar = (id) => {
    const objetivo = objetivos.find((obj) => obj.id === id);
    if (objetivo) {
      setFormData({ ...objetivo });
      setEditingId(id);
      setMostrarFormulario(true);
    }
    setFechaInvalida(false)
    setCamposIncompletos(false)
    setMontoInvalida(false)
  };

  const handleEliminar = (id) => {
    setObjetivos((prev) => prev.filter((obj) => obj.id !== id));
  };

  return (
    <div className="container">
      
      <div className='barra'>
        <h2>Saldo actual:</h2> <h3>${saldo.toFixed(2)}</h3>
      </div>

      <div className="barra">
        <h1>Objetivos</h1>
        <button onClick={() => setMostrarFormulario(true)}>Añadir</button>
      </div>

      {mostrarFormulario && (
        <div className="modal">
          <div className="modalContenido">
            <h2>{editingId ? 'Editar' : 'Crear'} objetivo</h2>

            <label>
              Inicio del plazo:
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  setCamposIncompletos(false);
                }}
              />
            </label>

            <label>
              Final del plazo:
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  setFechaInvalida(false);
                }}
              />
            </label>
            {fechaInvalida && (
              <p className="error">La fecha final debe ser posterior a la inicial</p>
            )}

            <label>
              Monto objetivo:
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  setMontoInvalida(false);
                }}
              />
            </label>
            {montoInvalida && <p className="error">El monto no puede ser negativo</p>}
            {camposIncompletos && <p className="error">Completa todos los campos.</p>}

            <div className="botones">
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setEditingId(null);
                  setFormData({ startDate: '', endDate: '', amount: '' });
                  setFechaInvalida(false)
                  setCamposIncompletos(false)
                  setMontoInvalida(false)
                }}
              >
                Cancelar
              </button>
              <button onClick={()=>handleGuardar()}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div className="lista">
        {objetivos.length === 0 ? (
          <p>No hay objetivos registrados.</p>
        ) : (
          <ul>
            {objetivos.map((item) => (
              <li key={item.id}>
                <div className="info">
                  <strong>Desde:</strong> {item.startDate} <br />
                  <strong>Hasta:</strong> {item.endDate} <br />
                  <strong>Monto:</strong> ${item.amount}
                </div>
                <div className="botonesItem">
                  <button onClick={() => handleEditar(item.id)}>Editar</button>
                  <button onClick={() => handleEliminar(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
