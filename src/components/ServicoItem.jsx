import React from "react";

function ServicoItem({ codigo, nome, descricao, onAgendar }) {
    return (
        <tr className="border-b hover:bg-gray-100">
            <td className="py-3 px-4">{codigo}</td>
            <td className="py-3 px-4 font-semibold text-sky-900">{nome}</td>
            <td className="py-3 px-4">{descricao}</td>
            <td className="py-3 px-4">
                <button
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded"
                    onClick={onAgendar}
                >
                    Agendar
                </button>
            </td>
        </tr>
    );
}

export default ServicoItem;
