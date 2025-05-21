"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowCircleLeft, EyeClosed, Eye } from "@phosphor-icons/react"
import useAuth from "../../hooks/useAuth"
import LayoutLogin from "../../components/LayoutLogin"

function Login() {
  const { login, loading, redirectPath, setRedirectPath } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath)
      setRedirectPath(null)
    }
  }, [redirectPath, navigate, setRedirectPath])

  const visibilidadeSenha = () => {
    setMostrarSenha((prev) => !prev)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro("")

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos")
      return
    }

    try {
      console.log("Tentando fazer login com:", email)
      await login(email, senha)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setErro("Falha ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <LayoutLogin>
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
          <div className="flex items-center gap-4 mb-24">
            <Link to="/" className="text-custom-teal">
              <ArrowCircleLeft size={60} className="text-sky-900 hover:text-sky-600 ease-in duration-150" />
            </Link>
            <h1 className="text-custom-teal text-4xl font-semibold">
              Entre no <span className="block">DentalConnect :)</span>
            </h1>
          </div>

          {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{erro}</div>}

          <form onSubmit={handleLogin}>
            <p className="mb-1 ml-1 font-semibold">E-mail</p>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-teal-2 ease-in-out duration-150"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="mb-1 ml-1 font-semibold">Senha</p>
            <div className="relative w-full mb-4">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-teal-2 ease-in-out duration-150"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button type="button" onClick={visibilidadeSenha} className="absolute right-4 top-3 text-gray-500 hover:text-gray-600">
                {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
              </button>
            </div>

            <div className="w-full flex justify-between items-center text-gray-700 text-sm mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-custom-teal" />
                Lembrar meus dados
              </label>
              <Link to="/recuperarsenha" className="hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-custom-teal hover:bg-custom-teal-hover text-sky-900 text-xl font-semibold py-3 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </LayoutLogin>
  )
}

export default Login
