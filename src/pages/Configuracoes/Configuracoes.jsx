"use client"

import { useState, useEffect, useRef } from "react"
import LayoutPrincipal from "../../components/LayoutPrincipal"
import { useAuth } from "../../context/auth"
import {
  User,
  Gear,
  Camera,
  Trash,
  EnvelopeSimple,
  Lock,
  FloppyDisk,
  Info,
  CalendarBlank,
  Clock,
  CaretDown,
  CaretUp,
  EyeClosed,
  Eye,
  Spinner
} from "@phosphor-icons/react"
import axios from "axios"

function Configuracoes() {
  const { nome, email, avatar: avatarContext, id, token, updateUserData } = useAuth()

  // State for fetched user data
  const [userData, setUserData] = useState(null)
  const [loadingAvatar, setLoadingAvatar] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false) // State for delete loading

  const [novoNome, setNovoNome] = useState("")
  const [novoEmail, setNovoEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("")
  const [senhaError, setSenhaError] = useState("")
  const [activeTab, setActiveTab] = useState("perfil")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAvatarSuccess, setShowAvatarSuccess] = useState(false)
  const [avatarSuccessMessage, setAvatarSuccessMessage] = useState("") // Specific success message for avatar actions
  const [error, setError] = useState("")
  const [avatarError, setAvatarError] = useState("")

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  const visibilidadeSenha = () => setMostrarSenha((prev) => !prev)
  const visibilidadeConfirmacao = () => setMostrarConfirmacao((prev) => !prev)

  const [expandedIndex, setExpandedIndex] = useState(null)

  const fileInputRef = useRef(null)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingAvatar(true)
      try {
        if (!id || !token) {
          console.error("ID do usuário ou token não disponível para buscar dados.")
          setUserData({ nome: nome, email: email, avatar: avatarContext })
          setLoadingAvatar(false)
          return
        }
        const response = await axios.get(`http://localhost:3001/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(response.data)
        setNovoNome(response.data.nome || "")
        setNovoEmail(response.data.email || "")
      } catch (err) {
        console.error("Erro ao buscar dados do usuário em Configurações:", err)
        setError("Erro ao carregar dados do perfil. Usando dados locais.")
        setUserData({ nome: nome, email: email, avatar: avatarContext })
        setNovoNome(nome || "")
        setNovoEmail(email || "")
      } finally {
        setLoadingAvatar(false)
      }
    }
    fetchUserData()
  }, [id, token, nome, email, avatarContext])

  // Validate and format avatar URL
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || avatarUrl.trim() === '') {
      return null;
    }
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
      return `http://localhost:3001${path}`;
    }
    return avatarUrl;
  };

  const formatarNome = (nomeInput) => nomeInput || "Usuário"
  const formatarEmail = (emailInput) => emailInput || ""

  // Handle general profile data update
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSenhaError("")
    setShowSuccess(false)

    try {
      if (senha && confirmacaoSenha && senha !== confirmacaoSenha) {
        setSenhaError("As senhas não coincidem")
        return
      }

      const updateData = { nome: novoNome, email: novoEmail }
      if (senha) updateData.senha = senha

      const response = await axios.put(`http://localhost:3001/api/users/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedLocalUserData = { ...userData, nome: novoNome, email: novoEmail };
      setUserData(updatedLocalUserData);

      if (updateUserData) {
        // Preserve existing avatar when updating other profile info
        updateUserData({ nome: novoNome, email: novoEmail, avatar: userData?.avatar, id, token })
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setSenha("")
      setConfirmacaoSenha("")
    } catch (err) {
      console.error("Erro ao atualizar dados:", err)
      setError(err.response?.data?.error || "Erro ao atualizar dados. Tente novamente.")
    }
  }

  // Trigger hidden file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection and initiate upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Use apenas JPEG, PNG ou GIF.');
      return;
    }

    // Validar tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setError("");

    try {
      console.log('Token:', token); // Debug do token
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
        `http://localhost:3001/api/users/${id}/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Resposta do upload:', response.data); // Debug da resposta

      // Atualizar o contexto com a nova URL do avatar
      updateUserData({
        avatar: response.data.avatarUrl
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      setError(error.response?.data?.message || 'Erro ao fazer upload do avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle avatar deletion logic (PUT with avatar: null)
  const handleAvatarDelete = async () => {
    if (!id || !token || !userData?.avatar) return; // Check if avatar exists

    setDeletingAvatar(true);
    setAvatarError("");
    setShowAvatarSuccess(false);

    try {
      // Send PUT request to update the user, setting avatar to null
      const response = await axios.put(`http://localhost:3001/api/users/${id}`,
        { avatar: null }, // Data to send
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Use JSON for this request
          },
        }
      );

      console.log("Avatar deletado com sucesso (via PUT):");

      // Update local state immediately
      const updatedLocalUserData = { ...userData, avatar: null };
      setUserData(updatedLocalUserData);

      // Update auth context
      if (updateUserData) {
        updateUserData({ ...userData, nome: novoNome, email: novoEmail, avatar: null, id, token });
      }

      setAvatarSuccessMessage("Foto de perfil deletada com sucesso!");
      setShowAvatarSuccess(true);
      setTimeout(() => setShowAvatarSuccess(false), 3000);

    } catch (err) {
      console.error("Erro ao deletar o avatar (via PUT):", err);
      setAvatarError(err.response?.data?.error || "Erro ao deletar o avatar. Tente novamente.");
    } finally {
      setDeletingAvatar(false);
    }
  };

  const menuItems = [
    { id: "perfil", icon: <User size={18} />, label: "Perfil" },
    { id: "ajuda", icon: <Info size={18} />, label: "Ajuda" },
  ]

  const duvidasFrequentes = [
    { pergunta: "Como agendar uma consulta?", resposta: "..." },
    { pergunta: "Como atualizar meus dados pessoais?", resposta: "..." },
    { pergunta: "Posso ver meu histórico de consultas?", resposta: "..." },
  ]

  const displayAvatarUrl = getAvatarUrl(userData?.avatar);

  return (
    <LayoutPrincipal>
      <div>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header and General Success Message */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Gear className="text-custom-teal w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
            </div>
            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">✓</span>
                Alterações de perfil salvas com sucesso!
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Menu */}
              <div className="md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200">
                <nav className="p-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-colors ${
                        activeTab === item.id
                          ? "bg-gray-100 text-custom-teal-dark font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === item.id ? "text-custom-teal-hover" : "text-gray-500"}`}>{item.icon}</span>
                      <span>{item.label}</span>
                      {activeTab === item.id && <span className="ml-auto w-1.5 h-5 bg-custom-teal rounded-full"></span>}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                {activeTab === "perfil" && (
                  <form onSubmit={handleSubmit}>
                    {/* Profile Header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Seu Perfil</h2>
                      <p className="text-gray-500 text-sm">Atualize suas informações pessoais.</p>
                    </div>

                    {/* Avatar Section */}
                    <div className="bg-gray-50 px-6 py-5 rounded-xl mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados pessoais</h3>
                      {/* Avatar Success/Error Messages */}
                      {showAvatarSuccess && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center">
                          <span className="mr-2">✓</span>
                          {avatarSuccessMessage} {/* Display dynamic success message */}
                        </div>
                      )}
                      {avatarError && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                          {avatarError}
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        {/* Avatar Display */}
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            {loadingAvatar || uploadingAvatar || deletingAvatar ? (
                              <Spinner size={32} className="animate-spin text-custom-teal" />
                            ) : displayAvatarUrl ? (
                              <img
                                key={displayAvatarUrl} // Force re-render on URL change
                                src={displayAvatarUrl}
                                alt="Foto de perfil"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentElement.querySelector('.fallback-icon');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <div className="fallback-icon w-full h-full flex items-center justify-center" style={{ display: displayAvatarUrl ? 'none' : 'flex' }}>
                                <User size={64} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/gif"
                            style={{ display: 'none' }}
                          />
                          {/* Camera Icon Overlay (triggers file input) */}
                          <button
                             type="button"
                             onClick={handleAvatarClick}
                             disabled={uploadingAvatar || loadingAvatar || deletingAvatar}
                             className="absolute bottom-0 right-0 bg-custom-teal p-2 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-custom-teal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             title="Mudar Foto"
                           >
                             <Camera size={18} className="text-white" />
                           </button>
                        </div>

                        {/* User Info & Action Buttons */}
                        <div className="flex flex-col justify-start">
                          <p className="text-lg font-semibold text-gray-800">{formatarNome(userData?.nome || nome)}</p>
                          <p className="text-gray-500 mb-4">{formatarEmail(userData?.email || email)}</p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={handleAvatarClick}
                              disabled={uploadingAvatar || loadingAvatar || deletingAvatar}
                              className="bg-custom-teal hover:bg-custom-teal-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {uploadingAvatar ? <Spinner size={16} className="animate-spin"/> : <Camera size={16} />}
                              {uploadingAvatar ? "Enviando..." : "Mudar Foto"}
                            </button>
                            <button
                              type="button"
                              onClick={handleAvatarDelete}
                              disabled={uploadingAvatar || loadingAvatar || deletingAvatar || !displayAvatarUrl} // Also disable if no avatar
                              className="text-red-500 border border-gray-300 hover:bg-gray-100 font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingAvatar ? <Spinner size={16} className="animate-spin"/> : <Trash size={16} />}
                              {deletingAvatar ? "Deletando..." : "Deletar Foto"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Form Fields */}
                    <div className="space-y-6 max-w-2xl">
                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      {/* Name and Email Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={16} className="text-gray-400" /></div>
                            <input
                              value={novoNome}
                              onChange={(e) => setNovoNome(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-custom-teal focus:border-custom-teal outline-none transition-all"
                              placeholder="Seu nome completo"
                              disabled={loadingAvatar}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><EnvelopeSimple size={16} className="text-gray-400" /></div>
                            <input
                              type="email"
                              value={novoEmail}
                              onChange={(e) => setNovoEmail(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-custom-teal focus:border-custom-teal outline-none transition-all"
                              placeholder="seu.email@exemplo.com"
                              disabled={loadingAvatar}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Password Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                          <div className="relative w-full">
                            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none"><Lock size={20} /></div>
                            <input
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Digite sua nova senha (mín. 8 caracteres)"
                              value={senha}
                              onChange={(e) => setSenha(e.target.value)}
                              className="pl-10 pr-10 p-3 focus:shadow-gray-200 focus:shadow-md w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            />
                            <button type="button" onClick={visibilidadeSenha} className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                              {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                          <div className="relative w-full">
                            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none"><Lock size={20} /></div>
                            <input
                              type={mostrarConfirmacao ? "text" : "password"}
                              placeholder="Confirme sua nova senha"
                              value={confirmacaoSenha}
                              onChange={(e) => setConfirmacaoSenha(e.target.value)}
                              minLength={8}
                              className={`pl-10 pr-10 p-3 focus:shadow-gray-200 focus:shadow-md w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${senhaError ? 'ring-red-500' : 'focus:ring-custom-teal'} ease-in duration-150`}
                            />
                            <button type="button" onClick={visibilidadeConfirmacao} className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                              {mostrarConfirmacao ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                          </div>
                          {senhaError && <p className="text-red-500 text-sm mt-1">{senhaError}</p>}
                        </div>
                      </div>
                      {/* Save Button */}
                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-custom-teal hover:bg-custom-teal-hover text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loadingAvatar || uploadingAvatar || deletingAvatar} // Disable save while any avatar operation is in progress
                        >
                          <FloppyDisk size={18} />
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Help Section */}
                {activeTab === "ajuda" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Ajuda</h2>
                      <p className="text-gray-500 text-sm">Encontre respostas para suas dúvidas mais comuns.</p>
                    </div>
                    <div className="space-y-4">
                      {duvidasFrequentes.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium text-gray-700 text-left">{item.pergunta}</span>
                            {expandedIndex === index ? <CaretUp size={16} className="text-gray-500" /> : <CaretDown size={16} className="text-gray-500" />}
                          </button>
                          {expandedIndex === index && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-gray-600">{item.resposta}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  )
}

export default Configuracoes
  