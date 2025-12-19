
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { RegistrationData } from '../types';
import SEO from '../components/SEO';
import { toast } from 'sonner';
import TicketGenerator from '../components/visuals/TicketGenerator';
import { trackEvent } from '../utils/tracking'; // Import tracking

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
            <circle cx="45" cy="45" r="45" style={{ fill: 'rgb(42,181,64)' }} />
            <path d="M 16.138 44.738 c -0.002 5.106 1.332 10.091 3.869 14.485 l -4.112 15.013 l 15.365 -4.029 c 4.233 2.309 8.999 3.525 13.85 3.527 h 0.012 c 15.973 0 28.976 -12.999 28.983 -28.974 c 0.003 -7.742 -3.01 -15.022 -8.481 -20.498 c -5.472 -5.476 -12.749 -8.494 -20.502 -8.497 C 29.146 15.765 16.145 28.762 16.138 44.738 M 25.288 58.466 l -0.574 -0.911 c -2.412 -3.834 -3.685 -8.266 -3.683 -12.816 c 0.005 -13.278 10.811 -24.081 24.099 -24.081 c 6.435 0.003 12.482 2.511 17.031 7.062 c 4.548 4.552 7.051 10.603 7.05 17.037 C 69.205 58.036 58.399 68.84 45.121 68.84 h -0.009 c -4.323 -0.003 -8.563 -1.163 -12.261 -3.357 l -0.88 -0.522 l -9.118 2.391 L 25.288 58.466 z M 45.122 73.734 L 45.122 73.734 L 45.122 73.734 C 45.122 73.734 45.121 73.734 45.122 73.734" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
            <path d="M 37.878 32.624 c -0.543 -1.206 -1.113 -1.23 -1.63 -1.251 c -0.422 -0.018 -0.905 -0.017 -1.388 -0.017 c -0.483 0 -1.268 0.181 -1.931 0.906 c -0.664 0.725 -2.535 2.477 -2.535 6.039 c 0 3.563 2.595 7.006 2.957 7.49 c 0.362 0.483 5.01 8.028 12.37 10.931 c 6.118 2.412 7.362 1.933 8.69 1.812 c 1.328 -0.121 4.285 -1.751 4.888 -3.442 c 0.604 -1.691 0.604 -3.14 0.423 -3.443 c -0.181 -0.302 -0.664 -0.483 -1.388 -0.845 c -0.724 -0.362 -4.285 -2.114 -4.948 -2.356 c -0.664 -0.241 -1.147 -0.362 -1.63 0.363 c -0.483 0.724 -1.87 2.355 -2.292 2.838 c -0.422 0.484 -0.845 0.544 -1.569 0.182 c -0.724 -0.363 -3.057 -1.127 -5.824 -3.594 c -2.153 -1.92 -3.606 -4.29 -4.029 -5.015 c -0.422 -0.724 -0.045 -1.116 0.318 -1.477 c 0.325 -0.324 0.724 -0.846 1.087 -1.268 c 0.361 -0.423 0.482 -0.725 0.723 -1.208 c 0.242 -0.483 0.121 -0.906 -0.06 -1.269 C 39.929 37.637 38.522 34.056 37.878 32.624" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
        </g>
    </svg>
);

const ThankYou: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { registrationData } = (location.state || {}) as { registrationData?: RegistrationData & { paymentLink: string } };
    const [countdown, setCountdown] = useState(5);

    // Initial Load & Redirect Logic
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!registrationData) {
            navigate('/');
            return;
        }

        // --- TRACK CONVERSION ---
        trackEvent('CompleteRegistration', {
            value: registrationData.totalCost,
            currency: 'RON',
            content_name: registrationData.type,
            status: 'success'
        });
        // ------------------------

        if (registrationData.paymentMethod === 'card' && registrationData.paymentLink && registrationData.paymentLink !== '#') {
            const timer = setInterval(() => setCountdown(prev => (prev > 0 ? prev - 1 : 0)), 1000);
            const redirectTimeout = setTimeout(() => window.location.href = registrationData.paymentLink, 5000);
            return () => { clearInterval(timer); clearTimeout(redirectTimeout); };
        }
    }, [registrationData, navigate]);
    
    if (!registrationData) return null;
    
    const participantName = registrationData.type === 'individual' ? registrationData.name : registrationData.groupName;

    return (
        <div className="min-h-screen bg-brand-dark font-sans text-gray-800 flex flex-col pt-20">
            <SEO title="Mulțumim! - VoiceUP Festival" />
            
            {/* Main Content Area - Split Layout */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: THE TICKET (Sticky on Desktop) */}
                <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 order-2 lg:order-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10 w-full max-w-sm backdrop-blur-sm">
                        <TicketGenerator data={registrationData} />
                    </div>
                </div>

                {/* RIGHT COLUMN: ACTION STEPS */}
                <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
                    
                    {/* 1. HERO GREETING */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-l-8 border-brand-purple animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Înscriere Recepționată
                            </div>
                            <span className="text-gray-400 text-xs font-mono">#{registrationData.id.slice(-6)}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight mb-2">
                            Mulțumim,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">{participantName}!</span>
                        </h1>
                        <p className="text-gray-600 text-lg mt-2">
                            Ești oficial înscris în cursa pentru trofeul VoiceUP 2025. Urmează pașii de mai jos pentru validarea finală.
                        </p>
                    </div>

                    {/* 2. PAYMENT STEP */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-lg">1</div>
                            <h3 className="text-xl font-bold text-brand-dark">Finalizare Plată</h3>
                        </div>
                        
                        {registrationData.totalCost === 0 ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                <div>
                                    <p className="font-bold">Înscriere Gratuită!</p>
                                    <p className="text-sm">Costul a fost acoperit de voucher. Nu este necesară nicio plată.</p>
                                </div>
                            </div>
                        ) : registrationData.paymentMethod === 'transfer' ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Cont Bancar (IBAN)</p>
                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mb-2">
                                    <span className="font-mono font-bold text-brand-dark select-all text-sm md:text-base">RO87BTRLRONCRT0675712701</span>
                                    <button onClick={() => {navigator.clipboard.writeText("RO87BTRLRONCRT0675712701"); toast.success("IBAN copiat!");}} className="text-brand-purple hover:bg-purple-50 p-2 rounded transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Beneficiar: <strong>Art Show Media Entertainment</strong></p>
                                    <p>Suma: <strong className="text-brand-purple">{registrationData.totalCost} RON</strong></p>
                                    <p>Detalii: <strong>Taxă VoiceUP - {participantName}</strong></p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-brand-purple/5 rounded-xl border border-brand-purple/10">
                                <p className="text-sm text-gray-600 mb-3">Redirecționare Netopia în <span className="font-bold text-brand-pink">{countdown}s</span>...</p>
                                <a href={registrationData.paymentLink} className="inline-block bg-brand-pink text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-colors shadow-lg animate-pulse">
                                    Plătește Acum {registrationData.totalCost} RON
                                </a>
                            </div>
                        )}
                    </div>

                    {/* 3. DOCUMENTS STEP */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">2</div>
                            <h3 className="text-xl font-bold text-brand-dark">Trimite Documentele</h3>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <p className="text-sm text-blue-900 mb-3 font-semibold">Trimite pe WhatsApp următoarele:</p>
                            <ul className="text-sm space-y-2 text-gray-700 font-medium mb-4">
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Dovada plății (OP / Screenshot)</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Certificat Naștere / CI Copil</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> CI Părinte</li>
                            </ul>
                            <a href="https://wa.me/40772172073" onClick={() => trackEvent('Contact', { type: 'whatsapp', location: 'thank_you' })} target="_blank" className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3 rounded-lg hover:bg-[#20bd5a] transition-colors shadow-md">
                                <WhatsAppIcon className="w-5 h-5" />
                                Trimite pe WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <Link to="/" className="text-white/50 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                            ← Înapoi pe Site
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ThankYou;
