import React from 'react';

const MainFooter: React.FC = () => {
    return (
        <footer className="relative w-full bg-transparent overflow-hidden pt-20 pb-12 px-6">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* CTA Section */}
                <div className="mb-32 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
                            ¿Listo para<br />
                            <span className="text-neon-blue">evolucionar?</span>
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl font-medium max-w-lg mb-10">
                            Construimos la infraestructura digital que tu empresa necesita para escalar sin límites.
                        </p>
                        <a
                            href="https://wa.me/573172474295"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-neon-blue hover:text-black transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(0,243,255,0.3)] transform hover:scale-105"
                        >
                            Comenzar Proyecto
                        </a>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex gap-4">
                            {['tw', 'ig', 'li', 'gh'].map((social) => (
                                <a key={social} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{social}</span>
                                </a>
                            ))}
                        </div>
                        <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">
                            worship.solutions © 2026
                        </p>
                    </div>
                </div>

                {/* Main Footer Grid — Quotes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-white/10">
                    <div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-neon-blue mb-6 block">Visión</span>
                        <ul className="space-y-6 text-sm text-white/50">
                            <li className="leading-relaxed italic">"El mejor marketing no se siente como marketing." <span className="not-italic font-bold text-white/30 block mt-1">— Tom Fishburne</span></li>
                            <li className="leading-relaxed italic">"La simplicidad es la máxima sofisticación." <span className="not-italic font-bold text-white/30 block mt-1">— Leonardo da Vinci</span></li>
                        </ul>
                    </div>
                    <div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-neon-blue mb-6 block">Estrategia</span>
                        <ul className="space-y-6 text-sm text-white/50">
                            <li className="leading-relaxed italic">"El software se está comiendo al mundo." <span className="not-italic font-bold text-white/30 block mt-1">— Marc Andreessen</span></li>
                            <li className="leading-relaxed italic">"Muévete rápido y construye cosas." <span className="not-italic font-bold text-white/30 block mt-1">— Reid Hoffman</span></li>
                        </ul>
                    </div>
                    <div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-neon-blue mb-6 block">Ejecución</span>
                        <ul className="space-y-6 text-sm text-white/50">
                            <li className="leading-relaxed italic">"Ideas sin ejecución son solo alucinaciones." <span className="not-italic font-bold text-white/30 block mt-1">— Thomas Edison</span></li>
                            <li className="leading-relaxed italic">"Tu marca es lo que la gente dice cuando no estás en la sala." <span className="not-italic font-bold text-white/30 block mt-1">— Jeff Bezos</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
