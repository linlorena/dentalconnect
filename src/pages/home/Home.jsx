import React from "react";
import { Link } from "react-router-dom";
import LayoutPrincipal from "../../components/LayoutPrincipal";
import SplashHome from "../../assets/splash.png";
import { FirstAid, Headphones } from "@phosphor-icons/react";

function Home() {
  return (
    <LayoutPrincipal>
      <div className="w-full max-w-screen-xl mx-auto px-4 py-10 overflow-hidden">
        <h1 className="text-4xl font-bold">
          Olá, <span className="text-teal-600">usuário</span>!
        </h1>
        <p className="text-gray-600 text-lg mt-1">
          Como podemos cuidar da sua saúde hoje?
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-10">
          <img
            src={SplashHome}
            alt="Splash"
            className="w-full max-w-sm lg:max-w-md"
          />

          <div className="flex flex-col lg:flex-row gap-6 flex-wrap justify-center">
            <Link to="/tratamentos">
              <div className="bg-custom-light rounded-2xl p-6 w-72 shadow-md hover:bg-custom-light-hover transition duration-150">
                <div className="flex flex-col items-center">
                  <FirstAid size={60} className="text-sky-900" />
                  <h2 className="text-3xl font-bold text-custom-teal-2 mt-2">
                    Tratamentos
                  </h2>
                </div>
                <p className="text-gray-600 mt-2 text-md leading-snug text-center">
                  Conheça alguns dos procedimentos que oferecemos para cuidar do seu sorriso.
                </p>
              </div>
            </Link>

            <Link to="/fale-conosco">
              <div className="bg-custom-light rounded-2xl p-6 w-72 shadow-md hover:bg-custom-light-hover transition duration-150">
                <div className="flex flex-col items-center">
                  <Headphones size={60} className="text-sky-900" />
                  <h2 className="text-3xl font-bold text-custom-teal-2 mt-2">
                    Fale Conosco
                  </h2>
                </div>
                <p className="text-gray-600 mt-2 text-md leading-snug text-center">
                  A DentalConnect quer te escutar. Envie suas sugestões, reclamações ou elogios.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  );
}

export default Home;
