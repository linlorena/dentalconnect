import React, { useState } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import { User, Settings, Camera, Trash2, Mail, Lock, Save, HelpCircle, Calendar, Phone, Clock } from "lucide-react";
import Avatar from "../../assets/avatar.png";

function Configuracoes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [activeTab, setActiveTab] = useState("perfil");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha && senha !== confirmacaoSenha) {
      setSenhaError("As senhas não coincidem");
      return;
    }

    setSenhaError("");
    // Futura Lógica para salvar os dados
    console.log("Dados salvos", { nome, email, telefone, senha });
    
    // Mostrar mensagem de sucesso
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const menuItems = [
    { id: "perfil", icon: <User size={18} />, label: "Perfil" },
    { id: "ajuda", icon: <HelpCircle size={18} />, label: "Ajuda" }
  ];

  const duvidasFrequentes = [
    {
      pergunta: "Como agendar uma consulta?",
      resposta: "Para agendar uma consulta, acesse a página de Serviços para escolher o procedimento e clique em 'Agendar Consulta', escolha o dentista e selecione a data e horário disponíveis."
    },
    {
      pergunta: "Como atualizar meus dados pessoais?",
      resposta: "Acesse a seção 'Perfil' nas configurações e atualize seus dados no formulário. Não esqueça de clicar em 'Salvar Alterações' após realizar as modificações."
    },
    {
      pergunta: "Posso ver meu histórico de consultas?",
      resposta: "Sim, na seção 'Agendamentos' você encontra todo o histórico de consultas realizadas e agendadas, incluindo datas, horários e dentistas."
    }
  ];

  return (
    <LayoutPrincipal>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Settings className="text-blue-600 w-8 h-8 mr-3" />
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
              {/* Menu lateral */}
              <div className="md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200">
                <nav className="p-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {activeTab === item.id && (
                        <span className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Conteúdo principal */}
              <div className="flex-1 p-6 md:p-8">
                {activeTab === "perfil" && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Seu Perfil</h2>
                      <p className="text-gray-500 text-sm">Atualize suas informações pessoais para o agendamento odontológico</p>
                    </div>

                    {/* Foto de perfil e botões */}
                    <div className="bg-gray-50 p-6 rounded-xl mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Foto de Perfil</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                          <img
                            src={Avatar || "/placeholder.svg"}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                          />
                          <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
                            <Camera size={18} className="text-white" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                          <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                          >
                            <Camera size={16} />
                            Mudar Foto
                          </button>
                          <button
                            type="button"
                            className="text-red-500 border border-gray-300 hover:bg-gray-100 font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Deletar Foto
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Campos de formulário */}
                    <div className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo de nome */}
                        <div>
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <input
                              id="nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              placeholder="Seu nome completo"
                            />
                          </div>
                        </div>

                        {/* Campo de email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail size={16} className="text-gray-400" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              placeholder="seu.email@exemplo.com"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Campo de telefone */}
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone para Contato
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Alterar Senha</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Campo de senha */}
                          <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                              Nova Senha
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                              </div>
                              <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Digite sua nova senha"
                              />
                            </div>
                          </div>

                          {/* Campo de confirmação de senha */}
                          <div>
                            <label htmlFor="confirmacaoSenha" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirmar Nova Senha
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                              </div>
                              <input
                                id="confirmacaoSenha"
                                type="password"
                                value={confirmacaoSenha}
                                onChange={(e) => setConfirmacaoSenha(e.target.value)}
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                  senhaError ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Confirme sua nova senha"
                              />
                            </div>
                            {senhaError && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <span className="mr-1">⚠️</span> {senhaError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botão de salvar */}
                      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
                        >
                          <Save size={18} />
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === "ajuda" && (
                  <div className="max-w-3xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">Central de Ajuda</h2>
                      <p className="text-gray-500 text-sm">Dúvidas frequentes sobre o sistema de agendamento odontológico</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl mb-8 flex items-start border border-blue-200">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                        <HelpCircle size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800 mb-2">Precisando de ajuda?</h3>
                        <p className="text-blue-700 text-sm">
                          Verifique as dúvidas frequentes abaixo ou entre em contato com nosso suporte
                          pelo telefone (85) 98765-4321 ou pelo email faleconosco@dentalconnect.com
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {duvidasFrequentes.map((duvida, index) => (
                        <div 
                          key={index}
                          className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                        >
                          <div className="bg-gray-50 px-6 py-4 flex items-center">
                            <span className="flex items-center justify-center bg-blue-100 text-blue-600 w-8 h-8 rounded-full mr-3 flex-shrink-0">
                              {index === 0 && <Calendar size={16} />}
                              {index === 1 && <Clock size={16} />}
                              {index === 2 && <Calendar size={16} />}
                              {index === 3 && <User size={16} />}
                              {index === 4 && <Calendar size={16} />}
                            </span>
                            <h4 className="font-medium text-gray-800">{duvida.pergunta}</h4>
                          </div>
                          <div className="px-6 py-4 bg-white">
                            <p className="text-gray-600">{duvida.resposta}</p>
                          </div>
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