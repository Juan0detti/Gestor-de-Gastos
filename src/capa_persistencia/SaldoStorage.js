const STORAGE_KEY = "saldo";

export class Saldo {
  constructor () {
    this.montoLibre = 0;
    this.montoAhorrado = {monto:0, ahorros:[]};
    this.total = 0;
  }

  setMontoLibre(newMontoLibre) {
    this.montoLibre = newMontoLibre;
  }

  getMontoLibre() {
    return this.montoLibre;
  }

  setMontoAhorrado(newMontoAhorrado) {
    this.montoAhorrado = newMontoAhorrado;
  }

  getMontoAhorrado() {
    return this.montoAhorrado;
  }

  setMontoTotal(newTotal) {
    this.total = newTotal;
  }

  getMontoTotal() {
    return this.total;
  }
}

export function getBalance() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!data) {
    return new Saldo(); // si no hay saldo guardado, crea uno nuevo
  }

  const saldo = new Saldo();
  saldo.setMontoLibre(data.montoLibre);
  saldo.setMontoAhorrado(data.montoAhorrado);
  saldo.setMontoTotal(data.total);
  return saldo;
}

export function saveBalance(balance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(balance));
}