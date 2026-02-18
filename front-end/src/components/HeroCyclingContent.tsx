import React, { useState, useEffect } from 'react';
import AntigravityText from './AntigravityText';

const themes = [
    { title: ".solutions", sub: "Desarrollo moderno y escalable", color: "text-neon-green", border: "border-neon-green/10", shadow: "shadow-[0_0_40px_rgba(57,255,20,0.1)]", triangle: "border-b-neon-green", glow: "drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]" },
    { title: ".design", sub: "Interfaces que rompen la gravedad", color: "text-neon-blue", border: "border-neon-blue/10", shadow: "shadow-[0_0_40px_rgba(0,243,255,0.1)]", triangle: "border-b-neon-blue", glow: "drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]" },
    { title: ".future", sub: "Soluciones web de alto impacto", color: "text-neon-purple", border: "border-neon-purple/10", shadow: "shadow-[0_0_40px_rgba(188,19,254,0.1)]", triangle: "border-b-neon-purple", glow: "drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]" },
    { title: ".digital", sub: "Tu visión llevada al código", color: "text-neon-pink", border: "border-neon-pink/10", shadow: "shadow-[0_0_40px_rgba(255,0,224,0.1)]", triangle: "border-b-neon-pink", glow: "drop-shadow-[0_0_15px_rgba(255,0,224,0.4)]" }
];

const HeroCyclingContent = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % themes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const theme = themes[index];

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] w-full max-w-5xl mx-auto -translate-y-12 md:-translate-y-20 transition-all duration-1000">
            {/* Logo Triángulo con Círculo y Glow Dinámico */}
            <div
                className={`w-24 h-24 rounded-full bg-white/5 border ${theme.border} flex items-center justify-center mb-16 ${theme.shadow} animate-logo backdrop-blur-sm transition-all duration-1000`}
            >
                <div
                    className={`w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] ${theme.triangle} ${theme.glow} transition-all duration-1000`}
                >
                </div>
            </div>

            <div className="relative w-full flex items-center justify-center">
                {/* Left side: static "worship" anchored to the right */}
                <div className="flex-1 flex justify-end">
                    <span className="text-[38px] sm:text-[64px] md:text-[84px] font-bold text-white tracking-tight leading-none">
                        worship
                    </span>
                </div>

                {/* Junction point / Minimal gap */}
                <div className="w-0 md:w-3"></div>

                {/* Right side: dynamic suffix anchored to the left */}
                <div className="flex-1 flex justify-start">
                    <AntigravityText
                        key={`title-${index}`}
                        tag="h1"
                        text={theme.title}
                        className="text-[38px] sm:text-[64px] md:text-[84px] font-bold tracking-tight leading-none"
                        letterClassName={`${theme.color} font-bold`}
                        delayStart={0.3}
                    />
                </div>
            </div>

            <AntigravityText
                key={`sub-${index}`}
                tag="p"
                text={theme.sub}
                className="text-xl md:text-2xl text-white/50 mt-8"
                delayStart={1.5}
            />
        </div>
    );
};

export default HeroCyclingContent;
