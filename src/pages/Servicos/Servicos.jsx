import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import ServicoItem from "../../components/ServicoItem";

function Servicos() {
    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 3; // Definindo quantos itens por página
    const navigate = useNavigate();  // Usando o hook para navegação

    // Todos os serviços, incluindo os novos
    const servicos = [
        { id: 1, nome: "Limpeza e Profilaxia", descricao: "Procedimento para remover placas bacterianas e tártaro, prevenindo cáries e doenças periodontais.", icone: "🦷" },
        { id: 2, nome: "Clareamento Dental", descricao: "Tratamento estético que remove manchas e devolve o branco natural dos dentes com resultados duradouros.", icone: "✨" },
        { id: 3, nome: "Restaurações", descricao: "Recuperação de dentes danificados por cáries ou fraturas utilizando materiais de alta qualidade e durabilidade.", icone: "🔧" },
        { id: 4, nome: "Tratamento de Canal", descricao: "Procedimento que remove a infecção da polpa dentária, preservando o dente natural e aliviando a dor.", icone: "🦠" },
        { id: 5, nome: "Implantes Dentários", descricao: "Solução definitiva para substituição de dentes perdidos com aparência e função semelhantes aos dentes naturais.", icone: "🔩" },
        { id: 6, nome: "Ortodontia", descricao: "Correção do alinhamento dos dentes e problemas de mordida com aparelhos fixos ou removíveis.", icone: "📏" },
        { id: 7, nome: "Próteses Dentárias", descricao: "Reposição de dentes ausentes com próteses fixas ou removíveis, devolvendo função e estética.", icone: "👄" },
        { id: 8, nome: "Odontopediatria", descricao: "Cuidados especializados para a saúde bucal das crianças, com foco na prevenção e educação.", icone: "👶" },
        // Serviços adicionais
        { id: 9, nome: "Alívio de Dor Intensa / Odontalgia", descricao: "Atendimento imediato para dor de dente aguda. Pode ser necessário tratamento com medicamentos ou procedimentos rápidos.", icone: "🦷" },
        { id: 10, nome: "Tratamento de Abscesso Dentário", descricao: "Drenagem e tratamento de infecções na raiz do dente ou gengiva, que podem causar inchaço e febre.", icone: "🦠" },
        { id: 11, nome: "Reparo de Dente Quebrado ou Fraturado", descricao: "Correção de dentes lascados ou partidos, seja com resina, coroa temporária ou cimentação.", icone: "🔧" },
        { id: 12, nome: "Avulsão Dentária (Dente Arrancado)", descricao: "Tentativa de reimplante do dente perdido (em casos de trauma).", icone: "⚠️" },
        { id: 13, nome: "Canal de Urgência", descricao: "Início de tratamento endodôntico para aliviar dor intensa causada por infecção ou inflamação do nervo do dente.", icone: "⚡" },
    ];

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
        // Redireciona para a página de agendamentos
        navigate("/agendamentos");
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
                                {servicosNaPagina.map((servico) => (
                                    <ServicoItem
                                        key={servico.id}
                                        codigo={servico.id}
                                        nome={servico.nome}
                                        descricao={servico.descricao}
                                        icone={servico.icone}
                                        onAgendar={() => handleAgendar(servico.id)}  // Chama a função de navegação
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="mt-6 flex justify-center space-x-2">
                        {/* Botão para a página anterior */}
                        <button
                            onClick={() => handlePagina(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                            className="w-8 h-8 bg-gray-200 text-black rounded"
                        >
                            &lt;
                        </button>

                        {/* Botões de página */}
                        {Array.from({ length: Math.ceil(servicosFiltrados.length / itensPorPagina) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePagina(i + 1)}
                                className={`w-8 h-8 rounded ${paginaAtual === i + 1 ? 'bg-black text-white' : 'bg-gray-200'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        {/* Botão para a próxima página */}
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
