"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ArrowLeft, X, MapPin, Stethoscope } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

function ProcedimentosModal({ local, onClose }) {
  const [procedimentos, setProcedimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProcedimentos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`http://localhost:3001/api/locals-services/${local.id}`)
        if (response.data && response.data.success && response.data.data && response.data.data.servicos) {
          setProcedimentos(response.data.data.servicos)
        } else {
          setProcedimentos([])
          console.warn("Nenhum serviço encontrado ou formato de resposta inesperado:", response.data)
        }
      } catch (err) {
        console.error("Erro ao buscar procedimentos:", err)
        let errorMessage = "Não foi possível carregar os procedimentos. Tente novamente mais tarde."
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        }
        setError(errorMessage)
        setProcedimentos([])
      } finally {
        setLoading(false)
      }
    }

    fetchProcedimentos();

  }, [local.id])

  const handleAgendarProcedimento = (procedimentoId) => {
    navigate(`/consultas?local=${local.id}&procedimento=${procedimentoId}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm p-4">
      {/* Card principal do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out">
        
        {/* Cabeçalho Fixo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-label="Voltar"
            >
              <ArrowLeft size={22} weight="bold" />
            </button>
            <h3 className="text-lg md:text-xl font-semibold text-sky-900">Procedimentos Disponíveis</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Fechar modal"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Informações da Clínica - Fixo abaixo do cabeçalho */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-5 border-b border-gray-200 sticky top-[73px] bg-white z-10">
          <h4 className="text-xl font-bold text-sky-700 mb-1 flex items-center">
             <MapPin size={20} className="mr-2 text-sky-600" /> 
             {local.nome}
          </h4>
          <p className="text-gray-600 text-sm">
            {local.endereco}, {local.numero} - {local.cidade}, {local.estado}
          </p>
        </div>

        {/* Conteúdo Rolável (Lista de Procedimentos) */}
        <div className="overflow-y-auto flex-grow p-5 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500">
              <svg className="animate-spin h-8 w-8 text-sky-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando procedimentos...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-sm text-center">
              <p className="font-semibold">Ocorreu um erro</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : procedimentos.length > 0 ? (
            procedimentos.map((procedimento) => (
              // Card para procedimento
              <div 
                key={procedimento.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-5 transition-shadow duration-200 hover:shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-4"
              >
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-sky-800 mb-1 flex items-center">
                    <Stethoscope size={18} className="mr-2 text-sky-600" />
                    {procedimento.nome}
                  </h4>
                  {procedimento.descricao && (
                    <p className="text-gray-600 text-sm leading-relaxed">{procedimento.descricao}</p>
                  )}
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => handleAgendarProcedimento(procedimento.id)}
                    className="w-full md:w-auto bg-sky-600 text-white py-2 px-5 rounded-lg font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150 shadow-sm hover:shadow-md"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500 bg-gray-100 rounded-lg p-5">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <p className="font-semibold">Nenhum procedimento disponível</p>
              <p className="text-sm">Esta clínica não oferece procedimentos para a localidade selecionada no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcedimentosModal

