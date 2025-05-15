"use client"

import React, { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import useAuth from "./hooks/useAuth"
import Home from "./pages/home/Home"
import Inicial from "./pages/Inicial/Inicial"
import Login from "./pages/login/Login"
import Cadastro from "./pages/Cadastro/Cadastro"
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha"
import BuscaAvancada from "./pages/BuscaAvancada/BuscaAvancada"
import MeusAgendamentos from "./pages/MeusAgendamentos/MeusAgendamentos"
import FaleConosco from "./pages/FaleConosco/FaleConosco"
import Tratamentos from "./pages/Tratamentos/Tratamentos"
import Servicos from "./pages/Servicos/Servicos"
import Consultas from "./pages/Consultas/Consultas"
import Configuracao from "./pages/Configuracoes/Configuracoes"
import SearchResultsPage from "./pages/ResultadosDeBusca/SearchResultsPage"; 


const AppRoutes = () => {
  const { signed, loading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      setIsReady(true)
    }
  }, [loading])

  // rotas para usuários não autenticados
  const routerNoAuth = createBrowserRouter([
    {
      path: "/",
      element: <Inicial />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/cadastro",
      element: <Cadastro />,
    },
    {
      path: "/recuperarsenha",
      element: <RecuperarSenha />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ])

  // Rotas para usuários autenticados
  const routerAuth = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "/cadastro",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "/recuperarsenha",
      element: <RecuperarSenha />,
    },
    {
      path: "/search-results", 
      element: <SearchResultsPage />,
    },
    {
      path: "/busca-avancada",
      element: <BuscaAvancada />,
    },
    {
      path: "/agendamentos",
      element: <MeusAgendamentos />,
    },
    {
      path: "/tratamentos",
      element: <Tratamentos />,
    },
    {
      path: "/servicos",
      element: <Servicos />,
    },   
    {
      path: "/consultas",
      element: <Consultas />,
    },
    {
      path: "/fale-conosco",
      element: <FaleConosco />,
    },
    {
      path: "/configuracoes",
      element: < Configuracao/>
    },
    {
      path: "*", 
      element: <Navigate to="/home" replace />,
    },
  ])
  if (!isReady) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }
  return <RouterProvider router={signed ? routerAuth : routerNoAuth} />
}

const App = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </React.StrictMode>
  )
}

export default App

