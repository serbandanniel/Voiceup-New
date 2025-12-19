
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaticPage } from '../types';
import { DEFAULT_STATIC_PAGES_CONFIG } from '../config';
import SEO from '../components/SEO';

const TermsAndConditions: React.FC = () => {
    const [pageData, setPageData] = useState<StaticPage | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('staticPagesConfig');
        let content = DEFAULT_STATIC_PAGES_CONFIG.find(p => p.id === 'terms');
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const found = parsed.find((p: StaticPage) => p.id === 'terms');
                if (found) content = found;
            } catch(e) { console.error(e); }
        }
        setPageData(content || null);
    }, []);

    if (!pageData) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50 font-sans text-gray-800">
            <SEO title="Termeni și Condiții - VoiceUP Festival" />
            <style>{`
                .custom-rich-text h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #7C3AED;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .custom-rich-text p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                    color: #4B5563;
                }
                .custom-rich-text ul {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                    list-style-type: disc;
                }
                .custom-rich-text li {
                    margin-bottom: 0.5rem;
                }
                .custom-rich-text strong {
                    color: #2E1065;
                }
            `}</style>

            <div className="max-w-4xl mx-auto px-6">
                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span>Înapoi la Pagina Principală</span>
                    </Link>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-pink"></div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2">{pageData.title}</h1>
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-8">Ultima actualizare: Decembrie 2025</p>
                    
                    <div className="w-full h-px bg-gray-100 mb-8"></div>

                    <div className="custom-rich-text prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageData.content }} />

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                        <p className="text-center text-gray-500 mb-6">Prin completarea formularului de înscriere, confirmați că ați citit și sunteți de acord cu termenii de mai sus.</p>
                        <Link to="/#formular-inscriere" className="bg-brand-pink text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105 flex items-center gap-2">
                            <span>Am înțeles, mergi la Înscriere</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
