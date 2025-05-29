import React, { useState, useEffect, useRef } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import AvatarDefault from "../../assets/avatar.png";
import { useAuth } from "../../context/auth";
import { User, Gear, Camera, Trash, EnvelopeSimple, Lock, FloppyDisk, Info, CalendarBlank, Clock, CaretDown, CaretUp, EyeClosed, Eye } from "@phosphor-icons/react";
import axios from "axios";

function Configuracoes() {
  const { nome, email, avatar, id, token, updateUserData } = useAuth();
  const fileInputRef = useRef(null);

  const [novoNome, setNovoNome] = useState(nome || "");
  const [novoEmail, setNovoEmail] = useState(email || "");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [activeTab, setActiveTab] = useState("perfil");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const visibilidadeSenha = () => setMostrarSenha((prev) => !prev);
  const visibilidadeConfirmacao = () => setMostrarConfirmacao((prev) => !prev);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatarNome = (nome) => {
    if (!nome) return "Usuário";
    return nome;
  };

  const formatarEmail = (email) => {
    if (!email) return "";
    return email;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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

    setUploading(true);
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
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/${id}`,
        { avatar: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualizar o contexto removendo o avatar
      updateUserData({
        avatar: null
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao deletar avatar:', error);
      setError(error.response?.data?.message || 'Erro ao deletar avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSenhaError("");

    try {
      // Validar senha apenas se ambas as senhas foram fornecidas
      if (senha && confirmacaoSenha) {
        if (senha !== confirmacaoSenha) {
          setSenhaError("As senhas não coincidem");
          return;
        }
      }

      // Preparar dados para atualização
      const updateData = {
        nome: novoNome,
        email: novoEmail,
      };

      // Adicionar senha apenas se foi fornecida
      if (senha) {
        updateData.senha = senha;
      }

      // Fazer a requisição para atualizar o usuário
      const response = await axios.put(
        `http://localhost:3001/api/users/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dados atualizados com sucesso:", response.data);
      
      // Atualizar o contexto de autenticação com os novos dados
      if (updateUserData) {
        updateUserData({
          nome: novoNome,
          email: novoEmail,
          // Mantém os outros dados do usuário inalterados
          avatar,
          id,
          token,
        });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Limpar campos de senha após sucesso
      setSenha("");
      setConfirmacaoSenha("");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setError(error.response?.data?.error || "Erro ao atualizar dados. Tente novamente.");
    }
  };

  const menuItems = [
    { id: "perfil", icon: <User size={18} />, label: "Perfil" },
    { id: "ajuda", icon: <Info size={18} />, label: "Ajuda" },
  ];

  const duvidasFrequentes = [
    {
      pergunta: "Como agendar uma consulta?",
      resposta:
        "Para agendar uma consulta, acesse a página de Serviços para escolher o procedimento e clique em 'Agendar Consulta', escolha o dentista e selecione a data e horário disponíveis.",
    },
    {
      pergunta: "Como atualizar meus dados pessoais?",
      resposta:
        "Acesse a seção 'Perfil' nas configurações e atualize seus dados no formulário. Não esqueça de clicar em 'Salvar Alterações' após realizar as modificações.",
    },
    {
      pergunta: "Posso ver meu histórico de consultas?",
      resposta:
        "Sim, na seção 'Agendamentos' você encontra todo o histórico de consultas realizadas e agendadas, incluindo datas, horários e dentistas.",
    },
  ];

  return (
    <LayoutPrincipal>
      <div>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Gear className="text-custom-teal w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
            </div>

            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">✓</span>
                Alterações salvas com sucesso!
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 bg-gray-50 p-4 md:p-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                      activeTab === item.id
                        ? "bg-custom-teal text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                {activeTab === "perfil" && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Seu Perfil</h2>
                      <p className="text-gray-500 text-sm">
                        Atualize suas informações pessoais para o agendamento odontológico
                      </p>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 rounded-xl mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Dados pessoais
                      </h3>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        <div className="relative flex-shrink-0">
                          <img
                            src={avatar || AvatarDefault}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                          />
                          <div 
                            className="absolute bottom-0 right-0 bg-custom-teal p-2 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-custom-teal-hover transition-colors"
                            onClick={handleAvatarClick}
                          >
                            <Camera size={18} className="text-white" />
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/gif"
                            className="hidden"
                          />
                        </div>

                        <div className="flex flex-col justify-start">
                          <p className="text-lg font-semibold text-gray-800">
                            {formatarNome(nome)}
                          </p>
                          <p className="text-gray-500 mb-4">{formatarEmail(email)}</p>

                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={handleAvatarClick}
                              disabled={uploading}
                              className="bg-custom-teal hover:bg-custom-teal-hover text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              <Camera size={16} />
                              {uploading ? 'Enviando...' : 'Mudar Foto'}
                            </button>
                            {avatar && (
                              <button
                                type="button"
                                onClick={handleDeleteAvatar}
                                className="text-red-500 border border-gray-300 hover:bg-gray-100 font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                              >
                                <Trash size={16} />
                                Deletar Foto
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <input
                              value={novoNome}
                              onChange={(e) => setNovoNome(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-custom-teal focus:border-custom-teal outline-none transition-all"
                              placeholder="Seu nome completo"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <EnvelopeSimple size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              value={novoEmail}
                              onChange={(e) => setNovoEmail(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-custom-teal focus:border-custom-teal outline-none transition-all"
                              placeholder="seu.email@exemplo.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nova Senha */}
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                          <div className="relative w-full">
                            {/* Ícone de cadeado à esquerda */}
                            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                              <Lock size={20} />
                            </div>
                            <input
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Digite sua nova senha"
                              value={senha}
                              onChange={(e) => setSenha(e.target.value)}
                              className="pl-10 pr-10 p-3 focus:shadow-gray-200 focus:shadow-md w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            />
                            {/* Botão de visibilidade à direita */}
                            <button
                              type="button"
                              onClick={visibilidadeSenha}
                              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                            >
                              {mostrarSenha ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                          </div>
                        </div>

                        {/* Confirmar Senha */}
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                          <div className="relative w-full">
                            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                              <Lock size={20} />
                            </div>
                            <input
                              type={mostrarConfirmacao ? "text" : "password"}
                              placeholder="Confirme sua nova senha"
                              value={confirmacaoSenha}
                              onChange={(e) => setConfirmacaoSenha(e.target.value)}
                              className="pl-10 pr-10 p-3 focus:shadow-gray-200 focus:shadow-md w-full rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            />
                            <button
                              type="button"
                              onClick={visibilidadeConfirmacao}
                              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                            >
                              {mostrarConfirmacao ? <Eye size={24} /> : <EyeClosed size={24} />}
                            </button>
                          </div>
                          {senhaError && (
                            <p className="text-red-500 text-sm mt-1">{senhaError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-custom-teal hover:bg-custom-teal-hover text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center gap-2"
                      >
                        <FloppyDisk size={20} weight="bold" />
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "ajuda" && (
                  <div className="max-w-3xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Central de Ajuda</h2>
                      <p className="text-gray-500 text-sm">
                        Dúvidas frequentes sobre o sistema de agendamento odontológico
                      </p>
                    </div>

                    <div className="bg-custom-light p-6 rounded-xl mb-6 flex items-start border border-custom-teal">
                      <div className="flex-shrink-0 bg-light p-3 rounded-full mr-4">
                        <Info size={24} className="text-custom-teal" />
                      </div>
                      <div>
                        <h3 className="font-medium text-custom-teal-dark mb-2">Precisando de ajuda?</h3>
                        <p className="text-custom-teal-dark text-sm">
                          Verifique as dúvidas frequentes abaixo ou entre em contato com nosso
                          suporte pelo telefone (85) 98765-4321 ou pelo email
                          faleconosco@dentalconnect.com
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {duvidasFrequentes.map((duvida, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl shadow-sm bg-white"
                        >
                          <button
                            onClick={() =>
                              setExpandedIndex((prev) => (prev === index ? null : index))
                            }
                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center">
                              <span className="flex items-center justify-center bg-custom-light text-custom-teal-dark w-8 h-8 rounded-full mr-3">
                                {index === 0 && <CalendarBlank size={16} />}
                                {index === 1 && <Clock size={16} />}
                                {index === 2 && <CalendarBlank size={16} />}
                              </span>
                              <span className="font-medium text-gray-800">{duvida.pergunta}</span>
                            </div>
                            <span className="text-gray-500">
                              {expandedIndex === index ? (
                                <CaretUp size={20} />
                              ) : (
                                <CaretDown size={20} />
                              )}
                            </span>
                          </button>
                          {expandedIndex === index && (
                            <div className="px-6 pb-4 text-gray-600">{duvida.resposta}</div>
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
  );
}

export default Configuracoes;
