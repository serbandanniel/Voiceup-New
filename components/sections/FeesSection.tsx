
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SectionConfig, FormConfig } from '../../types';
import { DEFAULT_FORM_CONFIG } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const FeesSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
    const [promoTimeLeft, setPromoTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('formConfig');
        if(stored) {
            try { 
                const parsed = JSON.parse(stored);
                setConfig({
                    ...DEFAULT_FORM_CONFIG,
                    ...parsed,
                    fieldRequirements: { ...DEFAULT_FORM_CONFIG.fieldRequirements, ...(parsed.fieldRequirements || {}) },
                    promotion: { ...DEFAULT_FORM_CONFIG.promotion, ...(parsed.promotion || {}) }
                }); 
            } catch(e) { console.error(e); }
        }
    }, []);

    // Promo Logic
    const isPromoActive = config.promotion.enabled && new Date(config.promotion.endDate) > new Date();
    const costs = isPromoActive ? config.promotion.costs : config.costs;

    useEffect(() => {
        if (!isPromoActive) return;
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(config.promotion.endDate);
            const diff = end.getTime() - now.getTime();
            if (diff <= 0) {
                setPromoTimeLeft(null);
                clearInterval(interval);
            } else {
                setPromoTimeLeft({
                    hours: Math.floor(diff / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPromoActive, config.promotion.endDate]);

    const handleScrollToRegister = (e: React.MouseEvent) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const target = document.getElementById('formular-inscriere');
            if (target) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const getDiscountBadge = (original: number, current: number) => {
        if (!isPromoActive || original <= current) return null;
        const percent = Math.round(((original - current) / original) * 100);
        return (
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-brand-dark w-10 h-10 flex items-center justify-center rounded-full font-black text-xs shadow-lg transform rotate-12 z-20 animate-pulse border-2 border-white">
                -{percent}%
            </div>
        );
    };

    // Component for Price Display inside cards
    const PricePill: React.FC<{ label: string, subLabel?: string, original: number, current: number }> = ({ label, subLabel, original, current }) => {
        const hasDiscount = isPromoActive && original > current;
        return (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-3 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group hover:bg-white/30 transition-all cursor-default">
                {hasDiscount && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                        PROMO
                    </div>
                )}
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</span>
                <div className="leading-none">
                    {hasDiscount && <span className="block text-white/60 line-through text-[10px] mb-0.5 font-semibold">{original} RON</span>}
                    <span className="block text-white font-black text-xl md:text-2xl drop-shadow-sm">{current}</span>
                    <span className="text-white/90 text-[10px] font-bold">RON</span>
                </div>
                {subLabel && <span className="text-white/70 text-[9px] mt-1">{subLabel}</span>}
            </div>
        );
    };

    const cards = [
        {
            title: "1 PIESĂ",
            originalPrice: config.costs.individual['1'],
            price: costs.individual['1'],
            subtitle: "Participare individuală",
            features: ["Diplomă de participare", "Evaluare juriu", "Cadouri sponsori"],
            color: "bg-brand-purple",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            )
        },
        {
            title: "2 PIESE",
            originalPrice: config.costs.individual['2'],
            price: costs.individual['2'],
            subtitle: "Participare individuală",
            features: ["Diplomă de participare", "Evaluare juriu", "Cadouri sponsori"],
            color: "bg-brand-pink",
            icon: (
                 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-9c-1.103 0-2 .897-2 2v9.185A2.992 2.992 0 0 0 7 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V8h8v7.185A2.992 2.992 0 0 0 16 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V6h1v-2z"/></svg>
            )
        },
        {
            title: "3 PIESE",
            originalPrice: config.costs.individual['3'],
            price: costs.individual['3'],
            subtitle: "Participare individuală",
            features: ["Diplomă de participare", "Evaluare juriu", "Cadouri sponsori"],
            color: "bg-brand-yellow",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            )
        },
        {
            title: "GRUP MIC",
            originalPrice: config.costs.group.small,
            price: costs.group.small,
            subtitle: "/ persoană (2-5 pers)",
            features: ["Diplomă de participare", "Evaluare juriu (grup)", "Cadouri sponsori"],
            color: "bg-blue-500",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-9c-1.103 0-2 .897-2 2v9.185A2.992 2.992 0 0 0 7 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V8h8v7.185A2.992 2.992 0 0 0 16 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V6h1v-2z"/></svg>
            )
        },
        {
            title: "GRUP MARE",
            originalPrice: config.costs.group.large,
            price: costs.group.large,
            subtitle: "/ persoană (peste 5 pers)",
            features: ["Diplomă de participare", "Evaluare juriu (grup)", "Cadouri sponsori"],
            color: "bg-teal-600",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-9c-1.103 0-2 .897-2 2v9.185A2.992 2.992 0 0 0 7 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V8h8v7.185A2.992 2.992 0 0 0 16 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V6h1v-2z"/></svg>
            )
        }
    ];

    // Helper for desktop view
    const DesktopFeeCard = ({ card }: { card: typeof cards[0] }) => {
        const hasDiscount = isPromoActive && card.originalPrice > card.price;
        return (
            <div className={`relative bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 border border-gray-100 hover:shadow-2xl h-full hover:scale-105 ${hasDiscount ? 'ring-2 ring-red-400' : ''}`}>
                {getDiscountBadge(card.originalPrice, card.price)}
                
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${card.color} flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0`}>
                    {card.icon}
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-wide">{card.title}</h3>
                
                {hasDiscount ? (
                    <div className="my-4 flex flex-col items-center">
                        <span className="text-gray-400 line-through text-lg font-bold">{card.originalPrice} RON</span>
                        <div>
                            <span className="text-4xl font-black text-red-500">{card.price}</span>
                            <span className="text-xl font-bold text-red-500"> RON</span>
                        </div>
                    </div>
                ) : (
                    <div className="my-4">
                        <span className={`text-4xl font-black ${card.color.replace('bg-', 'text-')}`}>{card.price}</span>
                        <span className={`text-xl font-bold ${card.color.replace('bg-', 'text-')}`}> RON</span>
                    </div>
                )}
                
                <p className="text-xs text-gray-500 font-semibold uppercase mb-4 md:mb-6">{card.subtitle}</p>
                
                <div className="space-y-2 w-full text-left mb-6 flex-grow">
                        {card.features.map((feat, fidx) => (
                            <div key={fidx} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                <span>{feat}</span>
                            </div>
                        ))}
                </div>
                
                <Link 
                    to={location.pathname === '/' ? '#formular-inscriere' : '/register'} 
                    onClick={handleScrollToRegister}
                    className={`w-full py-2 md:py-3 rounded-full font-bold text-white text-sm md:text-base shadow-md hover:opacity-90 transition-opacity text-center ${card.color}`}
                >
                    Înscrie-te
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
             <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
                <SectionTitle section={section} />
                <p className="mt-4 text-lg text-gray-600 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    Alege pachetul potrivit pentru tine și pregătește-te de spectacol!
                </p>
                {isPromoActive && promoTimeLeft && (
                    <div className="mt-6 inline-flex flex-col items-center bg-red-100 border border-red-200 text-red-800 px-6 py-3 rounded-xl animate-pulse shadow-md">
                        <span className="text-xs font-bold uppercase tracking-widest mb-1">Ofertă Specială Expiră în:</span>
                        <div className="text-2xl font-black font-mono">
                            {promoTimeLeft.hours}h : {String(promoTimeLeft.minutes).padStart(2, '0')}m : {String(promoTimeLeft.seconds).padStart(2, '0')}s
                        </div>
                    </div>
                )}
            </div>

            {/* --- MOBILE VIEW: 2 COMPACT AGGREGATE CARDS --- */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
                {/* 1. INDIVIDUAL CARD */}
                <div className="rounded-3xl p-5 shadow-2xl bg-gradient-to-br from-brand-purple to-brand-pink text-white relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-wide">Individual</h3>
                            <p className="text-[10px] text-white/80 font-semibold">Participare Solo</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        <PricePill label="1 Piesă" original={config.costs.individual['1']} current={costs.individual['1']} />
                        <PricePill label="2 Piese" original={config.costs.individual['2']} current={costs.individual['2']} />
                        <PricePill label="3 Piese" original={config.costs.individual['3']} current={costs.individual['3']} />
                    </div>

                    <div className="mt-5 relative z-10">
                        <div className="flex gap-2 mb-4 justify-center">
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded flex items-center gap-1"><span className="text-green-300">✓</span> Diplomă</span>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded flex items-center gap-1"><span className="text-green-300">✓</span> Trofeu</span>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded flex items-center gap-1"><span className="text-green-300">✓</span> Feedback</span>
                        </div>
                        <Link 
                            to={location.pathname === '/' ? '#formular-inscriere' : '/register'} 
                            onClick={handleScrollToRegister}
                            className="block w-full py-3 bg-white text-brand-purple font-black text-center rounded-xl shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
                        >
                            Înscrie-te Individual
                        </Link>
                    </div>
                </div>

                {/* 2. GROUP CARD */}
                <div className="rounded-3xl p-5 shadow-2xl bg-gradient-to-br from-brand-dark to-brand-purple text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

                    <div className="flex items-center gap-3 mb-5 relative z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-9c-1.103 0-2 .897-2 2v9.185A2.992 2.992 0 0 0 7 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V8h8v7.185A2.992 2.992 0 0 0 16 15c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3V6h1v-2z"/></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-wide">Grupuri</h3>
                            <p className="text-[10px] text-white/80 font-semibold">Coruri & Trupe</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <PricePill label="Grup Mic" subLabel="2-5 Persoane" original={config.costs.group.small} current={costs.group.small} />
                        <PricePill label="Grup Mare" subLabel="6+ Persoane" original={config.costs.group.large} current={costs.group.large} />
                    </div>

                    <div className="mt-5 relative z-10">
                        <div className="flex gap-2 mb-4 justify-center">
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded flex items-center gap-1"><span className="text-green-300">✓</span> Diplomă Grup</span>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded flex items-center gap-1"><span className="text-green-300">✓</span> Trofee</span>
                        </div>
                        <Link 
                            to={location.pathname === '/' ? '#formular-inscriere' : '/register'} 
                            onClick={handleScrollToRegister}
                            className="block w-full py-3 bg-white text-brand-dark font-black text-center rounded-xl shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
                        >
                            Înscrie Grupul
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP VIEW: Original Grid --- */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className={`h-full ${idx === 4 ? 'col-span-2 lg:col-span-1' : ''}`}>
                        <DesktopFeeCard card={card} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeesSection;
