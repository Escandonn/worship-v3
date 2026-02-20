import React, { useState, useRef } from 'react';

const ebooks = [
    {
        id: "01",
        tag: "DIGITAL STRATEGY",
        title: "¿Por qué necesitas una página web?",
        desc: "La autoridad digital no se negocia. Analizamos cómo el software a medida transforma la presencia de marca en un motor de ingresos constante.",
        accent: "rgba(0, 243, 255, 0.4)",
        edition: "VOL. 26",
        delay: "0.1s"
    },
    {
        id: "02",
        tag: "FUTURE SYSTEMS",
        title: "La IA y tu negocio: Aliados de Elite",
        desc: "Más allá del hype. Desglosamos implementaciones reales de IA que están redefiniendo la eficiencia operativa en empresas de alto impacto.",
        accent: "rgba(57, 255, 20, 0.4)",
        edition: "ED. MASTER",
        delay: "0.2s"
    },
    {
        id: "03",
        tag: "TECH TRENDS",
        title: "La tecnología es el futuro del éxito",
        desc: "El ecosistema cambia cada segundo. Una guía periodística sobre las infraestructuras que sostendrán el mercado global en la próxima década.",
        accent: "rgba(188, 19, 254, 0.4)",
        edition: "PREMIUM",
        delay: "0.3s"
    }
];

const BlogInsights: React.FC = () => {
    return (
        <section className="relative w-full py-40 px-6 overflow-hidden bg-transparent">
            {/* Background Texture / Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div className="max-w-xl text-left">
                        <span className="text-neon-blue text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">
                            Editorial Section / 2026
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.85]">
                            Insights <span className="text-white/20 italic">Premium</span>
                        </h2>
                    </div>
                    <p className="text-white/40 text-sm md:text-base font-medium max-w-xs text-left md:text-right leading-relaxed mb-2">
                        Pensamiento crítico sobre software, inteligencia artificial y el futuro corporativo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 perspective-[3000px]">
                    {ebooks.map((ebook) => (
                        <EbookCard key={ebook.id} ebook={ebook} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const EbookCard: React.FC<{ ebook: any }> = ({ ebook }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative h-[600px] cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{
                transformStyle: 'preserve-3d',
                transform: isHovered
                    ? 'rotateY(0deg) translateZ(50px) scale(1.02)'
                    : 'rotateY(-25deg) rotateX(5deg)',
            }}
        >
            {/* The "Spine" Shadow Effect */}
            <div className="absolute left-0 top-0 w-4 h-full bg-black/40 blur-sm -translate-x-full opacity-50 transform-gpu" />

            {/* Ebook Cover */}
            <div className="absolute inset-0 rounded-r-2xl bg-[#0a0a0a] border-y border-r border-white/10 flex flex-col overflow-hidden shadow-[20px_20px_60px_rgba(0,0,0,0.8)]">
                {/* Visual Header / Accent */}
                <div className="h-2 w-full" style={{ backgroundColor: ebook.accent }} />

                <div className="p-10 flex flex-col h-full relative">
                    {/* Editorial Branding */}
                    <div className="flex justify-between items-start mb-12">
                        <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">{ebook.edition}</span>
                        <span className="text-3xl font-black text-white/10 leading-none">{ebook.id}</span>
                    </div>

                    <div className="flex-1">
                        <span className="text-[10px] font-black tracking-[0.2em] text-neon-blue mb-4 block">{ebook.tag}</span>
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-[1] uppercase tracking-tighter mb-8">
                            {ebook.title}
                        </h3>

                        <div className="w-12 h-[2px] bg-white/20 mb-8" />

                        <p className="text-sm md:text-base text-white/50 font-medium leading-relaxed italic">
                            "{ebook.desc}"
                        </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-10 flex items-center justify-between border-t border-white/5 mt-auto">
                        <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Worship / Read More</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Inner Paper Effect (revealed on hover?) */}
                <div className={`absolute inset-0 bg-white/5 pointer-events-none transition-opacity duration-1000 ${isHovered ? 'opacity-20' : 'opacity-0'}`} />
            </div>

            {/* Reflection / Shine */}
            <div className="absolute inset-0 rounded-r-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
};

export default BlogInsights;
