import React, { useState, useEffect } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashBusca from "../../assets/splash search.png";
import { CaretDown } from "@phosphor-icons/react";
import estadosData from "../../data/Estados.json";
import cidadesData from "../../data/Cidades.json";

function BuscaAvancada() {
    const [estados, setEstados] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");

    useEffect(() => {
        setEstados(estadosData);
    }, []);

    useEffect(() => {
        if (estadoSelecionado) {
            const estadoEncontrado = cidadesData.estados.find(e => e.sigla === estadoSelecionado);
            setCidades(estadoEncontrado ? estadoEncontrado.cidades : []);
            setCidadeSelecionada(""); // Resetar cidade ao trocar de estado
        } else {
            setCidades([]);
            setCidadeSelecionada("");
        }
    }, [estadoSelecionado]);

    return (
        <LayoutPrincipal>
            <div className="px-6 md:px-16 py-10 md:ml-40 md:mt-20 flex flex-col lg:flex-row items-start justify-between">
                <div className="w-full lg:w-1/2 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mt-10 text-center md:text-left text-sky-900">Busca avançada</h2>
                    <p className="text-sky-900 text-lg md:text-3xl mt-8 text-center md:text-left font-semibold">Agende <span className="text-teal-600 font-semibold">agora</span> sua consulta.</p>
                    <p className="text-sky-900 text-md font-medium mt-2 mb-6 text-center md:text-left">Mais de 1000 profissionais Online pela DentalConnect!</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                        <div className="relative">
                            <select 
                                className="w-full p-3 border focus:shadow-gray-200 focus:shadow-md border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                                value={estadoSelecionado}
                                onChange={(e) => setEstadoSelecionado(e.target.value)}>
                                <option value="">UF</option>
                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.sigla}>
                                        {estado.sigla}
                                    </option>
                                ))}
                            </select>
                            <CaretDown size={16} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select 
                                className="w-full p-3 focus:shadow-gray-200 focus:shadow-md border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                                value={cidadeSelecionada}
                                onChange={(e) => setCidadeSelecionada(e.target.value)}
                                disabled={!estadoSelecionado}>
                                <option value="">Selecione uma cidade</option>
                                {cidades.map((cidade, index) => (
                                    <option key={index} value={cidade}>
                                        {cidade}
                                    </option>
                                ))}
                            </select>
                            <CaretDown size={16} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="relative sm:col-span-2">
                            <select className="w-full p-3 border focus:shadow-gray-200 focus:shadow-md border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150">
                                <option>Selecione uma especialidade</option>
                            </select>
                            <CaretDown size={16} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="flex justify-start sm:col-span-2 mt-4">
                            <button className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition w-full sm:w-auto">
                                Pesquisar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0">
                    <img src={SplashBusca} alt="Dentistas cuidando de um dente" className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-3/4" />
                </div>
            </div>
        </LayoutPrincipal>
    );
}

export default BuscaAvancada;
