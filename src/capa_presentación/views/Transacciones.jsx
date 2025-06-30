import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTransations } from '../../capa_persistencia/TransaccionesStorage';
import { getLabels } from '../../capa_persistencia/EtiquetasStorage';
import { DataTransationValidation, addTransation, filterTransation, eliminateTransaction, editTransation } from "../../capa_lógica/TransaccionesService";
import {TransaccionesAgrupadasPorFecha } from '../components/TransaccionesAgrupadasPorFechas'
import '../components/components_styles/Modal.css'
import '../../styles/Transacciones.css'
import SelectorEtiquetasLimitado from '../components/SelectorEtiquetasLimitado';
import { addLabel, DataLabelValidation } from '../../capa_lógica/EtiquetasServices';
import PanelSaldo from '../components/PanelSaldo'


export default function Transacciones() {
    const [showModalRegistrar, setShowModalRegistrar] = useState(false);
    const [showModalFiltrar, setShowModalFiltrar] = useState(false);
    const [showModalEdicion, setShowModalEdicion] = useState(false);
    const [showModalMasEtiquetas, setShowModalMasEtiquetas] = useState(false);
    const [showModalCrearEtiquetas, setShowModalCrearEtiquetas] = useState(false);
    const [validationErrors, setValidationErrors] = useState({ date: '', amount: '' });
    const [labelType, setLabelType] = useState('');
    const [formData, setFormData] = useState({
        transationName: '',
        transationDate: '',
        transationAmount: '',
        transationType: 'Gasto',
        transationDescription: '',
        transationLabels: []
    });

    const [filtrando, setFiltrando] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [editingId, setEditingId] = useState('');
    const [labelName, setLabelName] = useState('');

    useEffect(() => {
        console.log('formData actualizado:', formData);
    } , [formData]);


    useEffect(() => {
    const stored = getTransations();
    setTransactions(stored);
    }, []);

    const handleElimination = (id) => {
    const updated = eliminateTransaction(id)
    setTransactions(updated);
    localStorage.setItem('transacciones', JSON.stringify(updated));
    };

    const handleRegistro = (e) => {
        e.preventDefault();

        const validations = DataTransationValidation(
            formData.transationDate,
            formData.transationAmount
        );

        setValidationErrors(validations);

        if (!validations.date && !validations.amount) {
            addTransation(
                formData.transationName,
                parseFloat(formData.transationAmount),
                formData.transationDate,
                formData.transationType,
                formData.transationDescription,
                formData.transationLabels
            );

            const updatedTransation = getTransations();
            setTransactions(updatedTransation);

            setShowModalRegistrar(false);

            setFormData({
                transationDate: '',
                transationAmount: '',
                transationType: 'Gasto',
                transationDescription: '',
                transationLabels: []
            });

            setValidationErrors({ date: '', amount: '' });
        }
    };

    const handleFiltrar = (e) => {
    e.preventDefault();
    setFiltrando(true);

    const validations = DataTransationValidation(
        formData.transationDate,
        formData.transationAmount
    );

    setValidationErrors(validations);

    if (validations.date !='La fecha no puede ser futura.' && validations.amount != 'El monto no puede ser negativo.') {
        const resultados = filterTransation(
            formData.transationDate,
            formData.transationAmount,
            formData.transationType,
            formData.transationLabels
        );

        setTransactions(resultados)

        setShowModalFiltrar(false);

        setFormData({
            transationDate: '',
            transationAmount: '',
            transationType: 'Gasto',
            transationDescription: '',
            transationLabels: []
        });

        setValidationErrors({ date: '', amount: '' });
    }
    };

    const handleEdicion = (e) => {
        e.preventDefault();
        const nuevosDatosTransformados = {
            nombre: formData.transationName,
            fecha: formData.transationDate,
            monto: parseFloat(formData.transationAmount),
            tipo: formData.transationType,
            descripcion: formData.transationDescription,
            etiquetas: formData.transationLabels,
        };
        const errors = DataTransationValidation(formData.transationDate, formData.transationAmount);
        setValidationErrors(errors);
        
        if (!errors.date && !errors.amount){
            editTransation(editingId, nuevosDatosTransformados);

            const updated = getTransations();
            setTransactions(updated);
            setShowModalEdicion(false);

            setFormData({
                transationDate: '',
                transationAmount: '',
                transationType: 'Gasto',
                transationDescription: '',
                transationLabels: []
            });

            setValidationErrors({ date: '', amount: '' });
        }
    };

    const toggleEtiqueta = (nombreEtiqueta) => {
        setFormData((prev) => {
            const etiquetasActuales = prev.transationLabels || [];

            const yaSeleccionada = etiquetasActuales.includes(nombreEtiqueta);

            const nuevasEtiquetas = yaSeleccionada? etiquetasActuales.filter((et) => et !== nombreEtiqueta): [...etiquetasActuales, nombreEtiqueta];
        
            return {
                ...prev,
                transationLabels: nuevasEtiquetas,
            };
        });
    };

    const handleCreacionEtiqueta = (e) =>  {
        e.preventDefault();

        setValidationErrors(DataLabelValidation(labelName));

        if (!validationErrors.name)   {
            addLabel(labelName);
            setLabelName('');
            setShowModalCrearEtiquetas(false);
        }
    }

  return (
    <div className="container">

        <nav>
        <ul className="nav-links">
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
        <h1>Transacciones</h1>
        <div className='FiltrarAñadir'>
          <button onClick={()=>{setFiltrando(true); setShowModalFiltrar(true); setFormData({ transationDate: '', transationAmount: '', transationType: '', transationDescription: '', transationLabels: [] });}}>Filtrar</button> <button onClick={()=>setShowModalRegistrar(true)}>Registrar</button>
        </div>
      </div>

        <TransaccionesAgrupadasPorFecha
            transactions={transactions}
            handleEditar={
                (id) => {
                    const transaccion = getTransations().find(trx => trx.id === id);
                        if (transaccion) {
                            setFormData({
                                transationName: transaccion.nombre,
                                transationDate: transaccion.fecha,
                                transationAmount: transaccion.monto,
                                transationType: transaccion.tipo,
                                transationDescription: transaccion.descripcion,
                                transationLabels: transaccion.etiquetas,
                            });
                            setShowModalEdicion(true);
                            setEditingId(id);
                        }
                }}
            handleEliminar={(id) => handleElimination(id)}
        />
        
        {filtrando && <button onClick={()=>{setTransactions(getTransations()); setFiltrando(false)}} className='eliminarBoton'>Cancelar Filtrado</button>}

      { showModalRegistrar &&
      <div className='modal'>
        <div className='modalContenido'>
            <h2>Registrar una transacción</h2>

            <label>Nombre de la transacción</label>
            <input
                type="text"
                placeholder="Nombre"
                value={formData.transationName}
                onChange={(e) => setFormData(prev => ({ ...prev, transationName: e.target.value }))}
            />

            <label>Ingrese la fecha de la transacción</label>
            <input type='date' placeholder='Fecha:' value={formData.transationDate} onChange={(e) => setFormData(prev => ({ ...prev, transationDate: e.target.value }))}></input>
            {validationErrors.date && (<p className='error'>{validationErrors.date} {validationErrors.date === "La fecha no puede ser futura." && <Link to="/transaccionesProgramadas"><button className='buttons' style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Programar una transacción</button></Link>}</p>)}

            <label>Ingrese el monto de la transacción</label>
            <input type='number' placeholder='Monto:' value={formData.transationAmount} onChange={(e) => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))}></input>
            {validationErrors.amount && <p className='error'>{validationErrors.amount}</p>}

            <label>Ingrese el tipo de la transacción</label>
            <select placeholder='Tipo:' value={formData.transationType} onChange={(e) => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                <option value='Gasto'>Gasto</option>
                <option value='Ingreso'>Ingreso</option>
            </select>

            <label>Ingrese una descripción(Opcional)</label>
            <textarea  value={formData.transationDescription} onChange={(e) => setFormData(prev => ({ ...prev, transationDescription: e.target.value }))} ></textarea>

            <label>Seleccione una/s etiquetas(Opcional)</label>
            <SelectorEtiquetasLimitado 
                etiquetas={getLabels()}
                seleccionadas={formData.transationLabels}
                onToggle={toggleEtiqueta}
                tipo={formData.transationType}

            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalRegistrar(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' onClick={handleRegistro}>Registrar</button>
            </div>
        </div>
      </div>
      }

      { showModalFiltrar &&
      <div className='modal'>
        <div className='modalContenido'>
            <h2>Filtrar una transacciones</h2>

            <label>Ingrese la fecha de la transacción que desea filtrar</label>
            <input type='date' placeholder='Fecha:' value={formData.transationDate} onChange={(e) => setFormData(prev => ({ ...prev, transationDate: e.target.value }))}></input>
            {validationErrors.date && <p className='error'>{validationErrors.date}</p>}

            <label>Ingrese el monto de la transacción  que desea filtrar</label>
            <input type='number' placeholder='Monto:' value={formData.transationAmount} onChange={(e) => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))}></input>
            {validationErrors.amount && <p className='error'>{validationErrors.amount}</p>}

            <label>Ingrese el tipo de la transacción que desea filtrar</label>
            <select placeholder='Tipo:' value={formData.transationType} onChange={(e) => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                <option value=''>Sin seleccionar</option>
                <option value='Gasto'>Gasto</option>
                <option value='Ingreso'>Ingreso</option>
            </select>

            <label>Seleccione una/s etiquetas por la que desea filtrar</label>
            <SelectorEtiquetasLimitado 
                etiquetas={getLabels()}
                seleccionadas={formData.transationLabels}
                onToggle={toggleEtiqueta}
                tipo={formData.transationType}
            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' type='button' onClick={()=>{setFiltrando(false);setShowModalFiltrar(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' onSubmit={handleFiltrar}>Fitrar</button>
            </div>
        </div>
      </div>
      }

      { showModalEdicion &&
      <div className='modal'>
        <div className='modalContenido'>
            <h2>Editar una transacción</h2>
            <label>Ingrese el nuevo nombre de la transacción</label>
            <input
                type="text"
                placeholder="Nombre"
                value={formData.transationName}
                onChange={(e) => setFormData(prev => ({ ...prev, transationName: e.target.value }))}
            />


            <label>Ingrese la nueva fecha de la transacción</label>
            <input type='date' placeholder='Fecha:' value={formData.transationDate} onChange={(e) => setFormData(prev => ({ ...prev, transationDate: e.target.value }))}></input>
            {validationErrors.date && (<p className='error'>{validationErrors.date} {validationErrors.date === "La fecha no puede ser futura." && <Link to="/transaccionesProgramadas"><button className='buttons' style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Programar una transacción</button></Link>}</p>)}

            <label>Ingrese el nuevo monto de la transacción</label>
            <input type='number' placeholder='Monto:' value={formData.transationAmount} onChange={(e) => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))}></input>
            {validationErrors.amount && <p className='error'>{validationErrors.amount}</p>}

            <label>Ingrese el nuevo tipo de la transacción</label>
            <select placeholder='Tipo:' value={formData.transationType} onChange={(e) => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                <option value='Gasto'>Gasto</option>
                <option value='Ingreso'>Ingreso</option>
            </select>

            <label>Ingrese una nueva descripción(Opcional)</label>
            <textarea  value={formData.transationDescription} onChange={(e) => setFormData(prev => ({ ...prev, transationDescription: e.target.value }))} ></textarea>

            <label>Seleccione una/s nueva/s etiquetas(Opcional)</label>
            <SelectorEtiquetasLimitado 
                etiquetas={getLabels()}
                seleccionadas={formData.transationLabels}
                onToggle={toggleEtiqueta}
                tipo={formData.transationType}
            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalEdicion(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' onClick={handleEdicion} >Guardar Cambios</button>
            </div>
        </div>
      </div>
      }

      { showModalMasEtiquetas &&
      <div className='modal'>
        <div className='modalContenido'>
            <h2>Mas etiquetas</h2>

            <label>Seleccionar  una/s etiquetas(Opcional)</label>
            <SelectorEtiquetasLimitado 
                etiquetas={getLabels()}
                seleccionadas={formData.transationLabels}
                onToggle={toggleEtiqueta}
                limite={null}
                tipo={formData.transationType}
            />

            {!filtrando &&
                <button type='button' className='modal-buttons buttons' onClick={()=>setShowModalCrearEtiquetas(true)}>Crear nueva Etiqueta</button>
            }

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalMasEtiquetas(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []});}}>Cerrar</button>
            </div>

        </div>
      </div>
      }

      { showModalCrearEtiquetas &&
            <form className='modal' onSubmit={handleCreacionEtiqueta}>
                <div className='modalContenido'>
                    <h2>Crear una nueva Etiqueta</h2>
      
                    <label>Ingrese el nombre de la nueva etiqueta</label>
                    <input 
                        type='text' 
                        placeholder='Nombre:' 
                        value={labelName} 
                        onChange={(e) => setLabelName(e.target.value)} 
                    />
                    {validationErrors.name && <p className='error'>{validationErrors.name}</p>}

                    <label>Tipo de etiqueta</label>
                    <select 
                        value={labelType} 
                       onChange={(e) => setLabelType(e.target.value)}
                    >
                        <option value="">--Seleccione--</option>
                        <option value="gasto">Gasto</option>
                        <option value="ingreso">Ingreso</option>
                  </select>
                    {validationErrors.type && <p className='error'>{validationErrors.type}</p>}

                    <div className='modal-buttons'>
                        <button 
                            className='buttons' 
                            type='button' 
                            onClick={() => {
                                setLabelName(''); 
                                setLabelType(''); 
                                setShowModalCrearEtiquetas(false);
                            }}
                        >
                            Cancelar
                        </button>
                        <button className='buttons' type='submit'>Guardar Cambios</button>
                    </div>
                </div>
            </form>
        }   
    </div>
  );
}