
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    AboutContent, CategoriesContent, LocationContent,
    PartnersContent, JuryContent, PrizesContent, 
    FeesContent, RulesContent, FAQContent, ContactContent,
    FooterContent,
    // Visual Sections
    PhotoGallery, VideoGallery, ReviewsSection 
} from '../components/Sections';
import RegistrationForm from '../components/RegistrationForm';
import HeroSection from '../components/hero/HeroSection';
import CountdownSection from '../components/countdown/CountdownSection';
import SectionSeparator from '../components/SectionSeparator';
import SEO from '../components/SEO';
import { CountdownConfig, HeroConfig, SectionConfig } from '../types';
import { DEFAULT_COUNTDOWN_CONFIG, DEFAULT_HERO_CONFIG, DEFAULT_SECTIONS_CONFIG } from '../config';
import { hexToRgba } from '../utils/styleUtils';

// MAP IDs to Components
const sectionComponents: { [key: string]: React.FC<any> } = {
    about: AboutContent,
    categories: CategoriesContent,
    location: LocationContent,
    partners: PartnersContent,
    jury: JuryContent,
    prizes: PrizesContent,
    fees: FeesContent,
    howto: RulesContent, // 'howto' maps to RulesContent (renamed HowToRegisterSection)
    register: ({ section }: { section: SectionConfig }) => (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="relative inline-block animate-on-scroll">
                    <div className="absolute inset-0 bg-brand-pink transform -skew-y-2 rounded-lg shadow-lg"></div>
                    <h2 className="relative z-10 text-2xl md:text-4xl font-extrabold text-white px-10 py-3">{section.title}</h2>
                </div>
                <p className="mt-4 text-lg text-gray-600 animate-on-scroll" style={{transitionDelay: '0.1s'}}>
                    Completează formularul de mai jos și pregătește-te să urci pe scenă! Locurile sunt limitate.
                </p>
            </div>
            <div className="animate-on-scroll" style={{transitionDelay: '0.2s'}}>
                <RegistrationForm />
            </div>
        </div>
    ),
    faq: FAQContent,
    contact: ContactContent,
    gallery: PhotoGallery,
    video: VideoGallery,
    reviews: ReviewsSection,
    footer: FooterContent
};

const Home: React.FC = () => {
    const [countdownConfig, setCountdownConfig] = useState<CountdownConfig>(DEFAULT_COUNTDOWN_CONFIG);
    const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
    const [sectionsConfig, setSectionsConfig] = useState<SectionConfig[]>(DEFAULT_SECTIONS_CONFIG);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

    // Effect for Hash Scrolling on Load/Refresh
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            // Slight delay to ensure content is rendered/ready
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); 
        }
    }, [location.hash]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        
        const storedCountdown = localStorage.getItem('countdownConfig');
        if (storedCountdown) {
            try { 
                const parsed = JSON.parse(storedCountdown);
                setCountdownConfig({ ...DEFAULT_COUNTDOWN_CONFIG, ...parsed, sizing: { ...DEFAULT_COUNTDOWN_CONFIG.sizing, ...(parsed.sizing || {}) } });
            } catch(e) { console.error(e); }
        }
        
        const storedHero = localStorage.getItem('heroConfig');
        if (storedHero) {
            try {
                const parsed = JSON.parse(storedHero);
                setHeroConfig({ ...DEFAULT_HERO_CONFIG, ...parsed, gradient: { ...DEFAULT_HERO_CONFIG.gradient, ...(parsed.gradient || {}) }, logoAnimation: { ...DEFAULT_HERO_CONFIG.logoAnimation, ...(parsed.logoAnimation || {}) }, titleStyles: { ...DEFAULT_HERO_CONFIG.titleStyles, ...(parsed.titleStyles || {}) }, buttonStyles: { ...DEFAULT_HERO_CONFIG.buttonStyles, ...(parsed.buttonStyles || {}) } });
            } catch(e) { console.error(e); }
        }

        const storedSections = localStorage.getItem('sectionsConfig');
        if (storedSections) {
             try { 
                const parsed = JSON.parse(storedSections);
                // Merge with default to ensure we have all new sections even if local storage is old
                const merged = DEFAULT_SECTIONS_CONFIG.map(defaultSection => {
                    const savedSection = parsed.find((s: SectionConfig) => s.id === defaultSection.id);
                    return savedSection ? { ...defaultSection, ...savedSection } : defaultSection;
                });
                setSectionsConfig(merged);
             } catch(e) { console.error(e); }
        }
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getVisibilityClass = (visibility: { desktop: boolean, mobile: boolean }) => {
        if (visibility.desktop && visibility.mobile) return '';
        if (visibility.desktop) return 'hidden md:block';
        if (visibility.mobile) return 'block md:hidden';
        return 'hidden';
    };

    const heroSectionSettings = sectionsConfig.find(s => s.id === 'hero') || DEFAULT_SECTIONS_CONFIG[0];
    const countdownSectionSettings = sectionsConfig.find(s => s.id === 'countdown') || DEFAULT_SECTIONS_CONFIG[1];
    
    // Main sections excluding hero/countdown AND now 'footer' (handled globally by Layout)
    const mainSections = sectionsConfig.filter(s => !['hero', 'countdown', 'footer'].includes(s.id));

    return (
        <>
            <SEO 
                title="VoiceUP Festival - Let's VoiceUP Together!" 
                description="Cel mai mare festival de muzică pentru copii și tineret. Înscrie-te acum la VoiceUP Festival și arată-ne talentul tău!" 
            />

            <div className="relative z-0">
                <HeroSection config={heroConfig} sectionSettings={heroSectionSettings} isMobile={isMobile} />
                {heroSectionSettings.separatorBottom && <SectionSeparator config={heroSectionSettings.separatorBottom} />}
            </div>
            
            <div className="relative z-10">
                <CountdownSection config={countdownConfig} sectionSettings={countdownSectionSettings} isMobile={isMobile} />
                {countdownSectionSettings.separatorBottom && <SectionSeparator config={countdownSectionSettings.separatorBottom} />}
            </div>

            {mainSections.map((section, index) => {
                if (!section.enabled) return null;
                const Component = sectionComponents[section.id];
                if (!Component) return null;
                
                // Footer is no longer rendered here
                
                // REMOVED THE TOP MARGIN from index 0 to eliminate the gap
                const marginClass = index === 0 ? '' : '-mt-px';
                
                const idMap: { [key: string]: string } = {
                     about: 'despre', categories: 'categorii', location: 'locatie', 
                     partners: 'parteneri', jury: 'juriu', prizes: 'premii', 
                     fees: 'taxe-inscriere', howto: 'cum-ma-inscriu', register: 'formular-inscriere',
                     gallery: 'galerie', video: 'video', reviews: 'recenzii', contact: 'contact', faq: 'faq'
                };
                
                const bgStyle = section.bgColor ? { backgroundColor: hexToRgba(section.bgColor, 0.98) } : { backgroundColor: '#ffffff' };
                
                const shadowIntensity = section.shadowIntensity ?? 25;
                const boxShadow = section.shadowColor && shadowIntensity > 0 
                    ? `0 -${shadowIntensity / 2}px ${shadowIntensity}px -${shadowIntensity / 4}px ${section.shadowColor}` 
                    : 'none';

                return (
                    <section
                        key={section.id}
                        id={idMap[section.id] || section.id}
                        className={`relative py-8 md:py-16 backdrop-blur-sm scroll-mt-32 overflow-hidden ${marginClass} ${getVisibilityClass(section.visibility)}`}
                        style={{ 
                            zIndex: 10 + index,
                            ...bgStyle,
                            boxShadow: boxShadow
                        }}
                    >
                       <Component section={section} />
                       
                       {section.separatorBottom && <SectionSeparator config={section.separatorBottom} />}
                    </section>
                );
            })}
        </>
    );
};

export default Home;
