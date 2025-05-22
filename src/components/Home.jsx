import { useState, useEffect } from "react"
import { useAuth } from "../context/auth"
import axios from "axios"
import { FaUserCircle } from "react-icons/fa"

const Home = () => {
  const { id, token, user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error("ID do usuário não disponível")
          setError("ID do usuário não disponível")
          setLoading(false)
          return
        }

        // Buscar dados atualizados do usuário
        const userResponse = await axios.get(`http://localhost:3001/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserData(userResponse.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && token) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [id, token])

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
        <div className="text-red-500">Erro ao carregar dados: {error}</div>
      </div>
    )
  }

  const hasValidAvatar = userData?.avatar && 
                        typeof userData.avatar === 'string' && 
                        userData.avatar.trim() !== '' && 
                        userData.avatar !== 'null' && 
                        userData.avatar !== 'undefined';

  return (
    <div className="min-h-screen bg-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            {hasValidAvatar ? (
              <img
                src={userData.avatar}
                alt={`Avatar de ${userData.nome}`}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <FaUserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bem-vindo(a) ao DentalConnect</h1>
              <p className="text-gray-600">Olá, {userData?.nome || "Usuário"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Agendamentos</h2>
            <p className="text-gray-600 mb-4">
              Acesse seus agendamentos e gerencie suas consultas.
            </p>
            <a
              href="/meus-agendamentos"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Ver Agendamentos
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nova Consulta</h2>
            <p className="text-gray-600 mb-4">
              Agende uma nova consulta com nossos dentistas.
            </p>
            <a
              href="/agendar-consulta"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
            >
              Agendar Consulta
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meu Perfil</h2>
            <p className="text-gray-600 mb-4">
              Atualize suas informações pessoais e preferências.
            </p>
            <a
              href="/perfil"
              className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-300"
            >
              Editar Perfil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 