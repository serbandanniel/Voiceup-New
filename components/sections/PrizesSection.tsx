
import React, { useState, useEffect } from 'react';
import { SectionConfig, PrizesConfig } from '../../types';
import { DEFAULT_PRIZES_CONFIG } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const PrizesSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [config, setConfig] = useState<PrizesConfig>(DEFAULT_PRIZES_CONFIG);

    useEffect(() => {
        const stored = localStorage.getItem('prizesConfig');
        if(stored) {
            try { setConfig(JSON.parse(stored)); } catch(e) { console.error(e); }
        }
    }, []);

    const topPrize = config.prizes[0];
    const restPrizes = config.prizes.slice(1); // For Mobile Grid
    const leftPrizes = config.prizes.slice(1, 4); // For Desktop Left Col
    const rightPrizes = config.prizes.slice(4, 7); // For Desktop Right Col

    return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
            <SectionTitle section={section} />
            <p className="mt-4 text-lg text-gray-600 animate-on-scroll is-visible" style={{ transitionDelay: '0.1s' }}>
                Talentul tău merită răsplătit! Iată premiile care îți pot lansa cariera.
            </p>
            <div className="my-6 md:my-8 animate-on-scroll is-visible" style={{ transitionDelay: '0.15s' }}>
                <div className="inline-block bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-brand-dark p-4 md:p-6 rounded-xl shadow-2xl transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300">
                    <span className="block text-sm md:text-xl font-bold uppercase tracking-wider drop-shadow-sm">PREMII ÎN VALOARE DE</span>
                    <span className="block text-3xl md:text-6xl font-extrabold text-brand-purple drop-shadow-md">5000 EURO</span>
                </div>
            </div>
        </div>
        
        {/* Top Prize - Centered (Responsive Size) */}
        {topPrize && (
            <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12 animate-on-scroll is-visible">
                 <div className={`w-14 h-14 md:w-16 md:h-16 ${topPrize.colorClass} ${topPrize.textColorClass} rounded-full flex items-center justify-center font-extrabold text-xl md:text-2xl shadow-xl ring-4 ring-white mb-3 md:mb-4 relative z-10`}>
                    1
                    <div className="absolute -top-1 -right-1 text-2xl">👑</div>
                 </div>
                 <h3 className="text-xl md:text-3xl font-black text-brand-dark uppercase tracking-tight">{topPrize.title}</h3>
                 <p className="text-sm md:text-lg text-gray-700 mt-2 max-w-lg leading-relaxed">{topPrize.desc}</p>
            </div>
        )}

        {/* --- MOBILE LAYOUT (2 Columns Grid) --- */}
        <div className="grid grid-cols-2 gap-3 lg:hidden animate-on-scroll is-visible">
            {restPrizes.map((p, i) => (
                <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                    {/* Compact Number Badge */}
                    <div className={`w-8 h-8 ${p.colorClass} ${p.textColorClass} rounded-full flex items-center justify-center font-bold text-sm shadow-md mb-2`}>
                        {i + 2}
                    </div>
                    
                    {/* Compact Text */}
                    <h4 className="text-sm font-bold text-brand-dark leading-tight mb-1 line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                        {p.title}
                    </h4>
                    
                    {/* Bolded Description for visibility */}
                    <p className="text-[10px] text-gray-800 font-bold leading-snug line-clamp-4 border-t border-gray-50 pt-1 mt-1 w-full">
                        {p.desc}
                    </p>
                </div>
            ))}
        </div>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Column */}
            <div className="space-y-10 animate-on-scroll is-visible order-1">
                {leftPrizes.map((p, i) => (
                    <div key={p.id} className="flex flex-col items-end text-right group">
                         <div className="flex items-center gap-4 flex-row-reverse mb-2">
                             <div className={`w-12 h-12 ${p.colorClass} ${p.textColorClass} rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform`}>{i + 2}</div>
                             <h4 className="text-xl font-bold text-brand-dark">{p.title}</h4>
                         </div>
                         <p className="text-gray-800 font-bold text-sm max-w-xs">{p.desc}</p>
                    </div>
                ))}
            </div>

            {/* Center Image */}
            <div className="flex justify-center animate-on-scroll is-visible order-2 relative">
                 <div className="absolute inset-0 bg-brand-yellow/20 blur-[50px] rounded-full z-0"></div>
                 <img src={config.trophyImage} alt="Trofeu" className="w-80 h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 relative z-10" />
            </div>

            {/* Right Column */}
            <div className="space-y-10 animate-on-scroll is-visible order-3">
                {rightPrizes.map((p, i) => (
                    <div key={p.id} className="flex flex-col items-start text-left group">
                         <div className="flex items-center gap-4 mb-2">
                             <div className={`w-12 h-12 ${p.colorClass} ${p.textColorClass} rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform`}>{i + 5}</div>
                             <h4 className="text-xl font-bold text-brand-dark">{p.title}</h4>
                         </div>
                         <p className="text-gray-800 font-bold text-sm max-w-xs">{p.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default PrizesSection;
