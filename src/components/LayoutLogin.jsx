import React from "react";
import Logo from "../assets/logo_dentalconnect.png";
import Dentista from "../assets/inicial.png";

function LayoutLogin({ children, fundo = false }) {
    return (
        <div className="flex h-screen bg-sky-900 relative">
            <img src={Logo} alt="Logo DentalConnect" className="absolute top-6 right-6 w-20 md:w-24" />

            <div className="hidden lg:flex items-center justify-center w-1/2 bg-custom-teal rounded-r-full relative">
                <img
                    src={Dentista}
                    alt="Ilustração"
                    className="w-full max-w-lg lg:max-w-xl"
                />
             </div>


            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 md:px-12">
                {children}
            </div>
        </div>
    );
}

export default LayoutLogin;
