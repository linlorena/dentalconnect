import React from "react";
import { House, Calendar, Tooth, ChatText, Gear } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function MenuLateral() {
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
            className="flex items-center gap-3 text-lg rounded-md hover:bg-teal-700 px-2 py-2 transition-colors"
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

      <footer className="text-xs text-teal-200 text-center mt-8">
        &copy; 2025 DentalConnect
      </footer>
    </aside>
  );
}

export default MenuLateral;
