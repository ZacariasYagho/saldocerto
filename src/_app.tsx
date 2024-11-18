import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DespesasRecorrentes from './pages/despesas-recorrentes';
import DivisaoDespesas from './pages/divisao-despesas';
import HomeFinanceira from './pages/home-financeira';
import LimiteMensal from './pages/limite-mensal';
import RegistroDespesas from './pages/registro-despesas';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/home-financeira">Home Financeira</Link>
        <Link to="/despesas-recorrentes">Despesas Recorrentes</Link>
        <Link to="/divisao-despesas">Divisão de Despesas</Link>
        <Link to="/limite-mensal">Limite Mensal</Link>
        <Link to="/registro-despesas">Registro de Despesas</Link>
      </nav>
      <Routes>
        <Route path="/home-financeira" element={<HomeFinanceira />} />
        <Route path="/despesas-recorrentes" element={<DespesasRecorrentes />} />
        <Route path="/divisao-despesas" element={<DivisaoDespesas />} />
        <Route path="/limite-mensal" element={<LimiteMensal />} />
        <Route path="/registro-despesas" element={<RegistroDespesas />} />
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App; 