import React, { useEffect, useState, useRef } from 'react';

/* ICONS */
const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const MobileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="5" y="2" width="14" height="20" rx="2" />
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

/* DATA */
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
    const rafId = useRef<number | null>(null);

    /* ---------- LINE ---------- */
    const updateLine = () => {
        if (!containerRef.current) return;
        const c1 = cardRefs.current['card1'];
        const c2 = cardRefs.current['card2'];
        const c3 = cardRefs.current['card3'];
        const containerRect = containerRef.current.getBoundingClientRect();
        const mobile = window.innerWidth < 768;

        if (c1 && c2 && c3) {
            const center = (el: HTMLElement) => {
                const r = el.getBoundingClientRect();
                return {
                    x: r.left + r.width / 2 - containerRect.left,
                    y: r.top + r.height / 2 - containerRect.top
                };
            };

            const p1 = center(c1);
            const p2 = center(c2);
            const p3 = center(c3);

            const path = mobile
                ? `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 100}, ${p2.x} ${p2.y - 100}, ${p2.x} ${p2.y}
           C ${p2.x} ${p2.y + 100}, ${p3.x} ${p3.y - 100}, ${p3.x} ${p3.y}`
                : `M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

            setLinePath(path);
            setIsLineVisible(true);
        }
    };

    /* ---------- SCROLL RAF ---------- */
    const handleScrollRaw = () => {
        if (!containerRef.current) return;

        const y = window.scrollY;
        const delta = Math.abs(y - lastScrollY.current);
        velocity.current = Math.min(delta / 50, 1.5);

        const dir = y > lastScrollY.current ? 'down' : 'up';
        lastScrollY.current = y;

        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
        const p = Math.max(0, Math.min(1, progress));

        setScrollDirection(dir);
        setScrollProgress(p);

        if (p < 0.33) setActiveIndex(0);
        else if (p < 0.66) setActiveIndex(1);
        else setActiveIndex(2);

        if (!isMobile) updateLine();

        if (!isMoving) setIsMoving(true);

        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => {
            velocity.current = 0;
            setIsMoving(false);
        }, 140);
    };

    const handleScroll = () => {
        if (rafId.current) return;
        rafId.current = requestAnimationFrame(() => {
            handleScrollRaw();
            rafId.current = null;
        });
    };

    /* ---------- EFFECTS ---------- */
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 768) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePosition({ x, y });
        };

        const t1 = setTimeout(() => setVisibleCards(v => [...v, 'card1']), 300);
        const t2 = setTimeout(() => setVisibleCards(v => [...v, 'card2']), 900);
        const t3 = setTimeout(() => {
            setVisibleCards(v => [...v, 'card3']);
            setTimeout(updateLine, 400);
        }, 1500);

        checkMobile();
        setIsMounted(true);
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', () => {
            checkMobile();
            updateLine();
        });

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMobile]);

    const time = isMounted ? Date.now() : 0;

    /* ---------- RENDER ---------- */
    return (
        <div ref={containerRef} className="relative w-full max-w-6xl h-[1600px] md:h-[850px] mx-auto perspective-[1600px] px-4 md:px-0">

            {/* SVG LINE */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path
                    d={linePath}
                    className={`fill-none stroke-blue-400 stroke-2 md:stroke-3 transition-all duration-1000 ${isLineVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        strokeDasharray: 2000,
                        strokeDashoffset: isLineVisible ? 0 : 2000,
                        filter: 'drop-shadow(0 0 8px #60a5fa)'
                    }}
                />
            </svg>

            {/* CARDS */}
            {cards.map((card, index) => {
                const isDown = scrollDirection === 'down';
                const spreadFactor = index === 0 ? -1 : index === 2 ? 1 : 0;
                const isActive = index === activeIndex;

                const focusScale = isActive ? 1.05 : 1;
                const dynamicYRotate = isMobile ? (isDown ? 5 : -5) : (isDown ? 15 : -5);

                const mouseRX = isActive ? -mousePosition.y * 10 : 0;
                const mouseRY = isActive ? mousePosition.x * 10 : 0;

                const z = (scrollProgress - 0.5) * (isMobile ? 100 : 200);
                const scale = (1 + (scrollProgress - 0.5) * 0.1) * focusScale;

                const pcBase = index === 0 ? -400 : index === 2 ? 400 : 0;
                const spreadX = isMobile ? 0 : (scrollProgress - 0.5) * 60 * spreadFactor;
                const totalX = isMobile ? 0 : pcBase + spreadX;

                const spreadY = isMobile
                    ? (scrollProgress - 0.5) * 40 * (index - 1)
                    : (scrollProgress - 0.5) * 60;

                return (
                    <div
                        key={card.id}
                        ref={el => { cardRefs.current[card.id] = el; }}
                        className={`absolute p-8 md:p-10 w-[280px] sm:w-[320px] md:w-[380px] rounded-[32px] bg-[#0b1220] border border-white/10 transition-all duration-700 transform-gpu ${card.pos} ${card.rotate} ${visibleCards.includes(card.id) ? 'opacity-100' : 'opacity-0 translate-y-20 scale-95'}`}
                        style={{
                            boxShadow: isActive
                                ? '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(96,165,250,0.4)'
                                : '0 40px 120px rgba(0,0,0,0.8)',
                            transformStyle: 'preserve-3d',
                            willChange: 'transform',
                            transform: visibleCards.includes(card.id)
                                ? `translate3d(calc(-50% + ${totalX}px), ${spreadY}px, ${z}px) scale(${scale}) rotateX(${mouseRX}deg) rotateY(${dynamicYRotate + mouseRY}deg)`
                                : 'translateX(-50%)'
                        }}
                    >
                        <div className={`absolute inset-0 bg-linear-to-br ${card.accent} to-transparent opacity-10 rounded-[32px]`} />

                        <div className="absolute top-10 right-10 text-[11px] font-black tracking-[0.3em] uppercase text-blue-400/80">
                            {card.tag}
                        </div>

                        <div className="w-14 h-14 md:w-16 md:h-16 mb-8 text-white">
                            {card.icon}
                        </div>

                        <h3 className="font-black mb-6 tracking-tight leading-none uppercase text-white text-3xl md:text-4xl">
                            {card.id === 'card2'
                                ? card.title
                                : card.title.split(' ').map((w, i) => (
                                    <React.Fragment key={i}>{w}<br /></React.Fragment>
                                ))}
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-[90%]">
                            {card.desc}
                        </p>

                        <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${isActive ? 'bg-blue-500/40' : 'bg-white/5'}`} />
                    </div>
                );
            })}
        </div>
    );
};

export default ConnectedCards;
