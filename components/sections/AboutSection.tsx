
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';

const AboutSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    
    const benefits = [
        { title: 'Experiența Scenei', text: 'Prinde curaj cântând live în fața unui public.', icon: '🎤', color: 'border-brand-pink', bg: 'hover:bg-brand-pink/5' },
        { title: 'Feedback Valoros', text: 'Primește sfaturi de la profesioniști din industrie.', icon: '⭐', color: 'border-brand-purple', bg: 'hover:bg-brand-purple/5' },
        { title: 'Lansare în Carieră', text: 'Câștigă premii valoroase, studio și videoclipuri.', icon: '🚀', color: 'border-brand-yellow', bg: 'hover:bg-brand-yellow/10' },
        { title: 'Noi Prietenii', text: 'Întâlnește alți copii pasionați de muzică.', icon: '🤝', color: 'border-blue-400', bg: 'hover:bg-blue-50' }
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative">
            {/* Background Decor Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center mb-8 md:mb-16 relative z-10">
                <SectionTitle section={section} />
            </div>

            {/* 1. OMG MUSIC SPOTLIGHT - FEATURED CARD */}
            <div className="relative z-10 mb-10 md:mb-20 animate-on-scroll">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-gray-100 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-gradient-to-b from-brand-purple to-brand-pink group-hover:w-3 transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-50"></div>
                    
                    <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        {/* Icon / Brand Visual - Updated with Link and Larger Rectangular Size */}
                        <div className="flex-shrink-0">
                            <a 
                                href="https://www.instagram.com/omgmusicro/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="block transition-transform duration-300 hover:scale-105 active:scale-95"
                            >
                                <div 
                                    className="w-28 h-20 md:w-44 md:h-32 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl transform rotate-2 group-hover:rotate-6 transition-all duration-500 p-4 md:p-6"
                                    style={{ backgroundColor: '#211050' }}
                                >
                                    <img 
                                        src="https://i.postimg.cc/wy3JZF3Y/2.png" 
                                        alt="OMG Music Logo" 
                                        className="w-full h-full object-contain"
                                    />
                                    {/* Small external link indicator */}
                                    <div className="absolute -bottom-1 -right-1 bg-brand-pink text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Content */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="inline-block bg-brand-pink/10 text-brand-pink text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider mb-2 md:mb-3">
                                Partener Principal
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-brand-dark mb-2 md:mb-3 leading-tight">
                                Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">OMG Music</span>
                            </h3>
                            <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                                Singura casă de producție pentru copii și tineret, <b>OMG Music</b> este rampa de lansare și cel mai bun prieten al oricărui artist la început de drum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN DESCRIPTION - SPLIT LAYOUT */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start mb-10 md:mb-20 relative z-10">
                <div className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    <h3 className="text-xl md:text-3xl font-extrabold text-brand-dark mb-3 md:mb-6 relative inline-block">
                        Ce este VoiceUP Festival?
                        <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-brand-yellow/30 -z-10 transform -rotate-1"></span>
                    </h3>
                    <p className="text-gray-700 text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
                        VoiceUP Festival este o sărbătoare a talentului, dedicată exclusiv copiilor (cu vârste de la 5 ani în sus). 
                    </p>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        Am creat acest eveniment din dorința de a oferi celor mai tineri artiști șansa de a străluci, de a-și descoperi vocea și de a câștiga experiență valoroasă pe o scenă profesionistă.
                    </p>
                </div>

                <div className="bg-gray-50 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-inner animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                    <div className="flex items-start gap-3 md:gap-4">
                        <div className="text-2xl md:text-4xl">💡</div>
                        <div>
                            <h4 className="font-bold text-base md:text-xl text-brand-purple mb-2 md:mb-3">Mai mult decât un concurs</h4>
                            <p className="text-gray-600 text-sm md:text-base italic leading-relaxed">
                                "Participarea la VoiceUP este o investiție în viitorul artistic al copilului tău. Nu este doar despre competiție, ci despre creștere, încredere și bucuria de a cânta."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BENEFITS - DESKTOP GRID (Icon to the Left) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10 animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
                {benefits.map((item, idx) => (
                    <div key={idx} className={`bg-white p-5 rounded-2xl border-l-4 ${item.color} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-5 ${item.bg}`}>
                        <div className="text-4xl flex-shrink-0">{item.icon}</div>
                        <div>
                            <h4 className="font-black text-lg text-brand-dark mb-1 leading-tight">{item.title}</h4>
                            <p className="text-sm text-gray-600 leading-snug">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. BENEFITS - MOBILE CARD STACK SLIDER (Extra Compact) */}
            <div className="md:hidden relative z-10 animate-on-scroll pb-4" style={{ transitionDelay: '0.3s' }}>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards, Autoplay]}
                    className="w-[280px] h-[115px]"
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                >
                    {benefits.map((item, idx) => (
                        <SwiperSlide key={idx} className="rounded-2xl shadow-xl">
                            <div className={`bg-white p-4 w-full h-full rounded-2xl border-l-4 ${item.color} flex items-center text-left gap-3`}>
                                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="font-black text-base text-brand-dark mb-0.5 leading-tight">{item.title}</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight">{item.text}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="text-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-pulse flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16l-4-4m0 0l4-4m-4 4h18m-5 4l4-4m0 0l-4-4"/></svg>
                    Swipe pentru beneficii
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
