import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Objetivos from './capa_presentación/views/Objetivos';
import Transacciones from './capa_presentación/views/Transacciones';
import TransaccionesProgramadas from "./capa_presentación/views/TransaccionesProgramadas";
import PagPr from './capa_presentación/views/PagPrincipal';
import './styles/index.css';
import { Login } from './capa_presentación/views/Login';
import { Register } from './capa_presentación/views/Register';
import Ahorros from './capa_presentación/views/Ahorros';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/' element={<Login />}></Route>
          <Route path='/dashboard' element={<PagPr />}/>
          <Route path='/ahorros' element={<Ahorros />} />
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="/transacciones" element={<Transacciones />} />
          <Route path="/transaccionesProgramadas" element={<TransaccionesProgramadas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
