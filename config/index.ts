
// Central Export for All Default Configurations
export { DEFAULT_WHEEL_CONFIG } from './wheelDefaults';
export { DEFAULT_HERO_CONFIG } from './hero';
export { DEFAULT_COUNTDOWN_CONFIG } from './countdown';
export { DEFAULT_SECTIONS_CONFIG } from './sections';
export { DEFAULT_STICKY_FOOTER_CONFIG, DEFAULT_POPUP_CONFIG } from './marketing';
export { DEFAULT_FORM_CONFIG } from './form';
export { DEFAULT_LOCATION_CONFIG, DEFAULT_PARTNERS, DEFAULT_JURORS, DEFAULT_PRIZES_CONFIG, DEFAULT_FAQS } from './content';
export { DEFAULT_MOBILPAY_CONFIG, DEFAULT_SMARTBILL_CONFIG, DEFAULT_EMAIL_CONFIG } from './integrations';
export { DEFAULT_MARKETING_TRACKING_CONFIG } from './marketingDefaults';
export { DEFAULT_MARKETING_TRACKING_CONFIG as DEFAULT_MARKETING_CONFIG } from './marketingDefaults';
export { DEFAULT_NAVBAR_CONFIG } from './navigationDefaults';
export { DEFAULT_STATIC_PAGES_CONFIG } from './staticPages';

import { FloatingButtonsConfig } from '../types';

export const DEFAULT_FLOATING_CONFIG: FloatingButtonsConfig = {
    whatsappEnabled: true,
    chatbotEnabled: true,
    backToTopEnabled: false // Deactivated by user request
};
