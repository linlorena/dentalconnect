import React, { useState, useEffect } from "react";
import LayoutLogin from "../../components/LayoutLogin";
import { Link, useNavigate } from "react-router-dom";
import { ArrowCircleLeft, EyeClosed, Eye } from "@phosphor-icons/react";
import estadosData from "../../data/Estados.json";
import cidadesData from "../../data/Cidades.json";
import { Tooltip } from "react-tooltip";

function Cadastro() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setmostrarSenha2] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const [estados, setEstados] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const navigate = useNavigate();

    useEffect(() => {setEstados(estadosData);}, []);

    useEffect(() => {
        if (estadoSelecionado) {
            const estadoEncontrado = cidadesData.estados.find(e => e.sigla === estadoSelecionado);
            setCidades(estadoEncontrado ? estadoEncontrado.cidades : []);
            setCidadeSelecionada("");
        } else {
            setCidades([]);
            setCidadeSelecionada("");
        }
    }, [estadoSelecionado]);

    const visibilidadeSenha = () => {setMostrarSenha((prev) => !prev);};

    const formatarCPF = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const formatarTelefone = (value) => {
        const numeros = value.replace(/\D/g, "");
    
        if (numeros.length <= 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else {
            return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
        }
    };
    
    const handleTelefoneChange = (e) => {
        setTelefone(formatarTelefone(e.target.value));
    };

    const handleCpfChange = (e) => {setCpf(formatarCPF(e.target.value));};

    return (
        <LayoutLogin>
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
                    <div className="flex items-center gap-4 mb-24">
                    <button onClick={() => tipoUsuario ? setTipoUsuario(null) : navigate("/")} className="text-custom-teal">
                            <ArrowCircleLeft size={60} className="text-sky-900 hover:text-sky-600 ease-in duration-150" />
                        </button>
                        <h1 className="text-custom-teal text-3xl md:text-4xl font-semibold">
                            {tipoUsuario === "dentista" ? "Dentista" : tipoUsuario === "paciente" ? "Paciente" : "Cadastre-se no DentalConnect :)"}
                        </h1>
                    </div>
                    {!tipoUsuario ? (
                        <div className="flex flex-col gap-4 w-full">
                            <button onClick={() => setTipoUsuario("dentista")} className="w-full text-xl bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 font-semibold py-4 rounded-lg">Sou Dentista</button>
                            <button onClick={() => setTipoUsuario("paciente")} className="w-full text-xl bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 font-semibold py-4 rounded-lg mb-3">Sou Paciente</button>
                        </div> ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <input type="text" placeholder="Nome" className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                                <input type="date" placeholder="Data de nascimento" className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} maxLength={14} className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                                <input type="email" placeholder="E-mail" className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                <input type="tel" placeholder="Telefone" value={telefone} onChange={handleTelefoneChange} maxLength={15} className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                                {tipoUsuario === "dentista" && <input type="text" placeholder="CRO" className="p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                            <div className="relative w-full">
                                <input type={mostrarSenha ? "text" : "password"} placeholder="Senha" minLength={8} className="p-3 w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                                <button type="button" onClick={visibilidadeSenha} className="absolute right-4 top-3 text-gray-500 cursor-pointer">
                                    {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </button>
                            </div>
                            <div className="relative w-full">
                                    <input type={mostrarSenha2 ? "text" : "password"} placeholder="Confirmar Senha" className="p-3 w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                                    <button type="button" onClick={() => setmostrarSenha2(!mostrarSenha2)} className="absolute right-4 top-3 text-gray-500 cursor-pointer">
                                        {mostrarSenha2 ? <Eye size={24} /> : <EyeClosed size={24} />}
                                    </button>
                                </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full mt-4">
                            <select className="col-span-1 p-3 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150 appearance-none" value={estadoSelecionado} onChange={(e) => setEstadoSelecionado(e.target.value)}>
                                <option value="">Estado</option>
                                {estadosData.map((estado) => (
                                    <option key={estado.id} value={estado.sigla}>{estado.sigla}</option>
                                ))}
                            </select>
                            <select className="col-span-2 p-3 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" value={cidadeSelecionada} onChange={(e) => setCidadeSelecionada(e.target.value)} disabled={!estadoSelecionado}>
                                <option value="">Selecione uma cidade</option>
                                {cidades.map((cidade, index) => (
                                    <option key={index} value={cidade}>{cidade}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col mt-4 w-full">
                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="checkbox" className="accent-custom-teal" /> Desejo receber mensagens informativas da DentalConnect.
                            </label>
                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="checkbox" className="accent-custom-teal" /> Aceito os Termos de Uso e Condições.
                            </label>
                        </div>
                            <button className="w-full mt-6 bg-custom-teal hover:bg-custom-teal-hover text-sky-900 text-xl font-semibold py-3 rounded-lg transition">
                                Cadastrar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </LayoutLogin>
    );
}

export default Cadastro;

/* Aicionar tooltips/mensagens de erro caso os valores mínimos dos dados não sejam atingidos */