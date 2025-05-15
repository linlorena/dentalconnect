import React, { useState } from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import { Envelope, Phone, MapPin } from "@phosphor-icons/react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importar react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar o CSS do react-toastify

function FaleConosco() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!nome || !email || !mensagem) {
            toast.error('Nome, e-mail e mensagem são obrigatórios.');
            setIsLoading(false);
            return;
        }

        try {
            

            const response = await axios.post('http://localhost:3001/api/fale-conosco', {
                nome,
                email,
                telefone,
                mensagem
            });


            if (response.status === 201) {
                toast.success('Sua mensagem foi enviada com sucesso. Nossa equipe de suporte entrará em contato com você em breve.');
                setNome('');
                setEmail('');
                setTelefone('');
                setMensagem('');
            } else {
                toast.error(response.data.message || 'Ocorreu um erro ao enviar a mensagem.');
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            let erroMsg = 'Ocorreu um erro ao conectar ao servidor.';
            if (error.response && error.response.data && error.response.data.error) {
                erroMsg = error.response.data.error;
                if (error.response.data.details) {
                    erroMsg += `: ${error.response.data.details}`;
                }
            } else if (error.message) {
                erroMsg = error.message;
            }
            toast.error(erroMsg);
        }
        setIsLoading(false);
    };

    return (
        <LayoutPrincipal>
            
            <ToastContainer 
                position="top-right"
                autoClose={7000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                
            />
            <div className="px-6 md:px-16 py-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="w-full lg:w-1/2 px-4">
                    <h2 className="text-4xl font-bold text-sky-900 text-center md:text-left">Fale Conosco</h2>
                    <p className="text-lg mt-4 text-center md:text-left text-sky-900">Tem dúvidas ou precisa de ajuda? Entre em contato conosco.</p>
                    <p className="text-lg text-center md:text-left text-sky-900">Vamos fazer o possível para te ajudar. <span className="font-extrabold text-xl text-custom-teal">:)</span></p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <MapPin size={24} className="text-custom-teal" />
                            <p className="text-gray-600">Avenida Santos Dumont, 3060 - Fortaleza/CE</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={24} className="text-custom-teal" />
                            <p className="text-gray-600">(85) 98765-4321</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Envelope size={24} className="text-custom-teal" />
                            <p className="text-gray-600">faleconosco@dentalconnect.com</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6 md:p-8">
                    <h3 className="text-3xl font-semibold text-sky-900 text-center">Envie sua mensagem</h3>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text" placeholder="Nome"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required />
                        <input
                            type="email" placeholder="E-mail"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                        <input
                            type="tel" placeholder="Telefone (opcional)"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)} />
                        <textarea
                            rows="4" placeholder="Mensagem"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            required
                        ></textarea>

                        <button
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full bg-custom-teal text-sky-900 font-semibold text-xl py-3 px-6 rounded-xl hover:bg-custom-teal-hover ease-in duration-150 disabled:opacity-50">
                            {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                        </button>
                       
                    </form>
                </div>
            </div>
        </LayoutPrincipal>
    )
}

export default FaleConosco;

