import React, { useState } from "react";
import { User, MapPin, Mail, Calendar, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";

function DentistCard({ dentista }) {
  const navigate = useNavigate();
  const [showAgendamento, setShowAgendamento] = useState(false);
  const [procedimentos, setProcedimentos] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const { token, id } = useAuth();

  const handleAgendar = async () => {
    if (!showAgendamento) {
      setCarregando(true);
      try {
        // Busca os procedimentos do dentista
        const response = await axios.get(`http://localhost:3001/api/dentists-services/${dentista.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          // Extrai os serviços do resultado
          const servicos = response.data.map(item => item.servicos);
          setProcedimentos(servicos);
          setShowAgendamento(true);
        } else {
          setProcedimentos([]);
          setMensagem("Nenhum procedimento disponível para este dentista.");
        }
      } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);
        setMensagem("Erro ao carregar procedimentos. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    } else {
      setShowAgendamento(false);
    }
  };

  const handleConfirmarAgendamento = async () => {
    if (!horarioSelecionado || !procedimentoSelecionado) {
      setMensagem("Por favor, selecione um procedimento e um horário.");
      return;
    }

    setCarregando(true);
    try {
      const [dia, hora] = horarioSelecionado.split(" - ");
      const data = getDateFromDayOfWeek(dia);

      await axios.post("http://localhost:3001/api/consultation", {
        data: data,
        horario: hora,
        paciente: id,
        dentista: dentista.id,
        local: dentista.local_id || 1,
        status: "Confirmado",
        servico: procedimentoSelecionado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensagem("Consulta agendada com sucesso!");
      setTimeout(() => {
        navigate("/agendamentos");
      }, 2000);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      setMensagem("Erro ao agendar consulta. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para converter dia da semana em data
  const getDateFromDayOfWeek = (dayOfWeek) => {
    const days = {
      "Segunda-feira": 1,
      "Terça-feira": 2,
      "Quarta-feira": 3,
      "Quinta-feira": 4,
      "Sexta-feira": 5,
      "Sábado": 6,
      "Domingo": 0
    };

    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = days[dayOfWeek];
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    
    return targetDate.toISOString().split('T')[0];
  };

  // Horários fictícios para exemplo
  const horariosDisponiveis = [
    { dia: "Segunda-feira", hora: "09:00" },
    { dia: "Segunda-feira", hora: "10:00" },
    { dia: "Terça-feira", hora: "14:00" },
    { dia: "Terça-feira", hora: "15:00" },
    { dia: "Quarta-feira", hora: "09:00" },
    { dia: "Quarta-feira", hora: "10:00" }
  ];

  if (!dentista) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center h-64">
        <p className="text-gray-500 text-center">Informações do dentista não disponíveis.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-custom-teal to-sky-700 h-24 relative">
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
              {dentista.usuario?.avatar ? (
                <img
                  src={dentista.usuario.avatar || "/placeholder.svg"}
                  alt={dentista.usuario?.nome || "Dentista"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={36} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{dentista.usuario?.nome || "Nome não disponível"}</h3>

        <div className="flex items-center gap-2 mb-3 text-custom-teal-2">
          <Award size={18} />
          <span className="font-medium">CRO: {dentista.numero_cro || "Não informado"}</span>
        </div>

        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{dentista.usuario?.email || "Email não informado"}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span>
              {dentista.usuario?.cidade || "Cidade não informada"}
              {dentista.usuario?.cidade && dentista.usuario?.estado && ", "}
              {dentista.usuario?.estado || ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400 flex-shrink-0" />
            <span>
              {dentista.usuario?.data_nascimento
                ? new Date(dentista.usuario.data_nascimento).toLocaleDateString()
                : "Data não informada"}
            </span>
          </div>
        </div>

        {mensagem && (
          <div className={`mt-4 p-3 rounded-md ${
            mensagem.includes("sucesso") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {mensagem}
          </div>
        )}

        {showAgendamento && (
          <div className="mt-4 space-y-4">
            {/* Seleção de Procedimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedimento
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) => setProcedimentoSelecionado(e.target.value)}
                value={procedimentoSelecionado || ""}
              >
                <option value="">Selecione um procedimento</option>
                {procedimentos.map((procedimento) => (
                  <option key={procedimento.id} value={procedimento.id}>
                    {procedimento.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção de Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onChange={(e) => setHorarioSelecionado(e.target.value)}
                value={horarioSelecionado || ""}
              >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map((horario, index) => (
                  <option key={index} value={`${horario.dia} - ${horario.hora}`}>
                    {horario.dia} - {horario.hora}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão de Confirmar */}
            <button
              onClick={handleConfirmarAgendamento}
              disabled={!horarioSelecionado || !procedimentoSelecionado || carregando}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                !horarioSelecionado || !procedimentoSelecionado || carregando
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
        )}

        <div className="mt-4">
          <button
            onClick={handleAgendar}
            className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {showAgendamento ? "Cancelar" : "Agendar Consulta"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DentistCard
