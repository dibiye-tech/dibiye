import React, { useEffect, useState } from 'react';
import { IoArrowUp } from "react-icons/io5";

const Top = () => {
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [buttonIntensity, setButtonIntensity] = useState(0); 
    const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

    useEffect(() => {
        const handleScroll = () => {
            setLastInteractionTime(Date.now());
            if (window.scrollY > 100) {
                setBackToTopButton(true);
                setButtonIntensity(100);
            } else {
                setBackToTopButton(false);
                startOpacityDecreaseTimer();
            }
        };

        const startOpacityDecreaseTimer = () => {
            setTimeout(() => {
                if (Date.now() - lastInteractionTime > 2000) {
                    setButtonIntensity(20);
                }
            }, 5000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastInteractionTime]);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setLastInteractionTime(Date.now());
    };

    const handleMouseEnter = () => {
        setButtonIntensity(100);
        setLastInteractionTime(Date.now());
    };

    const handleMouseLeave = () => {
        setButtonIntensity(50);
    };

    return (
        <div>
            { backToTopButton && (
                <button
                    onClick={scrollUp}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`fixed right-4 bottom-4 sm:right-6 sm:bottom-6 md:right-8 md:bottom-8 
                        bg-[#2278AC] text-white border border-white rounded-[10px] 
                        cursor-pointer transition-all duration-700 hover:bg-[#096197] 
                        text-[20px] py-1 px-2 sm:text-[25px] sm:py-1.5 sm:px-2.5 md:text-[30px] md:py-2 md:px-3`}
                    style={{ opacity: buttonIntensity / 100 }} 
                >
                    <IoArrowUp />
                </button>
            )}
        </div>
    );
};

export default Top;
