
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionConfig } from '../../types';

const FooterSection: React.FC<{ section?: SectionConfig }> = () => {
    return (
        <footer className={`bg-brand-dark text-violet-300 py-12 relative z-[20] mt-auto`}>
            <div className="max-w-screen-xl mx-auto px-6 text-center">
                <div className="mb-8">
                    <p className="text-lg font-semibold text-white mb-4">Urmărește-ne pe social media</p>
                    <div className="flex justify-center gap-6">
                        {/* Facebook */}
                        <a href="https://www.facebook.com/VoiceupFestival/" target="_blank" rel="noreferrer" className="text-violet-300 hover:text-white transition-colors transform hover:scale-110">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        {/* Instagram - FIXED ICON with evenodd fill rule for proper cutout */}
                        <a href="https://www.instagram.com/voiceupfestival/" target="_blank" rel="noreferrer" className="text-violet-300 hover:text-white transition-colors transform hover:scale-110">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" />
                            </svg>
                        </a>
                        {/* TikTok */}
                        <a href="https://www.tiktok.com/@voiceupfestival" target="_blank" rel="noreferrer" className="text-violet-300 hover:text-white transition-colors transform hover:scale-110">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        </a>
                        {/* YouTube */}
                        <a href="https://www.youtube.com/@VoiceUpFestival" target="_blank" rel="noreferrer" className="text-violet-300 hover:text-white transition-colors transform hover:scale-110">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        </a>
                    </div>
                </div>
                
                <div className="flex justify-center gap-6 mb-6 text-sm">
                    <Link to="/termeni" className="text-violet-300 hover:text-white hover:underline transition-colors">Termeni și Condiții</Link>
                    <Link to="/regulament-oficial" className="text-violet-300 hover:text-white hover:underline transition-colors">Regulament Oficial</Link>
                    <Link to="/admin" className="text-violet-300 hover:text-white hover:underline transition-colors">Admin Login</Link>
                </div>

                <p>&copy; 2025 VoiceUP Festival. Toate drepturile rezervate.</p>
            </div>
        </footer>
    );
};

export default FooterSection;
