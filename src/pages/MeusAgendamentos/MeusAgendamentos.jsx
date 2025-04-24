import React, { useState, useEffect } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import Avatar from "../../assets/avatar.png";
import { MapPin, X } from "@phosphor-icons/react";
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

function MeusAgendamentos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null); // Estado para controlar o agendamento selecionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendamentosRes, locaisRes] = await Promise.all([
          axios.get("http://localhost:3001/api/consultation"),
          axios.get("http://localhost:3001/api/locals")
        ]);
        setAgendamentos(agendamentosRes.data);
        setLocais(locaisRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados.", error);
      }
    };
    fetchData();
  }, []);

  const handleAgendamentoClick = (agendamento) => {
    const localSelecionado = locais.find((l) => l.id === agendamento.local);
    const nomeLocal = localSelecionado?.nome || "Local não encontrado";
    const enderecoLocal = localSelecionado
      ? `${localSelecionado.endereco}, ${localSelecionado.numero} - ${localSelecionado.cidade}, ${localSelecionado.estado}`
      : "Endereço não encontrado";
    const enderecoEncoded = encodeURIComponent(enderecoLocal);

    // Alternar entre mostrar ou esconder a div com o endereço
    if (agendamentoSelecionado && agendamentoSelecionado.agendamento.id === agendamento.id) {
      setAgendamentoSelecionado(null); // Se já estiver selecionado, desmarca
    } else {
      setAgendamentoSelecionado({
        agendamento,
        nomeLocal,
        enderecoLocal,
        enderecoEncoded,
      });
    }
  };

  const handleVerNoMapa = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAgendamentoSelecionado(null);
  };

  return (
    <LayoutPrincipal>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-center md:text-left text-sky-900">
          Meus agendamentos
        </h2>

        <div className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-4 mb-6">
          <img src={Avatar} className="w-20 h-20 rounded-full border-5 border-custom-teal" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">{nomeUsuario}</h2>
            <p className="text-sm text-gray-500">Cadastrado em 31 de março de 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {agendamentos.map((agendamento, i) => {
            const dataFormatada = dayjs(agendamento.data).format("DD/MM");
            const diaSemana = dayjs(agendamento.data).format("dddd");
            const hora = agendamento.horario.slice(0, 5);
            const status = agendamento.status;

            const statusClasses = {
              "Pago": "text-green-600 bg-green-100",
              "Pendente": "text-yellow-700 bg-yellow-100",
              "Cancelado": "text-red-600 bg-red-100"
            };
            const statusStyle = statusClasses[status] || "text-gray-600 bg-gray-100";

            return (
              <div
                key={i}
                className="bg-sky-50 hover:bg-sky-100 duration-150 ease-in rounded-2xl p-4 text-center shadow-sm"
                onClick={() => handleAgendamentoClick(agendamento)} // Ao clicar, alterna a exibição dos dados do local
              >
                <p className="text-2xl font-bold text-custom-teal-2">{dataFormatada}</p>
                <p className="text-sm font-medium text-gray-600 capitalize">{diaSemana}</p>
                <p className="text-base font-semibold text-gray-800 mt-1">{hora}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-semibold ${statusStyle}`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Exibe a div com as informações do local abaixo dos agendamentos */}
        {agendamentoSelecionado && (
          <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row items-start gap-6 mt-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-sky-900 mb-1 flex items-center gap-2">
                <MapPin size={24} />
                {agendamentoSelecionado.nomeLocal}
              </h3>
              <p className="text-sm text-gray-600">{agendamentoSelecionado.enderecoLocal}</p>
              <button
                onClick={handleVerNoMapa}
                className="mt-4 px-4 py-2 bg-sky-100 font-bold text-sky-900 rounded-2xl hover:bg-custom-light-hover ease-in duration-150"
              >
                Ver no mapa
              </button>
            </div>

            <div className="w-full md:w-100 h-40 overflow-hidden rounded-xl drop-shadow-md shadow hidden md:block">
              <iframe
                title="Mapa"
                src={`https://www.google.com/maps?q=${agendamentoSelecionado.enderecoEncoded}&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}

        {/* Modal do mapa */}
        {modalAberto && agendamentoSelecionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <div className="bg-white p-4 rounded-3xl shadow-lg w-full max-w-3xl relative">
              <button
                onClick={fecharModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              >
                <X
                  size={32}
                  className="bg-white rounded-full p-2 text-gray-400 hover:text-custom-teal-2 duration-150 ease-in drop-shadow-md"
                  weight="bold"
                />
              </button>
              <iframe
                title="Mapa"
                src={`https://www.google.com/maps?q=${agendamentoSelecionado.enderecoEncoded}&z=16&output=embed`}
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default MeusAgendamentos;
