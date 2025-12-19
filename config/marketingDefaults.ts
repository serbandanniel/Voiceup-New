
import { MarketingConfig } from '../interfaces';

export const DEFAULT_MARKETING_TRACKING_CONFIG: MarketingConfig = {
    google: {
        enabled: false,
        measurementId: ''
    },
    googleAds: {
        enabled: false,
        conversionId: '',
        registrationLabel: ''
    },
    facebook: {
        enabled: false,
        pixelId: ''
    },
    tiktok: {
        enabled: false,
        pixelId: ''
    },
    fomo: {
        enabled: true,
        intervalSeconds: 20,
        minDelay: 5,
        messages: [
            "Maria D. din București s-a înscris la Muzică Ușoară 🎤",
            "Andrei P. tocmai a rezervat un loc! 🔥",
            "Grupul 'Armonia' din Iași s-a înscris cu succes 👥",
            "Elena S. din Constanța a aplicat pentru Secțiunea Folclor 🎵",
            "Alexandru M. a completat formularul de înscriere 📝",
            "Locurile se ocupă rapid! 2 înscrieri noi în ultimul minut ⏳",
            "Ioana T. din Brașov s-a înscris la categoria 11-13 ani 🌟"
        ]
    }
};
