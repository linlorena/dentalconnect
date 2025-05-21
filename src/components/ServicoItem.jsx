import React from "react";

function ServicoItem({ codigo, nome, descricao, onAgendar }) {
    return (
        <tr className="border-b hover:bg-gray-100">
            <td className="py-3 px-4">{codigo}</td>
            <td className="py-3 px-4 font-semibold text-sky-900">{nome}</td>
            <td className="py-3 px-4">{descricao}</td>
            <td className="py-3 px-4">
                <button
                    className="bg-custom-teal-hover hover:bg-custom-teal-2 ease-in-out duration-150 cursor-pointer text-white font-semibold px-4 py-2 rounded"
                    onClick={onAgendar}>
                    Agendar
                </button>
            </td>
        </tr>
    );
}

export default ServicoItem;
