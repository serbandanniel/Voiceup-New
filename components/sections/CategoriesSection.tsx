
import React from 'react';
import { SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';

const CategoriesSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    // Data for Ages - Optimized with Brand Colors
    const ageCategories = [
        { id: '1', label: '5 - 7 ani', sub: 'Mici Artiști', icon: '🐣', color: 'text-brand-pink', bg: 'bg-pink-50', border: 'border-brand-pink/20' },
        { id: '2', label: '8 - 10 ani', sub: 'Junior', icon: '🚀', color: 'text-brand-purple', bg: 'bg-purple-50', border: 'border-brand-purple/20' },
        { id: '3', label: '11 - 13 ani', sub: 'Pre-Teen', icon: '🎤', color: 'text-brand-yellow', bg: 'bg-yellow-50', border: 'border-brand-yellow/20' },
        { id: '4', label: '14 - 16 ani', sub: 'Teen Star', icon: '⭐', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
        { id: '5', label: '17 - 18+ ani', sub: 'Young Adult', icon: '🔥', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' }
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
                <SectionTitle section={section} />
                <p className="mt-4 text-gray-500 animate-on-scroll">
                    Competiția este structurată pe categorii de vârstă pentru a asigura o evaluare corectă.
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-y-1/2 z-0 rounded-full"></div>

                {/* Categories Container */}
                <div className="flex flex-wrap justify-center md:justify-between items-start gap-x-3 gap-y-2 md:gap-0 relative z-10">
                    {ageCategories.map((item, index) => {
                        const isDesktopDown = index % 2 !== 0;
                        const desktopClass = isDesktopDown ? 'md:mt-16' : 'md:mb-8';
                        const isMobileRightColumn = index % 2 !== 0;
                        const mobileClass = isMobileRightColumn ? 'mt-6' : 'mt-0';

                        return (
                            <div 
                                key={item.id} 
                                className={`w-[47%] md:w-[17%] flex flex-col items-center group animate-on-scroll ${mobileClass} ${desktopClass}`}
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                {/* Compact Card */}
                                <div className={`relative bg-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl border ${item.border} transition-all duration-300 transform hover:-translate-y-1.5 w-full text-center flex flex-col items-center h-full min-h-[135px] md:min-h-0`}>
                                    
                                    {/* Connector Dot (Desktop) */}
                                    <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-[3px] border-gray-200 z-20 ${isDesktopDown ? '-top-10' : '-bottom-10'}`}></div>
                                    {/* Vertical Line to Connector (Desktop) */}
                                    <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-px bg-gray-200 h-8 ${isDesktopDown ? '-top-9' : '-bottom-9'}`}></div>

                                    {/* Icon Bubble */}
                                    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${item.bg} ${item.color} flex items-center justify-center text-base md:text-xl mb-2 md:mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>

                                    <h4 className="text-sm md:text-base font-black text-brand-dark mb-0.5 leading-tight">
                                        {item.label}
                                    </h4>
                                    
                                    <div className="h-0.5 w-4 md:w-6 bg-gray-50 my-1.5 rounded-full"></div>

                                    <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${item.color} drop-shadow-sm`}>
                                        {item.sub}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Note about multiple sections */}
            <div className="text-center mt-10 md:mt-16 animate-on-scroll">
                <p className="inline-flex items-center gap-2 text-[10px] md:text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-left md:text-center leading-tight">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Secțiunea muzicală (ușoară, populară, instrument ...etc) se alege în formularul de înscriere.
                </p>
            </div>
        </div>
    );
};

export default CategoriesSection;
