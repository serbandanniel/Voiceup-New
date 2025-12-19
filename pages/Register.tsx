
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import SEO from '../components/SEO';

const Register: React.FC = () => {
    useEffect(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
    }, []);
    
    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-100">
             <SEO 
                title="Înscriere - VoiceUP Festival" 
                description="Completează formularul de înscriere pentru VoiceUP Festival. Locurile sunt limitate!" 
             />
             <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
                
                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span>Înapoi la Pagina Principală</span>
                    </Link>
                </div>

                <div className="text-center max-w-3xl mx-auto mb-10">
                   <h2 className="text-3xl md:text-4xl font-extrabold text-brand-purple">Înscriere Festival</h2>
                   <p className="mt-4 text-lg text-gray-600">Completează formularul de mai jos.</p>
                </div>
                <RegistrationForm />
             </div>
        </div>
    );
};

export default Register;
