import { useMemo, useState, useEffect, useRef } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzأبتثجحخدذرزسشصضطظعغفقكلمنهويءآأؤإئىةΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩабвгдеёжзийклмнопрстуфхцчшщъыьэюяあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん的一是在有和人中大上‼ඞ☻☺✿❀✬♥☼☾ツ♔♕♖♗♘♙♚♛♜♝♞♟✈☁☂☃☘☙☚☛☜☞☟✎⚀⚁⚂⚃⚄⚅"
const EFFECT_CONFIG = {
    RAINDROP: {
        MAX_COUNT: 30,
        MIN_DURATION: 15000,
        MAX_DURATION: 22000,
    },
};

const RAIN_COLORS = [
    '#3B82F6', // blue-500
    '#06B6D4', // cyan-500
    '#8B5CF6', // purple-500
    '#22D3EE', // teal-400
    '#10B981', // green-500
    '#F59E42', // orange-400
    '#F472B6', // pink-400
];

const HIGHLIGHT_COLOR = '#FFD700'; // gold

const RainDropLetter = ({ letter, duration, delay, index, mouseX, mouseY }) => {
    const tilt = useMemo(() => Math.random() * 40 - 20, []);
    const color = useMemo(() => RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)], []);
    const fontSize = useMemo(() => `${1.5 + Math.random()}rem`, []);
    const textShadow = useMemo(() => `0 0 8px ${color}, 0 0 16px ${color}99`, [color]);

    // Calculate left position in px
    const leftPercent = (index / EFFECT_CONFIG.RAINDROP.MAX_COUNT) * 100;
    const leftPx = typeof window !== 'undefined' ? (window.innerWidth * leftPercent) / 100 : 0;
    // Animate top position using CSS animation, but estimate current top for proximity
    // We'll use mouseY and mouseX to determine proximity
    const [isNear, setIsNear] = useState(false);
    const letterRef = useRef();

    useEffect(() => {
        if (mouseX == null || mouseY == null || !letterRef.current) {
            setIsNear(false);
            return;
        }
        // Get bounding rect for the letter
        const rect = letterRef.current.getBoundingClientRect();
        // Center of the letter
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Distance to mouse
        const dist = Math.sqrt((centerX - mouseX) ** 2 + (centerY - mouseY) ** 2);
        setIsNear(dist < 80); // 80px radius for highlight
    }, [mouseX, mouseY]);

    return (
        <div
            ref={letterRef}
            className="absolute select-none z-0"
            style={{
                left: `${leftPercent}%`,
                animation: `raindrop-fall ${duration}ms linear ${delay}ms infinite`,
                transform: `rotate(${tilt}deg)`,
                color: isNear ? HIGHLIGHT_COLOR : color,
                fontSize,
                textShadow: isNear ? `0 0 16px ${HIGHLIGHT_COLOR}, 0 0 32px ${HIGHLIGHT_COLOR}99` : textShadow,
                fontWeight: 700,
                transition: 'color 0.5s, text-shadow 0.2s',
            }}
        >
            {letter}
        </div>
    );
};

const RainDropEffect = ({ letterCount }) => {
    const [mouse, setMouse] = useState({ x: null, y: null });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const letterInstances = useMemo(() => {
        return Array.from({
            length: Math.min(letterCount, EFFECT_CONFIG.RAINDROP.MAX_COUNT),
        }).map((_, index) => {
            const randomLetter =
                ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            const duration =
                Math.random() *
                    (EFFECT_CONFIG.RAINDROP.MAX_DURATION -
                        EFFECT_CONFIG.RAINDROP.MIN_DURATION) +
                EFFECT_CONFIG.RAINDROP.MIN_DURATION;
            const delay = -Math.random() * 14000;

            return {
                id: `letter-${index}`,
                letter: randomLetter,
                duration,
                delay,
                index,
            };
        });
    }, [letterCount]);

    return (
        <div className="absolute overflow-hidden h-screen w-screen flex">
            {letterInstances.map(({ id, letter, duration, delay, index }) => (
                <RainDropLetter
                    key={id}
                    letter={letter}
                    duration={duration}
                    delay={delay}
                    index={index}
                    mouseX={mouse.x}
                    mouseY={mouse.y}
                />
            ))}
            <style>{`
                @keyframes raindrop-fall {
                    0% { top: -2rem; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100vh; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

RainDropEffect.displayName = "RainDropEffect";

export default RainDropEffect;
