import React, { useState } from 'react';
import AntigravityText from './AntigravityText';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full h-[72px] flex items-center justify-between px-6 md:px-12 backdrop-blur-[14px] bg-black/20 border-b border-white/5 z-1000">
                <div className="flex items-center gap-3 font-semibold text-lg md:text-xl tracking-tight">
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.2)] overflow-hidden">
                        <div className="w-0 h-0 border-l-7 border-l-transparent border-r-7 border-r-transparent border-b-12 border-b-neon-green"></div>
                    </div>
                    <div className="flex items-center cursor-default">
                        <span className="text-white">worship</span>
                        <AntigravityText
                            tag="span"
                            text=".solutions"
                            className="font-bold"
                            letterClassName="text-neon-green"
                            delayStart={0.1}
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-[15px]">
                    <a href="#" className="text-white/85 hover:text-white transition-colors relative group">
                        Inicio
                        <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full rounded-sm shadow-[0_0_10px_#39FF14]"></span>
                    </a>
                    <a href="#productos" className="text-white/85 hover:text-white transition-colors relative group">
                        Productos
                        <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full rounded-sm shadow-[0_0_10px_#39FF14]"></span>
                    </a>
                    <a href="#precios" className="text-white/85 hover:text-white transition-colors relative group">
                        Precios
                        <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full rounded-sm shadow-[0_0_10px_#39FF14]"></span>
                    </a>
                    <a href="#docs" className="text-white/85 hover:text-white transition-colors relative group">
                        Docs
                        <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full rounded-sm shadow-[0_0_10px_#39FF14]"></span>
                    </a>
                    <button className="px-[18px] py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold cursor-pointer transition-all duration-250 hover:-translate-y-0.5 hover:bg-white/10 hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                        Entrar
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 cursor-pointer z-1001"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={`w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed top-[72px] right-0 w-[260px] h-[calc(100vh-72px)] backdrop-blur-[18px] bg-[#0a0f1e]/90 border-l border-white/10 p-7 flex flex-col gap-5.5 transform transition-transform duration-350 ease-in-out z-999 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <a href="#" className="text-white/90 text-base" onClick={() => setIsOpen(false)}>Inicio</a>
                <a href="#productos" className="text-white/90 text-base" onClick={() => setIsOpen(false)}>Productos</a>
                <a href="#precios" className="text-white/90 text-base" onClick={() => setIsOpen(false)}>Precios</a>
                <a href="#docs" className="text-white/90 text-base" onClick={() => setIsOpen(false)}>Docs</a>
                <button className="mt-2.5 w-full px-[18px] py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/20 text-neon-green font-semibold">
                    Entrar
                </button>
            </div>
        </>
    );
};

export default Navbar;
