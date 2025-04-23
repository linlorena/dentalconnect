import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import ServicoItem from "../../components/ServicoItem";
import axios from "axios";

function Servicos() {
    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 3;
    const [servicos, setServicos] = useState([]);  // Armazena os serviços
    const [erro, setErro] = useState(null); // Armazena erros da API
    const navigate = useNavigate();

    // Carregar serviços de forma dinâmica (simulando o futuro backend)
    useEffect(() => {
        axios.get("http://localhost:3001/api/services")
            .then((response) => {
                setServicos(response.data);
                setErro(null); // Limpa o erro caso a requisição seja bem-sucedida
            })
            .catch((error) => {
                setErro("Erro ao buscar serviços, tente novamente mais tarde.");
                console.error("Erro ao buscar serviços:", error);
            });
    }, []);

    // Filtrando os serviços com base na busca
    const servicosFiltrados = servicos.filter((servico) =>
        servico.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // Paginação: selecionando os itens da página atual
    const indexDoUltimoServico = paginaAtual * itensPorPagina;
    const indexDoPrimeiroServico = indexDoUltimoServico - itensPorPagina;
    const servicosNaPagina = servicosFiltrados.slice(indexDoPrimeiroServico, indexDoUltimoServico);

    // Alterar a página
    const handlePagina = (pagina) => {
        setPaginaAtual(pagina);
    };

    // Função para navegar para a tela de MeusAgendamentos
    const handleAgendar = (codigo) => {
        navigate("/agendamentos");
    };

    // Função para voltar ao menu principal
    const handleVoltar = () => {
        navigate("/home"); // Ou para a página inicial que você preferir
    };

    return (
        <LayoutPrincipal>
            <div className="w-full h-full flex flex-col">
                <div className="flex-grow px-4 md:px-12 py-10">
                    {/* Barra de navegação */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-custom-teal">Serviços Disponíveis</h2>
                        <input
                            type="text"
                            placeholder="Buscar procedimento"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Exibição de erro */}
                    {erro && (
                        <div className="bg-red-200 text-red-700 p-3 mb-4 rounded-md">
                            {erro}
                        </div>
                    )}

                    {/* Tabela de serviços */}
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-2 px-4">Código</th>
                                    <th className="py-2 px-4">Nome do Procedimento</th>
                                    <th className="py-2 px-4">Descrição</th>
                                    <th className="py-2 px-4">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicosNaPagina.length > 0 ? (
                                    servicosNaPagina.map((servico) => (
                                        <ServicoItem
                                            key={servico.id}
                                            codigo={servico.id}
                                            nome={servico.nome}
                                            descricao={servico.descricao}
                                            icone={servico.icone}
                                            onAgendar={() => handleAgendar(servico.id)}  // Chama a função de navegação
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            Nenhum serviço encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="mt-6 flex justify-center space-x-2">
                        <button
                            onClick={() => handlePagina(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                            className="w-8 h-8 bg-gray-200 text-black rounded"
                        >
                            &lt;
                        </button>

                        {Array.from({ length: Math.ceil(servicosFiltrados.length / itensPorPagina) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePagina(i + 1)}
                                className={`w-8 h-8 rounded ${paginaAtual === i + 1 ? 'bg-black text-white' : 'bg-gray-200'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePagina(paginaAtual + 1)}
                            disabled={paginaAtual === Math.ceil(servicosFiltrados.length / itensPorPagina)}
                            className="w-8 h-8 bg-gray-200 text-black rounded"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </LayoutPrincipal>
    );
}

export default Servicos;
