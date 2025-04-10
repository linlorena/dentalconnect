import React from "react";
import { House, MagnifyingGlass, ShootingStar, SignIn, Tooth } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo_dentalconnect.png";

function LayoutPrincipal({ children }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between px-4 py-4 bg-stone-100 border-b-4 border-teal-600 drop-shadow-sm">
        <div className="flex items-center">
          <Link to="/home">
            <img src={Logo} alt="Logo" className="w-28 pl-4" />
          </Link>
        </div>

        <div className="w-full sm:max-w-lg lg:max-w-2xl bg-gray-200 focus-within:ring-2 focus-within:ring-custom-teal focus-within:drop-shadow-sm ease-in duration-150 rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Encontre um profissional"
            className="w-full bg-transparent border-none focus:outline-none placeholder:text-gray-400 text-gray-600"
          />
          <MagnifyingGlass size={24} className="text-gray-400 hover:text-gray-600 cursor-pointer ease-in duration-150" />
        </div>

        <div className="hidden sm:flex items-center gap-4 text-md">
          <Link to="/home" className="flex items-center gap-1 font-bold hover:text-gray-700 ease-in duration-150 cursor-pointer">
            <House size={18} className="text-custom-teal" />
            <span>Início</span>
          </Link>
          <span className="text-teal-500">|</span>
          <Link to="/agendamentos" className="flex items-center gap-1 font-bold hover:text-gray-700 ease-in duration-150 cursor-pointer">
            <Tooth size={18} className="text-custom-teal" />
            <span>Agendamentos</span>
          </Link>
          <span className="text-teal-500">|</span>
          <Link to="/servicos" className="flex items-center gap-1 font-bold hover:text-gray-700 ease-in duration-150 cursor-pointer">
            <ShootingStar size={18} className="text-custom-teal" />
            <span>Serviços</span>
          </Link>
          <span className="text-teal-500">|</span>
          <Link to="/busca-avancada" className="flex items-center gap-1 font-bold hover:text-gray-700 ease-in duration-150 cursor-pointer">
            <MagnifyingGlass size={18} className="text-custom-teal" />
            <span>Busca Avançada</span>
          </Link>
        </div>

        <Link to="/">
          <div className="flex items-center rounded-3xl bg-orange-500 hover:bg-orange-600 px-4 py-2 mr-4 ease-in duration-150 cursor-pointer hover:drop-shadow-xs">
            <SignIn size={20} className="text-gray-900 mr-2" />
            <span className="text-gray-900 font-bold">Sair</span>
          </div>
        </Link>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

export default LayoutPrincipal;
