import React from "react";
import { House, Calendar, Tooth, ChatText, Gear, User } from "@phosphor-icons/react"; // Adicionando o ícone do usuário
import { Link, useLocation } from "react-router-dom"; // Importando useLocation para determinar a página ativa

function MenuLateral() {
  const location = useLocation(); // Hook para verificar a URL atual

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
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
          >
            <Calendar size={24} />
            Agendamentos
          </Link>

          <Link
            to="/servicos"
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
          >
            <Tooth size={24} />
            Serviços
          </Link>

          <Link
            to="/contato"
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
          >
            <ChatText size={24} />
            Contato
          </Link>

          {/* Novo Link para Perfil */}
          <Link
            to="/perfil"
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
          >
            <User size={24} />
            Perfil
          </Link>
        </nav>

        <div className="border-t border-teal-300 my-6"></div>

        <nav className="flex flex-col gap-4">
          <Link
            to="/configuracoes"
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
          >
            <Gear size={24} />
            Configurações
          </Link>
        </nav>
      </div>

      {/* Alterando a cor do footer */}
      <footer className="text-xs text-teal-200 text-center mt-8 bg-teal-800 p-2">
        &copy; 2025 DentalConnect
      </footer>
    </aside>
  );
}

export default MenuLateral;
