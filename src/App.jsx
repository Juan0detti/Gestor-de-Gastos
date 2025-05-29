import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Objetivos from './capa_presentación/views/Objetivos';
import Transacciones from './capa_presentación/views/Transacciones';
import TransaccionesProgramadas from "./capa_presentación/views/TransaccionesProgramadas";
import PagPr from './capa_presentación/views/PagPrincipal';
import './styles/index.css';


function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li><Link to="/objetivos">Objetivos</Link></li>
            <li><Link to="/transacciones">Transacciones</Link></li>
            <li><Link to="/transaccionesProgramadas">Transacciones Programadas</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path='/' element={<PagPr />}/>
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="/transacciones" element={<Transacciones />} />
          <Route path="/transaccionesProgramadas" element={<TransaccionesProgramadas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
