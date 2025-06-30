import React, { useState } from 'react';
// import { useSaldo } from '../Service/useSaldo';
import { getBalance } from '../../capa_persistencia/SaldoStorage'

export default function PanelSaldo({ objetivos = [] }) {
  //const { valor } = useSaldo();
  const valor = getBalance().getMontoTotal();
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const totalReservado = objetivos.reduce((acc, obj) => acc + obj.monto, 0);
  const libre = valor - totalReservado;

  return (
    <div>
      <h2
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setMostrarDetalle(!mostrarDetalle)}
      >
        Saldo actual: ${valor}
      </h2>

      {mostrarDetalle && (
        <div style={{ marginTop: '10px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
          <p>🎯 Total reservado en objetivos: ${totalReservado}</p>
          <p>🟢 Saldo libre: ${libre}</p>
        </div>
      )}
    </div>
  );
}
