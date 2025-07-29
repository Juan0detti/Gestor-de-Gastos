import { parseISO, isToday, isYesterday, format, isThisWeek } from "date-fns";
import "./components_styles/TransaccionesAgrupadasPorFechas.css";

export const TransaccionesAgrupadasPorFecha = ({
  transactions,
  handleEditar,
  handleEliminar,
}) => {
  const grouped = {};
  const fechaMap = {};

  const getLabelForfecha = (fecha) => {
    if (isToday(fecha)) return "Hoy";
    if (isYesterday(fecha)) return "Ayer";
    if (isThisWeek(fecha)) return "Esta semana";
    return format(fecha, "dd/MM/yyyy");
  };

  transactions.forEach((tx) => {
    if (!tx?.fecha) {
      console.warn("Transacción sin fecha válida:", tx);
      return;
    }

    let fechaObj;
    try {
      fechaObj = parseISO(tx.fecha);
    } catch (e) {
      console.error("Fecha inválida para parseISO:", tx.fecha, tx);
      return;
    }

    const label = getLabelForfecha(fechaObj);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(tx);

    if (!fechaMap[label] || fechaMap[label] < fechaObj) {
      fechaMap[label] = fechaObj;
    }
  });

  const sortedGroups = Object.entries(grouped).sort(
    ([labelA], [labelB]) => fechaMap[labelB] - fechaMap[labelA]
  );

  const hayTransacciones = sortedGroups.length > 0;

  return (
    <div className="transacciones-agrupadas">
      {!hayTransacciones ? (
        <p className="mensaje-sin-transacciones">
          No hay transacciones registradas
        </p>
      ) : (
        sortedGroups.map(([label, txs]) => (
          <div key={label}>
            <h3>{label}</h3>
            <ul className="lista-transacciones">
              {txs
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar dentro del grupo
                .map((item, idx) => (
                  <li
                    key={idx}
                    className="card-transaccion"
                    style={{
                      background:
                        item.tipo === "Ingreso" ? "#c8f7cc" : "#f7c8c8",
                    }}
                  >
                    <span className="info">
                      <strong>Nombre:</strong> {item.nombre} <br />
                      <strong>Monto:</strong> ${item.monto} <br />
                      {item.description && (
                        <>
                          <strong>Descripción:</strong> {item.description}{" "}
                          <br />
                        </>
                      )}
                      {item.etiquetas && item.etiquetas.length > 0 && (
                        <>
                          <strong>Etiquetas:</strong>{" "}
                          {item.etiquetas.join(", ")}
                        </>
                      )}
                    </span>
                    <span className="botonesItem">
                      <button
                        onClick={() => handleEditar?.(item.id)}
                        className="editarBoton"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar?.(item.id)}
                        className="eliminarBoton"
                      >
                        Eliminar
                      </button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};
