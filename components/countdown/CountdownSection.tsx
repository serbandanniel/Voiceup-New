
import React, { useState, useEffect } from 'react';
import { CountdownConfig, SectionConfig } from '../../types';

interface CountdownSectionProps {
    config: CountdownConfig;
    sectionSettings: SectionConfig;
    isMobile: boolean;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ config, sectionSettings, isMobile }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date(config.targetDate).getTime();
        const interval = setInterval(() => {
          const now = new Date().getTime();
          const distance = targetDate - now;
          if (distance < 0) {
            clearInterval(interval);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          } else {
            setTimeLeft({ days: Math.floor(distance / (1000 * 60 * 60 * 24)), hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), seconds: Math.floor((distance % (1000 * 60)) / 1000) });
          }
        }, 1000);
        return () => clearInterval(interval);
    }, [config.targetDate]);

    const getVisibilityClass = (visibility: { desktop: boolean, mobile: boolean }) => {
        if (visibility.desktop && visibility.mobile) return '';
        if (visibility.desktop) return 'hidden md:block';
        if (visibility.mobile) return 'block md:hidden';
        return 'hidden';
    };

    if (!sectionSettings.enabled) return null;

    return (
        <section 
            id="countdown" 
            className={`relative py-8 md:py-12 z-40 ${getVisibilityClass(sectionSettings.visibility)}`}
        >
            {/* Floating Card Design */}
            <div className="max-w-5xl mx-auto px-4">
                <div 
                    className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center transform transition-transform duration-500 hover:scale-[1.01]"
                    style={{ 
                        backgroundColor: config.bgColor || '#ffffff',
                        boxShadow: `0 20px 50px -10px ${config.shadowColor || 'rgba(0,0,0,0.2)'}` 
                    }}
                >
                    <h2 className="text-xl md:text-3xl font-extrabold text-brand-dark mb-4 md:mb-8">{config.title}</h2>
                    
                    {/* Grid on mobile to force single row, Flex on Desktop */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 md:flex md:justify-center md:gap-8">
                        {[{ label: config.labels.days, value: timeLeft.days }, { label: config.labels.hours, value: timeLeft.hours }, { label: config.labels.minutes, value: timeLeft.minutes }, { label: config.labels.seconds, value: timeLeft.seconds }].map((item, idx) => {
                            const isSeconds = idx === 3;
                            const effect = config.animationEffect;
                            let animationClass = '';
                            if (effect === 'pulse') animationClass = 'pulse-all';
                            else if (isSeconds) {
                                if (effect === 'shake') animationClass = 'shake-seconds';
                                if (effect === 'flip') animationClass = 'flip-seconds';
                                if (effect === 'fade') animationClass = 'fade-seconds';
                            }

                            // On mobile we ignore fixed width to allow grid to work, use height from config
                            const size = isMobile ? config.sizing.mobile : config.sizing.desktop;
                            const style = isMobile 
                                ? { height: `${size.height}px` } 
                                : { width: `${size.width}px`, height: `${size.height}px` };

                            return (
                               <div 
                                  key={idx} 
                                  style={style}
                                  className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl shadow-inner ${animationClass}`}
                                >
                                  <div className={`font-black leading-none ${isMobile ? 'text-xl' : 'text-4xl'}`} style={{ color: config.numberColor }}>{String(item.value).padStart(2, '0')}</div>
                                  <div className={`font-bold uppercase leading-none mt-1 ${isMobile ? 'text-[9px]' : 'text-xs'} tracking-wider`} style={{ color: config.labelColor }}>{item.label}</div>
                               </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountdownSection;
