import PanelSaldo from "../components/PanelSaldo";
import { Link } from "react-router-dom";
import '../../styles/PagPrincipal.css';

export default function PagPr() {
  return (
    <div className="container">
      <nav>
        <ul className="nav-links">
          <li><Link to='/ahorros'>Ahorros</Link></li>
          <li><Link to="/objetivos">Objetivos</Link></li>
          <li><Link to="/transacciones">Transacciones</Link></li>
          <li><Link to="/transaccionesProgramadas">Transacciones Programadas</Link></li>
        </ul>
      </nav>

      <div className="barra">
        <PanelSaldo />
      </div>

      <h1>Página Principal</h1>
      <p>Estas imágenes son ilustrativas</p>

      <div className="contenedor-imagenes">
        <span className="card">
          <h3>Objetivos</h3>
          <img className="imagenes" src="src/capa_presentación/imgs/ListaObjetivos.png" alt="Lista de objetivos" />
        </span>

        <span className="card">
          <h3>Gastos</h3>
          <img className="imagenes" src="src/capa_presentación/imgs/grafico-torta-basico-1.png" alt="Gráfico de gastos" />
        </span>

        <span className="card">
          <h3>Vista General de acciones</h3>
          <img className="imagenes" src="src/capa_presentación/imgs/icono-calendario.png" alt="Vista general" />
        </span>
      </div>
    </div>
  );
}