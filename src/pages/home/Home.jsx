import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashHome from "../../assets/splash.png";
import AvatarDefault from "../../assets/avatar.png";
import { CalendarBlank, FirstAid, Headphones, Users, ChartLine, Gear } from "@phosphor-icons/react";
import { useAuth } from "../../context/auth"
import api from "../../services/api";

function Home() {
  const { nome, tipo, avatar, user } = useAuth()
  const [totalAgendamentos, setTotalAgendamentos] = useState(0)
  const [totalPacientes, setTotalPacientes] = useState(0)
  const [proximasConsultas, setProximasConsultas] = useState([])
  const [carregando, setCarregando] = useState(true)

  const formatarNome = (nome) => {
    if (!nome) return "Usuário"
    const primeiroNome = nome.split(" ")[0]
    return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase()
  }

  const nomeFormatado = formatarNome(nome)

  useEffect(() => {
    if (tipo === "dentista" && user) {
      const carregarDados = async () => {
        try {
          // Buscar todas as consultas
          const consultasRes = await api.get("/consultation");
          
          // Filtrar consultas do dentista atual
          const consultasDoDentista = consultasRes.data.filter(
            consulta => consulta.dentista === user
          );

          setTotalAgendamentos(consultasDoDentista.length);
          
          // Obter pacientes únicos das consultas
          const pacientesUnicos = [...new Set(consultasDoDentista.map(c => c.paciente))];
          setTotalPacientes(pacientesUnicos.length);
          
          // Filtra as próximas consultas (próximos 3 dias)
          const hoje = new Date();
          const em3Dias = new Date();
          em3Dias.setDate(hoje.getDate() + 3);
          
          const proximasConsultas = consultasDoDentista
            .filter(consulta => {
              const dataConsulta = new Date(consulta.data);
              return dataConsulta >= hoje && dataConsulta <= em3Dias;
            })
            .slice(0, 5); // Limita a 5 consultas
          
          setProximasConsultas(proximasConsultas);
          setCarregando(false);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          setCarregando(false);
        }
      };

      carregarDados();
    }
  }, [tipo, user]);

  if (tipo == "paciente") {
    return (
      <LayoutPrincipal>
        <div className="w-full max-w-screen-xl mx-auto px-4 py-10 overflow-hidden">
          <h1 className="text-4xl font-bold">
            Olá, <span className="text-teal-600">{nomeFormatado}</span>!
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Como podemos cuidar da sua saúde hoje?
          </p>
  
          <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-10">
            <img
              src={SplashHome}
              alt="Splash"
              className="w-full max-w-sm lg:max-w-md"
            />
  
            <div className="flex flex-col lg:flex-row gap-6 flex-wrap justify-center">
              <Link to="/tratamentos">
                <div className="bg-custom-light rounded-2xl p-6 w-72 shadow-md hover:bg-custom-light-hover transition duration-150">
                  <div className="flex flex-col items-center">
                    <FirstAid size={60} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-2">
                      Tratamentos
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-2 text-md leading-snug text-center">
                    Conheça alguns dos procedimentos que oferecemos para cuidar do seu sorriso.
                  </p>
                </div>
              </Link>
  
              <Link to="/fale-conosco">
                <div className="bg-custom-light rounded-2xl p-6 w-72 shadow-md hover:bg-custom-light-hover transition duration-150">
                  <div className="flex flex-col items-center">
                    <Headphones size={60} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-2">
                      Fale Conosco
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-2 text-md leading-snug text-center">
                    A DentalConnect quer te escutar. Envie suas sugestões, reclamações ou elogios.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </LayoutPrincipal>
    );
  } else {
    return (
      <LayoutPrincipal>
        <div className="w-full max-w-screen-xl mx-auto px-4 py-10">
          {/* Card do Dentista */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-700 rounded-3xl shadow-lg p-6 flex items-center gap-6 mb-8">
            <div className="relative">
              <img 
                src={avatar || AvatarDefault} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
                alt={nomeFormatado}
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">Dr(a). {nomeFormatado}</h2>
              <p className="text-sky-100">Dentista</p>
              <div className="flex gap-4 mt-2">
                <span className="bg-sky-800 bg-opacity-30 rounded-full px-3 py-1 text-sm">
                  {totalAgendamentos} consulta{totalAgendamentos !== 1 ? 's' : ''}
                </span>
                <span className="bg-sky-800 bg-opacity-30 rounded-full px-3 py-1 text-sm">
                  {totalPacientes} paciente{totalPacientes !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card de Agendamentos */}
            <Link to="/agendamentos" className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-sky-100 p-3 rounded-xl">
                  <CalendarBlank size={32} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Agendamentos</h3>
                  <p className="text-gray-500">Gerencie suas consultas</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-sky-600">{totalAgendamentos}</div>
            </Link>

            {/* Card de Pacientes */}
            <Link to="/pacientes" className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-sky-100 p-3 rounded-xl">
                  <Users size={32} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Pacientes</h3>
                  <p className="text-gray-500">Seus pacientes ativos</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-sky-600">{totalPacientes}</div>
            </Link>

            {/* Card de Configurações */}
            <Link to="/configuracoes" className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-sky-100 p-3 rounded-xl">
                  <Gear size={32} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Configurações</h3>
                  <p className="text-gray-500">Gerencie seu perfil</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Próximas Consultas */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Próximas Consultas</h3>
              <Link to="/agendamentos" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                Ver todos
              </Link>
            </div>

            {carregando ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
              </div>
            ) : proximasConsultas.length > 0 ? (
              <div className="space-y-4">
                {proximasConsultas.map((consulta, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-sky-100 p-2 rounded-lg">
                        <CalendarBlank size={24} className="text-sky-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{consulta.paciente_nome || "Paciente"}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(consulta.data).toLocaleDateString('pt-BR')} às {consulta.horario}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      consulta.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                      consulta.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma consulta agendada para os próximos dias.</p>
            )}
          </div>
        </div>
      </LayoutPrincipal>
    );
  }
}

export default Home;
