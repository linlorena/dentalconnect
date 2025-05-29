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
  const [email, setEmail] = useState(localStorage.getItem("email") || null)
  const [id, setId] = useState(localStorage.getItem("id") || null)
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null)

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
        const storedEmail = localStorage.getItem("email")
        const storedId = localStorage.getItem("id")
        const storedAvatar = localStorage.getItem("avatar")

        console.log("Dados armazenados:", {
          token: storedToken,
          user: storedUser,
          tipo: storedTipo,
          nome: storedNome,
          email: storedEmail,
          id: storedId,
          avatar: storedAvatar
        })

        if (storedToken && storedUser && storedTipo) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          setTipo(storedTipo)
          setNome(storedNome)
          setEmail(storedEmail)
          setId(storedId)
          setAvatar(storedAvatar)
        } else {
          console.log("Dados de autenticação incompletos, limpando localStorage")
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("tipo")
          localStorage.removeItem("nome")
          localStorage.removeItem("email")
          localStorage.removeItem("id")
          localStorage.removeItem("avatar")
          setToken(null)
          setUser(null)
          setTipo(null)
          setNome(null)
          setEmail(null)
          setId(null)
          setAvatar(null)
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("tipo")
        localStorage.removeItem("nome")
        localStorage.removeItem("email")
        localStorage.removeItem("id")
        localStorage.removeItem("avatar")
        setToken(null)
        setUser(null)
        setTipo(null)
        setNome(null)
        setEmail(null)
        setId(null)
        setAvatar(null)
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

      // Verificar se o ID do usuário está presente
      if (!response.data.user || !response.data.user.id) {
        throw new Error("ID do usuário não encontrado na resposta")
      }

      // Armazenar dados do usuário
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("tipo", response.data.tipo)
      localStorage.setItem("nome", response.data.nome)
      localStorage.setItem("email", response.data.email)
      localStorage.setItem("id", response.data.user.id)
      localStorage.setItem("avatar", response.data.user.avatar)

      // Atualizar o estado
      setToken(response.data.token)
      setUser(response.data.user)
      setTipo(response.data.tipo)
      setNome(response.data.nome)
      setEmail(response.data.email)
      setId(response.data.user.id)
      setAvatar(response.data.user.avatar)

      const path = response.data.tipo === "dentista" ? "/dentista" : "/home"
      setRedirectPath(path)

      return {
        success: true,
        redirectTo: path,
        tipo: response.data.tipo,
      }
    } catch (error) {
      console.error("Erro de login:", error)
      // Limpar dados em caso de erro
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("tipo")
      localStorage.removeItem("nome")
      localStorage.removeItem("email")
      localStorage.removeItem("id")
      localStorage.removeItem("avatar")
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
    localStorage.removeItem("email")
    localStorage.removeItem("id")
    localStorage.removeItem("avatar")

    setToken(null)
    setUser(null)
    setTipo(null)
    setNome(null)
    setEmail(null)
    setId(null)
    setAvatar(null)
    setRedirectPath(null)

    window.location.href = "/"
  }

  const updateUserData = (newData) => {
    // Atualizar localStorage
    if (newData.nome) {
      localStorage.setItem("nome", newData.nome)
      setNome(newData.nome)
    }
    if (newData.email) {
      localStorage.setItem("email", newData.email)
      setEmail(newData.email)
    }
    if (newData.avatar !== undefined) {
      localStorage.setItem("avatar", newData.avatar)
      setAvatar(newData.avatar)
    }
    
    // Atualizar o objeto user no localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
    const updatedUser = { ...currentUser, ...newData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    // Atualizar outros estados se necessário
    if (newData.id) {
      localStorage.setItem("id", newData.id)
      setId(newData.id)
    }
    if (newData.token) {
      localStorage.setItem("token", newData.token)
      setToken(newData.token)
    }
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
        id,
        avatar,
        login,
        logout,
        loading,
        redirectPath,
        setRedirectPath,
        updateUserData,
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
