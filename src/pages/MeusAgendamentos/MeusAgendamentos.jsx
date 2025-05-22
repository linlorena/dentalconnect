import React, { useState, useEffect } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import AvatarDefault from "../../assets/avatar.png";
import { MapPin, X, Calendar, Clock, User, CheckCircle, Stethoscope } from "@phosphor-icons/react";
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
  const [mesSelecionado, setMesSelecionado] = useState(dayjs().format('YYYY-MM'));

  const { nome, avatar, id } = useAuth()

  const formatarNome = (nome) => {
    if (!nome) return "Usuário"
    return nome
  }

  const nomeFormatado = formatarNome(nome)

  // Função para verificar se o avatar é válido
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined') {
      return "https://wvttncioiubiecakmzum.supabase.co/storage/v1/object/public/avatar/avatarPaciente.jpg";
    }
    return avatarUrl;
  };

  // Gera a lista de meses para o seletor (6 meses atrás até 6 meses à frente)
  const gerarOpcoesMeses = () => {
    const meses = [];
    const hoje = dayjs();
    
    for (let i = -6; i <= 6; i++) {
      const mes = hoje.add(i, 'month');
      meses.push({
        value: mes.format('YYYY-MM'),
        label: mes.format('MMMM [de] YYYY')
      });
    }
    
    return meses;
  };

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
          axios.get(`http://localhost:3001/api/consultation/paciente/${id}`, { headers }),
          axios.get("http://localhost:3001/api/locals", { headers })
        ]);

        // Busca os nomes dos dentistas e informações dos procedimentos para cada agendamento
        const agendamentosComDados = await Promise.all(
          agendamentosRes.data.map(async (agendamento) => {
            try {
              // Busca apenas o nome do dentista
              const dentistaRes = await axios.get(`http://localhost:3001/api/dentists/${agendamento.dentista}`, { headers });
              
              // Se o agendamento tiver um serviço específico (diferente de 1), busca o procedimento
              let procedimento_nome = "Consulta de Rotina";
              if (agendamento.servico && agendamento.servico !== 1) {
                const procedimentoRes = await axios.get(`http://localhost:3001/api/services/${agendamento.servico}`, { headers });
                procedimento_nome = procedimentoRes.data.nome || "Procedimento não encontrado";
              }
              
              return {
                ...agendamento,
                dentista_nome: dentistaRes.data.usuario?.nome || "Dentista não encontrado",
                procedimento_nome: procedimento_nome,
                user_avatar: agendamento.paciente?.avatar || avatar
              };
            } catch (error) {
              console.error("Erro ao buscar dados:", error);
              if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return null;
              }
              return {
                ...agendamento,
                dentista_nome: "Dentista não encontrado",
                procedimento_nome: "Consulta de Rotina",
                user_avatar: avatar
              };
            }
          })
        );

        setAgendamentos(agendamentosComDados.filter(Boolean));
        setLocais(locaisRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, [avatar, id]);

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

  // Filtra os agendamentos pelo mês selecionado
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const dataAgendamento = dayjs(agendamento.data);
    return dataAgendamento.format('YYYY-MM') === mesSelecionado;
  });

  return (
    <LayoutPrincipal>
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4 text-sky-900">
            Meus Agendamentos
          </h2>
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-custom-teal"
            >
              {gerarOpcoesMeses().map((mes) => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-custom-teal to-sky-700 rounded-3xl shadow-lg p-6 flex items-center gap-6 mb-8 text-white">
          <div className="relative">
            <img 
              src={getAvatarUrl(agendamentos[0]?.user_avatar || avatar)} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
              alt={nomeFormatado}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://wvttncioiubiecakmzum.supabase.co/storage/v1/object/public/avatar/avatarPaciente.jpg";
              }}
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{nomeFormatado}</h2>
            <p className="text-sm text-sky-100">Cadastrado em 31 de março de 2024</p>
            <p className="mt-1 text-sm bg-sky-800 bg-opacity-30 rounded-full px-3 py-1 inline-block">
              {agendamentosFiltrados.length} agendamento{agendamentosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {agendamentosFiltrados.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700">Nenhum agendamento para {dayjs(mesSelecionado).format('MMMM [de] YYYY')}</h3>
            <p className="text-gray-500 mt-2">
              Selecione outro mês para visualizar seus agendamentos
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {agendamentosFiltrados.map((agendamento, i) => {
            const dataFormatada = dayjs(agendamento.data).format("DD/MM");
            const diaSemana = dayjs(agendamento.data).format("dddd");
            const hora = agendamento.horario.slice(0, 5);
            
            const isSelected = agendamentoSelecionado && agendamentoSelecionado.agendamento.id === agendamento.id;

            return (
              <div 
                key={i} 
                className={`bg-white hover:bg-sky-50 duration-150 ease-in rounded-2xl p-5 shadow-sm border-2 cursor-pointer transform transition-all
                  ${isSelected ? "border-custom-teal shadow-md scale-[1.02]" : "border-transparent hover:border-sky-200"}`} 
                onClick={() => handleAgendamentoClick(agendamento)}
              >
                <div className="flex justify-between items-start mb-3">
                <div className="bg-sky-100 rounded-xl px-4 py-3 min-w-[72px] max-w-[90px] flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-custom-teal-dark leading-tight">{dataFormatada}</p>
                  <p className="text-xs font-medium text-sky-600 capitalize text-center">{diaSemana}</p>
                </div>
                  <span className="flex items-center px-3 py-1 text-sm rounded-full font-medium border text-green-600 bg-green-100 border-green-200">
                    <CheckCircle className="mr-1" size={16} weight="fill" />
                    Confirmado
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
                
                <div className="flex items-center gap-2 mt-2">
                  <Stethoscope size={18} className="text-gray-500" />
                  <p className="text-sm text-gray-600 truncate">
                    {agendamento.servico && agendamento.procedimento_nome ? agendamento.procedimento_nome : "Consulta de Rotina"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {agendamentoSelecionado && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-sky-200 mb-12 transition-all duration-300 transform">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-custom-teal-dark mb-4 flex items-center gap-2">
                  <div className="bg-custom-light p-2 rounded-full">
                    <MapPin size={24} className="text-custom-teal-2" weight="fill" />
                  </div>
                  {agendamentoSelecionado.nomeLocal}
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-custom-light rounded-full p-2">
                      <User size={20} className="text-custom-teal-2" weight="fill" />
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
                    <div className="bg-custom-light rounded-full p-2">
                      <Stethoscope size={20} className="text-custom-teal-2" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Procedimento</p>
                      <p className="text-sm text-gray-600">
                        {agendamentoSelecionado.agendamento.servico && agendamentoSelecionado.agendamento.procedimento_nome 
                          ? agendamentoSelecionado.agendamento.procedimento_nome 
                          : "Consulta de Rotina"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-custom-light rounded-full p-2">
                      <Calendar size={20} className="text-custom-teal-2" weight="fill" />
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
                      <MapPin size={20} className="text-custom-teal-2" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Endereço</p>
                      <p className="text-sm text-gray-600">{agendamentoSelecionado.enderecoLocal}</p>
                      <button 
                        onClick={handleVerNoMapa} 
                        className="mt-3 px-4 py-2 bg-custom-teal-2 font-semibold text-white rounded-xl hover:bg-custom-teal-dark transition-colors flex items-center gap-2 shadow-sm">
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

        {modalAberto && agendamentoSelecionado && (
          <div className="fixed inset-0 z-50 backdrop-blur-xs bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-lg w-full max-w-4xl relative animate-fadeIn overflow-hidden border border-white/20">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={fecharModal} 
                  className="bg-white/80 backdrop-blur p-2 rounded-full shadow text-gray-600 hover:text-custom-teal-2 transition-colors">
                  <X size={24} weight="bold" />
                </button>
              </div>
              
              <div className="p-5 bg-custom-teal-dark text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin size={24} weight="fill" />
                  {agendamentoSelecionado.nomeLocal}
                </h3>
                <p className="text-sm text-sky-100 mt-1">{agendamentoSelecionado.enderecoLocal}</p>
              </div>
              
              <iframe
                title="Mapa" 
                src={`https://www.google.com/maps?q=${agendamentoSelecionado.enderecoEncoded}&z=17&output=embed`}
                width="100%" height="500" style={{ border: 0 }}
                allowFullScreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default MeusAgendamentos;