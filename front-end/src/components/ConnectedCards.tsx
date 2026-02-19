import React, { useEffect, useState, useRef } from 'react';

const cards = [
    {
        id: 'card1',
        tag: 'SOLUTIONS',
        icon: '🌐',
        title: 'Ecosistema Web',
        desc: 'Desarrollamos plataformas escalables de alto rendimiento con arquitecturas modernas, garantizando una presencia digital robusta y segura para tu negocio.',
        pos: 'left-1/2 top-[5%] md:top-[10%]',
        rotate: 'md:rotate-y-[-18deg] md:rotate-x-[6deg]',
        accent: 'from-blue-500/20'
    },
    {
        id: 'card2',
        tag: 'ENGINEERING',
        icon: '📱',
        title: 'Arquitectura Mobile',
        desc: 'Diseñamos experiencias nativas y multiplataforma que rompen los límites de lo convencional, priorizando la fluidez y la retención de usuarios en cada interacción.',
        pos: 'left-1/2 top-[35%] md:top-[45%]',
        rotate: 'md:rotate-y-[-10deg] md:rotate-x-[4deg]',
        accent: 'from-purple-500/20'
    },
    {
        id: 'card3',
        tag: 'SYSTEMS',
        icon: '⚙️',
        title: 'Core Empresarial',
        desc: 'Optimizamos la infraestructura crítica de tu empresa con soluciones de software personalizadas que integran procesos y potencian la eficiencia operativa.',
        pos: 'left-1/2 top-[65%] md:top-[15%]',
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

    return (
        <div ref={containerRef} className="relative w-full max-w-6xl h-[1200px] md:h-[700px] mx-auto perspective-[1600px] px-4 md:px-0">
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
                        className={`absolute p-8 md:p-10 w-[280px] sm:w-[320px] md:w-[380px] rounded-[30px] bg-linear-to-b from-[#0b1220] via-[#0b1220] to-[#0f172a] border transition-all duration-700 ease-out transform-gpu overflow-hidden ${card.pos} ${card.rotate} ${visibleCards.includes(card.id) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
                        style={{
                            borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                            boxShadow: `0 30px 100px rgba(0,0,0,0.6), 0 0 40px ${focusGlow}`,
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
                        <div className={`absolute inset-0 bg-linear-to-br ${card.accent} to-transparent opacity-10 rounded-[30px] pointer-events-none`} />

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
                        <div className={`absolute top-8 right-8 text-[10px] font-bold tracking-[0.2em] uppercase transform translate-z-[30px] transition-all duration-500 ${isMoving ? (isActive ? 'text-white/60' : 'text-white/20') : 'text-white/60'}`}>
                            {card.tag}
                        </div>

                        {/* Edge Glow (Brushed Look) */}
                        <div className="absolute -inset-px rounded-inherit bg-linear-to-br from-white/10 via-transparent to-white/5 blur-[1px] -z-10" />

                        <div className={`text-4xl md:text-5xl mb-6 transform translate-z-[80px] drop-shadow-2xl transition-all duration-500 ${isMoving ? (isActive ? 'grayscale-0 scale-110' : 'grayscale-[0.8] opacity-60') : 'grayscale-0 opacity-100 scale-100'}`}>{card.icon}</div>

                        <h3 className={`text-white text-xl md:text-2xl font-bold mb-4 transform translate-z-[60px] tracking-tight leading-tight transition-all duration-500 ${isMoving ? (isActive ? 'opacity-100' : 'opacity-70') : 'opacity-100'}`}>
                            {card.title}
                        </h3>

                        <p className={`text-gray-400 text-xs md:text-sm lg:text-base leading-relaxed transform translate-z-[40px] font-light transition-all duration-500 ${isMoving ? (isActive ? 'opacity-100' : 'opacity-50') : 'opacity-100'}`}>
                            {card.desc}
                        </p>

                        {/* Bottom Line Accent */}
                        <div className={`absolute bottom-0 left-10 right-10 h-px transition-all duration-700 ${isActive ? 'bg-linear-to-r from-transparent via-white/40 to-transparent scale-x-110' : 'bg-linear-to-r from-transparent via-white/10 to-transparent opacity-50'}`} />
                    </div>
                );
            })}
        </div>
    );
};

export default ConnectedCards;
