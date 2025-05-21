"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error)
      localStorage.removeItem("user")
      return null
    }
  })
  const [tipo, setTipo] = useState(localStorage.getItem("tipo") || null)
  const [nome, setNome] = useState(localStorage.getItem("nome") || null)
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null)
  const [email, setEmail] = useState(localStorage.getItem("email") || null)

  const [loading, setLoading] = useState(true)
  const [redirectPath, setRedirectPath] = useState(null)

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        const storedTipo = localStorage.getItem("tipo")
        const storedNome = localStorage.getItem("nome")
        const storedAvatar = localStorage.getItem("avatar")
        const storedEmail = localStorage.getItem("email")

        if (storedToken && storedUser && storedTipo) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          setTipo(storedTipo)
          setNome(storedNome)
          setAvatar(storedAvatar)
          setEmail(storedEmail)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("tipo")
          localStorage.removeItem("nome")
          localStorage.removeItem("avatar")
          localStorage.removeItem("email")
          setToken(null)
          setUser(null)
          setTipo(null)
          setNome(null)
          setAvatar(null)
          setEmail(null)
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("tipo")
        localStorage.removeItem("nome")
        localStorage.removeItem("avatar")
        localStorage.removeItem("email")
        setToken(null)
        setUser(null)
        setTipo(null)
        setNome(null)
        setAvatar(null)
        setEmail(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, senha) => {
    setLoading(true)
    try {
      // Fazer a requisição de login
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        senha,
      })

      console.log("Resposta do login:", response.data)

      if (!response.data || !response.data.token) {
        throw new Error("Resposta inválida do servidor")
      }

      // Armazenar dados do usuário
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("tipo", response.data.tipo)
      localStorage.setItem("nome", response.data.nome)
      localStorage.setItem("avatar", response.data.avatar)
      localStorage.setItem("email", response.data.email)

      // Atualizar o estado
      setToken(response.data.token)
      setUser(response.data.user)
      setTipo(response.data.tipo)
      setNome(response.data.nome)
      setAvatar(response.data.avatar)
      setEmail(response.data.email)

      const path = response.data.tipo === "dentista" ? "/dentista" : "/home"
      setRedirectPath(path)

      return {
        success: true,
        redirectTo: path,
        tipo: response.data.tipo,
      }
    } catch (error) {
      console.error("Erro de login:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("tipo")
    localStorage.removeItem("nome")
    localStorage.removeItem("avatar")
    localStorage.removeItem("email")

    setToken(null)
    setUser(null)
    setTipo(null)
    setNome(null)
    setAvatar(null)
    setEmail(null)
    setRedirectPath(null)

    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        token,
        tipo,
        nome,
        email,
        avatar,
        login,
        logout,
        loading,
        redirectPath,
        setRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
