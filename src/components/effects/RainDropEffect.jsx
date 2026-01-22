import { useMemo } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzأبتثجحخدذرزسشصضطظعغفقكلمنهويءآأؤإئىةΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

const EFFECT_CONFIG = {
    RAINDROP: {
        MAX_COUNT: 30,
        MIN_DURATION: 15000,
        MAX_DURATION: 22000,
    },
};

const RainDropLetter = ({ letter, duration, delay, index }) => {
    // Generate a random tilt between -20deg and 20deg for each letter
    const tilt = useMemo(
        () => Math.random() * 40 - 20,
        [] // Only generate once per instance
    );

    return (
        <div
            className="absolute select-none text-2xl text-blue-500 z-0"
            style={{
                left: `${(index / EFFECT_CONFIG.RAINDROP.MAX_COUNT) * 100}%`,
                animation: `raindrop-fall ${duration}ms linear ${delay}ms infinite`,
                transform: `rotate(${tilt}deg)`,
            }}
        >
            {letter}
        </div>
    );
};

const RainDropEffect = ({ letterCount = 20 }) => {
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
                />
            ))}
            <style>{`
                @keyframes raindrop-fall {
                    0% { top: -2rem; opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100vh; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

RainDropEffect.displayName = "RainDropEffect";

export default RainDropEffect;
