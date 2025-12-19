
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HeroConfig, SectionConfig, DynamicTextSet } from '../../types';
import FloatingNotes from '../visuals/FloatingNotes';
import AudioVisualizer from '../visuals/AudioVisualizer';
import { loadFont } from '../../utils/styleUtils';

interface HeroSectionProps {
    config: HeroConfig;
    sectionSettings: SectionConfig;
    isMobile: boolean;
}

const Typewriter: React.FC<{ words: string[], interval: number, active: boolean }> = ({ words, interval, active }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        if (!active) {
            setIndex(0);
            setSubIndex(0);
            setReverse(false);
        }
    }, [active]);

    useEffect(() => {
        if (!active) return;
        if (subIndex === words[index].length + 1 && !reverse) {
            setReverse(true);
            return;
        }
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, Math.max(reverse ? 75 : subIndex === words[index].length ? interval : 150, 100));
        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, interval, active]);

    useEffect(() => {
        const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    return (
        <span className="relative inline-block">
            {words[index].substring(0, subIndex)}
            <span className={`inline-block w-1.5 h-[0.9em] bg-current ml-1 align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
        </span>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ config, sectionSettings, isMobile }) => {
    const heroRef = useRef<HTMLElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const [activeSetIndex, setActiveSetIndex] = useState(0);
    const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
    
    const sets = config.changingText?.sets || [];
    const hasMultipleSets = sets.length > 1;

    useEffect(() => {
        setMounted(true);
        if (config.titleStyles.fontFamily) loadFont(config.titleStyles.fontFamily);
        if (config.buttonStyles.fontFamily) loadFont(config.buttonStyles.fontFamily);
        return () => setMounted(false);
    }, [config]);

    useEffect(() => {
        if (!config.changingText?.enabled || !hasMultipleSets) return;
        const duration = config.changingText.setDuration || 9000;
        const cycleInterval = setInterval(() => {
            setFadeState('out');
            setTimeout(() => {
                setActiveSetIndex((prev) => (prev + 1) % sets.length);
                setFadeState('in');
            }, 600);
        }, duration);
        return () => clearInterval(cycleInterval);
    }, [config.changingText?.enabled, hasMultipleSets, sets.length, config.changingText.setDuration]);

    useEffect(() => {
        if (isMobile) return;
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); 
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isMobile]);

    const handleScrollToRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.getElementById('formular-inscriere');
        if (target) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const getHeroBg = () => {
        const { backgroundType, gradient, desktopImageUrl, mobileImageUrl, desktopVideoUrl, mobileVideoUrl } = config;
        if (backgroundType === 'gradient') {
            return {
                type: 'gradient',
                style: {
                    backgroundImage: `linear-gradient(-45deg, ${gradient.color1}, ${gradient.color2}, ${gradient.color3}, ${gradient.color4})`,
                    backgroundSize: '400% 400%',
                    animation: `animatedGradient ${gradient.speed}s ease infinite`
                }
            };
        }
        if (backgroundType === 'image') {
            const imageUrl = isMobile ? (mobileImageUrl || desktopImageUrl) : desktopImageUrl;
            return {
                type: 'image',
                style: { backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
            };
        }
        if (backgroundType === 'video') {
            const videoUrl = isMobile ? (mobileVideoUrl || desktopVideoUrl) : desktopVideoUrl;
            return { type: 'video', url: videoUrl };
        }
        return { type: 'none', style: {} };
    };

    const heroBg = getHeroBg();
    const getLogoAnimationClass = () => {
        if (config.logoAnimation?.type === 'none') return '';
        switch (config.logoAnimation?.type) {
          case 'float': return 'animation-logo-float';
          case 'rotate': return 'animation-logo-rotate';
          case 'pulse': return 'animation-logo-pulse';
          default: return '';
        }
    };
    
    if (!sectionSettings.enabled) return null;

    const logoTransform = isMobile ? {} : {
        transform: `perspective(1000px) rotateY(${mousePos.x * 20}deg) rotateX(${-mousePos.y * 20}deg) scale(1.05)`,
        transition: 'transform 0.1s ease-out',
        filter: `drop-shadow(${mousePos.x * -15}px ${mousePos.y * 15}px 20px rgba(0,0,0,0.4))`
    };

    const activeSet = sets[activeSetIndex] || sets[0];
    const dynamicFontSize = isMobile ? config.changingText.fontSizeMobile : config.changingText.fontSizeDesktop;

    return (
        <>
            {mounted && createPortal(
                <div className="fixed inset-0 z-0">
                    {heroBg.type === 'video' && heroBg.url ? (
                        <video key={heroBg.url} autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src={heroBg.url} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="w-full h-full" style={heroBg.style}></div>
                    )}
                </div>,
                document.body
            )}

            <header id="hero" ref={heroRef} className={`relative overflow-hidden pb-12 pt-24 md:pt-20 md:pb-12 z-0 scroll-mt-32`}>
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="w-full h-full" style={!isMobile ? { transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`, transition: 'transform 0.1s ease-out' } : {}}>
                        {config.decorationType === 'notes' && <FloatingNotes count={config.floatingNotesCount} />}
                        {config.decorationType === 'visualizer' && <AudioVisualizer height={config.visualizerHeight} />}
                    </div>
                </div>
                
                <div className="max-w-screen-xl mx-auto px-6 relative z-40 grid md:grid-cols-2 gap-4 md:gap-12 items-center">
                    <div className={`flex items-center text-center justify-center`} style={{ perspective: '1000px' }}>
                        {config.showLogo && (
                            <img 
                                src={config.logoUrl} 
                                alt="Logo" 
                                className={`hero-logo w-full max-w-xs sm:max-w-sm md:max-w-lg ${getLogoAnimationClass()}`} 
                                style={{ ...(config.logoAnimation?.type !== 'none' ? { animationDuration: `${config.logoAnimation.speed}s` } : {}), ...logoTransform }}
                            />
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
                        <div className="drop-shadow-md w-full" style={{ 
                                fontFamily: `'${config.titleStyles.fontFamily}', sans-serif`, 
                                // Fix: updated property names to iBold and iItalic to match the HeroConfig interface
                                fontWeight: config.titleStyles.iBold ? 'bold' : 'normal', 
                                fontStyle: config.titleStyles.iItalic ? 'italic' : 'normal', 
                                textDecoration: config.titleStyles.isUnderlined ? 'underline' : 'none',
                                fontSize: `${dynamicFontSize}px`
                            }}>
                            {config.changingText?.enabled && sets.length > 0 ? (
                                <div className={`flex flex-col items-center md:items-start leading-tight transition-all duration-700 transform ${fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="w-full"><span className="whitespace-pre-wrap block" style={{ color: activeSet.prefixColor }}>{activeSet.prefix}</span></div>
                                    <div className="w-full"><span className="min-h-[1.2em] inline-block" style={{ color: activeSet.wordsColor }}>
                                        <Typewriter key={activeSet.id} words={activeSet.words} interval={config.changingText.interval} active={fadeState === 'in'} />
                                    </span></div>
                                </div>
                            ) : (
                                config.showTitle && <span className="block" style={{ color: config.titleStyles.color }}>{config.title}</span>
                            )}
                        </div>
                        
                        {config.showButton && (
                            <a href="#formular-inscriere" onClick={handleScrollToRegister} className="ripple-btn inline-block mt-6 sm:mt-8 py-3 px-8 md:py-4 md:px-10 text-lg md:text-xl rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110" 
                                style={{ 
                                    fontFamily: `'${config.buttonStyles.fontFamily}', sans-serif`, 
                                    backgroundColor: config.buttonStyles.bgColor, 
                                    color: config.buttonStyles.textColor, 
                                    // Fix: updated property name to iBold to match the HeroConfig interface
                                    fontWeight: config.buttonStyles.iBold ? 'bold' : 'normal' 
                                }}>
                                {config.buttonText}
                            </a>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default HeroSection;