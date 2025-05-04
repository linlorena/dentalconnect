import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashBusca from "../../assets/splash search.png";
import { CaretDown, X } from "@phosphor-icons/react";
import estadosData from "../../data/Estados.json";
import cidadesData from "../../data/Cidades.json";

function BuscaAvancada() {
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidades, setCidades] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  
  const [locaisEncontrados, setLocaisEncontrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setEstados(estadosData);
  }, []);

  useEffect(() => {
    if (estadoSelecionado) {
      const estadoEncontrado = cidadesData.estados.find(
        (e) => e.sigla === estadoSelecionado
      );
      setCidades(estadoEncontrado ? estadoEncontrado.cidades : []);
      setCidadeSelecionada("");
    } else {
      setCidades([]);
      setCidadeSelecionada("");
    }
  }, [estadoSelecionado]);

  const handleSearch = async () => {
    setIsModalOpen(true);
    setLoading(true);
    setError(null);
    setLocaisEncontrados([]);
    setSearchPerformed(true);

    const params = {};
    if (estadoSelecionado) params.estado = estadoSelecionado;
    if (cidadeSelecionada) params.cidade = cidadeSelecionada;

    const baseUrl = "http://localhost:3001/api/locals/buscaavancada";

    try {
      const response = await axios.get(baseUrl, { params });
      const data = Array.isArray(response.data) ? response.data : [];
      setLocaisEncontrados(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Ocorreu um erro ao buscar os locais.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPrincipal>
      <div className="px-6 md:px-16 py-10 md:ml-40 md:mt-20 flex flex-col items-start">
        {/* Seção Superior com Formulário e Imagem */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between mb-10">
          {/* Formulário */}
          <div className="w-full lg:w-1/2 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mt-10 text-center md:text-left text-sky-900">
              Busca avançada
            </h2>
            <p className="text-sky-900 text-lg md:text-3xl mt-8 text-center md:text-left font-semibold">
              Agende <span className="text-teal-600 font-semibold">agora</span>{" "}
              sua consulta.
            </p>
            <p className="text-sky-900 text-md font-medium mt-2 mb-6 text-center md:text-left">
              Mais de 1000 profissionais Online pela DentalConnect!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
              <div className="relative">
                <select
                  className="w-full p-3 border focus:shadow-gray-200 focus:shadow-md border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                  value={estadoSelecionado}
                  onChange={(e) => setEstadoSelecionado(e.target.value)}
                >
                  <option value="">UF</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.sigla}>
                      {estado.sigla}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-500 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  className="w-full p-3 focus:shadow-gray-200 focus:shadow-md border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                  value={cidadeSelecionada}
                  onChange={(e) => setCidadeSelecionada(e.target.value)}
                  disabled={!estadoSelecionado}
                >
                  <option value="">Selecione uma cidade</option>
                  {cidades.map((cidade, index) => (
                    <option key={index} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-500 pointer-events-none"
                />
              </div>

              <div className="flex justify-start sm:col-span-2 mt-4">
                <button
                  className={`bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition w-full sm:w-auto ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? "Pesquisando..." : "Pesquisar"}
                </button>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
            <img
              src={SplashBusca}
              alt="Dentistas cuidando de um dente"
              className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-3/4"
            />
          </div>
        </div>

        {/* Modal de Resultados */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold text-sky-900">
                  Resultados da Busca
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong className="font-bold">Erro!</strong>
                    <span className="block"> {error}</span>
                  </div>
                )}

                {loading && (
                  <p className="text-center text-sky-900">
                    Carregando resultados...
                  </p>
                )}

                {!loading && !error && (
                  locaisEncontrados.length > 0 ? (
                    <ul className="space-y-4">
                      {locaisEncontrados.map((local) => (
                        <li
                          key={local.id}
                          className="border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            {/* Informações da clínica */}
                            <div>
                              <h4 className="text-xl font-bold text-teal-600">
                                {local.nome}
                              </h4>
                              <p className="text-gray-700">
                                {local.endereco}, {local.numero}
                              </p>
                              <p className="text-gray-600">
                                {local.cidade} - {local.estado}
                              </p>
                            </div>
                            {/* Botão Ver Procedimentos centralizado verticalmente */}
                            <button
                              onClick={() =>
                                console.log("Ver procedimentos de", local.id)
                              }
                              className="ml-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                            >
                              Ver Procedimentos
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    searchPerformed && (
                      <p className="text-center text-gray-600 font-bold">
                        Ops, por enquanto não possuímos clínicas no seu local :(
                      </p>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default BuscaAvancada;
