import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [etiquetas, setEtiquetas] = useState(!localStorage.getItem('etiquetas')?[{"nombre":"Comida","frecuencia":0},{"nombre":"Juegos","frecuencia":0},{"nombre":"Entretenimentos","frecuencia":0},{"nombre":"Datos Celular","frecuencia":1},{"nombre":"Transporte","frecuencia":0},{"nombre":"Fotocopias","frecuencia":0}]: localStorage.getItem('etiquetas'));
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    etiquetas: [],
    descripcion: '',
    tipo: 'Gasto', // valor por defecto
  });

  const [editingId, setEditingId] = useState(null);
  const [camposIncompletos, setCamposIncompletos] = useState(false);
  const [fechaInvalida, setFechaInvalida] = useState(false);
  const [montoInvalida, setMontoInvalida] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [mostrarModalEtiquetas, setMostrarModalEtiquetas] = useState(false);
  const [nuevaEtiquetaNombre, setNuevaEtiquetaNombre] = useState('');
  const [showCrearEtiqueta, setShowCrearEtiqueta] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');


  const [mostrarModalFiltando, setMostrarModalFiltando] = useState(false);
  const [estaFiltrando, setestaFiltrando] = useState(false);
  const [saldo, setSaldo] = useState(0);
  
  useEffect(() => {
    const savedTransacciones = localStorage.getItem('transacciones');
    if (savedTransacciones) {
      setTransacciones(JSON.parse(savedTransacciones));
    }
    const savedEtiquetas = localStorage.getItem('etiquetas');
    if (savedEtiquetas) {
      setEtiquetas(JSON.parse(savedEtiquetas));
    }
    setIsLoaded(true);
  }, []);

  const calcularSaldo = () => {
    return transacciones.reduce((saldo, tx) => {
      const monto = parseFloat(tx.amount);
      if (tx.tipo === 'Ingreso') {
        return saldo + monto;
      } else if (tx.tipo === 'Gasto') {
        return saldo - monto;
      }
      return saldo;
    }, 0);
  };  

  useEffect(() => {
    if (isLoaded && !estaFiltrando) {
      const nuevoSaldo = calcularSaldo();
      setSaldo(nuevoSaldo);
      localStorage.setItem('transacciones', JSON.stringify(transacciones));
      localStorage.setItem('saldo', nuevoSaldo);
    }
  }, [transacciones, isLoaded]);  

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
    }
  }, [etiquetas, isLoaded]);

  const handleGuardar = () => {
    set
    const { date, amount, etiquetas: etiquetasSeleccionadas, descripcion, tipo } = formData;

    if (!date || !amount) {
      setCamposIncompletos(true);
      return;
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (date > hoy) {
      setFechaInvalida(true);
      return;
    }

    if (parseFloat(amount) < 0) {
      setMontoInvalida(true);
      return;
    }

    const nuevasEtiquetas = [...etiquetas];
    etiquetasSeleccionadas.forEach((nombreEtiqueta) => {
      const index = nuevasEtiquetas.findIndex((e) => e.nombre === nombreEtiqueta);
      if (index !== -1) {
        nuevasEtiquetas[index].frecuencia += 1;
      } else {
        nuevasEtiquetas.push({ nombre: nombreEtiqueta, frecuencia: 1 });
      }
    });
    setEtiquetas(nuevasEtiquetas);

    if (tipo === undefined) {
      tipo = 'Gasto';
    }

    if (editingId) {
      setTransacciones((prev) =>
        prev.map((tx) =>
          tx.id === editingId ? { ...formData, id: editingId } : tx
        )
      );
    } else {
      const nueva = { ...formData, id: Date.now().toString() };
      setTransacciones((prev) => [...prev, nueva]);
    }

    setFormData({ date: '', amount: '', etiquetas: [], descripcion: '', tipo:'Gasto'});
    setEditingId(null);
    setMostrarFormulario(false);
  };

  const handleEditar = (id) => {
    const tx = transacciones.find((t) => t.id === id);
    if (tx) {
      setFormData({ ...tx });
      setEditingId(id);
      setMostrarFormulario(true);
    }
  };

  const handleEliminar = (id) => {
    setTransacciones((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFiltrar = ()  => {
    const { date, amount, etiquetas: etiquetasSeleccionadas, descripcion, tipo} = formData;
  
    const hoy = new Date().toISOString().split('T')[0];
    if (date > hoy) {
        setFechaInvalida(true);
        return;
    }
  
    if (parseFloat(amount) < 0) {
        setMontoInvalida(true);
        return;
    }
      
    const savedTransacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

    const coincidencias = savedTransacciones.filter((tx) => {
        return (
            (date ? tx.date === date : true) &&
            (amount != '' ? tx.amount === amount : true) &&
            (etiquetasSeleccionadas.length > 0
              ? tx.etiquetas?.some(et => etiquetasSeleccionadas.includes(et))
              : true) &&
            (tipo != ''? tx.tipo === tipo : true)
          );
    });

    setTransacciones(coincidencias);
    setMostrarFormulario(false);
    setMostrarModalFiltando(false)
  }

  const etiquetasOrdenadas = [...etiquetas].sort((a, b) => b.frecuencia - a.frecuencia);

  const toggleEtiqueta = (nombreEtiqueta) => {
    setFormData((prev) => {
      const etiquetasActuales = prev.etiquetas || [];
      if (etiquetasActuales.includes(nombreEtiqueta)) {
        return {
          ...prev,
          etiquetas: etiquetasActuales.filter((e) => e !== nombreEtiqueta),
        };
      } else {
        return {
          ...prev,
          etiquetas: [...etiquetasActuales, nombreEtiqueta],
        };
      }
    });
  };

  return (
    <div className="container">
      <div className='barra'>
        <h2>Saldo actual:</h2> <h3>${saldo.toFixed(2)}</h3>
      </div>

      <div className="barra">
        <h1>Transacciones</h1>
        <div className='FiltrarAñadir'>
          <button onClick={()=> {setMostrarFormulario(true); setestaFiltrando(true); setMostrarModalFiltando(true); setFormData({ date: '', amount: '', etiquetas: [], descripcion: '', tipo:''});}} >Filtrar</button>
          { !estaFiltrando && <button onClick={() => setMostrarFormulario(true)}>Añadir</button> }
        </div>
      </div>

        {/* Modal Formulario General */}
      {(mostrarFormulario) && (
        <div className="modal">
          <div className="modalContenido">
            { (mostrarModalFiltando? <h2>Filtrar Transacción</h2>: <h2>{editingId ? 'Editar' : 'Crear'} transacción</h2>)   }
            <label>
              Fecha de transacción:
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setFechaInvalida(false);
                  setCamposIncompletos(false);
                }}
              />
            </label>
            {fechaInvalida && <p className="error">La fecha no puede ser futura. 
              <div> Si desea puede {estaFiltrando? "Filtrar Transacciones Futuras" : "Programar una Transacción"}  
                <Link to={"/transaccionesProgramadas"}>
                  <button className='IrTransaccionesProgramadas'> Programar Transacción</button> 
                </Link>    
              </div>
              </p>}

              <label>
                Tipo:
              </label>

            <label>
              Monto:
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  setMontoInvalida(false);
                  setCamposIncompletos(false);
                }}
              />
            </label>
            {montoInvalida && <p className="error">El monto no puede ser negativo</p>}
            {camposIncompletos && <p className="error">Completa todos los campos obligatorios.</p>}


            <label>
              Tipo de transacción:
              <div>
                <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                  {estaFiltrando && <option value="">Sin seleccionar</option>}
                  <option value="Gasto">Gasto</option>
                  <option value="Ingreso">Ingreso</option>
                </select>
              </div>
            </label>

            { !mostrarModalFiltando &&
            <label>
              Descripción (opcional):
              <div>
                <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                    }
                />
              </div>
            </label>
            }
            <label>
              Etiquetas {!mostrarModalFiltando && '(opcional)'}:
              <div className="etiquetas">
              {(() => {
                const seleccionadas = etiquetasOrdenadas.filter(et => formData.etiquetas.includes(et.nombre));
                const noSeleccionadas = etiquetasOrdenadas.filter(et => !formData.etiquetas.includes(et.nombre));
                
                const mostrar = seleccionadas.length > 6 ? seleccionadas : [...seleccionadas, ...noSeleccionadas.slice(0, 6 - seleccionadas.length)];

                return mostrar.map((etiqueta) => (
                  <button key={etiqueta.nombre} type="button" className={formData.etiquetas.includes(etiqueta.nombre) ? 'etiqueta seleccionada' : 'etiqueta'} onClick={() => toggleEtiqueta(etiqueta.nombre)}>
                    {etiqueta.nombre}
                  </button>
                ));
              })()}

                <button
                  type="button"
                  className="etiqueta gestionar"
                  onClick={() => setMostrarModalEtiquetas(true)}>Selecionar + etiquetas </button>
              </div>
            </label>

            <div className="botones">
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setMostrarModalFiltando(false)
                  setFechaInvalida(false);
                  setMontoInvalida(false);
                  setEditingId(null);
                  setFormData({ date: '', amount: '', etiquetas: [], descripcion: '' });
                }}
              >
                Cancelar
              </button>
              <button onClick={()=>mostrarModalFiltando? handleFiltrar() : handleGuardar()}>{mostrarModalFiltando?'Filtrar':'Guardar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal + Etiquetas */}
      {mostrarModalEtiquetas && (
        <div className="modal">
            <div className="modalContenido modalEtiquetas">
                <h2>Selecionar + etiquetas</h2>

                <div className="etiquetas">
                    {etiquetas.map((et, index) => (
                    <button
                        key={index}
                        className={
                        formData.etiquetas.includes(et.nombre)? 'etiqueta seleccionada': 'etiqueta'}
            onClick={() => toggleEtiqueta(et.nombre)}
          >
            {et.nombre}
          </button>
        ))}
      </div>

      { !mostrarModalFiltando &&
        <span className="crearEtiqueta">
        <p>Crear nueva etiqueta:</p>
        <div className="filaCrearEtiqueta">
          <button onClick={() => setShowCrearEtiqueta(true)} style={{color : 'white'}}>+</button>
        </div>
      </span>
      }

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <div>
        { mostrarModalFiltando  && <button onClick={()=>setMostrarModalEtiquetas(false)}>Aceptar</button> }
        </div>
        <button onClick={() => {setMostrarModalEtiquetas(false)}} style={{marginTop : '10px', color : 'white'}}>Volver</button>
      </div>
    </div>
  </div>
)}

{/*MODAL Crear etiquetas */}
{showCrearEtiqueta && (
  <div className="modal">
    <div className="modalContenido">
      <h3>Crear nueva etiqueta</h3>
      <input
        type="text"
        value={nuevaEtiqueta}
        onChange={(e) => setNuevaEtiqueta(e.target.value)}
        placeholder="Nombre de la etiqueta"
      />
      <div className="modal-buttons">
        <button style={{color : 'white'}} onClick={() => {
          if (nuevaEtiqueta.trim() !== '') {
            const nueva = { nombre: nuevaEtiqueta.trim(), frecuencia: 0 };
            const etiquetasActuales = JSON.parse(localStorage.getItem("etiquetas")) || [];
            const nombresExistentes = etiquetasActuales.map(e => e.nombre.toLowerCase());
            
            if (!nombresExistentes.includes(nueva.nombre.toLowerCase())) {
              const actualizadas = [...etiquetasActuales, nueva];
              localStorage.setItem("etiquetas", JSON.stringify(actualizadas));
              setEtiquetas(actualizadas);
            }

            setNuevaEtiqueta('');
            setShowCrearEtiqueta(false);
          }
        }}>
          Crear
        </button>
        <button style={{color : 'white'}} onClick={() => {
          setNuevaEtiqueta('');
          setShowCrearEtiqueta(false);
        }}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

      <div className="lista">
        {transacciones.length === 0 ? (
          <p>No hay transacciones registradas.</p>
        ) : (
          <ul>
            {transacciones.map((item) => (
              <li key={item.id}>
                <div className="info">
                  <strong>Fecha:</strong> {item.date} <br />
                  <strong>Monto:</strong> ${item.amount} <br />
                  <strong>Tipo:</strong> {item.tipo} <br />
                  {item.descripcion && (
                    <>
                      <strong>Descripción:</strong> {item.descripcion} <br />
                    </>
                  )}
                  {item.etiquetas && item.etiquetas.length > 0 && (
                    <>
                      <strong>Etiquetas:</strong> {item.etiquetas.join(', ')}
                    </>
                  )}
                </div>
                <div className="botonesItem">
                  <button onClick={() => handleEditar(item.id)} className='editarBoton'>Editar</button>
                  <button onClick={() => handleEliminar(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {estaFiltrando && <button className='cancelar' onClick={()=>{setTransacciones(JSON.parse(localStorage.getItem('transacciones'))); setestaFiltrando(false); setMostrarModalFiltando(false); setFormData({ 
        date: '', amount: '', etiquetas: [], descripcion: '',})}}>Cancelar Filtrado</button>}
    </div>
  );
}