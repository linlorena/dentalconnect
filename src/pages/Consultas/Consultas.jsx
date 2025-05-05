import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";

function Consultas() {
  const [dentistas, setDentistas] = useState([]);
  const [dentistaSelecionado, setDentistaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [pacienteId] = useState(1); // ID do paciente (simulado, pode pegar do contexto)
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCarregando(true);
    axios
      .get("http://localhost:3001/api/dentistas")
      .then((response) => {
        setDentistas(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dentistas:", error);
        setCarregando(false);
      });
  }, []);

  const handleMarcarConsulta = () => {
    if (!dentistaSelecionado || !horarioSelecionado) {
      alert("Por favor, selecione o dentista e o horário.");
      return;
    }

    setCarregando(true);
    // Enviar dados para marcar consulta
    axios
      .post("http://localhost:3001/api/marcar-consulta", {
        pacienteId,
        dentistaId: dentistaSelecionado.id,
        dataHora: horarioSelecionado,
      })
      .then((response) => {
        setMensagemConfirmacao(response.data.mensagem);
        setTimeout(() => {
          navigate("/agendamentos"); // Redireciona para a página de agendamentos
        }, 2000);
      })
      .catch((error) => {
        console.error("Erro ao marcar consulta:", error);
        setCarregando(false);
      });
  };

  return (
    <LayoutPrincipal>
      <div className="max-w-3xl mx-auto w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-600 mb-2">Agendar Consulta</h2>
          <p className="text-gray-600">Escolha um dentista e um horário disponível para sua consulta</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seleção de dentista */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4 text-teal-600">
              <User size={20} className="mr-2" />
              <h3 className="text-lg font-semibold">Selecione o Dentista</h3>
            </div>
            
            {carregando && dentistas.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-t-teal-500 border-r-teal-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <select
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                onChange={(e) => {
                  const dentista = dentistas.find(
                    (dentista) => dentista.id === parseInt(e.target.value)
                  );
                  setDentistaSelecionado(dentista);
                  setHorarioSelecionado(null);
                }}
                value={dentistaSelecionado?.id || ""}
              >
                <option value="">Escolha um dentista</option>
                {dentistas.map((dentista) => (
                  <option key={dentista.id} value={dentista.id}>
                    Dr(a). {dentista.nome} - {dentista.especialidade}
                  </option>
                ))}
              </select>
            )}

            {dentistaSelecionado && (
              <div className="mt-4 p-4 bg-teal-50 rounded-md border border-teal-100">
                <h4 className="font-semibold text-teal-700">Dr(a). {dentistaSelecionado.nome}</h4>
                <p className="text-sm text-gray-600">{dentistaSelecionado.especialidade}</p>
                {dentistaSelecionado.descricao && (
                  <p className="text-sm mt-2">{dentistaSelecionado.descricao}</p>
                )}
              </div>
            )}
          </div>

          {/* Seleção de horário */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4 text-teal-600">
              <Calendar size={20} className="mr-2" />
              <h3 className="text-lg font-semibold">Escolha o Horário</h3>
            </div>
            
            {dentistaSelecionado ? (
              <>
                <select
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  onChange={(e) => setHorarioSelecionado(e.target.value)}
                  value={horarioSelecionado || ""}
                >
                  <option value="">Selecione um horário disponível</option>
                  {dentistaSelecionado.horarios.map((horario, index) => (
                    <option key={index} value={`${horario.dia} - ${horario.hora}`}>
                      {horario.dia} - {horario.hora}
                    </option>
                  ))}
                </select>

                {horarioSelecionado && (
                  <div className="mt-4 flex items-center bg-teal-50 p-3 rounded-md border border-teal-100">
                    <Clock size={18} className="text-teal-600 mr-2" />
                    <span className="text-teal-700 font-medium">{horarioSelecionado}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 text-gray-500 p-4 rounded-md text-center">
                <p>Selecione um dentista primeiro para ver os horários disponíveis</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumo e confirmação */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-teal-600">Resumo da Consulta</h3>
          
          <div className="mb-6">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-medium w-24">Dentista:</span>
                <span>{dentistaSelecionado ? `Dr(a). ${dentistaSelecionado.nome}` : "Nenhum selecionado"}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-24">Especialidade:</span>
                <span>{dentistaSelecionado ? dentistaSelecionado.especialidade : "N/A"}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-24">Horário:</span>
                <span>{horarioSelecionado || "Nenhum selecionado"}</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleMarcarConsulta}
              disabled={!dentistaSelecionado || !horarioSelecionado || carregando}
              className={`flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-md font-medium transition-all ${
                !dentistaSelecionado || !horarioSelecionado || carregando
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {carregando ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-white border-r-white rounded-full animate-spin mr-2"></div>
                  Processando...
                </>
              ) : (
                <>Confirmar Agendamento</>
              )}
            </button>
          </div>
        </div>

        {mensagemConfirmacao && (
          <div className="mt-6 bg-green-50 border border-green-100 text-green-700 p-4 rounded-md flex items-center justify-center">
            <CheckCircle size={20} className="mr-2" />
            <p className="font-medium">{mensagemConfirmacao}</p>
            <p className="ml-2 text-sm">Redirecionando para seus agendamentos...</p>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default Consultas;