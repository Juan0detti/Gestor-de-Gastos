import { getTransations } from '../capa_persistencia/TransaccionesStorage';
import { getSaves } from '../capa_persistencia/AhorrosStorage';
import { Saldo, getBalance, saveBalance } from '../capa_persistencia/SaldoStorage';

export function actualizarSaldoPorTransaccion(transactionId, viejoMonto, accion) {
  const saldo = getBalance();
  
  const transacciones = getTransations();

  const transaccion = transacciones.find(t => t.id === transactionId);

  if (!transaccion) {
    throw new Error('Transacción no encontrada');
  }

  if (transaccion.tipo === 'Ingreso') {
    switch (accion) {
      case 'creacion':
        saldo.setMontoLibre(saldo.getMontoLibre() + transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() + transaccion.monto);
        break;
      case 'edicion':
        saldo.setMontoLibre(saldo.getMontoLibre() - viejoMonto + transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() - viejoMonto + transaccion.monto);
        break;
      case 'eliminacion':
        saldo.setMontoLibre(saldo.getMontoLibre() - transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() - transaccion.monto);
        break;
      default:
        throw new Error('La acción debe ser "creacion", "edicion" o "eliminacion"');
    }
  } else  {
    switch (accion) {
      case 'creacion':
        saldo.setMontoLibre(saldo.getMontoLibre() - transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() - transaccion.monto);
        break;
      case 'edicion':
        saldo.setMontoLibre(saldo.getMontoLibre() + viejoMonto - transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() + viejoMonto - transaccion.monto);
        break;
      case 'eliminacion':
        saldo.setMontoLibre(saldo.getMontoLibre() + transaccion.monto);
        saldo.setMontoTotal(saldo.getMontoTotal() + transaccion.monto);
        break;
      default:
        throw new Error('La acción debe ser "creacion", "edicion" o "eliminacion"');
    }
  }

  saveBalance(saldo);
}

export function actualizarSaldoPorAhorro(ahorroId, viejoMonto, accion) {
  const saldo = getBalance();
  let { monto, ahorros } = saldo.getMontoAhorrado(); // Lista interna de ahorros

  switch (accion) {
    case 'creacion': {
      const ahorro = getSaves().find(a => a.id === ahorroId);
      if (!ahorro) throw new Error('Ahorro no encontrado al crear');

      const nuevoMonto = monto + ahorro.monto_actual;
      const nuevosAhorros = [...ahorros, { ahorroId, ahorroMonto: ahorro.monto_actual }];
      saldo.setMontoAhorrado({ monto: nuevoMonto, ahorros: nuevosAhorros });
      break;
    }

    case 'edicion': {
      const ahorro = getSaves().find(a => a.id === ahorroId);
      if (!ahorro) throw new Error('Ahorro no encontrado al editar');

      const nuevoMonto = monto - viejoMonto + ahorro.monto_actual;
      const nuevosAhorros = ahorros.map(a =>
        a.ahorroId === ahorroId ? { ahorroId, ahorroMonto: ahorro.monto_actual } : a
      );
      saldo.setMontoAhorrado({ monto: nuevoMonto, ahorros: nuevosAhorros });
      break;
    }

    case 'eliminacion': {
      const ahorroGuardado = ahorros.find(a => a.ahorroId === ahorroId);
      if (!ahorroGuardado) throw new Error('Ahorro no encontrado al eliminar');

      const nuevoMonto = monto - ahorroGuardado.ahorroMonto;
      const nuevosAhorros = ahorros.filter(a => a.ahorroId !== ahorroId);
      saldo.setMontoAhorrado({ monto: nuevoMonto, ahorros: nuevosAhorros });
      break;
    }

    default:
      throw new Error('La acción debe ser "creacion", "edicion" o "eliminacion"');
  }

  saveBalance(saldo);
}


export function recalcularSaldo() {
  const transacciones = getTransations();
  const ahorros =  getSaves();

  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((acc, t) => acc + Number(t.monto), 0);

  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((acc, t) => acc + Number(t.monto), 0);

  const saldoAhorrado = ahorros.reduce((acc, ahorro) => acc + Number(ahorro.monto), 0);
  const saldoTotal = totalIngresos - totalGastos;

  const saldoLibre = saldoTotal - saldoAhorrado;

  const nuevoSaldo = {
    saldoLibre,
    saldoAhorrado,
    saldoTotal,
  };

  saveBalance(nuevoSaldo);
  return nuevoSaldo;
}