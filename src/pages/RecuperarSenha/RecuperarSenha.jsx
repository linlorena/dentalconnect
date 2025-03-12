import React, { useState } from "react";
import LayoutLogin from "../../components/LayoutLogin";
import { ArrowCircleLeft, Eye, EyeClosed } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

function RecuperarSenha() {
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setmostrarSenha2] = useState(false);
    const toggleMostrarSenha = () => setMostrarSenha(!mostrarSenha);
    const togglemostrarSenha2 = () => setmostrarSenha2(!mostrarSenha2);

    return (
        <LayoutLogin>
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">

                    <div className="flex items-center gap-4 mb-24">
                        <button onClick={() => navigate("/login")} className="text-custom-teal">
                            <ArrowCircleLeft size={60} className="text-sky-900 hover:text-sky-600 transition duration-150" />
                        </button>
                        <h1 className="text-custom-teal text-4xl font-bold">Esqueci minha senha :(</h1>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <input type="text" placeholder="E-mail ou CPF" className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal" />

                        <div className="relative w-full">
                            <input type={mostrarSenha ? "text" : "password"} placeholder="Nova senha" className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal" />
                            <button type="button" onClick={toggleMostrarSenha} className="absolute right-4 top-3 text-gray-500 cursor-pointer">
                                {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                        </div>

                        <div className="relative w-full">
                            <input type={mostrarSenha2 ? "text" : "password"} placeholder="Confirmar nova senha" className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal" />
                            <button type="button" onClick={togglemostrarSenha2} className="absolute right-4 top-3 text-gray-500 cursor-pointer">
                                {mostrarSenha2 ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                        </div>
                    </div>

                   {/*  <div className="mt-6 w-full flex justify-center">
                        espaço pro recaptcha?
                    </div> */}

                    <button className="w-full mt-8 bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 text-xl font-semibold py-3 rounded-lg hover:bg-opacity-90 transition">
                        Alterar senha
                    </button>
                </div>
            </div>
        </LayoutLogin>
    );
}

export default RecuperarSenha;
