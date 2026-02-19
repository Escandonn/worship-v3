import React, { useState, useEffect, useRef } from 'react';
import AntigravityText from './AntigravityText';
import adanImg from '../assets/adan.png';
import godImg from '../assets/Dios.png';
const icons = [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
];

const HandsCarousel: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [showHands, setShowHands] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const lastScrollY = useRef(0);

    useEffect(() => {
        let animationFrameId: number;
        const tick = () => {
            setOffset((prev) => prev + 0.005);
            animationFrameId = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
            lastScrollY.current = currentScrollY;
            setScrollDirection(direction);

            const rect = containerRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // Calculate progress: 0 when top is at bottom of viewport, 1 when bottom is at top of viewport
            const progress = 1 - (rect.top + rect.height) / (viewHeight + rect.height);
            setScrollProgress(Math.max(0, Math.min(1, progress)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setTilt({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowHands(true);
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const renderIcons = () => {
        if (!carouselRef.current) return null;
        const gap = 120; // Increased gap for larger icons

        return icons.map((src, i) => {
            const pos = (i + offset) % icons.length;
            const y = (pos - icons.length / 2) * gap;
            const dist = Math.abs(y);

            const scale = 1 - Math.min(dist / 600, 0.6);
            const opacity = 1 - Math.min(dist / 500, 0.8);

            return (
                <div
                    key={i}
                    className="absolute w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-all duration-300 ease-out before:content-[''] before:absolute before:-inset-2 before:rounded-3xl before:bg-[radial-gradient(circle,rgba(57,255,20,0.2),transparent_70%)] before:opacity-50 before:-z-10"
                    style={{
                        transform: `translateY(${y}px) scale(${scale}) rotateX(${y / 8}deg)`,
                        opacity: opacity,
                        zIndex: Math.floor(100 - dist),
                    }}
                >
                    <img src={src} alt="tech icon" className="w-[80%] h-[80%] object-contain pointer-events-none" />
                </div>
            );
        });
    };

    return (
        <div ref={containerRef} className="relative w-full h-[30vh] md:h-[50vh] flex flex-col items-center justify-center pointer-events-none overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 md:top-8 w-full text-center z-20 px-4">
                <h2 className="text-xl md:text-3xl font-bold tracking-tighter text-white/90 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                    Usamos las últimas <span className="text-[#39FF14]">tecnologías</span>
                </h2>
            </div>

            {/* Hand Left (Adán) */}
            <img
                src={adanImg.src}
                alt="Mano de Adán"
                className={`absolute left-[-5vw] top-[100%] -translate-y-1/2 h-[20vh] md:h-[55vh] max-h-[400px] md:max-h-none w-auto pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out ${showHands ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}
                style={{
                    transform: showHands
                        ? `translateY(calc(-50% + ${tilt.y * 0.5 + (scrollProgress - 0.5) * 100}px)) 
                           translateX(${tilt.x * 0.2 + (scrollDirection === 'down' ? -20 : 20)}px)
                           rotate(${scrollDirection === 'down' ? 5 : -5}deg)`
                        : 'translateY(-50%) translateX(-100%)'
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            {/* Hand Right (Dios) */}
            <img
                src={godImg.src}
                alt="Mano de Dios"
                className={`absolute right-[-5vw] top-[100%] -translate-y-1/2 h-[20vh] md:h-[55vh] max-h-[400px] md:max-h-none w-auto pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] scale-x-[-1] transition-all duration-700 ease-out delay-100 ${showHands ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
                style={{
                    transform: showHands
                        ? `translateY(calc(-50% + ${tilt.y * 0.5 + (scrollProgress - 0.5) * -100}px)) 
                           translateX(${-tilt.x * 0.2 + (scrollDirection === 'down' ? 20 : -20)}px) 
                           scaleX(-1) 
                           rotate(${scrollDirection === 'down' ? -5 : 5}deg)`
                        : 'translateY(-50%) translateX(100%) scaleX(-1)'
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            {/* Carousel */}
            <div
                ref={carouselRef}
                className="relative w-32 md:w-48 h-full flex items-center justify-center perspective-[1000px] pointer-events-auto"
                style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
            >
                {renderIcons()}
            </div>
        </div>
    );
};

export default HandsCarousel;
