import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import UserBemVindo from "../pages/userBemVindo/UserBemVindo";
import ClienteCadastro from "../pages/cliente/clienteCadastro/ClienteCadastro";
import VendedorCadastro from "../pages/vendedor/vendedorCadastro/VendedorCadastro";
import MeusProdutos from "../pages/vendedor/meusProdutos/MeusProdutos";
import Comidas from "../pages/Comidas/Comidas";
import Pagamento from "../pages/Pagamento/Pagamento";

import Notificacoes from "../pages/Notificacoes/Notificacoes";
import Mensagens from "../pages/Mensagens/Mensagens";
import Recompensas from "../pages/Recompensas/Recompensas";
import Configuracoes from "../pages/Configuracoes/Configuracoes";
import Dashboard from "../pages/Dashboard/Dashboard";
import Pedidos from "../pages/Pedidos/Pedidos";
import ProximosEventos from "../pages/Eventos/ProximosEventos";

export default function AppRoutes() {
  console.log("Rotas renderizadas"); // Adicione isso
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserBemVindo />} />
        <Route path="/clienteCadastro" element={<ClienteCadastro />} />
        <Route path="/vendedorCadastro" element={<VendedorCadastro />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meusprodutos" element={<MeusProdutos />} />
        <Route path="/comidas" element={<Comidas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/eventos" element={<ProximosEventos />} />

        <Route path="/pagamento" element={<Pagamento />} />

        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/recompensas" element={<Recompensas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}
