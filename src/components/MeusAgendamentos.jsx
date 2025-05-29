import { useState, useEffect } from "react"
import { useAuth } from "../context/auth"
import axios from "axios"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FaUserCircle } from "react-icons/fa"

const MeusAgendamentos = () => {
  const { id, token, user } = useAuth()
  const [consultas, setConsultas] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificação mais robusta do ID
        if (!id || id === 'undefined' || id === 'null') {
          console.error("ID do usuário inválido:", id)
          setError("ID do usuário não disponível. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        if (!token) {
          console.error("Token não disponível")
          setError("Token de autenticação não disponível. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        console.log("ID do usuário logado:", id)
        console.log("Dados do usuário do contexto:", user)

        // Buscar dados atualizados do usuário
        const userResponse = await axios.get(`http://localhost:3001/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log("Dados do usuário da API:", userResponse.data)
        setUserData(userResponse.data)

        // Buscar consultas
        console.log("Buscando consultas para o paciente:", id)
        const consultasResponse = await axios.get(`http://localhost:3001/api/consultation/paciente/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log("Resposta da API de consultas:", consultasResponse.data)
        setConsultas(consultasResponse.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        if (error.response?.status === 404) {
          setError("Nenhum agendamento encontrado para este usuário.")
        } else if (error.response?.status === 401) {
          setError("Sessão expirada. Por favor, faça login novamente.")
        } else {
          setError(error.response?.data?.message || "Erro ao carregar agendamentos. Tente novamente mais tarde.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id && token) {
      fetchData()
    } else {
      setLoading(false)
      setError("Dados de autenticação incompletos. Por favor, faça login novamente.")
    }
  }, [id, token, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          <p className="font-medium">Erro ao carregar agendamentos</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!consultas || consultas.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Nenhum agendamento encontrado</p>
          <p className="text-sm mt-2">Você ainda não possui agendamentos.</p>
        </div>
      </div>
    )
  }

  // Verificar se o usuário tem um avatar válido
  const hasValidAvatar = userData?.avatar && 
                        typeof userData.avatar === 'string' && 
                        userData.avatar.trim() !== '' && 
                        userData.avatar !== 'null' && 
                        userData.avatar !== 'undefined';

  console.log("Verificação do avatar:", {
    userId: id,
    avatar: userData?.avatar,
    tipo: typeof userData?.avatar,
    temValor: userData?.avatar?.trim() !== '',
    naoENull: userData?.avatar !== 'null',
    naoEUndefined: userData?.avatar !== 'undefined',
    resultadoFinal: hasValidAvatar,
    dadosCompletos: userData
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {hasValidAvatar ? (
            <img
              src={userData.avatar}
              alt={`Avatar de ${userData.nome}`}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar avatar:", e);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <FaUserCircle className="w-16 h-16 text-gray-400" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Meus Agendamentos</h1>
            <p className="text-gray-600">Bem-vindo(a), {userData?.nome || "Usuário"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultas.map((consulta) => (
          <div
            key={consulta.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {consulta.servico}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(consulta.data), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm text-gray-600">{consulta.horario}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  consulta.status === "agendada"
                    ? "bg-green-100 text-green-800"
                    : consulta.status === "cancelada"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dentista:</span> {consulta.dentista}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Local:</span> {consulta.local}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MeusAgendamentos 