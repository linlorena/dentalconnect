import React from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";

function Tratamentos() {
    const tratamentos = [
        { id: 1, nome: "Limpeza e Profilaxia", descricao: "Procedimento para remover placas bacterianas e tártaro, prevenindo cáries e doenças periodontais.", icone: "🦷" },
        { id: 2, nome: "Clareamento Dental", descricao: "Tratamento estético que remove manchas e devolve o branco natural dos dentes com resultados duradouros.", icone: "✨" },
        { id: 3, nome: "Restaurações", descricao: "Recuperação de dentes danificados por cáries ou fraturas utilizando materiais de alta qualidade e durabilidade.", icone: "🔧" },
        { id: 4, nome: "Tratamento de Canal", descricao: "Procedimento que remove a infecção da polpa dentária, preservando o dente natural e aliviando a dor.", icone: "🦠" },
        { id: 5, nome: "Implantes Dentários", descricao: "Solução definitiva para substituição de dentes perdidos com aparência e função semelhantes aos dentes naturais.", icone: "🔩" },
        { id: 6, nome: "Ortodontia", descricao: "Correção do alinhamento dos dentes e problemas de mordida com aparelhos fixos ou removíveis.", icone: "📏" },
        { id: 7, nome: "Próteses Dentárias", descricao: "Reposição de dentes ausentes com próteses fixas ou removíveis, devolvendo função e estética.", icone: "👄" },
        { id: 8, nome: "Odontopediatria", descricao: "Cuidados especializados para a saúde bucal das crianças, com foco na prevenção e educação.", icone: "👶" }
    ];

    return (
        <LayoutPrincipal>
            <div className="w-full h-full flex flex-col">
                <div className="flex-grow px-4 md:px-12 py-10">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-sky-900">Nossos Tratamentos</h2>
                        <p className="text-lg mt-4 text-sky-900 max-w-2xl mx-auto">
                            Aqui você encontrará uma seleção de alguns dos tratamentos disponíveis. 
                            Nossa equipe está pronta para oferecer cuidados personalizados para o seu sorriso.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tratamentos.map((tratamento) => (
                            <div
                                key={tratamento.id}
                                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300 border-t-4 border-custom-teal"
                            >
                                <div className="flex items-center mb-3">
                                    <span className="text-3xl mr-3">{tratamento.icone}</span>
                                    <h3 className="text-xl font-semibold text-sky-900">{tratamento.nome}</h3>
                                </div>
                                <p className="text-gray-600">{tratamento.descricao}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LayoutPrincipal>
    );
}

export default Tratamentos;
