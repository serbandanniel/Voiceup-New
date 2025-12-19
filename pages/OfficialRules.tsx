
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaticPage } from '../types';
import { DEFAULT_STATIC_PAGES_CONFIG, DEFAULT_LOCATION_CONFIG } from '../config';
import SEO from '../components/SEO';

const OfficialRules: React.FC = () => {
    const [pageData, setPageData] = useState<StaticPage | null>(null);
    const locationConfig = DEFAULT_LOCATION_CONFIG; // Or fetch from localStorage if dynamic

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('staticPagesConfig');
        let content = DEFAULT_STATIC_PAGES_CONFIG.find(p => p.id === 'rules');
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const found = parsed.find((p: StaticPage) => p.id === 'rules');
                if (found) content = found;
            } catch(e) { console.error(e); }
        }
        setPageData(content || null);
    }, []);

    if (!pageData) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50 font-sans text-gray-800">
            <SEO title="Regulament Oficial - VoiceUP Festival" />
            <style>{`
                .custom-rich-text h2 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #7C3AED; /* brand-purple */
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #F3F4F6;
                    padding-bottom: 0.5rem;
                }
                .custom-rich-text h3 {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #2E1065; /* brand-dark */
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .custom-rich-text p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                    color: #4B5563;
                }
                .custom-rich-text ul, .custom-rich-text ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .custom-rich-text ul li {
                    list-style-type: disc;
                    margin-bottom: 0.5rem;
                    color: #374151;
                }
                .custom-rich-text strong {
                    color: #2E1065;
                    font-weight: 800;
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span>Înapoi la Pagina Principală</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="bg-brand-pink/10 text-brand-pink px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm border border-brand-pink/20">Document Oficial</span>
                    <h1 className="text-4xl md:text-6xl font-black text-brand-dark mt-6 mb-4 drop-shadow-sm">{pageData.title}</h1>
                    <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Toate detaliile necesare pentru o participare de succes la Festivalul VoiceUP.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar / Quick Info - Desktop Only */}
                    <div className="hidden lg:block lg:col-span-4 space-y-6">
                        <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-xl sticky top-24 border border-white/10 relative overflow-hidden">
                            {/* Decorative blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink blur-[60px] opacity-20 rounded-full pointer-events-none"></div>

                            <h3 className="font-bold text-2xl mb-6 border-b border-white/20 pb-4">Informații Esențiale</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <span className="block opacity-60 text-xs uppercase tracking-wider mb-1">Data Evenimentului</span>
                                        <span className="font-bold text-lg leading-tight block">{locationConfig.startDate}</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div>
                                        <span className="block opacity-60 text-xs uppercase tracking-wider mb-1">Locație</span>
                                        <span className="font-bold text-lg leading-tight block">{locationConfig.locationName}</span>
                                        <span className="text-sm opacity-80">{locationConfig.address}</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <span className="block opacity-60 text-xs uppercase tracking-wider mb-1">Deadline Înscrieri</span>
                                        <span className="font-bold text-lg leading-tight block text-brand-yellow">6 Decembrie 2025</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-10 pt-6 border-t border-white/20">
                                <a href="#formular-inscriere" className="block w-full text-center bg-gradient-to-r from-brand-pink to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02]">
                                    Completează Formularul
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Editable Area) */}
                    <div className="col-span-1 lg:col-span-8">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 relative">
                             {/* Decorative Corner */}
                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent rounded-tr-[2rem]"></div>
                             
                             <div className="custom-rich-text" dangerouslySetInnerHTML={{ __html: pageData.content }} />
                        </div>
                        
                        {/* Mobile CTA */}
                        <div className="mt-8 lg:hidden">
                             <a href="#formular-inscriere" className="block w-full text-center bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg">
                                Înscrie-te Acum
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialRules;
