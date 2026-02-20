import React, { useState, useEffect, useRef } from 'react';
import AntigravityText from './AntigravityText';

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    isPopular?: boolean;
    accent: string;
}

const plans: PricingPlan[] = [
    {
        name: "Starter",
        price: "0",
        period: "mo",
        description: "Para proyectos personales y experimentación.",
        features: ["3 proyectos activos", "Soporte comunitario", "1GB de almacenamiento"],
        buttonText: "Empezar Gratis",
        accent: "rgba(57, 255, 20, 0.4)" // Neon Green
    },
    {
        name: "Pro",
        price: "29",
        period: "mo",
        description: "Potencia tu negocio con herramientas avanzadas.",
        features: ["Proyectos ilimitados", "Soporte prioritario 24/7", "10GB de almacenamiento", "Analytics avanzado"],
        buttonText: "Obtener Pro",
        isPopular: true,
        accent: "rgba(0, 243, 255, 0.4)" // Neon Blue
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Soluciones a medida para grandes organizaciones.",
        features: ["Infraestructura dedicada", "SLA garantizado", "Account Manager", "Seguridad avanzada"],
        buttonText: "Contactar Ventas",
        accent: "rgba(188, 19, 254, 0.4)" // Neon Purple
    }
];

const PricingSection: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [activePlan, setActivePlan] = useState(1); // Default to Pro
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
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        const handleScroll = () => {
            if (!sectionRef.current) return;
            const currentScrollY = window.scrollY;
            setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
            lastScrollY.current = currentScrollY;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // Progress calculation
            const progress = (viewHeight - rect.top) / viewHeight;
            setScrollProgress(progress);
        };

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });

        handleScroll(); // Initialize values on mount

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    // Mobile Intro Sequence
    useEffect(() => {
        if (isIntersecting && !hasPlayedIntro.current && isMounted && typeof window !== 'undefined' && window.innerWidth < 768) {
            hasPlayedIntro.current = true;

            const triggerShine = () => {
                setIsShining(true);
                setTimeout(() => setIsShining(false), 500);
            };

            const sequence = async () => {
                await new Promise(r => setTimeout(r, 800)); // Initial wait

                setActivePlan(2); triggerShine();
                await new Promise(r => setTimeout(r, 700));

                setActivePlan(0); triggerShine();
                await new Promise(r => setTimeout(r, 700));

                setActivePlan(1); triggerShine();
            };

            sequence();
        }
    }, [isIntersecting, isMounted]);

    // Derived animation states
    const isInView = isIntersecting && scrollProgress > 0.1 && scrollProgress < 1.9;

    // Scale and recoil logic (Safe clamping)
    const safeProgress = Math.max(0, Math.min(1, scrollProgress));
    const revealScale = isMounted ? Math.max(0.8, Math.min(1, safeProgress * 1.2)) : 0;
    const revealOpacity = isMounted ? Math.max(0, Math.min(1, safeProgress * 2)) : 0;
    const recoilY = (isMounted && scrollDirection === 'up') ? Math.max(0, (1 - safeProgress) * 50) : 0;
    const recoilScale = (isMounted && scrollDirection === 'up') ? Math.max(0.95, 1 - (1 - scrollProgress) * 0.05) : 1;

    return (
        <section
            ref={sectionRef}
            id="pricing-premium"
            className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
        >
            {/* Background Layer: Removed custom gradient to use Astro's symmetrical background */}

            {/* Depth Particles: Removed to use Astro's standard ParticlesBackground */}

            {/* Main Antigravity Container */}
            <div
                ref={containerRef}
                className="relative z-10 w-[95%] max-w-6xl h-[85vh] md:h-[70vh] rounded-[40px] border border-white/20 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: 'inset 0 0 60px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.6)',
                    opacity: revealOpacity,
                    transform: `scale(${revealScale * recoilScale}) translateY(${recoilY}px)`,
                }}
            >
                {/* Secondary Inner Border / Hexagon Glow */}
                <div className="absolute inset-[2px] rounded-[38px] border border-white/5 pointer-events-none" />

                {/* Internal Glow Follows Mouse */}
                <div
                    className="absolute inset-0 rounded-[40px] pointer-events-none opacity-30 overflow-hidden"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x - (containerRef.current?.offsetLeft || 0)}px ${mousePos.y - (containerRef.current?.offsetTop || 0)}px, rgba(0, 243, 255, 0.2) 0%, transparent 40%)`
                    }}
                />

                {/* Section Title */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <AntigravityText
                            text="Evoluciona tu Negocio"
                            className="inline-block"
                            letterClassName="text-white"
                        />
                    </h2>
                    <p className="text-white/70 text-base md:text-lg max-w-lg mx-auto font-medium drop-shadow-md">
                        Arquitectura robusta para empresas que no aceptan límites.
                    </p>
                </div>

                {/* Desktop Pricing Grid */}
                <div className="hidden md:grid grid-cols-3 gap-8 w-full px-12 perspective-[2000px]">
                    {plans.map((plan, idx) => (
                        <PricingCard
                            key={idx}
                            plan={plan}
                            mousePos={mousePos}
                            sectionRef={sectionRef}
                        />
                    ))}
                </div>

                {/* Mobile Slider View */}
                <div className="flex md:hidden flex-col items-center w-full px-4 relative h-[45vh]">
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

                    {/* Mobile Navigation Capsule */}
                    <div className="mt-8 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <button
                            onClick={() => setActivePlan(prev => Math.max(0, prev - 1))}
                            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${activePlan === 0 ? 'opacity-30' : ''}`}
                            disabled={activePlan === 0}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex gap-2">
                            {plans.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activePlan ? 'bg-neon-blue w-4' : 'bg-white/20'}`} />
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
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(16px);
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                }
            `}</style>
        </section>
    );
};

// Internal Sub-component for 3D Tilt Cards
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

        // Local mouse pos relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Only tilt if mouse is nearby (simple proximity)
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
            className={`relative p-8 rounded-3xl glass-card flex flex-col items-center text-center group cursor-default transition-all duration-500`}
            style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                borderColor: plan.isPopular ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: plan.isPopular ? '0 20px 60px rgba(0, 243, 255, 0.1)' : '0 10px 40px rgba(0,0,0,0.3)',
                background: 'rgba(255, 255, 255, 0.05)'
            }}
        >
            {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon-blue text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.5)] z-30">
                    Más Popular
                </div>
            )}

            <h3 className="text-xl font-black mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">{plan.name}</h3>
            <div className="flex items-baseline mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                <span className="text-4xl font-black text-white">{plan.price !== 'Custom' ? '$' : ''}{plan.price}</span>
                {plan.period && <span className="text-white/60 font-bold ml-1">/{plan.period}</span>}
            </div>

            <p className="text-sm text-white/80 mb-8 min-h-[40px] leading-relaxed drop-shadow-sm font-medium">
                {plan.description}
            </p>

            <ul className="w-full text-left space-y-3.5 mb-10 block">
                {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white font-medium drop-shadow-sm">
                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: plan.accent, color: plan.accent }} />
                        {feat}
                    </li>
                ))}
            </ul>

            <button
                className={`mt-auto w-full py-3.5 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group/btn ${plan.isPopular
                    ? 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'
                    : 'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
            >
                {plan.buttonText}
            </button>
        </div>
    );
};

const MobilePricingCard: React.FC<{ plan: PricingPlan, isShining?: boolean }> = ({ plan, isShining }) => {
    return (
        <div className="w-[300px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
                <span className="text-4xl font-black text-white">{plan.price !== 'Custom' ? '$' : ''}{plan.price}</span>
                {plan.period && <span className="text-white/40 ml-1">/{plan.period}</span>}
            </div>
            <p className="text-xs text-white/50 mb-6">{plan.description}</p>
            <ul className="w-full text-left space-y-3 mb-8">
                {plan.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: plan.accent }} />
                        {feat}
                    </li>
                ))}
            </ul>
            <button
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${plan.isPopular ? 'bg-neon-blue text-black' : 'bg-white/10 text-white border border-white/10'
                    } ${isShining ? 'animate-button-shine' : ''}`}
            >
                {plan.buttonText}
            </button>
            <style>{`
                @keyframes button-shine {
                    0% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
                    50% { box-shadow: 0 0 30px white; filter: brightness(1.8); }
                    100% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
                }
                .animate-button-shine {
                    animation: button-shine 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PricingSection;
