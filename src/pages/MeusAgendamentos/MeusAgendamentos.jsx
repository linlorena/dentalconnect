import React, { useState } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import Avatar from "../../assets/avatar.png";
import { MapPin, X } from "@phosphor-icons/react";

function MeusAgendamentos() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <LayoutPrincipal>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-center md:text-left text-sky-900">
          Meus agendamentos
        </h2>

        <div className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-4 mb-6">
          <img src={Avatar} className="w-20 h-20 rounded-full border-5 border-custom-teal" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Usuário_Teste</h2>
            <p className="text-sm text-gray-500">Cadastrado em 31 de março de 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { dia: "10.abr", data: "quinta-feira", hora: "23:00" },
            { dia: "14.nov", data: "quinta-feira", hora: "09:30" },
            { dia: "27.dez", data: "sexta-feira", hora: "18:45" },
          ].map((agendamento, i) => (
            <div key={i} className="bg-sky-50 hover:bg-sky-100 duration-150 ease-in rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-custom-teal-2">{agendamento.dia}</p>
              <p className="text-sm font-medium text-gray-600">{agendamento.data}</p>
              <p className="text-base font-semibold text-gray-800 mt-1">{agendamento.hora}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
          <h3 className="text-xl font-semibold text-sky-900 mb-1 flex items-center gap-2">
            <MapPin size={24} />
            Clínica de Saúde Bucal Teste123
          </h3>
            <p className="text-sm text-gray-600">Rua das Laranjeiras, 12</p>
            <button onClick={() => setModalAberto(true)} className="mt-4 px-4 py-2 bg-sky-100 font-bold text-sky-900 rounded-2xl hover:bg-custom-light-hover ease-in duration-150">
              Ver no mapa
            </button>
          </div>

          <div className="w-full md:w-100 h-40 overflow-hidden rounded-xl drop-shadow-md shadow hidden md:block">
            <iframe title="Mapa" src="https://www.google.com/maps?q=Rua+das+Laranjeiras,+12&output=embed"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"></iframe>
          </div>
        </div>

        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <div className="bg-white p-4 rounded-3xl shadow-lg w-full max-w-3xl relative">
              <button onClick={() => setModalAberto(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl">
                <X size={32} className="bg-white rounded-full p-2 text-gray-400 hover:text-custom-teal-2 duration-150 ease-in drop-shadow-md" weight="bold" />
              </button>
              <iframe title="Mapa" src="https://www.google.com/maps?q=Rua+das+Laranjeiras,+12&output=embed"
                width="100%" height="500" style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy" className="rounded-2xl"></iframe>
            </div>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default MeusAgendamentos;
