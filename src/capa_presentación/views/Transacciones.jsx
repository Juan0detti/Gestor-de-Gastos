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


export default function TransaccionesProgramadas() {
    const [saldo, setSaldo] = useState(0);
    const [showModalRegistrar, setShowModalRegistrar] = useState(false);
    const [showModalFiltrar, setShowModalFiltrar] = useState(false);
    const [showModalEdicion, setShowModalEdicion] = useState(false);
    const [showModalMasEtiquetas, setShowModalMasEtiquetas] = useState(false);
    const [showModalCrearEtiquetas, setShowModalCrearEtiquetas] = useState(false);
    const [validationErrors, setValidationErrors] = useState({ date: '', amount: '' });
    const [formData, setFormData] = useState({transationDate:'', transationAmount:'', transationType:'Gasto', transationDescription:'', transationLabels:[]});
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
                formData.transationDate,
                parseFloat(formData.transationAmount),
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
            date: formData.transationDate,
            amount: parseFloat(formData.transationAmount),
            type: formData.transationType,
            description: formData.transationDescription,
            labels: formData.transationLabels,
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
      <div className='barra'>
        <h2>Saldo actual:</h2> <h3>${saldo.toFixed(2)}</h3>
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
                                transationDate: transaccion.date,
                                transationAmount: transaccion.amount,
                                transationType: transaccion.type,
                                transationDescription: transaccion.description,
                                transationLabels: transaccion.labels,
                            });
                            setShowModalEdicion(true);
                            setEditingId(id);
                        }
                }}
            handleEliminar={(id) => handleElimination(id)}
        />
        
        {filtrando && <button onClick={()=>{setTransactions(getTransations()); setFiltrando(false)}} className='eliminarBoton'>Cancelar Filtrado</button>}

      { showModalRegistrar &&
      <form className='modal' onSubmit={handleRegistro}>
        <div className='modalContenido'>
            <h2>Registrar una transacción</h2>
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
            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalRegistrar(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' type='submit'>Registrar</button>
            </div>
        </div>
      </form>
      }

      { showModalFiltrar &&
      <form className='modal' onSubmit={handleFiltrar}>
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
            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' type='button' onClick={()=>{setFiltrando(false);setShowModalFiltrar(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' type='submit'>Fitrar</button>
            </div>
        </div>
      </form>
      }

      { showModalEdicion &&
      <form className='modal' onSubmit={handleEdicion}>
        <div className='modalContenido'>
            <h2>Editar una transacción</h2>
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
            />

            <button type='button' className='boton-ver-mas' onClick={()=>setShowModalMasEtiquetas(true)}>Mostrar mas etiquetas</button>

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalEdicion(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []}); setValidationErrors({ date: '', amount: '' });}}>Cancelar</button>   <button className='buttons' type='submit' >Guardar Cambios</button>
            </div>
        </div>
      </form>
      }

      { showModalMasEtiquetas &&
      <form className='modal' onSubmit={handleEdicion}>
        <div className='modalContenido'>
            <h2>Mas etiquetas</h2>

            <label>Seleccionar  una/s etiquetas(Opcional)</label>
            <SelectorEtiquetasLimitado 
                etiquetas={getLabels()}
                seleccionadas={formData.transationLabels}
                onToggle={toggleEtiqueta}
                limite={null}
            />

            {!filtrando &&
                <button type='button' className='modal-buttons buttons' onClick={()=>setShowModalCrearEtiquetas(true)}>Crear nueva Etiqueta</button>
            }

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setShowModalMasEtiquetas(false);setFormData({transationDate: '', transationAmount: '', transationType: 'Gasto', transationDescription: '', transationLabels: []});}}>Cerrar</button>
            </div>

        </div>
      </form>
      }

      { showModalCrearEtiquetas &&
      <form className='modal' onSubmit={handleCreacionEtiqueta}>
        <div className='modalContenido'>
            <h2>Crear una nueva Etiqueta</h2>
            <label>Ingrese el nombre de la nueva etiqueta</label>
            <input type='text' placeholder='Nombre:' value={labelName} onChange={(e) => setLabelName(e.target.value)}></input>
            {validationErrors.name && <p className='error'>{validationErrors.name}</p>}

            <div className='modal-buttons'>
                <button className='buttons' onClick={()=>{setLabelName(''); setShowModalCrearEtiquetas(false)}}>Cancelar</button>   <button className='buttons' type='submit' >Guardar Cambios</button>
            </div>
        </div>
      </form>
      }

    </div>
  );
}