import React, { useState, useEffect, useRef } from 'react';
import AntigravityText from './AntigravityText';

interface PricingPlan {
    name: string;
    tag: string;
    totalPrice: string;
    downPaymentPct: string;
    downPayment: string;
    remainder: string;
    description: string;
    features: string[];
    buttonText: string;
    isPopular?: boolean;
    accent: string;
    accentRaw: string;
}

const WHATSAPP_URL = "https://wa.me/573172474295";

const plans: PricingPlan[] = [
    {
        name: "Presencia Digital",
        tag: "Web profesional",
        totalPrice: "$1.2M",
        downPaymentPct: "30%",
        downPayment: "$360K",
        remainder: "$70K",
        description: "Tu marca en la web con diseño premium, rendimiento y posicionamiento real.",
        features: [
            "Diseño a medida & responsive",
            "SEO técnico desde el día 1",
            "Actualizaciones continuas",
        ],
        buttonText: "Iniciar proyecto",
        accent: "rgba(57, 255, 20, 0.45)",
        accentRaw: "#39ff14",
    },
    {
        name: "App de Alto Impacto",
        tag: "iOS & Android",
        totalPrice: "$3M",
        downPaymentPct: "35%",
        downPayment: "$1.05M",
        remainder: "$162,500K",
        description: "Aplicación nativa que convierte usuarios en clientes fieles desde el lanzamiento.",
        features: [
            "iOS & Android nativos",
            "UI/UX de clase mundial",
            "Integraciones API avanzadas",
            "Soporte técnico dedicado",
        ],
        buttonText: "Quiero mi App",
        isPopular: true,
        accent: "rgba(0, 243, 255, 0.45)",
        accentRaw: "#00f3ff",
    },
    {
        name: "Motor Empresarial",
        tag: "Software a medida",
        totalPrice: "A medida",
        downPaymentPct: "40%",
        downPayment: "Primer pago",
        remainder: "Pago mensual",
        description: "Infraestructura de software diseñada para escalar con tus operaciones sin límites.",
        features: [
            "Arquitectura escalable",
            "Integraciones empresariales",
            "Panel de control propio",
            "SLA & soporte prioritario",
        ],
        buttonText: "Agendar consultoría",
        accent: "rgba(188, 19, 254, 0.45)",
        accentRaw: "#bc13fe",
    }
];

const PricingSection: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [activePlan, setActivePlan] = useState(1);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [isShining, setIsShining] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const hasPlayedIntro = useRef(false);

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        const handleScroll = () => {
            if (!sectionRef.current) return;
            const currentScrollY = window.scrollY;
            setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
            lastScrollY.current = currentScrollY;
            const rect = sectionRef.current.getBoundingClientRect();
            const progress = (window.innerHeight - rect.top) / window.innerHeight;
            setScrollProgress(progress);
        };

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isIntersecting && !hasPlayedIntro.current && isMounted && typeof window !== 'undefined' && window.innerWidth < 768) {
            hasPlayedIntro.current = true;
            const triggerShine = () => { setIsShining(true); setTimeout(() => setIsShining(false), 500); };
            const sequence = async () => {
                await new Promise(r => setTimeout(r, 800));
                setActivePlan(2); triggerShine();
                await new Promise(r => setTimeout(r, 700));
                setActivePlan(0); triggerShine();
                await new Promise(r => setTimeout(r, 700));
                setActivePlan(1); triggerShine();
            };
            sequence();
        }
    }, [isIntersecting, isMounted]);

    const safeProgress = Math.max(0, Math.min(1, scrollProgress));
    const revealScale = isMounted ? Math.max(0.8, Math.min(1, safeProgress * 1.2)) : 0;
    const revealOpacity = isMounted ? Math.max(0, Math.min(1, safeProgress * 2)) : 0;
    const recoilY = (isMounted && scrollDirection === 'up') ? Math.max(0, (1 - safeProgress) * 50) : 0;
    const recoilScale = (isMounted && scrollDirection === 'up') ? Math.max(0.95, 1 - (1 - scrollProgress) * 0.05) : 1;

    return (
        <section
            ref={sectionRef}
            id="precios"
            className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
        >
            <div
                ref={containerRef}
                className="relative z-10 w-[95%] max-w-6xl h-[85vh] md:h-[75vh] rounded-[40px] border border-white/20 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: 'inset 0 0 60px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.6)',
                    opacity: revealOpacity,
                    transform: `scale(${revealScale * recoilScale}) translateY(${recoilY}px)`,
                }}
            >
                <div className="absolute inset-[2px] rounded-[38px] border border-white/5 pointer-events-none" />

                {/* Mouse glow */}
                <div
                    className="absolute inset-0 rounded-[40px] pointer-events-none opacity-30 overflow-hidden"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x - (containerRef.current?.offsetLeft || 0)}px ${mousePos.y - (containerRef.current?.offsetTop || 0)}px, rgba(0, 243, 255, 0.2) 0%, transparent 40%)`
                    }}
                />

                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                        Inversión Anual ·  Pagos flexibles
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <AntigravityText
                            text="Construye sin Límites"
                            className="inline-block"
                            letterClassName="text-white"
                        />
                    </h2>
                    <p className="text-white/50 text-sm md:text-base max-w-md mx-auto font-medium leading-relaxed">
                        Primer mes:{' '}
                        <span className="text-white/80 font-bold">30–40% del total.</span>{' '}
                        El saldo restante, mensual.
                    </p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-3 gap-6 w-full px-10 perspective-[2000px]">
                    {plans.map((plan, idx) => (
                        <PricingCard
                            key={idx}
                            plan={plan}
                            mousePos={mousePos}
                            sectionRef={sectionRef}
                        />
                    ))}
                </div>

                {/* Mobile Slider */}
                <div className="flex md:hidden flex-col items-center w-full px-4 relative h-[50vh]">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`absolute transition-all duration-500 ease-out transform ${idx === activePlan
                                    ? 'opacity-100 scale-100 z-20 translate-x-0'
                                    : idx < activePlan
                                        ? 'opacity-0 -translate-x-[100%] scale-90 z-10'
                                        : 'opacity-0 translate-x-[100%] scale-90 z-10'
                                    }`}
                            >
                                <MobilePricingCard plan={plan} isShining={isShining && idx === activePlan} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <button
                            onClick={() => setActivePlan(prev => Math.max(0, prev - 1))}
                            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${activePlan === 0 ? 'opacity-30' : ''}`}
                            disabled={activePlan === 0}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex gap-2">
                            {plans.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activePlan ? 'bg-neon-blue w-4' : 'bg-white/20 w-1.5'}`} />
                            ))}
                        </div>
                        <button
                            onClick={() => setActivePlan(prev => Math.min(plans.length - 1, prev + 1))}
                            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${activePlan === plans.length - 1 ? 'opacity-30' : ''}`}
                            disabled={activePlan === plans.length - 1}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(16px);
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.25);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                }
                .payment-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 10px;
                }
            `}</style>
        </section>
    );
};

const PricingCard: React.FC<{
    plan: PricingPlan,
    mousePos: { x: number, y: number },
    sectionRef: React.RefObject<HTMLElement | null>
}> = ({ plan, mousePos, sectionRef }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!cardRef.current || !sectionRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(mousePos.x + sectionRect.left - centerX, 2) + Math.pow(mousePos.y + sectionRect.top - centerY, 2));
        if (distance < 400) {
            const relX = (mousePos.x + sectionRect.left - centerX) / (rect.width / 2);
            const relY = (mousePos.y + sectionRect.top - centerY) / (rect.height / 2);
            setTilt({ x: relY * -10, y: relX * 10 });
        } else {
            setTilt({ x: 0, y: 0 });
        }
    }, [mousePos]);

    return (
        <div
            ref={cardRef}
            className="relative p-6 rounded-3xl glass-card flex flex-col cursor-default"
            style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                borderColor: plan.isPopular ? plan.accent : 'rgba(255, 255, 255, 0.12)',
                boxShadow: plan.isPopular ? `0 20px 60px ${plan.accent}` : '0 10px 40px rgba(0,0,0,0.3)',
            }}
        >
            {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon-blue text-black text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.5)] z-30 whitespace-nowrap">
                    ⚡ Más Contratado
                </div>
            )}

            {/* Tag */}
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: plan.accentRaw }}>
                {plan.tag}
            </span>

            {/* Name */}
            <h3 className="text-lg font-black text-white mb-4 leading-tight">{plan.name}</h3>

            {/* Total Price */}
            <div className="mb-4 pb-4 border-b border-white/10">
                <div className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Inversión anual total</div>
                <div className="text-3xl font-black text-white">{plan.totalPrice} <span className="text-base font-semibold text-white/40">COP</span></div>
            </div>

            {/* Payment Structure */}
            <div className="mb-5 space-y-2">
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Esquema de pago</div>

                <div className="payment-row" style={{ backgroundColor: `${plan.accentRaw}18`, border: `1px solid ${plan.accentRaw}35` }}>
                    <div>
                        <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Primer mes</div>
                        <div className="text-sm font-black" style={{ color: plan.accentRaw }}>{plan.downPayment}</div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ backgroundColor: `${plan.accentRaw}25`, color: plan.accentRaw }}>
                        {plan.downPaymentPct}
                    </div>
                </div>

                <div className="payment-row bg-white/5 border border-white/10">
                    <div>
                        <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Saldo mensual</div>
                        <div className="text-sm font-bold text-white/80">{plan.remainder}</div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/40 bg-white/5 border border-white/10">
                        Restante
                    </div>
                </div>
            </div>

            {/* Features */}
            <ul className="w-full space-y-2.5 mb-6">
                {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-white/70 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: plan.accentRaw, color: plan.accentRaw }} />
                        {feat}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-3 rounded-xl text-sm font-black transition-all duration-300 text-center block"
                style={plan.isPopular ? {
                    background: `linear-gradient(135deg, ${plan.accentRaw}, rgba(0,243,255,0.6))`,
                    color: '#000',
                    boxShadow: `0 0 24px ${plan.accent}`,
                } : {
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                {plan.buttonText}
            </a>
        </div>
    );
};

const MobilePricingCard: React.FC<{ plan: PricingPlan, isShining?: boolean }> = ({ plan, isShining }) => {
    return (
        <div className="w-[310px] p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: plan.accentRaw }}>{plan.tag}</span>
            <h3 className="text-lg font-black text-white mb-3">{plan.name}</h3>

            <div className="mb-4 pb-4 border-b border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total anual</div>
                <div className="text-2xl font-black text-white">{plan.totalPrice} <span className="text-sm text-white/40">COP</span></div>
            </div>

            <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center p-2.5 rounded-xl" style={{ backgroundColor: `${plan.accentRaw}15`, border: `1px solid ${plan.accentRaw}30` }}>
                    <div>
                        <div className="text-[9px] text-white/40 uppercase tracking-wider">Primer mes</div>
                        <div className="text-sm font-black" style={{ color: plan.accentRaw }}>{plan.downPayment}</div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${plan.accentRaw}20`, color: plan.accentRaw }}>{plan.downPaymentPct}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div>
                        <div className="text-[9px] text-white/40 uppercase tracking-wider">Saldo contado</div>
                        <div className="text-sm font-bold text-white/70">{plan.remainder}</div>
                    </div>
                    <span className="text-[9px] text-white/30 px-2 py-0.5 rounded-full bg-white/5">Restante</span>
                </div>
            </div>

            <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: plan.accentRaw }} />
                        {feat}
                    </li>
                ))}
            </ul>

            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl text-sm font-black text-center block transition-all duration-300 ${isShining ? 'animate-button-shine' : ''}`}
                style={plan.isPopular ? {
                    background: `linear-gradient(135deg, ${plan.accentRaw}, rgba(0,243,255,0.6))`,
                    color: '#000',
                } : {
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                {plan.buttonText}
            </a>
            <style>{`
                @keyframes button-shine {
                    0% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
                    50% { box-shadow: 0 0 30px white; filter: brightness(1.8); }
                    100% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
                }
                .animate-button-shine { animation: button-shine 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export default PricingSection;
