import React from "react";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import { Envelope, Phone, MapPin } from "@phosphor-icons/react";

function FaleConosco() {
    return (
        <LayoutPrincipal>
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
                    <form className="mt-6 space-y-4">
                        <input
                            type="text" placeholder="Nome"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            required />
                        <input
                            type="email" placeholder="E-mail"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            required />
                        <input
                            type="tel" placeholder="Telefone"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150" />
                        <textarea
                            rows="4" placeholder="Mensagem"
                            className="w-full p-3 border border-gray-300 focus:shadow-gray-200 focus:shadow-md rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-teal ease-in duration-150"
                            required
                        ></textarea>

                        <a href="mailto:faleconosco@dentalconnect.com.br">
                            <button
                                type="submit" className="w-full bg-custom-teal text-sky-900 font-semibold text-xl py-3 px-6 rounded-xl hover:bg-custom-teal-hover ease-in duration-150">
                                Enviar Mensagem
                            </button>
                        </a>
                    </form>
                </div>
            </div>
        </LayoutPrincipal>
    )
}

export default FaleConosco;