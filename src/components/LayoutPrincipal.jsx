import React, { useState } from "react";
import {
  House,
  MagnifyingGlass,
  ShootingStar,
  SignIn,
  Tooth,
  Stethoscope,
  Gear,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo_dentalconnect.png";
import { useAuth } from "../context/auth";

function LayoutPrincipal({ children }) {
  const { logout, tipo } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const renderLinks = () => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 text-md">
      <Link to="/home" className="flex items-center gap-2 font-bold hover:text-gray-700">
        <House size={18} className="text-custom-teal" />
        <span>Início</span>
      </Link>

      <span className="hidden sm:inline text-teal-500">|</span>

      <Link to="/agendamentos" className="flex items-center gap-2 font-bold hover:text-gray-700">
        <Tooth size={18} className="text-custom-teal" />
        <span>Agendamentos</span>
      </Link>

      {tipo === "paciente" && (
        <>
          <span className="hidden sm:inline text-teal-500">|</span>
          <Link to="/consultas" className="flex items-center gap-2 font-bold hover:text-gray-700">
            <Stethoscope size={18} className="text-custom-teal" />
            <span>Consultas</span>
          </Link>
        </>
      )}

      <span className="hidden sm:inline text-teal-500">|</span>

      <Link to="/servicos" className="flex items-center gap-2 font-bold hover:text-gray-700">
        <ShootingStar size={18} className="text-custom-teal" />
        <span>Serviços</span>
      </Link>

      <span className="hidden sm:inline text-teal-500">|</span>

      <Link to="/busca-avancada" className="flex items-center gap-2 font-bold hover:text-gray-700">
        <MagnifyingGlass size={18} className="text-custom-teal" />
        <span>Busca Avançada</span>
      </Link>

      <span className="hidden sm:inline text-teal-500">|</span>

      <Link to="/configuracoes" className="flex items-center gap-2 font-bold hover:text-gray-700">
        <Gear size={18} className="text-custom-teal" />
        <span>Configurações</span>
      </Link>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-stone-100 border-b-4 border-teal-600 drop-shadow-sm relative z-20">
        <Link to="/home">
          <img src={Logo} alt="Logo" className="w-28 pl-4" />
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="w-full sm:max-w-lg lg:max-w-2xl bg-gray-200 focus-within:ring-2 focus-within:ring-custom-teal focus-within:drop-shadow-sm ease-in duration-150 rounded-full px-4 py-2 flex items-center mx-6"
        >
          <input
            type="text"
            placeholder="Encontre um profissional"
            className="w-full bg-transparent border-none focus:outline-none placeholder:text-gray-400 text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Pesquisar">
            <MagnifyingGlass
              size={24}
              className="text-gray-400 hover:text-gray-600 cursor-pointer ease-in duration-150"
            />
          </button>
        </form>

        <div className="hidden sm:flex">{renderLinks()}</div>

        <div className="sm:hidden">
          <button onClick={() => setMenuAberto(!menuAberto)} aria-label="Abrir menu">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuAberto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center rounded-3xl bg-orange-500 hover:bg-orange-600 px-4 py-2 ml-4 ease-in duration-150 cursor-pointer hover:drop-shadow-xs">
          <button onClick={handleLogout} className="text-gray-900 font-bold">
            Sair
          </button>
          <SignIn size={20} className="text-gray-900 ml-3" />
        </div>
      </div>

      {menuAberto && (
        <div className="sm:hidden bg-stone-100 border-b-2 border-teal-500 px-6 py-4 z-10">
          {renderLinks()}
        </div>
      )}

      {menuAberto && (
        <div
          className="fixed inset-0 z-0 bg-black opacity-25 sm:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-6 bg-white">{children}</div>
    </div>
  );
}

export default LayoutPrincipal;
