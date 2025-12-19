
import React, { useState, useEffect } from 'react';
import { MarketingConfig } from '../../types';
import { DEFAULT_MARKETING_TRACKING_CONFIG } from '../../config/marketingDefaults';

const FomoNotification: React.FC = () => {
    const [config, setConfig] = useState(DEFAULT_MARKETING_TRACKING_CONFIG.fomo);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const stored = localStorage.getItem('marketingConfig');
        if (stored) {
            try {
                const parsed: MarketingConfig = JSON.parse(stored);
                if (parsed.fomo) setConfig(parsed.fomo);
            } catch (e) { console.error(e); }
        }

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!config.enabled) return;

        // Initial delay
        const startTimeout = setTimeout(() => {
            scheduleNextNotification();
        }, config.minDelay * 1000);

        return () => clearTimeout(startTimeout);
    }, [config]);

    const scheduleNextNotification = () => {
        if(!config.messages || config.messages.length === 0) return;

        // Show a notification
        const randomMsg = config.messages[Math.floor(Math.random() * config.messages.length)];
        setMessage(randomMsg);
        setIsVisible(true);

        // Hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false);
            
            // Schedule next one
            const nextDelay = (config.intervalSeconds * 1000) + (Math.random() * 10000); // Base interval + random variance
            setTimeout(scheduleNextNotification, nextDelay);
        }, 5000);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed z-[9990] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isMobile ? 'top-4 left-4 right-4' : 'bottom-6 left-6'}`}>
            <div className={`bg-white/95 backdrop-blur-md border border-brand-purple/20 rounded-2xl shadow-2xl flex items-center border-l-4 border-l-brand-purple relative overflow-hidden
                ${isMobile ? 'p-2.5 gap-3' : 'p-4 gap-4 max-w-sm'}
            `}>
                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0 animate-pulse`}>
                    <span className={isMobile ? 'text-base' : 'text-xl'}>🔥</span>
                </div>
                <div className="flex-grow pr-4">
                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-brand-purple uppercase tracking-wider mb-0`}>Live Updates</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 leading-tight`}>{message}</p>
                    {!isMobile && <p className="text-[10px] text-gray-400 mt-1">Chiar acum</p>}
                </div>
                <button 
                    onClick={() => setIsVisible(false)} 
                    className={`absolute text-gray-400 hover:text-gray-600 flex items-center justify-center ${isMobile ? 'top-2 right-2' : 'top-3 right-3'}`}
                >
                    <svg className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default FomoNotification;
