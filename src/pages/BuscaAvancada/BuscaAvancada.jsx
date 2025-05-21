import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashBusca from "../../assets/splash search.png";
import { CaretDown, X, MapPin, Buildings } from "@phosphor-icons/react";
import estadosData from "../../data/Estados.json";
import cidadesData from "../../data/Cidades.json";
import ProcedimentosModal from "../../components/ProcedimentosModal" 

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

  const [isProcedimentosModalOpen, setIsProcedimentosModalOpen] = useState(false)
  const [localSelecionado, setLocalSelecionado] = useState(null)  

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

  const handleVerProcedimentos = (local) => {
    setLocalSelecionado(local)
    setIsProcedimentosModalOpen(true)
  }

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
              Agende <span className="text-custom-teal font-semibold">agora</span>{" "}
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
                  className="w-full p-3 focus:shadow-gray-200 focus:shadow-md border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal-2 ease-in duration-150"
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
                  className={`bg-custom-teal text-white py-3 px-6 rounded-lg hover:bg-custom-teal-hover transition w-full sm:w-auto ${
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

        {/* Modal de Resultados - Layout Melhorado */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm p-4">
            {/* Card principal do Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out">
              {/* Header Fixo */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-lg md:text-xl font-semibold text-sky-900 flex items-center">
                  <Buildings size={24} className="mr-2 text-custom-teal-dark" />
                  Resultados da Busca
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Fechar modal"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* Conteúdo Rolável */}
              <div className="overflow-y-auto flex-grow p-5 space-y-4 bg-gray-50">
                {error && (
                  <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-sm text-center">
                    <p className="font-semibold">Ocorreu um erro</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500">
                    <svg className="animate-spin h-8 w-8 text-sky-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando resultados...
                  </div>
                )}

                {!loading && !error && (
                  locaisEncontrados.length > 0 ? (
                    <ul className="space-y-4">
                      {locaisEncontrados.map((local) => (
                        // Card para cada clínica
                        <li
                          key={local.id}
                          className="bg-white rounded-lg shadow-md border border-gray-200 p-5 transition-shadow duration-200 hover:shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-4"
                        >
                          <div className="flex-grow">
                            <h4 className="text-lg font-semibold text-custom-teal-dark mb-1 flex items-center">
                              <Buildings size={18} className="mr-2 text-custom-teal-2 flex-shrink-0" />
                              {local.nome}
                            </h4>
                            <p className="text-gray-600 text-sm flex items-center pl-7"> {/* Alinhado com o texto do nome */}
                              <MapPin size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                              {local.endereco}, {local.numero} - {local.cidade}, {local.estado}
                            </p>
                          </div>
                          <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0">
                            <button
                              onClick={() => handleVerProcedimentos(local)}
                              className="w-full md:w-auto bg-custom-teal text-white py-2 px-5 rounded-lg font-medium hover:bg-custom-teal-hover  focus:outline-none focus:ring-2 focus:ring-custom-teal focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150 shadow-sm hover:shadow-md"
                            >
                              Ver Procedimentos
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    searchPerformed && (
                      <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500 bg-gray-100 rounded-lg p-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="font-semibold">Nenhuma clínica encontrada</p>
                        <p className="text-sm">Tente ajustar os filtros ou pesquisar em outra localidade.</p>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

       {/* Modal de Procedimentos (usando a versão atualizada) */}
       {isProcedimentosModalOpen && localSelecionado && (
          <ProcedimentosModal local={localSelecionado} onClose={() => setIsProcedimentosModalOpen(false)} />
        )}

    </LayoutPrincipal>
  );
}

export default BuscaAvancada;

