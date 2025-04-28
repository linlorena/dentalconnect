import LayoutPrincipal from "../../components/LayoutPrincipal"
import { User, Settings } from "lucide-react"
import Avatar from "../../assets/avatar.png"
import { useState } from "react"

function Configuracao() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("")
  const [senhaError, setSenhaError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (senha !== confirmacaoSenha) {
      setSenhaError("As senhas não coincidem")
      return
    }

    setSenhaError("")
    // Futura Lógica para salvar os dados
    console.log("Dados salvos", { nome, email, senha })
  }

  return (
    <LayoutPrincipal>
      <div className="flex min-h-screen bg-white">
        <div className="w-64 border-r">
          <div className="p-4 bg-white border-b">
            <h1 className="text-3xl font-bold text-teal-500">Configurações</h1>
          </div>
          <nav className="mt-2">
            <div className="flex items-center px-4 py-3 bg-blue-50 border-l-4 border-blue-400 text-blue-900 font-bold text-xl">
              <User className="w-5 h-5 mr-3" />
              <span>Perfil</span>
            </div>
            
          </nav>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Edição de Dados</h2>

              {/* Foto de perfil e botões */}
              <div className="flex items-center mb-10">
                <img
                  src={Avatar || "/placeholder.svg"}
                  className="w-30 h-30 rounded-full border-5 border-custom-teal"
                />
                <div className="ml-6 space-x-3">
                  <button className="bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-3xl">
                    Mudar Foto
                  </button>
                  <button
                    variant="outline"
                    className="text-red-500 border-gray-300 border-2 bg-gray hover:bg-gray-200 font-semibold px-6 py-3 rounded-3xl"
                  >
                    Deletar Foto
                  </button>
                </div>
              </div>

                  <div style={{ maxWidth: "36rem", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label htmlFor="nome" style={{ display: "block", color: "#374151", marginBottom: "4px" }}>
                    Nome
                  </label>
                  <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      padding: "8px",
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{ display: "block", color: "#374151", marginBottom: "4px" }}>
                    Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6B7280",
                      }}
                    >
                      @
                    </span>
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        border: "1px solid #D1D5DB",
                        borderRadius: "6px",
                        padding: "8px",
                        paddingLeft: "32px",
                      }}
                    />
                  </div>
                </div>

                    {/* Campo de senha */}
                <div>
                  <label htmlFor="senha" style={{ display: "block", color: "#374151", marginBottom: "4px" }}>
                    Nova Senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      padding: "8px",
                    }}
                    placeholder="Digite sua nova senha"
                  />
                </div>

                {/* Campo de confirmação de senha */}
                <div>
                  <label htmlFor="confirmacaoSenha" style={{ display: "block", color: "#374151", marginBottom: "4px" }}>
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="confirmacaoSenha"
                    type="password"
                    value={confirmacaoSenha}
                    onChange={(e) => setConfirmacaoSenha(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      padding: "8px",
                    }}
                    placeholder="Confirme sua nova senha"
                  />
                  {senhaError && <p style={{ color: "#EF4444", fontSize: "0.875rem", marginTop: "4px" }}>{senhaError}</p>}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#2563EB",
                        color: "white",
                        borderRadius: "9999px",
                        padding: "8px 40px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Salvar
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  )
}

export default Configuracao
