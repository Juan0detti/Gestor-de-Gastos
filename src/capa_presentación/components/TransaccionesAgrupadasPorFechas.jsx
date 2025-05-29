export const TransaccionesAgrupadasPorFecha = ({ transactions, handleEditar, handleEliminar }) => {
  const grouped = {};

  transactions.forEach(tx => {
    if (!tx?.date) {
      console.warn('Transacción sin fecha válida:', tx);
      return;
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

  const hayTransacciones = Object.keys(grouped).length > 0;

  return (
    <div className="transacciones-agrupadas">
      {!hayTransacciones ? (
        <p className="mensaje-sin-transacciones">No hay transacciones registradas</p>
      ) : (
        Object.entries(grouped).map(([label, txs]) => (
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
        ))
      )}
    </div>
  );
};
