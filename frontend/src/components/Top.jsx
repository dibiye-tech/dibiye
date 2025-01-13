import React, { useEffect, useState } from 'react';
import { IoArrowUp } from "react-icons/io5";

const Top = () => {

    const [backToTopButton, setBackToTopButton] = useState(false);
    const [buttonIntensity, setButtonIntensity] = useState(0); // Ajout de l'état pour l'intensité du bouton
    const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

    useEffect(() => {
        const handleScroll = () => {
            setLastInteractionTime(Date.now()); // Mettre à jour le temps de la dernière interaction
            if (window.scrollY > 100) {
                setBackToTopButton(true);
                setButtonIntensity(100); // Réglez l'intensité à 100 quand le bouton apparaît
            } else {
                setBackToTopButton(false);
                // Démarrer le délai pour diminuer l'intensité si aucun scroll ou hover
                startOpacityDecreaseTimer();
            }
        };

        const startOpacityDecreaseTimer = () => {
            setTimeout(() => {
                // Vérifiez si aucun scroll ou hover n'a eu lieu depuis 2 secondes
                if (Date.now() - lastInteractionTime > 2000) {
                    setButtonIntensity(20); // Réglez l'intensité à 50 après un délai
                }
            }, 5000); // Délai de 2 secondes (ajustez selon vos besoins)
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastInteractionTime]);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setLastInteractionTime(Date.now()); // Mettre à jour le temps de la dernière interaction
    };

    const handleMouseEnter = () => {
        setButtonIntensity(100); // Réglez l'intensité à 100 quand la souris entre dans le bouton
        setLastInteractionTime(Date.now()); // Mettre à jour le temps de la dernière interaction
    };

    const handleMouseLeave = () => {
        setButtonIntensity(50); // Réglez l'intensité à 50 quand la souris quitte le bouton
    };

    return (
        <div>
            { backToTopButton && (
                <button
                    onClick={scrollUp}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`fixed right-[50px] bottom-[50px] bg-[#2278AC] text-white py-2 px-3 border border-1 border-[#fff] rounded-[10px] w-auto text-center hover:bg-[#096197] cursor-pointer transition-all duration-700 text-[30px]`}
                    style={{ opacity: buttonIntensity / 100 }} // Utilisation de l'intensité pour régler l'opacité
                >
                    <IoArrowUp />
                </button>
            )}
        </div>
    );
};

export default Top;
