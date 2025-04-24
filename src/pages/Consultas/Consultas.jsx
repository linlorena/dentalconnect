import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";

function Consultas() {
  const [dentistas, setDentistas] = useState([]);
  const [dentistaSelecionado, setDentistaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [pacienteId] = useState(1); // ID do paciente (simulado, você pode pegar do contexto)
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar dentistas do backend
    axios
      .get("http://localhost:3001/api/dentistas")
      .then((response) => {
        setDentistas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dentistas:", error);
      });
  }, []);

  const handleMarcarConsulta = () => {
    if (!dentistaSelecionado || !horarioSelecionado) {
      alert("Por favor, selecione o dentista e o horário.");
      return;
    }

    // Enviar dados para marcar consulta
    axios
      .post("http://localhost:3001/api/marcar-consulta", {
        pacienteId,
        dentistaId: dentistaSelecionado.id,
        dataHora: horarioSelecionado,
      })
      .then((response) => {
        setMensagemConfirmacao(response.data.mensagem);
        navigate("/agendamentos"); // Redireciona para a página de agendamentos
      })
      .catch((error) => {
        console.error("Erro ao marcar consulta:", error);
      });
  };

  return (
    <LayoutPrincipal>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-custom-teal mb-4">Marcar Consulta</h2>

        <div className="mb-6">
          <h3 className="text-lg">Selecione o dentista:</h3>
          <select
            className="border p-2 rounded"
            onChange={(e) => {
              const dentista = dentistas.find(
                (dentista) => dentista.id === parseInt(e.target.value)
              );
              setDentistaSelecionado(dentista);
              setHorarioSelecionado(null); // Limpa o horário selecionado ao trocar de dentista
            }}
          >
            <option value="">Escolha um dentista</option>
            {dentistas.map((dentista) => (
              <option key={dentista.id} value={dentista.id}>
                {dentista.nome} - {dentista.especialidade}
              </option>
            ))}
          </select>
        </div>

        {dentistaSelecionado && (
          <div className="mb-6">
            <h3 className="text-lg">Escolha o horário:</h3>
            <select
              className="border p-2 rounded"
              onChange={(e) => setHorarioSelecionado(e.target.value)}
            >
              <option value="">Escolha um horário</option>
              {dentistaSelecionado.horarios.map((horario, index) => (
                <option key={index} value={`${horario.dia} - ${horario.hora}`}>
                  {horario.dia} - {horario.hora}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleMarcarConsulta}
          className="bg-teal-500 text-white py-2 px-4 rounded"
        >
          Marcar Consulta
        </button>

        {mensagemConfirmacao && (
          <div className="mt-4 text-green-500">
            <p>{mensagemConfirmacao}</p>
          </div>
        )}
      </div>
    </LayoutPrincipal>
  );
}

export default Consultas;
