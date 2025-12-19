
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    AboutContent, CategoriesContent, LocationContent, // New components
    PartnersContent, JuryContent, PrizesContent, 
    FeesContent, RulesContent, ContactContent 
} from '../components/Sections';
import SEO from '../components/SEO';
import { SectionConfig } from '../types';
import { DEFAULT_SECTIONS_CONFIG } from '../config';

// Helper to get section config (tries localStorage, falls back to default)
const useSectionConfig = (sectionId: string): SectionConfig => {
    const [config, setConfig] = useState<SectionConfig>(() => {
        const defaultSec = DEFAULT_SECTIONS_CONFIG.find(s => s.id === sectionId) || DEFAULT_SECTIONS_CONFIG[0];
        // Try load from storage immediately for initial render if possible
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sectionsConfig');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    const found = parsed.find((s: SectionConfig) => s.id === sectionId);
                    if (found) return { ...defaultSec, ...found };
                } catch (e) {}
            }
        }
        return defaultSec;
    });

    useEffect(() => {
        const stored = localStorage.getItem('sectionsConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const found = parsed.find((s: SectionConfig) => s.id === sectionId);
                if (found) {
                    // Merge found config with default to ensure all fields exist
                    setConfig(prev => ({ ...prev, ...found }));
                }
            } catch (e) { console.error(e); }
        }
    }, [sectionId]);

    return config;
};

const PageWrapper: React.FC<{ children: React.ReactNode, title?: string, description?: string, bgClass?: string }> = ({ children, title, description, bgClass = 'bg-white' }) => {
    useEffect(() => {
        // Trigger animations immediately for standalone pages
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    const pageTitle = title ? `${title} - VoiceUP Festival` : 'VoiceUP Festival';

    return (
        <div className={`min-h-screen pt-32 pb-24 ${bgClass}`}>
             <SEO title={pageTitle} description={description} />
             
             {/* Back Button */}
             <div className="max-w-screen-xl mx-auto px-6 mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </div>
                    <span>Înapoi la Pagina Principală</span>
                </Link>
             </div>

             {children}
        </div>
    );
};

export const About: React.FC = () => {
    const aboutConfig = useSectionConfig('about');
    const categoriesConfig = useSectionConfig('categories');
    const locationConfig = useSectionConfig('location');

    return (
        <PageWrapper title="Despre Festival" bgClass="bg-gray-50">
            <div className="space-y-16">
                <AboutContent section={aboutConfig} />
                <CategoriesContent section={categoriesConfig} />
                <LocationContent section={locationConfig} />
            </div>
        </PageWrapper>
    );
};

export const Partners: React.FC = () => {
    const config = useSectionConfig('partners');
    return <PageWrapper title={config.title} bgClass="bg-white"><PartnersContent section={config} /></PageWrapper>;
};

export const Jury: React.FC = () => {
    const config = useSectionConfig('jury');
    return <PageWrapper title={config.title} bgClass="bg-gray-50"><JuryContent section={config} /></PageWrapper>;
};

export const Prizes: React.FC = () => {
    const config = useSectionConfig('prizes');
    return <PageWrapper title={config.title} bgClass="bg-gray-50"><PrizesContent section={config} /></PageWrapper>;
};

export const Fees: React.FC = () => {
    const config = useSectionConfig('fees');
    return <PageWrapper title={config.title} bgClass="bg-white"><FeesContent section={config} /></PageWrapper>;
};

export const Rules: React.FC = () => {
    const config = useSectionConfig('rules'); // Actually maps to HowToRegister
    return <PageWrapper title={config.title} bgClass="bg-white"><RulesContent section={config} /></PageWrapper>;
};

export const Contact: React.FC = () => {
    const config = useSectionConfig('contact');
    return <PageWrapper title={config.title} bgClass="bg-white"><ContactContent section={config} /></PageWrapper>;
};
