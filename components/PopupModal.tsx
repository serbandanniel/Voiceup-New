
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PopupConfig } from '../types';
import { DEFAULT_POPUP_CONFIG } from '../config';

const POPUP_STORAGE_KEY = 'voiceup_popup_seen';

interface PopupModalProps {
    previewConfig?: PopupConfig; // For admin preview mode
}

const PopupModal: React.FC<PopupModalProps> = ({ previewConfig }) => {
    const [config, setConfig] = useState<PopupConfig>(DEFAULT_POPUP_CONFIG);
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false); // To handle DOM mounting
    const location = useLocation();

    // Check visibility rules
    useEffect(() => {
        if (previewConfig) {
            // Preview Mode: Always show immediately
            setConfig(previewConfig);
            setIsRendered(true);
            setTimeout(() => setIsVisible(true), 100);
            return;
        }

        // Live Mode
        const storedConfig = localStorage.getItem('popupConfig');
        const activeConfig = storedConfig ? JSON.parse(storedConfig) : DEFAULT_POPUP_CONFIG;
        
        if (!activeConfig.enabled) return;

        setConfig(activeConfig);

        const lastSeen = localStorage.getItem(POPUP_STORAGE_KEY);
        const sessionSeen = sessionStorage.getItem(POPUP_STORAGE_KEY);
        let shouldShow = false;

        switch (activeConfig.frequency) {
            case 'always':
                shouldShow = true;
                break;
            case 'once_session':
                if (!sessionSeen) shouldShow = true;
                break;
            case 'once_day':
                if (!lastSeen) {
                    shouldShow = true;
                } else {
                    const diff = Date.now() - parseInt(lastSeen, 10);
                    if (diff > 24 * 60 * 60 * 1000) shouldShow = true;
                }
                break;
            case 'once_forever':
                if (!lastSeen) shouldShow = true;
                break;
        }

        if (shouldShow) {
            const timer = setTimeout(() => {
                setIsRendered(true);
                // Slight delay after render to allow CSS transition
                setTimeout(() => setIsVisible(true), 50);
                
                // Record view
                const now = Date.now().toString();
                localStorage.setItem(POPUP_STORAGE_KEY, now);
                sessionStorage.setItem(POPUP_STORAGE_KEY, now);
            }, (activeConfig.triggerDelay || 0) * 1000);

            return () => clearTimeout(timer);
        }
    }, [previewConfig, location.pathname]); // Re-check on route change if needed, though usually popup is global

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setIsRendered(false), 500); // Remove from DOM after animation
    };

    if (!isRendered) return null;

    const widthClass = {
        small: 'max-w-sm',
        medium: 'max-w-xl',
        large: 'max-w-3xl'
    }[config.styles.width];

    const animationClass = isVisible ? `popup-${config.animation}` : 'opacity-0 scale-95';

    // Helper to determine if media is a video file or generic url
    const isVideoFile = config.content.mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: config.styles.overlayColor }}
            onClick={handleClose}
        >
            <div 
                className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform ${animationClass}`}
                style={{ backgroundColor: config.styles.backgroundColor }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* Content */}
                <div className="flex flex-col">
                    {/* Media Section */}
                    {config.content.mediaType === 'image' && config.content.mediaUrl && (
                        <div className="w-full max-h-60 overflow-hidden">
                            <img src={config.content.mediaUrl} alt="Popup" className="w-full h-full object-cover" />
                        </div>
                    )}
                    
                    {config.content.mediaType === 'video' && config.content.mediaUrl && (
                        <div className="w-full aspect-video bg-black">
                            {isVideoFile ? (
                                <video src={config.content.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                            ) : (
                                <iframe 
                                    src={config.content.mediaUrl.includes('youtube') && !config.content.mediaUrl.includes('embed') 
                                        ? config.content.mediaUrl.replace('watch?v=', 'embed/') 
                                        : config.content.mediaUrl} 
                                    className="w-full h-full border-0" 
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    )}

                    {/* Text & Button Section */}
                    <div className="p-6 md:p-8 text-center">
                        {config.content.title && (
                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                                {config.content.title}
                            </h3>
                        )}
                        
                        {config.content.description && (
                            <div className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: config.content.description.replace(/\n/g, '<br/>') }} />
                        )}

                        {config.button.show && (
                            previewConfig ? (
                                // In preview, don't actually navigate
                                <button 
                                    className="inline-block font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: config.button.bgColor, color: config.button.textColor }}
                                >
                                    {config.button.text}
                                </button>
                            ) : (
                                <Link 
                                    to={config.button.link}
                                    onClick={handleClose}
                                    className="inline-block font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: config.button.bgColor, color: config.button.textColor }}
                                >
                                    {config.button.text}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;
