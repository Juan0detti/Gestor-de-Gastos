import { useState } from 'react';
import saldo from '../Storage/Saldo';

export function useSaldo() {
  const [valor, setValor] = useState(saldo.obtener());

  const sumar = (monto) => {
    saldo.sumar(monto);
    setValor(saldo.obtener());
  };

  const restar = (monto) => {
    saldo.restar(monto);
    setValor(saldo.obtener());
  };

  const reiniciar = () => {
    saldo.reiniciar();
    setValor(saldo.obtener());
  };

  return { valor, sumar, restar, reiniciar };
}
