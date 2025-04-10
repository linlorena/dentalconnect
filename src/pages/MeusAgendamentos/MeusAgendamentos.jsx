import React from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import Avatar from "../../assets/avatar.png";


function MeusAgendamentos() {
  return (
    <LayoutPrincipal>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-center md:text-left text-sky-900">Meus agendamentos</h2>

        {/* Card do Usuário */}
        <div className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-4 mb-6">
          <img
            src={Avatar}
            className="w-20 h-20 rounded-full border-5 border-custom-teal"
          />
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
            <div key={i} className="bg-gray-100 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl text-gray-500">{agendamento.dia}</p>
              <p className="text-sm font-medium text-gray-600">{agendamento.data}</p>
              <p className="text-base font-semibold text-gray-800 mt-1">{agendamento.hora}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Clínica de Saúde Oral Teste123</h3>
            <p className="text-sm text-gray-600">Rua das Laranjeiras, 12</p>
          </div>

          <div className="w-full md:w-60 h-40 overflow-hidden rounded-md shadow">
            <iframe
              title="Mapa da clínica"
              src="https://www.google.com/maps?q=Rua+das+Laranjeiras,+12&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  );
}

export default MeusAgendamentos;
