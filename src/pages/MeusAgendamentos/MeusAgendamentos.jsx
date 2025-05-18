import React, { useState, useEffect } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import AvatarDefault from "../../assets/avatar.png";
import { MapPin, X, Calendar, Clock, User, CheckCircle, CaretLeft, CaretRight } from "@phosphor-icons/react";
import api from "../../services/api";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');
import { useAuth } from "../../context/auth"

function MeusAgendamentos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [dataAtual, setDataAtual] = useState(dayjs());
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("todos");

  const { nome, avatar, tipo, user } = useAuth()

  const formatarNome = (nome) => {
    if (!nome) return "Usuário"
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
  }

  const nomeFormatado = formatarNome(nome)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCarregando(true);
        const [agendamentosRes, locaisRes] = await Promise.all([
          api.get("/consultation"),
          api.get("/locals")
        ]);

        // Se for dentista, filtra apenas os agendamentos dele
        const agendamentosFiltrados = tipo === "dentista" 
          ? agendamentosRes.data.filter(ag => ag.dentista === user)
          : agendamentosRes.data;

        // Ordena os agendamentos por data e horário
        const agendamentosOrdenados = agendamentosFiltrados.sort((a, b) => {
          const dataA = new Date(a.data + 'T' + a.horario);
          const dataB = new Date(b.data + 'T' + b.horario);
          return dataA - dataB;
        });

        setAgendamentos(agendamentosOrdenados);
        setLocais(locaisRes.data);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setCarregando(false);
      }
    };
    fetchData();
  }, [tipo, user]);

  const handleAgendamentoClick = (agendamento) => {
    const localSelecionado = locais.find((l) => l.id === agendamento.local);
    const nomeLocal = localSelecionado?.nome || "Local não encontrado";
    const enderecoLocal = localSelecionado ? `${localSelecionado.endereco}, ${localSelecionado.numero} - ${localSelecionado.cidade}, ${localSelecionado.estado}` : "Endereço não encontrado";
    const enderecoEncoded = encodeURIComponent(enderecoLocal);

    if (agendamentoSelecionado && agendamentoSelecionado.agendamento.id === agendamento.id) {
      setAgendamentoSelecionado(null); 
    } else {
      setAgendamentoSelecionado({
        agendamento, nomeLocal, enderecoLocal, enderecoEncoded,
      });
    }
  };

  const handleVerNoMapa = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pago":
        return <CheckCircle className="mr-1" size={16} weight="fill" />;
      case "Pendente":
        return <Clock className="mr-1" size={16} weight="fill" />;
      case "Cancelado":
        return <X className="mr-1" size={16} weight="fill" />;
      default:
        return null;
    }
  };

  const handleAtualizarStatus = async (agendamentoId, novoStatus) => {
    try {
      await api.put(`/consultation/${agendamentoId}`, { status: novoStatus });
      // Atualiza a lista de agendamentos
      const agendamentosAtualizados = agendamentos.map(ag => 
        ag.id === agendamentoId ? { ...ag, status: novoStatus } : ag
      );
      setAgendamentos(agendamentosAtualizados);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const proximoDia = () => {
    setDataAtual(dataAtual.add(1, 'day'));
  };

  const diaAnterior = () => {
    setDataAtual(dataAtual.subtract(1, 'day'));
  };

  // Função para filtrar agendamentos da semana atual
  const getAgendamentosSemana = () => {
    const inicioDaSemana = dataAtual.startOf('week');
    const fimDaSemana = dataAtual.endOf('week');
    
    return agendamentos
      .filter(ag => filtroStatus === "Todos" || ag.status === filtroStatus)
      .filter(ag => {
        const dataAgendamento = dayjs(ag.data);
        return dataAgendamento.isAfter(inicioDaSemana) && dataAgendamento.isBefore(fimDaSemana);
      })
      .sort((a, b) => dayjs(a.data).valueOf() - dayjs(b.data).valueOf());
  };

  // Função para filtrar todos os agendamentos
  const getTodosAgendamentos = () => {
    return agendamentos
      .filter(ag => filtroStatus === "Todos" || ag.status === filtroStatus)
      .sort((a, b) => dayjs(a.data).valueOf() - dayjs(b.data).valueOf());
  };

  // Filtra agendamentos baseado na aba ativa
  const agendamentosFiltrados = abaAtiva === "semana" ? getAgendamentosSemana() : getTodosAgendamentos();

  return (
    <LayoutPrincipal>
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-sky-900">
            {tipo === "dentista" ? "Minha Agenda" : "Meus Agendamentos"}
          </h2>
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
            {["Todos", "Pago", "Pendente", "Cancelado"].map(status => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filtroStatus === status 
                    ? "bg-sky-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sistema de abas */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAbaAtiva("todos")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              abaAtiva === "todos"
                ? "bg-sky-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Todos os Agendamentos
          </button>
          <button
            onClick={() => setAbaAtiva("semana")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              abaAtiva === "semana"
                ? "bg-sky-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Agenda da Semana
          </button>
        </div>

        {/* Cabeçalho da semana (apenas visível na aba da semana) */}
        {abaAtiva === "semana" && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <button 
                onClick={diaAnterior}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-all"
              >
                <CaretLeft size={20} />
              </button>
              <div className="text-center">
                <p className="text-lg font-bold text-sky-900">
                  Semana de {dataAtual.startOf('week').format('DD/MM')} até {dataAtual.endOf('week').format('DD/MM')}
                </p>
              </div>
              <button 
                onClick={proximoDia}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-all"
              >
                <CaretRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de carregamento */}
        {carregando && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Mensagem se não houver agendamentos */}
        {!carregando && agendamentosFiltrados.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700">
              {abaAtiva === "semana" 
                ? `Nenhuma consulta ${filtroStatus !== "Todos" ? `com status "${filtroStatus}"` : ""} para esta semana`
                : `Nenhum agendamento ${filtroStatus !== "Todos" ? `com status "${filtroStatus}"` : ""}`}
            </h3>
            <p className="text-gray-500 mt-2">
              {filtroStatus !== "Todos" 
                ? "Tente selecionar outro filtro ou visualizar todos os agendamentos"
                : "Você ainda não possui agendamentos cadastrados"}
            </p>
          </div>
        )}

        {/* Grid de agendamentos */}
        {!carregando && agendamentosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {agendamentosFiltrados.map((agendamento, i) => {
              const dataFormatada = dayjs(agendamento.data).format("DD/MM");
              const diaSemana = dayjs(agendamento.data).format("dddd");
              const hora = agendamento.horario.slice(0, 5);
              const status = agendamento.status;

              const statusClasses = {
                "Pago": "text-green-600 bg-green-100 border-green-200",
                "Pendente": "text-yellow-700 bg-yellow-100 border-yellow-200",
                "Cancelado": "text-red-600 bg-red-100 border-red-200"
              };
              const statusStyle = statusClasses[status] || "text-gray-600 bg-gray-100 border-gray-200";
              
              const isSelected = agendamentoSelecionado && agendamentoSelecionado.agendamento.id === agendamento.id;

              return (
                <div 
                  key={i} 
                  className={`bg-white hover:bg-sky-50 duration-150 ease-in rounded-2xl p-5 shadow-sm border-2 cursor-pointer transform transition-all
                    ${isSelected ? "border-sky-500 shadow-md scale-[1.02]" : "border-transparent hover:border-sky-200"}`} 
                  onClick={() => handleAgendamentoClick(agendamento)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-sky-100 rounded-xl p-3 w-16 h-16 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-sky-700">{dataFormatada}</p>
                      <p className="text-xs font-medium text-sky-500 capitalize -mt-1">{diaSemana}</p>
                    </div>
                    {tipo === "dentista" ? (
                      <select
                        value={status}
                        onChange={(e) => handleAtualizarStatus(agendamento.id, e.target.value)}
                        className={`px-3 py-1 text-sm rounded-full font-medium border ${statusStyle}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    ) : (
                      <span className={`flex items-center px-3 py-1 text-sm rounded-full font-medium border ${statusStyle}`}>
                        {getStatusIcon(status)}
                        {status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Clock size={18} className="text-gray-500" />
                    <p className="text-base font-semibold text-gray-800">{hora}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin size={18} className="text-gray-500" />
                    <p className="text-sm text-gray-600 truncate">
                      {locais.find(l => l.id === agendamento.local)?.nome || "Local não especificado"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <User size={18} className="text-gray-500" />
                    <p className="text-sm text-gray-600 truncate">
                      {tipo === "dentista" 
                        ? agendamento.paciente_nome || "Paciente não especificado"
                        : "Dr. " + (agendamento.dentista_nome || "Nome não disponível")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detalhes do agendamento selecionado */}
        {agendamentoSelecionado && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-sky-200 mb-12 transition-all duration-300 transform">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-sky-900 mb-4 flex items-center gap-2">
                  <div className="bg-sky-100 p-2 rounded-full">
                    <MapPin size={24} className="text-sky-700" weight="fill" />
                  </div>
                  {agendamentoSelecionado.nomeLocal}
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-sky-100 rounded-full p-2">
                      <User size={20} className="text-sky-700" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tipo === "dentista"
                          ? agendamentoSelecionado.agendamento.paciente_nome || "Paciente não especificado"
                          : "Dr. " + (agendamentoSelecionado.agendamento.dentista_nome || "Nome não disponível")}
                      </p>
                      {tipo === "dentista" && (
                        <p className="text-sm text-gray-500">
                          Telefone: {agendamentoSelecionado.agendamento.paciente_telefone || "Não informado"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-sky-100 rounded-full p-2">
                      <Calendar size={20} className="text-sky-700" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {dayjs(agendamentoSelecionado.agendamento.data).format("DD [de] MMMM [de] YYYY")}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {dayjs(agendamentoSelecionado.agendamento.data).format("dddd")} às {agendamentoSelecionado.agendamento.horario.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-sky-100 rounded-full p-2 mt-1">
                      <MapPin size={20} className="text-sky-700" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Endereço</p>
                      <p className="text-sm text-gray-600">{agendamentoSelecionado.enderecoLocal}</p>
                      <button 
                        onClick={handleVerNoMapa}
                        className="mt-2 text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1"
                      >
                        Ver no mapa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal do mapa */}
        {modalAberto && agendamentoSelecionado && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative animate-fadeIn overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={fecharModal} 
                  className="bg-white rounded-full p-2 shadow-lg text-gray-500 hover:text-sky-700 transition-colors"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>
              
              <div className="p-5 bg-sky-700 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin size={24} weight="fill" />
                  {agendamentoSelecionado.nomeLocal}
                </h3>
                <p className="text-sm text-sky-100 mt-1">{agendamentoSelecionado.enderecoLocal}</p>
              </div>
              
              <iframe
                title="Mapa" 
                src={`https://www.google.com/maps?q=${agendamentoSelecionado.enderecoEncoded}&z=17&output=embed`}
                width="100%" 
                height="500" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy">
              </iframe>
            </div>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default MeusAgendamentos;