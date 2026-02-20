import React, { useEffect, useState, useRef } from 'react';

const TriangleMotionLogo: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // Calculate progress: 0 when top is at bottom of viewport, 1 when bottom is at top
            const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
            setScrollProgress(Math.max(0, Math.min(1, progress)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isMounted) return null;

    // Define transitions within the 0-1 progress
    const introEnd = 0.35;
    const pressureStart = 0.45;
    const pressureEnd = 0.75;
    const restoreStart = 0.85;

    // Logic for State 1: Intro (0 to introEnd)
    const introProgress = Math.min(1, scrollProgress / introEnd);
    const triangleYIntro = (1 - introProgress) * 200; // Come from below
    const textOpacityIntro = Math.max(0, (introProgress - 0.5) * 2);
    const textYIntro = (1 - introProgress) * 20;

    // Logic for State 2 & 3: Pressure & Restoration
    // We want the triangle to "press" between pressureStart and pressureEnd
    let triangleYPressure = 0;
    let letterDeform = 0;
    let opacityRestore = 1;

    if (scrollProgress > pressureStart && scrollProgress <= pressureEnd) {
        const p = (scrollProgress - pressureStart) / (pressureEnd - pressureStart);
        // Sinusoidal pressure or linear
        triangleYPressure = p * 60; // Desceds 60px
        letterDeform = p * 15; // Letters sink 15px
    } else if (scrollProgress > pressureEnd) {
        // Restoration or just stay buried? User said State 3 is "retroceder scroll" (scroll up)
        // In scroll-based animation, "ascending" happens when scrollProgress decreases.
        // So we just stick to the mapping.
        triangleYPressure = 60;
        letterDeform = 15;
    }

    const logoText = "worship.solutions";
    const letters = logoText.split("");

    return (
        <div ref={sectionRef} className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
            {/* Triangle Container */}
            <div
                className="relative z-20 transition-transform duration-100 ease-out"
                style={{
                    transform: `translateY(${triangleYIntro + triangleYPressure}px)`,
                }}
            >
                <svg width="80" height="70" viewBox="0 0 80 70" fill="none" className="drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                    <path
                        d="M40 5L75 65H5L40 5Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="2"
                    />
                </svg>

                {/* Shadow/Oclusion beneath triangle */}
                <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/40 blur-md rounded-full transition-opacity duration-300"
                    style={{
                        opacity: scrollProgress > pressureStart ? (scrollProgress - pressureStart) * 2 : 0,
                        transform: `scale(${1 + triangleYPressure * 0.01})`
                    }}
                />
            </div>

            {/* Logo Text Container */}
            <div
                className="mt-8 flex items-baseline gap-[2px] transition-all duration-500"
                style={{
                    opacity: textOpacityIntro,
                    transform: `translateY(${textYIntro}px)`
                }}
            >
                {letters.map((char, i) => {
                    // Slight delay or variance in "softness" for letters
                    const isVowel = "aeiou. ".includes(char.toLowerCase());
                    const letterSink = letterDeform * (isVowel ? 1.2 : 0.8);

                    return (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase select-none inline-block transition-transform duration-200 ease-out"
                            style={{
                                transform: `translateY(${letterSink}px) scaleY(${1 - letterSink * 0.01})`,
                                filter: `blur(${letterSink * 0.1}px)`,
                                opacity: 1 - (letterSink * 0.02)
                            }}
                        >
                            {char === "." ? (
                                <span className="text-neon-blue">.</span>
                            ) : char}
                        </span>
                    );
                })}
            </div>

            {/* Footer Text / Status */}
            <div className="absolute bottom-10 text-[10px] font-black tracking-[0.4em] uppercase text-white/20">
                Motion Branding System / v1.0
            </div>
        </div>
    );
};

export default TriangleMotionLogo;
