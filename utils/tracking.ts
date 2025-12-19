
// Centralized Event Tracking Utility

// Extend window interface for TS
declare global {
    interface Window {
        fbq: any;
        gtag: any;
        ttq: any;
    }
}

/**
 * Fires a conversion or custom event to all configured and available platforms.
 * @param eventName The generic name of the event (e.g., 'Contact', 'CompleteRegistration')
 * @param data Optional data payload (e.g., value, currency)
 */
export const trackEvent = (eventName: 'PageView' | 'Contact' | 'CompleteRegistration' | 'InitiateCheckout', data?: any) => {
    
    // --- META PIXEL (Facebook) ---
    if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, data);
    }

    // --- TIKTOK PIXEL ---
    if (typeof window.ttq === 'object' && window.ttq !== null) {
        // Map standard names to TikTok equivalents if needed
        let ttEventName: string = eventName;
        if (eventName === 'CompleteRegistration') ttEventName = 'SubmitForm';
        if (eventName === 'PageView') ttEventName = 'Pageview';
        
        window.ttq.track(ttEventName, data);
    }

    // --- GOOGLE ANALYTICS 4 & GOOGLE ADS ---
    // Google uses 'gtag' for both.
    if (typeof window.gtag === 'function') {
        
        // 1. GA4 Standard Events
        let ga4EventName: string = eventName;
        if (eventName === 'CompleteRegistration') ga4EventName = 'sign_up';
        if (eventName === 'InitiateCheckout') ga4EventName = 'begin_checkout';
        
        if (eventName !== 'PageView') { // PageView is automatic in GA4 usually
             window.gtag('event', ga4EventName, data);
        }

        // 2. Google Ads Conversion
        // We need to check if there is a conversion label specific for this event
        // This usually comes from config, but for simplicity, we assume 'CompleteRegistration' triggers the main conversion
        if (eventName === 'CompleteRegistration') {
            const marketingConfig = JSON.parse(localStorage.getItem('marketingConfig') || '{}');
            if (marketingConfig?.googleAds?.enabled && marketingConfig?.googleAds?.conversionId && marketingConfig?.googleAds?.registrationLabel) {
                const conversionTag = `${marketingConfig.googleAds.conversionId}/${marketingConfig.googleAds.registrationLabel}`;
                window.gtag('event', 'conversion', {
                    'send_to': conversionTag,
                    'value': data?.value,
                    'currency': data?.currency
                });
            }
        }
    }
    
    console.log(`[Tracking] Fired ${eventName}`, data);
};
