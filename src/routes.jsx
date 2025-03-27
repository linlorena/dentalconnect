import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./pages/Inicial/Inicial";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";
import Home from "./pages/Home/Home";
import BuscaAvancada from "./pages/BuscaAvancada/BuscaAvancada";
import FaleConosco from "./pages/FaleConosco/FaleConosco";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicial />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/recuperarsenha" element={<RecuperarSenha />} />
                <Route path="/home" element={<Home />} />
                <Route path="/busca-avancada" element={<BuscaAvancada />} />
                <Route path="/fale-conosco" element={<FaleConosco />} />
                {/* <Route path="/agendamentos" element={<Home />} />
                <Route path="/perfil" element={<Home />} />
                <Route path="/configuracoes" element={<Home />} /> */}
            </Routes>
        </Router>
    );
}

export default AppRoutes;
