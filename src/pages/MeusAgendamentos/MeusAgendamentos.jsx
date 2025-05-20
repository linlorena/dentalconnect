import React, { useState, useEffect } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import AvatarDefault from "../../assets/avatar.png";
import { MapPin, X, Calendar, Clock, User, CheckCircle } from "@phosphor-icons/react";
import axios from "axios";
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

  const { nome, avatar } = useAuth()

  const formatarNome = (nome) => {
    if (!nome) return "Usuário"
    
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
  }

  const nomeFormatado = formatarNome(nome)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [agendamentosRes, locaisRes] = await Promise.all([
          axios.get("http://localhost:3001/api/consultation", { headers }),
          axios.get("http://localhost:3001/api/locals", { headers })
        ]);

        // Busca os nomes dos dentistas para cada agendamento
        const agendamentosComDentistas = await Promise.all(
          agendamentosRes.data.map(async (agendamento) => {
            try {
              const dentistaRes = await axios.get(`http://localhost:3001/api/dentists/${agendamento.dentista}`, { headers });
              return {
                ...agendamento,
                dentista_nome: dentistaRes.data.usuario?.nome || "Dentista não encontrado"
              };
            } catch (error) {
              console.error("Erro ao buscar dados do dentista:", error);
              if (error.response?.status === 401) {
                // Token expirado ou inválido
                localStorage.removeItem('token');
                window.location.href = '/login';
                return null;
              }
              return {
                ...agendamento,
                dentista_nome: "Dentista não encontrado"
              };
            }
          })
        );

        setAgendamentos(agendamentosComDentistas.filter(Boolean));
        setLocais(locaisRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, []);

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

  const agendamentosFiltrados = filtroStatus === "Todos" 
    ? agendamentos 
    : agendamentos.filter(ag => ag.status === filtroStatus);

  return (
    <LayoutPrincipal>
      <div className="max-w-5xl mx-auto px-4">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-sky-900">
            Meus Agendamentos
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

        {/* Card do usuário */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-700 rounded-3xl shadow-lg p-6 flex items-center gap-6 mb-8 text-white">
          <div className="relative">
            <img 
              src={avatar || AvatarDefault} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
              alt={nomeFormatado}
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{nomeFormatado}</h2>
            <p className="text-sm text-sky-100">Cadastrado em 31 de março de 2024</p>
            <p className="mt-1 text-sm bg-sky-800 bg-opacity-30 rounded-full px-3 py-1 inline-block">
              {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Mensagem se não houver agendamentos */}
        {agendamentosFiltrados.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700">Nenhum agendamento {filtroStatus !== "Todos" ? `com status "${filtroStatus}"` : ""}</h3>
            <p className="text-gray-500 mt-2">
              {filtroStatus !== "Todos" 
                ? "Tente selecionar outro filtro ou visualizar todos os agendamentos"
                : "Você ainda não possui agendamentos cadastrados"}
            </p>
          </div>
        )}

        {/* Grid de agendamentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
                  <span className={`flex items-center px-3 py-1 text-sm rounded-full font-medium border ${statusStyle}`}>
                    {getStatusIcon(status)}
                    {status}
                  </span>
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
                    Dr(a). {agendamento.dentista_nome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

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
                        Dr(a). {agendamentoSelecionado.agendamento.dentista_nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        CRO {/* {agendamentoSelecionado.agendamento.dentista_cro} */} 12345
                      </p>
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
                        className="mt-3 px-4 py-2 bg-sky-600 font-semibold text-white rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <MapPin size={18} weight="bold" />
                        Ver no mapa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden rounded-xl shadow-md">
                <iframe
                  title="Mapa" 
                  src={`https://www.google.com/maps?q=${agendamentoSelecionado.enderecoEncoded}&z=17&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: "240px" }}
                  allowFullScreen="" 
                  loading="lazy">
                </iframe>
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