import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Objetivos from './components/Objetivos';
import Transacciones from './components/Transacciones';
import TransaccionesProgramadas from "./components/transaccionesProgramadas";
import './index.css';
import PagPr from './components/PagPrincipal';

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
