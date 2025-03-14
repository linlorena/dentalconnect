import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./pages/Inicial/Inicial";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";
import Home from "./pages/Home/Home";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicial />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/recuperarsenha" element={<RecuperarSenha />} />
                <Route path="/home" element={<Home />} />
                {/* <Route path="/agendamentos" element={<Home />} />
                <Route path="/perfil" element={<Home />} />
                <Route path="/configuracoes" element={<Home />} /> */}
            </Routes>
        </Router>
    );
}

export default AppRoutes;
