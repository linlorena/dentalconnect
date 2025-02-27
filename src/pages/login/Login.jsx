import React, { useState } from "react";
import LayoutLogin from "../../components/LayoutLogin";
import { Link } from "react-router-dom";
import { ArrowCircleLeft, EyeClosed, Eye } from "@phosphor-icons/react";

function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const visibilidadeSenha = () => {
        setMostrarSenha((prev) => !prev);
    };

    return (
        <LayoutLogin>
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
                    <div className="flex items-center gap-4 mb-24">
                        <Link to="/" className="text-custom-teal">
                            <ArrowCircleLeft size={60} className="text-sky-900 hover:text-sky-600 ease-in duration-150" />
                        </Link>
                        <h1 className="text-custom-teal text-4xl font-semibold">
                            Entre no <span className="block">DentalConnect :)</span>
                        </h1>
                    </div>
                    
                    <p className="mb-1 ml-1 font-semibold">E-mail</p>
                    <div className="relative w-full mb-4">
                        <input
                            type="text"
                            placeholder="Digite seu e-mail"
                            className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal"
                        />
                    </div>

                    <p className="mb-1 ml-1 font-semibold">Senha</p>
                    <div className="relative w-full mb-4">
                        <input type={mostrarSenha ? "text" : "password"} placeholder="Digite sua senha" className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal" />
                        <button type="button" onClick={visibilidadeSenha} className="absolute right-4 top-3 text-gray-500 cursor-pointer">
                            {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
                        </button>
                    </div>

                    <div className="w-full flex justify-between items-center text-gray-700 text-sm mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-custom-teal" />
                                Lembrar meus dados
                        </label>
                        <Link to="/esqueci-senha" className="hover:underline">
                            <Link to={"/recuperarsenha"}>Esqueci minha senha</Link>
                        </Link>
                    </div>

                    <Link to="/home" className="block">
                        <button className="w-full mt-8 mb-3 bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 text-xl font-semibold py-3 rounded-lg hover:bg-opacity-90 transition">
                            Entrar
                        </button>
                    </Link>
                </div>
            </div>
        </LayoutLogin>
    );
}

export default Login;
