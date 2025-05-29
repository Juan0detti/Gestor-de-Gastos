import React from 'react';
import { isToday, isYesterday, isSameWeek, startOfWeek, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import './components_styles/TransaccionesAgrupadasPorFechas.css';

function getLabelForDate(fecha) {
  if (isToday(fecha)) return 'Hoy';
  if (isYesterday(fecha)) return 'Ayer';

  const semanaActual = startOfWeek(new Date(), { weekStartsOn: 1 });
  const semanaTransaccion = startOfWeek(fecha, { weekStartsOn: 1 });

  if (isSameWeek(fecha, new Date(), { weekStartsOn: 1 })) return 'Esta semana';
  if (isSameWeek(fecha, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 })) return 'Semana anterior';

  return format(fecha, "dd 'de' MMMM yyyy", { locale: es });
}

export const TransaccionesAgrupadasPorFecha = ({ transactions, handleEditar, handleEliminar }) => {
  const grouped = {};

  transactions.forEach(tx => {
    if (!tx?.date) {
      console.warn('Transacción sin fecha válida:', tx);
      return; // Ignorar si no hay fecha válida
    }

    let dateObj;
    try {
      dateObj = parseISO(tx.date);
    } catch (e) {
      console.error('Fecha inválida para parseISO:', tx.date, tx);
      return;
    }

    const label = getLabelForDate(dateObj);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(tx);
  });

  return (
    <div className="transacciones-agrupadas">
      {Object.entries(grouped).map(([label, txs]) => (
        <div key={label}>
          <h3>{label}</h3>
          <ul className="lista-transacciones">
            {txs.map((item, idx) => (
              <li key={idx} className="card-transaccion">
                <div className="info">
                  <strong>Monto:</strong> ${item.amount} <br />
                  <strong>Tipo:</strong> {item.type} <br />
                  {item.description && (
                    <>
                      <strong>Descripción:</strong> {item.description} <br />
                    </>
                  )}
                  {item.labels && item.labels.length > 0 && (
                    <>
                      <strong>Etiquetas:</strong> {item.labels.join(', ')}
                    </>
                  )}
                </div>
                <div className="botonesItem">
                  <button onClick={() => handleEditar?.(item.id)} className="editarBoton">Editar</button>
                  <button onClick={() => handleEliminar?.(item.id)} className="eliminarBoton">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TransaccionesAgrupadasPorFecha;
