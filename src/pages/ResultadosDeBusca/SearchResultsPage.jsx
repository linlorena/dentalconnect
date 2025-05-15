"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import DentistCard from "../../components/DentistCard"
import { useAuth } from "../../context/auth"
import { ArrowCircleLeft } from "@phosphor-icons/react"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchResultsPage() {
  const queryParams = useQuery()
  const searchTerm = queryParams.get("query")
  const [dentistas, setDentistas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (!searchTerm) {
      setLoading(false)
      setDentistas([])
      return
    }

    const fetchDentistas = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:3001/api/dentists/nome", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Acesso não autorizado. Faça seu login novamente")
          }
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        const data = await response.json()

        const filteredDentistas = data.filter(
          (dentista) =>
            dentista.usuario &&
            dentista.usuario.nome &&
            dentista.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setDentistas(filteredDentistas)
      } catch (err) {
        console.error("Erro ao buscar dentistas:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDentistas()
    } else {
      setError("Token de autenticação não encontrado. Faça login novamente.")
      setLoading(false)
    }
  }, [searchTerm, token])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-10 mt-16">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors duration-300"
            aria-label="Voltar"
          >
            <ArrowCircleLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-sky-600">Resultados da Pesquisa</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
          <div className="animate-spin text-sky-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p className="text-lg text-gray-700 mb-2">Carregando resultados</p>
          <p className="text-sm text-gray-500">Buscando dentistas para "{searchTerm}"...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Erro: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-10 mt-16">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors duration-300"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-sky-600">Resultados da Pesquisa</h2>
      </div>

      {searchTerm && (
        <p className="text-gray-600 mb-6">
          Mostrando resultados para: <span className="font-medium ">"{searchTerm}"</span>
          {dentistas.length > 0 && (
            <span className="ml-2 bg-sky-100 text-sky-800 font-medium px-2.5 py-0.5 rounded-full">
              {dentistas.length} {dentistas.length === 1 ? "resultado" : "resultados"}
            </span>
          )}
        </p>
      )}

      {dentistas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dentistas.map((dentista) => (
            <DentistCard key={dentista.id} dentista={dentista} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Nenhum dentista encontrado com esse nome.</p>
          <button
            onClick={handleGoBack}
            className="mt-4 inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
          >
            <ArrowLeft size={16} />
            <span>Voltar à pesquisa</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage
