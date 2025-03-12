import React from "react";
import { Bookmark, House, ListPlus, MagnifyingGlass, Question, ReadCvLogo, SignIn, Users } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function LayoutPrincipal() {
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-4 bg-white border-b-4 border-teal-600">
      <div className="flex items-center">
        <Link to="/">
          <img src="" alt="Logo" className="w-40 sm:w-48 lg:w-64" />
        </Link>
      </div>

      <div className="w-full sm:max-w-md lg:max-w-lg bg-gray-200 rounded-full px-4 py-2 flex items-center">
        <input
          type="text"
          placeholder="Buscar"
          className="w-full bg-transparent border-none focus:outline-none placeholder:text-gray-400 text-gray-600"
        />
        <MagnifyingGlass size={24} className="text-gray-400 hover:text-gray-600 ease-in duration-150" />
      </div>

      <div className="hidden sm:flex items-center gap-4 text-md">
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <House size={18} />
          <span>Home</span>
        </Link>
        <span className="text-teal-500">✶</span>
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <Users size={18} />
          <span>Sobre nós</span>
        </Link>
        <span className="text-teal-500">✶</span>
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <ListPlus size={18} />
          <span>Categorias</span>
        </Link>
        <span className="text-teal-500">✶</span>
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <Bookmark size={18} />
          <span>Minhas Reservas</span>
        </Link>
        <span className="text-teal-500">✶</span>
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <ReadCvLogo size={18} />
          <span>Trabalhe conosco</span>
        </Link>
        <span className="text-teal-500">✶</span>
        <Link to="/" className="flex items-center gap-1 font-bold hover:text-orange-600">
          <Question size={18} />
          <span>Ajuda</span>
        </Link>
      </div>

      <div className="flex items-center rounded-3xl bg-orange-500 hover:bg-orange-600 px-4 py-2 cursor-pointer">
        <SignIn size={20} className="text-gray-100 mr-2" />
        <span className="text-gray-100 font-bold">
          <Link to="/">Sair</Link>
        </span>
      </div>
    </div>
  );
}

export default LayoutPrincipal;