
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Chatbot from './Chatbot';
import PopupModal from './PopupModal';
import StickyFooter from './StickyFooter';
import WheelOfFortune from './WheelOfFortune';
// Fix: Renamed fomoNotification to FomoNotification to match the component name used in JSX (line 270)
import FomoNotification from './visuals/FomoNotification'; 
import FooterSection from './sections/FooterSection'; 
import { NavbarConfig, StickyFooterConfig, FloatingButtonsConfig } from '../types';
import { DEFAULT_NAVBAR_CONFIG, DEFAULT_STICKY_FOOTER_CONFIG, DEFAULT_FLOATING_CONFIG, DEFAULT_HERO_CONFIG } from '../config';

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
            <circle cx="45" cy="45" r="45" style={{ fill: 'rgb(42,181,64)' }} />
            <path d="M 16.138 44.738 c -0.002 5.106 1.332 10.091 3.869 14.485 l -4.112 15.013 l 15.365 -4.029 c 4.233 2.309 8.999 3.525 13.85 3.527 h 0.012 c 15.973 0 28.976 -12.999 28.983 -28.974 c 0.003 -7.742 -3.01 -15.022 -8.481 -20.498 c -5.472 -5.476 -12.749 -8.494 -20.502 -8.497 C 29.146 15.765 16.145 28.762 16.138 44.738 M 25.288 58.466 l -0.574 -0.911 c -2.412 -3.834 -3.685 -8.266 -3.683 -12.816 c 0.005 -13.278 10.811 -24.081 24.099 -24.081 c 6.435 0.003 12.482 2.511 17.031 7.062 c 4.548 4.552 7.051 10.603 7.05 17.037 C 69.205 58.036 58.399 68.84 45.121 68.84 h -0.009 c -4.323 -0.003 -8.563 -1.163 -12.261 -3.357 l -0.88 -0.522 l -9.118 2.391 L 25.288 58.466 z M 45.122 73.734 L 45.122 73.734 L 45.122 73.734 C 45.122 73.734 45.121 73.734 45.122 73.734" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
            <path d="M 37.878 32.624 c -0.543 -1.206 -1.113 -1.23 -1.63 -1.251 c -0.422 -0.018 -0.905 -0.017 -1.388 -0.017 c -0.483 0 -1.268 0.181 -1.931 0.906 c -0.664 0.725 -2.535 2.477 -2.535 6.039 c 0 3.563 2.595 7.006 2.957 7.49 c 0.362 0.483 5.01 8.028 12.37 10.931 c 6.118 2.412 7.362 1.933 8.69 1.812 c 1.328 -0.121 4.285 -1.751 4.888 -3.442 c 0.604 -1.691 0.604 -3.14 0.423 -3.443 c -0.181 -0.302 -0.664 -0.483 -1.388 -0.845 c -0.724 -0.362 -4.285 -2.114 -4.948 -2.356 c -0.664 -0.241 -1.147 -0.362 -1.63 0.363 c -0.483 0.724 -1.87 2.355 -2.292 2.838 c -0.422 0.484 -0.845 0.544 -1.569 0.182 c -0.724 -0.363 -3.057 -1.127 -5.824 -3.594 c -2.153 -1.92 -3.606 -4.29 -4.029 -5.015 c -0.422 -0.724 -0.045 -1.116 0.318 -1.477 c 0.325 -0.324 0.724 -0.846 1.087 -1.268 c 0.361 -0.423 0.482 -0.725 0.723 -1.208 c 0.242 -0.483 0.121 -0.906 -0.06 -1.269 C 39.929 37.637 38.522 34.056 37.878 32.624" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
        </g>
    </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFloatingUI, setShowFloatingUI] = useState(false); 
  const [navConfig, setNavConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG);
  const [floatingConfig, setFloatingConfig] = useState<FloatingButtonsConfig>(DEFAULT_FLOATING_CONFIG);
  const [footerActive, setFooterActive] = useState(false); 
  const cursorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadConfigs = () => {
      const storedNav = localStorage.getItem('navbarConfig');
      if (storedNav) try { setNavConfig({ ...DEFAULT_NAVBAR_CONFIG, ...JSON.parse(storedNav) }); } catch(e) {}

      const storedFloating = localStorage.getItem('floatingButtonsConfig');
      if (storedFloating) try { setFloatingConfig({ ...DEFAULT_FLOATING_CONFIG, ...JSON.parse(storedFloating) }); } catch(e) {}

      const storedFooter = localStorage.getItem('stickyFooterConfig');
      if (storedFooter) {
          try {
              const parsed: StickyFooterConfig = JSON.parse(storedFooter);
              setFooterActive(parsed.enabled);
          } catch(e) {}
      } else {
          setFooterActive(DEFAULT_STICKY_FOOTER_CONFIG.enabled);
      }
  };

  useEffect(() => {
      loadConfigs();
      const handleConfigUpdate = () => loadConfigs();
      window.addEventListener('navbarConfigUpdated', handleConfigUpdate);
      window.addEventListener('floatingConfigUpdated', handleConfigUpdate);
      window.addEventListener('marketingConfigUpdated', handleConfigUpdate);
      window.addEventListener('stickyFooterUpdated', handleConfigUpdate);
      return () => {
          window.removeEventListener('navbarConfigUpdated', handleConfigUpdate);
          window.removeEventListener('floatingConfigUpdated', handleConfigUpdate);
          window.removeEventListener('marketingConfigUpdated', handleConfigUpdate);
          window.removeEventListener('stickyFooterUpdated', handleConfigUpdate);
      };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    
    const handleScroll = () => {
        setShowFloatingUI(window.scrollY > 350);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (url: string) => {
      setIsMobileMenuOpen(false);
      if (url.startsWith('#')) {
          if (location.pathname === '/') {
              const el = document.getElementById(url.replace('#', ''));
              if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
              navigate(`/${url}`);
          }
      } else if (url.startsWith('http')) {
          window.open(url, '_blank');
      } else {
          navigate(url);
          window.scrollTo(0,0);
      }
  };

  const getNavContainerClass = () => {
      const design = navConfig.design || 'default';
      switch (design) {
          case 'modern_pill': return 'bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full max-w-screen-lg mx-auto top-6';
          case 'dark_glass': return 'bg-brand-dark/90 backdrop-blur-lg border border-white/10 shadow-lg max-w-screen-xl mx-auto rounded-2xl top-4';
          case 'full_width': return 'bg-white/95 backdrop-blur-md shadow-md w-full top-0 rounded-none';
          default: return 'bg-white/80 backdrop-blur-md mx-4 md:mx-8 lg:mx-auto rounded-xl shadow-lg max-w-screen-lg top-4';
      }
  };

  const getNavLinkClass = () => {
      const design = navConfig.design || 'default';
      return design === 'dark_glass' ? 'text-gray-300 hover:text-white' : 'text-gray-600';
  };

  const getMobileMenuClass = () => {
      const design = navConfig.design || 'default';
      return design === 'dark_glass' ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark';
  };

  const visibleLinks = (navConfig.links || []).filter(l => l.visible);

  const floatingBottom = footerActive 
    ? (window.innerWidth < 768 ? '85px' : '80px') 
    : '24px';

  return (
    <>
      <Toaster position="top-right" richColors />
      {location.pathname !== '/' && <div id="global-animated-bg"></div>}
      
      <div ref={cursorRef} className="custom-cursor hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15 3.05a1 1 0 00-1-1H7a1 1 0 00-1 1v8.41a3.001 3.001 0 102 2.83V5.05h6v6.41a3.001 3.001 0 102 2.83V3.05z"></path>
        </svg>
      </div>

      <nav className={`sticky z-[100] transition-all duration-300 ${getNavContainerClass()}`}>
        <div className="px-4 md:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 rounded-md transition-colors ${navConfig.design === 'dark_glass' ? 'text-white hover:bg-white/10' : 'text-brand-dark hover:bg-gray-100'}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
            
            {navConfig.showContactIcons && (
                <div className="hidden md:flex items-center gap-4">
                   <a href="tel:0772172073" className={`transition-transform hover:scale-110 ${navConfig.design === 'dark_glass' ? 'text-violet-300 hover:text-white' : 'text-brand-purple hover:text-brand-dark'}`} title="Sună-ne">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.218 5.218l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   </a>
                   <a href="https://wa.me/40772172073" target="_blank" rel="noreferrer" className={`transition-transform hover:scale-110`} title="WhatsApp">
                      <WhatsAppIcon className="w-6 h-6" />
                   </a>
                   <a href="mailto:contact@voiceup-festival.ro" className={`transition-transform hover:scale-110 ${navConfig.design === 'dark_glass' ? 'text-pink-300 hover:text-white' : 'text-brand-pink hover:text-brand-dark'}`} title="Email">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                   </a>
                </div>
            )}

            <div className="hidden md:flex items-center md:space-x-2 lg:space-x-6">
               {visibleLinks.map((link, index) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.url); }} 
                    className={`relative font-semibold md:text-sm lg:text-base md:py-2 md:px-3 lg:px-4 rounded-lg desktop-nav-link nav-color-${(index % 6) + 1} cursor-pointer ${getNavLinkClass()}`}
                  >
                      {link.label}
                      <span className="nav-note-icon">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                      </span>
                  </a>
               ))}
            </div>
          </div>

          {navConfig.showCtaButton && (
              <a href={navConfig.ctaButtonLink} onClick={(e) => { e.preventDefault(); handleNavClick(navConfig.ctaButtonLink); }} className={`nav-cta-animated-btn ripple-btn bg-brand-pink text-white font-bold py-2 px-5 md:px-8 text-sm md:text-base rounded-full shadow-md hover:bg-opacity-90 transition-all`}>
                  {navConfig.ctaButtonText}
              </a>
          )}
        </div>
      </nav>

      {/* MOBILE MENU WITH LARGER LOGO CENTERED */}
      <div className={`fixed inset-0 z-[101] p-6 flex flex-col transition-all duration-500 ${getMobileMenuClass()} ${isMobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible -translate-x-full'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="w-12"></div> {/* Compensator pentru butonul de închidere ca logo-ul să fie pe centru */}
            <div className="flex-grow flex justify-center pt-2">
                <img 
                    src={DEFAULT_HERO_CONFIG.logoUrl} 
                    alt="VoiceUP" 
                    className="h-28 md:h-32 w-auto object-contain drop-shadow-xl animate-logo-float" 
                />
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-full text-brand-dark shadow-md active:scale-90 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center space-y-6 md:space-y-8">
            {visibleLinks.map((link) => (
                <a key={link.id} href={link.url} onClick={(e) => { e.preventDefault(); handleNavClick(link.url); }} className="text-3xl md:text-4xl font-black text-brand-dark hover:text-brand-purple transition-all transform hover:scale-110 active:scale-95">
                    {link.label}
                </a>
            ))}
        </div>

        {/* MOBILE MENU BOTTOM CONTACT BUTTONS */}
        <div className="mt-auto grid grid-cols-2 gap-4 pb-8 border-t border-gray-100 pt-8">
            <a href="tel:0772172073" className="flex flex-col items-center justify-center gap-2 p-4 bg-brand-purple/5 rounded-2xl border border-brand-purple/10 text-brand-purple font-black transition-all active:scale-95">
                <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.218 5.218l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Suna-ne</span>
            </a>
            <a href="https://wa.me/40772172073" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 font-black transition-all active:scale-95">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    <WhatsAppIcon className="w-full h-full" />
                </div>
                <span className="text-xs uppercase tracking-widest">WhatsApp</span>
            </a>
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div key={location.pathname} className="page-transition-enter w-full flex-grow">
            {children}
        </div>
        <FooterSection />
      </div>

      {floatingConfig.whatsappEnabled && (
          <a 
            href="https://wa.me/40772172073" 
            target="_blank" rel="noreferrer" 
            className={`fixed z-[90] transition-all duration-500 transform left-6 ${showFloatingUI ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}
            style={{ bottom: floatingBottom }}
          >
            <WhatsAppIcon className="w-14 h-14 md:w-16 md:h-16 shadow-[0_10px_30px_rgba(37,211,102,0.5)] rounded-full hover:scale-110 transition-transform" />
          </a>
      )}

      {floatingConfig.backToTopEnabled && showFloatingUI && (
        <button 
            onClick={scrollToTop} 
            className={`fixed z-[90] bg-brand-pink text-white p-3 rounded-full shadow-2xl hover:bg-pink-600 transition-all transform hover:scale-110 flex items-center justify-center right-6`}
            style={{ 
                bottom: floatingConfig.chatbotEnabled 
                    ? (footerActive ? (window.innerWidth < 768 ? '160px' : '140px') : '100px') 
                    : floatingBottom
            }}
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        </button>
      )}

      <WheelOfFortune />
      <PopupModal />
      <Chatbot />
      <StickyFooter />
      <FomoNotification />
    </>
  );
};

export default Layout;
