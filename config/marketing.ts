
import { StickyFooterConfig, PopupConfig } from '../interfaces';

// --- STICKY FOOTER ---
export const DEFAULT_STICKY_FOOTER_CONFIG: StickyFooterConfig = {
    enabled: true,
    type: 'countdown',
    text: 'Grăbește-te! Înscrierile se închid în: ⏳',
    buttonText: 'Înscrie-te',
    buttonLink: '/register',
    effect: 'pulse',
    countdownDate: '2025-12-06T23:59', // Default date
    images: {
        desktop: 'https://placehold.co/1920x120?text=Desktop+Banner',
        mobile: 'https://placehold.co/750x150?text=Mobile+Banner'
    },
    colors: {
        background: '#7C3AED',
        text: '#ffffff',
        buttonBg: '#FBBF24',
        buttonText: '#2E1065'
    }
};

// --- POPUP ---
export const DEFAULT_POPUP_CONFIG: PopupConfig = {
    enabled: false,
    triggerDelay: 5,
    frequency: 'once_session',
    animation: 'zoom-in',
    content: {
        mediaType: 'image',
        mediaUrl: 'https://placehold.co/600x300?text=Promo+Image',
        title: 'Ofertă Specială!',
        description: 'Abonează-te la newsletter și primești 10% reducere la înscriere.'
    },
    button: {
        show: true,
        text: 'Profită Acum',
        link: '/register',
        bgColor: '#F472B6',
        textColor: '#ffffff'
    },
    styles: {
        width: 'medium',
        overlayColor: 'rgba(0,0,0,0.7)',
        backgroundColor: '#ffffff'
    }
};
