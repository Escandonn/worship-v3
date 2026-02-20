import React from 'react';

interface AntigravityTextProps {
    text: string;
    className?: string;
    letterClassName?: string;
    delayStart?: number;
    tag?: 'h1' | 'p' | 'span';
}

const AntigravityText: React.FC<AntigravityTextProps> = ({
    text,
    className = "",
    letterClassName = "",
    delayStart = 0,
    tag = 'span'
}) => {
    const Tag = tag;
    const letters = text.split("");
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoize random values
    const randomStats = React.useMemo(() => {
        return letters.map(() => ({
            x: (Math.random() - 0.5) * 300 + "px",
            y: (Math.random() - 0.5) * 200 + "px",
            r: (Math.random() - 0.5) * 60 + "deg",
        }));
    }, [text]);

    return (
        <Tag className={className}>
            {letters.map((char, i) => {
                const stats = randomStats[i];
                const delay = (delayStart + i * 0.05).toFixed(2) + "s";

                return (
                    <span
                        key={i}
                        className={`gravity-letter ${isMounted ? 'animate-[floatIn_1.1s_cubic-bezier(.22,.9,.32,1)_forwards]' : 'opacity-0'} ${letterClassName}`}
                        style={isMounted ? {
                            // @ts-ignore
                            "--x": stats.x,
                            "--y": stats.y,
                            "--r": stats.r,
                            animationDelay: delay,
                        } : {}}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </Tag>
    );
};

export default AntigravityText;
