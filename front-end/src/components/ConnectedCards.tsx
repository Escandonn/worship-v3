import React, { useEffect, useState, useRef } from 'react';

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const MobileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
);

const LayersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

const cards = [
    {
        id: 'card1',
        tag: 'SOLUTIONS',
        icon: <GlobeIcon />,
        title: 'Ecosistema Web',
        desc: 'Desarrollamos plataformas escalables de alto rendimiento con arquitecturas modernas, garantizando una presencia digital robusta y segura para tu negocio.',
        pos: 'left-1/2 top-[2%] md:top-[10%]',
        rotate: 'md:rotate-y-[-18deg] md:rotate-x-[6deg]',
        accent: 'from-blue-500/20'
    },
    {
        id: 'card2',
        tag: 'ENGINEERING',
        icon: <MobileIcon />,
        title: 'Arquitectura Mobile',
        desc: 'Diseñamos experiencias nativas y multiplataforma que rompen los límites de lo convencional, priorizando la fluidez y la retención de usuarios en cada interacción.',
        pos: 'left-1/2 top-[32%] md:top-[45%]',
        rotate: 'md:rotate-y-[-10deg] md:rotate-x-[4deg]',
        accent: 'from-purple-500/20'
    },
    {
        id: 'card3',
        tag: 'SYSTEMS',
        icon: <LayersIcon />,
        title: 'Core Empresarial',
        desc: 'Optimizamos la infraestructura crítica de tu empresa con soluciones de software personalizadas que integran procesos y potencian la eficiencia operativa.',
        pos: 'left-1/2 top-[62%] md:top-[15%]',
        rotate: 'md:rotate-y-[14deg] md:rotate-x-[6deg]',
        accent: 'from-neon-green/20'
    },
];

const ConnectedCards: React.FC = () => {
    const [visibleCards, setVisibleCards] = useState<string[]>([]);
    const [linePath, setLinePath] = useState('');
    const [isLineVisible, setIsLineVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [isMobile, setIsMobile] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const lastScrollY = useRef(0);
    const velocity = useRef(0);
    const scrollTimer = useRef<any>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 768) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePosition({ x, y });

            setIsMoving(true);
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
            scrollTimer.current = setTimeout(() => setIsMoving(false), 1000);
        };

        // Sequential appearance
        const timeouts = [
            setTimeout(() => setVisibleCards(prev => [...prev, 'card1']), 300),
            setTimeout(() => setVisibleCards(prev => [...prev, 'card2']), 900),
            setTimeout(() => {
                setVisibleCards(prev => [...prev, 'card3']);
                setTimeout(() => updateLine(), 400);
            }, 1500),
        ];

        const updateLine = () => {
            if (!containerRef.current) return;
            const c1 = cardRefs.current['card1'];
            const c2 = cardRefs.current['card2'];
            const c3 = cardRefs.current['card3'];
            const containerRect = containerRef.current.getBoundingClientRect();
            const mobile = window.innerWidth < 768;

            if (c1 && c2 && c3) {
                const getCenter = (el: HTMLElement) => {
                    const r = el.getBoundingClientRect();
                    return {
                        x: r.left + r.width / 2 - containerRect.left,
                        y: r.top + r.height / 2 - containerRect.top
                    };
                };

                const p1 = getCenter(c1);
                const p2 = getCenter(c2);
                const p3 = getCenter(c3);

                if (mobile) {
                    setLinePath(`M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 100}, ${p2.x} ${p2.y - 100}, ${p2.x} ${p2.y} C ${p2.x} ${p2.y + 100}, ${p3.x} ${p3.y - 100}, ${p3.x} ${p3.y}`);
                } else {
                    setLinePath(`M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`);
                }
                setIsLineVisible(true);
            }
        };

        const handleScroll = () => {
            if (!containerRef.current) return;

            setIsMoving(true);
            const currentScrollY = window.scrollY;
            const delta = Math.abs(currentScrollY - lastScrollY.current);
            velocity.current = Math.min(delta / 50, 1.5); // Cap velocity

            const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
            lastScrollY.current = currentScrollY;
            setScrollDirection(direction);

            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const progress = 1 - (rect.top + rect.height) / (viewHeight + rect.height);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            setScrollProgress(clampedProgress);

            // Calculate active index (0 to 1 split into 3 zones)
            if (clampedProgress < 0.33) setActiveIndex(0);
            else if (clampedProgress < 0.66) setActiveIndex(1);
            else setActiveIndex(2);

            updateLine();

            // Clear velocity after scroll stop
            if (scrollTimer.current) clearTimeout(scrollTimer.current as any);
            scrollTimer.current = setTimeout(() => {
                velocity.current = 0;
                setIsMoving(false);
            }, 150) as any;
        };

        checkMobile();
        setIsMounted(true);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', () => {
            checkMobile();
            updateLine();
        });
        handleScroll();

        return () => {
            timeouts.forEach(clearTimeout);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', updateLine);
            if (scrollTimer.current) clearTimeout(scrollTimer.current as any);
        };
    }, []);

    const currentTimeForWave = isMounted ? Date.now() : 0;

    return (
        <div id="productos" ref={containerRef} className="relative w-full max-w-6xl h-[1600px] md:h-[850px] mx-auto perspective-[1600px] px-4 md:px-0">
            {/* SVG Connection Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <path
                    d={linePath}
                    className={`fill-none stroke-blue-400 stroke-2 md:stroke-3 stroke-linecap-round transition-all duration-1000 ease-in-out ${isLineVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        filter: 'drop-shadow(0 0 8px #60a5fa) drop-shadow(0 0 16px #60a5fa)',
                        strokeDasharray: 2000,
                        strokeDashoffset: isLineVisible ? 0 : 2000,
                    }}
                />

                {/* Energy Pulse Path */}
                {isLineVisible && (
                    <path
                        d={linePath}
                        className="fill-none stroke-white/40 stroke-2 md:stroke-3 stroke-linecap-round"
                        style={{
                            strokeDasharray: '50, 150',
                            animation: 'pulse-flow 4s linear infinite',
                            filter: 'blur(2px) drop-shadow(0 0 10px #fff)',
                        }}
                    />
                )}

                {isLineVisible && (
                    <circle r="6" fill="#a5b4fc" style={{ filter: 'url(#glow-line)' }}>
                        <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                            <mpath href="#path-anim" />
                        </animateMotion>
                    </circle>
                )}
                {/* Hidden path for animation motion since href needs an ID */}
                <path id="path-anim" d={linePath} fill="none" pointerEvents="none" />
            </svg>

            <style>{`
                @keyframes pulse-flow {
                    from { stroke-dashoffset: 2000; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes shimmer-move {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    100% { transform: translateX(150%) skewX(-20deg); }
                }
            `}</style>

            {/* Cards */}
            {cards.map((card, index) => {
                const isDown = scrollDirection === 'down';
                const spreadFactor = index === 0 ? -1 : index === 2 ? 1 : 0;

                // Focus Logic
                const isActive = index === activeIndex;
                const focusScale = isActive ? 1.05 : 1;
                const focusGlow = isActive ? 'rgba(96, 165, 250, 0.4)' : 'transparent';

                // Premium Effects
                const dynamicYRotate = isMobile ? (isDown ? 5 : -5) : (isDown ? 15 : -5);
                const mouseRotateX = isActive ? -mousePosition.y * 10 : 0;
                const mouseRotateY = isActive ? mousePosition.x * 10 : 0;

                const dynamicZ = (scrollProgress - 0.5) * (isMobile ? 100 : 200);
                const dynamicScale = (1 + (scrollProgress - 0.5) * 0.1) * focusScale;

                // Horizontal spread logic
                const pcBaseOffset = index === 0 ? -400 : index === 2 ? 400 : 0;
                const spreadX = isMobile ? 0 : (scrollProgress - 0.5) * 60 * spreadFactor;
                const totalX = isMobile ? 0 : pcBaseOffset + spreadX;

                const spreadY = isMobile ? (scrollProgress - 0.5) * 40 * (index - 1) : (scrollProgress - 0.5) * 60;

                // Aberration / Velocity effects
                const blurAmount = velocity.current * 4;
                const grayscaleAmount = isMoving ? (isActive ? 0 : velocity.current * 0.5 + 0.3) : 0;

                return (
                    <div
                        key={card.id}
                        ref={(el) => { cardRefs.current[card.id] = el; }}
                        className={`absolute p-8 md:p-10 w-[280px] sm:w-[320px] md:w-[380px] rounded-[32px] bg-linear-to-b from-[#0b1220] via-[#0b1220] to-[#040812] border border-white/10 transition-all duration-700 ease-out transform-gpu overflow-hidden ${card.pos} ${card.rotate} ${visibleCards.includes(card.id) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
                        style={{
                            boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 60px ${focusGlow}`,
                            filter: `blur(${blurAmount}px) grayscale(${grayscaleAmount})`,
                            opacity: visibleCards.includes(card.id) ? (isMoving ? (isActive ? 1 : 0.7) : 1) : 0,
                            transformStyle: 'preserve-3d',
                            transform: visibleCards.includes(card.id)
                                ? `translateX(calc(-50% + ${totalX}px))
                                   translateY(${spreadY}px) 
                                   translateZ(${dynamicZ}px) 
                                   scale(${dynamicScale})
                                   rotateX(${mouseRotateX}deg)
                                   rotateY(${dynamicYRotate + mouseRotateY}deg)`
                                : 'translateX(-50%)'
                        }}
                    >
                        {/* Interior Gradient Glow */}
                        <div className={`absolute inset-0 bg-linear-to-br ${card.accent} to-transparent opacity-10 rounded-[32px] pointer-events-none`} />

                        {/* Holographic Shimmer Effect */}
                        <div
                            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                                transform: 'translateX(-150%) skewX(-20deg)',
                                animation: isActive ? 'shimmer-move 3s linear infinite' : 'none',
                                opacity: isActive ? 1 : 0
                            }}
                        />

                        {/* Card Tag */}
                        <div className={`absolute top-10 right-10 text-[11px] font-black tracking-[0.3em] uppercase transform translate-z-[30px] transition-all duration-500 ${isMoving ? (isActive ? 'text-blue-400' : 'text-white/20') : 'text-blue-400/80'}`}>
                            {card.tag}
                        </div>

                        {/* Edge Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

                        {/* Icon Container */}
                        <div className={`w-14 h-14 md:w-16 md:h-16 mb-8 transform translate-z-[90px] transition-all duration-500 ${isMoving ? (isActive ? 'text-white scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/30 grayscale opacity-60') : 'text-white opacity-100 grayscale-0 scale-100'}`}>
                            {card.icon}
                        </div>

                        <h3
                            className={`
                                    font-black mb-6 transform translate-z-[70px] tracking-tighter leading-none 
                                    transition-all duration-500 uppercase bg-linear-to-br 
                                    from-white via-white to-white/40 bg-clip-text text-transparent
                                    ${card.id === 'card2' && isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'}
                                    ${isMoving ? (isActive ? 'opacity-100' : 'opacity-60') : 'opacity-100'}
                                `}
                        ></h3>

                        <p className={`text-gray-400 text-sm md:text-base leading-relaxed transform translate-z-[40px] font-normal transition-all duration-500 max-w-[90%] ${isMoving ? (isActive ? 'opacity-100' : 'opacity-40') : 'opacity-100'}`}>
                            {card.desc}
                        </p>

                        {/* Bottom Line Accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-700 ${isActive ? 'bg-linear-to-r from-transparent via-blue-500/40 to-transparent scale-x-100' : 'bg-linear-to-r from-transparent via-white/5 to-transparent'}`} />
                    </div>
                );
            })}

            {/* SoundWave Visual Effect */}
            <div className="absolute bottom-4 md:bottom-2 left-0 right-0 h-40 pointer-events-none z-10 overflow-hidden">
                <svg className="w-full h-full preserve-3d" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Core "Auditory" Wave */}
                    <path
                        className={`transition-colors duration-1000 ${scrollDirection === 'up' ? 'text-cyan-400' : 'text-[#FFD700]'}`}
                        fill="none"
                        stroke="url(#wave-gradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{
                            filter: `drop-shadow(0 0 20px ${scrollDirection === 'up' ? '#22d3ee' : '#FFD700'})`,
                            opacity: isMoving ? 0.9 : 0.4,
                        }}
                        d={Array.from({ length: 151 }).map((_, i) => {
                            const x = i * 8;
                            // High frequency loop + base jitter
                            const baseFreq = 0.05 + (velocity.current * 0.1);
                            const noise = Math.sin(i * 0.5 + currentTimeForWave * 0.01) * 5; // Jittery loop
                            const amplitude = (isMoving ? 40 : 15) + (velocity.current * 50);
                            const phase = scrollProgress * 15 + (currentTimeForWave * 0.004);
                            const y = 60 + Math.sin(i * baseFreq + phase) * amplitude + noise;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                    />

                    {/* Secondary High-Frequency Analyzer Wave */}
                    <path
                        className={`transition-colors duration-1000 ${scrollDirection === 'up' ? 'text-cyan-500/40' : 'text-[#FFD700]/40'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        style={{
                            opacity: isMoving ? 0.6 : 0.2,
                        }}
                        d={Array.from({ length: 151 }).map((_, i) => {
                            const x = i * 8;
                            const frequency = 0.1 + (velocity.current * 0.2); // Extremely high for analyzer look
                            const amplitude = (isMoving ? 15 : 5) + (velocity.current * 20);
                            const phase = -scrollProgress * 12 + (currentTimeForWave * 0.008);
                            const y = 60 + Math.cos(i * frequency + phase) * amplitude * Math.sin(i * 0.1);
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                    />
                </svg>
            </div>
        </div>
    );
};

export default ConnectedCards;
