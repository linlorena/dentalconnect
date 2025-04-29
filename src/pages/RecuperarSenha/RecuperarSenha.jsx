import React, { useState } from "react";
import LayoutLogin from "../../components/LayoutLogin";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleRecuperarSenha = async () => {
    try {
      const resposta = await fetch("http://localhost:3001/api/mail/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const dados = await resposta.json();
      alert(dados.message);
    } catch (error) {
      alert("Erro ao enviar requisição. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <LayoutLogin>
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
          
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate("/login")} className="text-custom-teal">
              <ArrowCircleLeft size={60} className="text-sky-900 hover:text-sky-600 transition duration-150" />
            </button>
            <h1 className="text-custom-teal text-4xl font-bold">Esqueci minha senha :(</h1>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <input 
              type="text"
              placeholder="E-mail ou CPF"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none ease-in duration-150 focus:ring-2 focus:ring-custom-teal"
            />

            <button
              onClick={handleRecuperarSenha}
              className="w-full bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 text-xl font-semibold py-3 rounded-lg hover:bg-opacity-90 transition mt-4"
            >
              Alterar senha
            </button>
          </div>

        </div>
      </div>
    </LayoutLogin>
  );
}

export default RecuperarSenha;
