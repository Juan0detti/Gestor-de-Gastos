class Saldo {
  constructor() {
    if (Saldo.instance) return Saldo.instance;

    this.valor = 0;
    Saldo.instance = this;
  }

  obtener() {
    return this.valor;
  }

  sumar(monto) {
    this.valor += monto;
  }

  restar(monto) {
    this.valor -= monto;
  }

  reiniciar() {
    this.valor = 0;
  }
}

const saldoGlobal = new Saldo();
Object.freeze(saldoGlobal);

export default saldoGlobal;
