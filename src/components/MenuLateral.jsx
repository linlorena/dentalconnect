import React, { useState } from "react";
import { House, Calendar, Tooth, ChatText, Gear, User, FileText } from "@phosphor-icons/react"; // Adicionando ícone para 'Relatórios'
import { Link, useLocation } from "react-router-dom"; // Hook para detectar página ativa

function MenuLateral() {
  const location = useLocation(); // Para saber a página ativa
  const [isCollapsed, setIsCollapsed] = useState(false); // Lógica para esconder/mostrar links de navegação

  return (
    <aside className="bg-custom-teal h-screen w-64 p-6 flex flex-col justify-between text-white shadow-lg fixed top-0 left-0">
      <div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold">DentalConnect</h2>
          <p className="text-sm text-teal-100">Sistema de Agendamento</p>
        </div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/home"
            className={`flex items-center gap-3 text-lg rounded-md px-2 py-2 transition-colors ${
              location.pathname === "/home" ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <House size={24} />
            Página Inicial
          </Link>

          <Link
            to="/agendamentos"
            className={`flex items-center gap-3 text-lg rounded-md px-2 py-2 transition-colors ${
              location.pathname === "/agendamentos" ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <Calendar size={24} />
            Agendamentos
          </Link>

          <Link
            to="/servicos"
            className={`flex items-center gap-3 text-lg rounded-md px-2 py-2 transition-colors ${
              location.pathname === "/servicos" ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <Tooth size={24} />
            Serviços
          </Link>

          <Link
            to="/contato"
            className={`flex items-center gap-3 text-lg rounded-md px-2 py-2 transition-colors ${
              location.pathname === "/contato" ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <ChatText size={24} />
            Contato
          </Link>

          {/* Novo submenu com links adicionais */}
          <div className={`flex flex-col gap-2 pl-4 ${isCollapsed ? "hidden" : ""}`}>
            <Link
              to="/relatorios"
              className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
            >
              <FileText size={24} />
              Relatórios
            </Link>
            <Link
              to="/estatisticas"
              className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
            >
              <FileText size={24} />
              Estatísticas
            </Link>
          </div>

          {/* Alterando o comportamento do botão */}
          <button
            className="text-lg text-teal-300 mt-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "Expandir Menu" : "Ocultar Menu"}
          </button>
        </nav>

        <div className="border-t border-teal-300 my-6"></div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/configuracoes"
            className={`flex items-center gap-3 text-lg rounded-md px-2 py-2 transition-colors ${
              location.pathname === "/configuracoes" ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <Gear size={24} />
            Configurações
          </Link>
        </nav>
      </div>

      <footer className="text-xs text-teal-200 text-center mt-8 bg-teal-800 p-4">
        <p>&copy; 2025 DentalConnect</p>
        <p>Todos os direitos reservados.</p>
        <p>Desenvolvido por Equipe DentalConnect</p>
      </footer>
    </aside>
  );
}

export default MenuLateral;
