
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StickyFooterConfig } from '../types';
import { DEFAULT_STICKY_FOOTER_CONFIG } from '../config';

interface StickyFooterProps {
    previewConfig?: StickyFooterConfig; // Optional prop for Admin Preview
}

const StickyFooter: React.FC<StickyFooterProps> = ({ previewConfig }) => {
    const [config, setConfig] = useState<StickyFooterConfig>(DEFAULT_STICKY_FOOTER_CONFIG);
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (previewConfig) {
            setConfig(previewConfig);
            setIsVisible(true);
        } else {
            const stored = localStorage.getItem('stickyFooterConfig');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setConfig({ ...DEFAULT_STICKY_FOOTER_CONFIG, ...parsed });
                    if (parsed.enabled) {
                        setTimeout(() => setIsVisible(true), 800); 
                    }
                } catch (e) { 
                    console.error(e);
                    if (DEFAULT_STICKY_FOOTER_CONFIG.enabled) setIsVisible(true);
                }
            } else if (DEFAULT_STICKY_FOOTER_CONFIG.enabled) {
                setTimeout(() => setIsVisible(true), 800);
            }
        }
    }, [previewConfig]);

    useEffect(() => {
        if (config.type !== 'countdown' || !config.countdownDate) return;

        const targetDate = new Date(config.countdownDate).getTime();
        
        const calculateTime = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [config.type, config.countdownDate]);

    if (!config.enabled && !previewConfig) return null;

    const getEffectClass = () => {
        if (!isVisible) return 'translate-y-full opacity-0';
        
        switch (config.effect) {
            case 'shake': return 'sticky-shake translate-y-0 opacity-100';
            case 'vibe': return 'sticky-vibe translate-y-0 opacity-100';
            case 'pulse': return 'sticky-pulse translate-y-0 opacity-100';
            case 'glow': return 'sticky-glow translate-y-0 opacity-100';
            case 'slide-up': return 'translate-y-0 opacity-100';
            default: return 'translate-y-0 opacity-100';
        }
    };

    const isImageMode = config.type === 'image_button';
    const isMarquee = config.effect === 'marquee';

    const CountBox = ({ val, label, isLarge }: { val: number, label: string, isLarge?: boolean }) => (
        <div className={`flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm ${isLarge ? 'px-1 py-1.5 min-w-[52px]' : 'px-2 py-1 md:px-3 md:py-1.5 min-w-[40px] md:min-w-[60px]'}`}>
            <span className={`${isLarge ? 'text-xl' : 'text-sm md:text-xl'} font-black leading-none`}>{String(val).padStart(2, '0')}</span>
            <span className={`${isLarge ? 'text-[8px]' : 'text-[8px] md:text-[10px]'} uppercase font-black opacity-80 mt-0.5`}>{label}</span>
        </div>
    );

    const renderText = () => (
        <span className={`${isMarquee ? 'sticky-marquee-content' : ''} text-base lg:text-lg font-black tracking-tight`}>
            {config.text}
        </span>
    );

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 z-[100] w-full transition-all duration-500 transform ${getEffectClass()}`}
            style={isImageMode ? {} : { backgroundColor: config.colors.background, color: config.colors.text }}
        >
            {isImageMode ? (
                <div className="relative w-full">
                    <img 
                        src={config.images.desktop} 
                        alt="Footer Banner" 
                        className="hidden md:block w-full h-auto max-h-[120px] object-cover object-center" 
                    />
                    <img 
                        src={config.images.mobile} 
                        alt="Footer Banner" 
                        className="block md:hidden w-full h-auto max-h-[150px] object-cover object-center" 
                    />
                    <div className="absolute inset-0 flex items-center justify-end px-4 md:px-12 pointer-events-none">
                        <Link 
                            to={config.buttonLink}
                            className="pointer-events-auto font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-sm md:text-base"
                            style={{ backgroundColor: config.colors.buttonBg, color: config.colors.buttonText }}
                        >
                            {config.buttonText}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-3 py-3 md:py-4 overflow-hidden">
                    <div className="hidden md:flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6 overflow-hidden flex-1">
                             {renderText()}
                             {config.type === 'countdown' && (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <CountBox val={timeLeft.days} label="Zile" />
                                    <span className="font-bold opacity-30 text-lg">:</span>
                                    <CountBox val={timeLeft.hours} label="Ore" />
                                    <span className="font-bold opacity-30 text-lg">:</span>
                                    <CountBox val={timeLeft.minutes} label="Min" />
                                    <span className="font-bold opacity-30 text-lg">:</span>
                                    <CountBox val={timeLeft.seconds} label="Sec" />
                                </div>
                            )}
                        </div>
                        <Link 
                            to={config.buttonLink}
                            className="font-black py-3 px-10 rounded-full shadow-xl transform hover:scale-105 transition-all text-base uppercase tracking-widest whitespace-nowrap"
                            style={{ backgroundColor: config.colors.buttonBg, color: config.colors.buttonText }}
                        >
                            {config.buttonText}
                        </Link>
                    </div>

                    <div className="md:hidden">
                        {config.type === 'countdown' ? (
                            <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <CountBox val={timeLeft.days} label="Zile" isLarge />
                                    <CountBox val={timeLeft.hours} label="Ore" isLarge />
                                    <CountBox val={timeLeft.minutes} label="Min" isLarge />
                                    <CountBox val={timeLeft.seconds} label="Sec" isLarge />
                                </div>
                                <Link 
                                    to={config.buttonLink}
                                    className="font-black py-3.5 px-4 rounded-xl shadow-xl active:scale-95 transition-all text-[11px] uppercase tracking-tighter flex-grow text-center ml-1 border-b-4 border-black/10 leading-none flex items-center justify-center min-h-[50px]"
                                    style={{ backgroundColor: config.colors.buttonBg, color: config.colors.buttonText }}
                                >
                                    {config.buttonText}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-grow overflow-hidden pr-2">
                                    <span className={`${isMarquee ? 'sticky-marquee-content' : ''} text-[11px] font-black leading-tight block opacity-90`}>
                                        {config.text}
                                    </span>
                                </div>
                                <Link 
                                    to={config.buttonLink}
                                    className="font-black py-2.5 px-6 rounded-xl shadow-lg active:scale-95 transition-all text-[12px] uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                                    style={{ backgroundColor: config.colors.buttonBg, color: config.colors.buttonText }}
                                >
                                    {config.buttonText}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StickyFooter;
