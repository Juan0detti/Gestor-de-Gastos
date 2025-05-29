import React from 'react';
import './components_styles/ListaObjetivosOrdenada.css';

export default function ListaObjetivosOrdenada({ objetivos }) {
  if (!objetivos || objetivos.length === 0) {
    return <p>No hay objetivos registrados.</p>;
  }

  return (
    <div className="lista-objetivos">
      <ul>
        {objetivos.map(goal => (
          <li key={goal.id} className="objetivo-item">
            <strong>{goal.name}</strong><br />
            Fecha límite: {goal.date}<br />
            Monto: ${parseFloat(goal.amount).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
