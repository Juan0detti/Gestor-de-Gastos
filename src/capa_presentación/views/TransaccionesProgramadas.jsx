import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getProgramedTransations } from '../../capa_persistencia/TransaccionesProgramadasStorage';
import { agregarTransaccionProgramada, filtrarTransaccionesProgramadas, eliminarTransaccionProgramada, editarTransaccionProgramada, obtenerTransaccionesVencidas, validarTransaccionProgramada } from "../../capa_lógica/TransaccionesProgramadasService";
import { addTransation } from "../../capa_lógica/TransaccionesService";
import { getLabels } from '../../capa_persistencia/EtiquetasStorage';
import {TransaccionesAgrupadasPorFecha } from '../components/TransaccionesAgrupadasPorFechas';
import SelectorEtiquetasLimitado from '../components/SelectorEtiquetasLimitado';
import PanelSaldo from '../components/PanelSaldo';
import '../../styles/Transacciones.css';
import '../components/components_styles/Modal.css';

export default function TransaccionesProgramadas() {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        transationDate: '',
        transationAmount: '',
        transationType: 'Gasto',
        transationDescription: '',
        transationLabels: [],
        transationName: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showModalRegistrar, setShowModalRegistrar] = useState(false);
    const [showModalEdicion, setShowModalEdicion] = useState(false);
    const [showModalFiltrar, setShowModalFiltrar] = useState(false);

    useEffect(() => {
        const vencidas = obtenerTransaccionesVencidas();
        vencidas.forEach(tx => {
            const confirmar = window.confirm(`¿Registrar transacción programada "${tx.nombre}" que venció el ${new Date(tx.fecha).toLocaleString()}?`);
            if (confirmar) {
                addTransation(
                    tx.nombre, 
                    tx.monto,
                    new Date(tx.fecha).toISOString().split('T')[0],
                    tx.tipo,
                    tx.descripcion,
                    tx.etiquetas
                );
                eliminarTransaccionProgramada(tx.id);
            }
        });
        setTransactions(getProgramedTransations());
    }, []);

    const handleRegistro = (e) => {
        e.preventDefault();
        const errors = validarTransaccionProgramada(formData.transationDate, formData.transationAmount);
        setValidationErrors(errors);
        if (!errors.date && !errors.amount) {
            agregarTransaccionProgramada(
                formData.transationName,
                parseFloat(formData.transationAmount),
                formData.transationDate,
                formData.transationType,
                formData.transationDescription,
                formData.transationLabels
            );
            setFormData({
                transationDate: '',
                transationAmount: '',
                transationType: 'Gasto',
                transationDescription: '',
                transationLabels: [],
                transationName: ''
            });
            setTransactions(getProgramedTransations());
            setShowModalRegistrar(false);
            setValidationErrors({});
        }
    };

    const handleEliminacion = (id) => {
        eliminarTransaccionProgramada(id);
        setTransactions(getProgramedTransations());
    };

    const handleEdicion = () => {
        const errors = validarTransaccionProgramada(formData.transationDate, formData.transationAmount);
        setValidationErrors(errors);
        if (!errors.date && !errors.amount) {
            editarTransaccionProgramada(editingId, {
                nombre: formData.transationName,
                monto: parseFloat(formData.transationAmount),
                fecha: formData.transationDate,
                tipo: formData.transationType,
                descripcion: formData.transationDescription,
                etiquetas: formData.transationLabels
            });
            setFormData({
                transationDate: '',
                transationAmount: '',
                transationType: 'Gasto',
                transationDescription: '',
                transationLabels: [],
                transationName: ''
            });
            setTransactions(getProgramedTransations());
            setShowModalEdicion(false);
            setValidationErrors({});
        }
    };

    const toggleEtiqueta = (etiqueta) => {
        setFormData((prev) => {
            const yaEsta = prev.transationLabels.includes(etiqueta);
            const nuevas = yaEsta
                ? prev.transationLabels.filter((e) => e !== etiqueta)
                : [...prev.transationLabels, etiqueta];
            return { ...prev, transationLabels: nuevas };
        });
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
                <h1>Transacciones Programadas</h1>
                <button onClick={() => { setShowModalFiltrar(true); }}>Filtrar</button>
                <button onClick={() => setShowModalRegistrar(true)}>Programar</button>
            </div>

            <TransaccionesAgrupadasPorFecha
                transactions={transactions}
                handleEditar={(id) => {
                    const tx = getProgramedTransations().find(t => t.id === id);
                    if (tx) {
                        setFormData({
                            transationDate: tx.fecha,
                            transationAmount: tx.monto,
                            transationType: tx.tipo,
                            transationDescription: tx.descripcion,
                            transationLabels: tx.etiquetas,
                            transationName: tx.nombre
                        });
                        setEditingId(id);
                        setShowModalEdicion(true);
                    }
                }}
                handleEliminar={handleEliminacion}
            />

            {/* Modal registrar */}
            {showModalRegistrar && (
                <form className="modal" onSubmit={handleRegistro}>
                    <div className="modalContenido">
                        <h2>Programar una transacción</h2>

                        <label>Nombre</label>
                        <input type='text' value={formData.transationName} onChange={e => setFormData(prev => ({ ...prev, transationName: e.target.value }))} />

                        <label>Fecha y hora</label>
                        <input type='datetime-local' value={formData.transationDate} onChange={e => setFormData(prev => ({ ...prev, transationDate: e.target.value }))} />
                        {validationErrors.date && <p className="error">{validationErrors.date}</p>}

                        <label>Monto</label>
                        <input type='number' value={formData.transationAmount} onChange={e => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))} />
                        {validationErrors.amount && <p className="error">{validationErrors.amount}</p>}

                        <label>Tipo</label>
                        <select value={formData.transationType} onChange={e => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                            <option value='Gasto'>Gasto</option>
                            <option value='Ingreso'>Ingreso</option>
                        </select>

                        <label>Descripción</label>
                        <textarea value={formData.transationDescription} onChange={e => setFormData(prev => ({ ...prev, transationDescription: e.target.value }))} />

                        <label>Etiquetas</label>
                        <SelectorEtiquetasLimitado
                            etiquetas={getLabels()}
                            seleccionadas={formData.transationLabels}
                            onToggle={toggleEtiqueta}
                            tipo={formData.transationType}
                        />

                        <div className='modal-buttons'>
                            <button type="button" onClick={() => { setShowModalRegistrar(false); setValidationErrors({}); }}>Cancelar</button>
                            <button type="submit">Programar</button>
                        </div>
                    </div>
                </form>
            )}

            {/* Modal edición */}
            {showModalEdicion && (
                <div className="modal">
                    <div className="modalContenido">
                        <h2>Editar transacción programada</h2>

                        <label>Nombre</label>
                        <input type='text' value={formData.transationName} onChange={e => setFormData(prev => ({ ...prev, transationName: e.target.value }))} />

                        <label>Fecha y hora</label>
                        <input type='datetime-local' value={formData.transationDate} onChange={e => setFormData(prev => ({ ...prev, transationDate: e.target.value }))} />
                        {validationErrors.date && <p className="error">{validationErrors.date}</p>}

                        <label>Monto</label>
                        <input type='number' value={formData.transationAmount} onChange={e => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))} />
                        {validationErrors.amount && <p className="error">{validationErrors.amount}</p>}

                        <label>Tipo</label>
                        <select value={formData.transationType} onChange={e => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                            <option value='Gasto'>Gasto</option>
                            <option value='Ingreso'>Ingreso</option>
                        </select>

                        <label>Descripción</label>
                        <textarea value={formData.transationDescription} onChange={e => setFormData(prev => ({ ...prev, transationDescription: e.target.value }))} />

                        <label>Etiquetas</label>
                        <SelectorEtiquetasLimitado
                            etiquetas={getLabels()}
                            seleccionadas={formData.transationLabels}
                            onToggle={toggleEtiqueta}
                            tipo={formData.transationType}
                        />

                        <div className='modal-buttons'>
                            <button type="button" onClick={() => { setShowModalEdicion(false); setValidationErrors({}); }}>Cancelar</button>
                            <button type="button" onClick={handleEdicion}>Guardar cambios</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Filtrar */}
            {showModalFiltrar && (
                <div className="modal" onSubmit={(e) => {
                    const resultados = filtrarTransaccionesProgramadas({
                      fecha_inicio: formData.transationDate || null,
                      fecha_fin: null,
                      monto: formData.transationAmount,
                      tipo: formData.transationType,
                      etiquetas: formData.transationLabels,
                    });
                    setTransactions(resultados);
                    setShowModalFiltrar(false);
                }}>
                    <div className="modalContenido">
                        <h2>Filtrar transacciones programadas</h2>     
                        <label>Fecha mínima</label>
                        <input type="datetime-local" value={formData.transationDate} onChange={(e) => setFormData(prev => ({ ...prev, transationDate: e.target.value }))} />

                        <label>Monto</label>
                        <input type="number" value={formData.transationAmount} onChange={(e) => setFormData(prev => ({ ...prev, transationAmount: e.target.value }))} />

                        <label>Tipo</label>
                        <select value={formData.transationType} onChange={(e) => setFormData(prev => ({ ...prev, transationType: e.target.value }))}>
                            <option value="">Sin seleccionar</option>
                            <option value="Gasto">Gasto</option>
                            <option value="Ingreso">Ingreso</option>
                        </select>

                        <label>Etiquetas</label>
                        <SelectorEtiquetasLimitado
                            etiquetas={getLabels()}
                            seleccionadas={formData.transationLabels}
                            onToggle={toggleEtiqueta}
                            tipo={formData.transationType}
                        />

                        <div className="modal-buttons">
                            <button type="button" onClick={() => { setShowModalFiltrar(false); }}>Cancelar</button>
                            <button type="submit">Filtrar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
