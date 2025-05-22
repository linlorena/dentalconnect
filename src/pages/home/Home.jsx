import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashHome from "../../assets/splash.png";
import { CalendarBlank, FirstAid, Headphones, User } from "@phosphor-icons/react";
import { useAuth } from "../../context/auth"
import axios from "axios";

function Home() {
  const { nome, tipo, avatar, id, token } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error("ID do usuário não disponível")
          setLoading(false)
          return
        }

        console.log("Buscando dados do usuário:", { id, token })

        // Buscar dados atualizados do usuário
        const userResponse = await axios.get(`http://localhost:3001/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log("Dados do usuário recebidos:", userResponse.data)
        setUserData(userResponse.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
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

  const formatarNome = (nome) => {
    if (!nome) return "Usuário"
    const primeiroNome = nome.split(" ")[0]
    return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase()
  }

  const nomeFormatado = formatarNome(nome)

  // Função para verificar se o avatar é válido
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || avatarUrl.trim() === '') {
      return null;
    }
    return avatarUrl;
  };

  if (loading) {
    return (
      <LayoutPrincipal>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </LayoutPrincipal>
    )
  }

  console.log("Renderizando componente com dados:", {
    userData,
    avatar: userData?.avatar,
    nome: userData?.nome,
    tipo,
  });

  if (tipo == "paciente") {
    return (
      <LayoutPrincipal>
        <div className="w-full max-w-screen-xl mx-auto px-4 py-12 overflow-hidden">
          <div className="flex items-center gap-8 mb-16">
            <div className="relative">
              {getAvatarUrl(userData?.avatar || avatar) ? (
                <img 
                  src={getAvatarUrl(userData?.avatar || avatar)} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300" 
                  alt={nomeFormatado}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                  <User size={56} className="text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 w-7 h-7 rounded-full border-2 border-white shadow-md"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Olá, <span className="text-custom-teal">{nomeFormatado}</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Como podemos cuidar da sua saúde hoje?</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between mt-12 gap-16">
            <img
              src={SplashHome}
              alt="Splash"
              className="w-full max-w-sm lg:max-w-md transform hover:scale-105 transition-transform duration-300"
            />
  
            <div className="flex flex-col lg:flex-row gap-8 flex-wrap justify-center">
              <Link to="/tratamentos" className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-custom-light rounded-2xl p-8 w-80 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <FirstAid size={72} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-4">
                      Tratamentos
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed text-center">
                    Conheça alguns dos procedimentos que oferecemos para cuidar do seu sorriso.
                  </p>
                </div>
              </Link>
  
              <Link to="/fale-conosco" className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-custom-light rounded-2xl p-8 w-80 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <Headphones size={72} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-4">
                      Fale Conosco
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed text-center">
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
        <div className="w-full max-w-screen-xl mx-auto px-4 py-12 overflow-hidden">
          <div className="flex items-center gap-8 mb-16">
            <div className="relative">
              {getAvatarUrl(userData?.avatar || avatar) ? (
                <img 
                  src={getAvatarUrl(userData?.avatar || avatar)} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300" 
                  alt={nomeFormatado}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                  <User size={56} className="text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 w-7 h-7 rounded-full border-2 border-white shadow-md"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Olá, <span className="text-custom-teal">{nomeFormatado}</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Como podemos te ajudar hoje?</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between mt-12 gap-16">
            <img
              src={SplashHome}
              alt="Splash"
              className="w-full max-w-sm lg:max-w-md transform hover:scale-105 transition-transform duration-300"
            />
  
            <div className="flex flex-col lg:flex-row gap-8 flex-wrap justify-center">
              <Link to="/agendamentos" className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-custom-light rounded-2xl p-8 w-80 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <CalendarBlank size={72} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-4">
                      Agendamentos
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed text-center">
                    Confira as datas, pacientes e status dos seus agendamentos num único lugar.
                  </p>
                </div>
              </Link>
  
              <Link to="/fale-conosco" className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-custom-light rounded-2xl p-8 w-80 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <Headphones size={72} className="text-sky-900" />
                    <h2 className="text-3xl font-bold text-custom-teal-2 mt-4">
                      Fale Conosco
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed text-center">
                    A DentalConnect quer te escutar. Envie suas sugestões, reclamações ou elogios.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </LayoutPrincipal>
    );
  }
}

export default Home;
