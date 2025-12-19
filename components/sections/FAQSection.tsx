import React, { useState, useEffect } from 'react';
import { SectionConfig, FAQ } from '../../types';
import { DEFAULT_FAQS } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const FAQSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);

    useEffect(() => {
        const stored = localStorage.getItem('faqConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setFaqs(parsed);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <SectionTitle section={section} />
                <p className="mt-4 text-lg text-gray-600 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    Răspunsuri la cele mai comune întrebări despre VoiceUP Festival.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-on-scroll">
                {faqs.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors gap-3"
                        >
                            <div className="flex items-center gap-4">
                                {item.iconUrl && <img src={item.iconUrl} alt="icon" className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 object-contain" />}
                                <span className="font-bold text-base md:text-lg text-brand-dark leading-tight">{item.q}</span>
                            </div>
                            <span className={`transform transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? 'rotate-180 text-brand-pink' : 'text-gray-400'}`}>
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </button>
                        <div className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-[500px] py-4 border-t border-gray-100' : 'max-h-0'}`}>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;