import React from "react";
import LayoutLogin from "../../components/LayoutLogin";
import { Question } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function Inicial() {
    return (
        <LayoutLogin>
            <div className="flex flex-col justify-center w-full lg:w-3/4 px-6 md:px-12">
                <h1 className="text-white items-center text-left text-4xl font-medium w-full max-w-xl leading-tight">
                  Bem-vindo à sua<br />conexão de odontologia <span className="font-black">:)</span>
                </h1>

                <div className="mt-8 space-y-4 w-full max-w-5/6">
                  <Link to="/login" className="block">
                    <button className="w-full bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 font-semibold text-xl py-4 rounded-lg hover:bg-opacity-90 transition">
                      Login
                    </button>
                  </Link>
                    <button className="w-full bg-custom-teal hover:bg-custom-teal-hover ease-in duration-150 text-sky-900 font-semibold text-xl py-4 rounded-lg hover:bg-opacity-90 transition">
                      <Link to="/cadastro" className="block">
                      Quero me cadastrar
                      </Link>
                    </button>
                </div>

                <div className="mt-4 w-full max-w-5/6 flex justify-end">
                  <p className="text-gray-300 text-md flex items-center gap-1 hover:underline ease-in duration-150">
                    Precisa de ajuda? <Question size={22} />
                  </p>
                </div>
            </div>
        </LayoutLogin>
    );
}

export default Inicial;
