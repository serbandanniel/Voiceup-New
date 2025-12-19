
import React from 'react';
import { SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';
import { trackEvent } from '../../utils/tracking'; // Import tracking

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
            <circle cx="45" cy="45" r="45" style={{ fill: 'rgb(42,181,64)' }} />
            <path d="M 16.138 44.738 c -0.002 5.106 1.332 10.091 3.869 14.485 l -4.112 15.013 l 15.365 -4.029 c 4.233 2.309 8.999 3.525 13.85 3.527 h 0.012 c 15.973 0 28.976 -12.999 28.983 -28.974 c 0.003 -7.742 -3.01 -15.022 -8.481 -20.498 c -5.472 -5.476 -12.749 -8.494 -20.502 -8.497 C 29.146 15.765 16.145 28.762 16.138 44.738 M 25.288 58.466 l -0.574 -0.911 c -2.412 -3.834 -3.685 -8.266 -3.683 -12.816 c 0.005 -13.278 10.811 -24.081 24.099 -24.081 c 6.435 0.003 12.482 2.511 17.031 7.062 c 4.548 4.552 7.051 10.603 7.05 17.037 C 69.205 58.036 58.399 68.84 45.121 68.84 h -0.009 c -4.323 -0.003 -8.563 -1.163 -12.261 -3.357 l -0.88 -0.522 l -9.118 2.391 L 25.288 58.466 z M 45.122 73.734 L 45.122 73.734 L 45.122 73.734 C 45.122 73.734 45.121 73.734 45.122 73.734" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
            <path d="M 37.878 32.624 c -0.543 -1.206 -1.113 -1.23 -1.63 -1.251 c -0.422 -0.018 -0.905 -0.017 -1.388 -0.017 c -0.483 0 -1.268 0.181 -1.931 0.906 c -0.664 0.725 -2.535 2.477 -2.535 6.039 c 0 3.563 2.595 7.006 2.957 7.49 c 0.362 0.483 5.01 8.028 12.37 10.931 c 6.118 2.412 7.362 1.933 8.69 1.812 c 1.328 -0.121 4.285 -1.751 4.888 -3.442 c 0.604 -1.691 0.604 -3.14 0.423 -3.443 c -0.181 -0.302 -0.664 -0.483 -1.388 -0.845 c -0.724 -0.362 -4.285 -2.114 -4.948 -2.356 c -0.664 -0.241 -1.147 -0.362 -1.63 0.363 c -0.483 0.724 -1.87 2.355 -2.292 2.838 c -0.422 0.484 -0.845 0.544 -1.569 0.182 c -0.724 -0.363 -3.057 -1.127 -5.824 -3.594 c -2.153 -1.92 -3.606 -4.29 -4.029 -5.015 c -0.422 -0.724 -0.045 -1.116 0.318 -1.477 c 0.325 -0.324 0.724 -0.846 1.087 -1.268 c 0.361 -0.423 0.482 -0.725 0.723 -1.208 c 0.242 -0.483 0.121 -0.906 -0.06 -1.269 C 39.929 37.637 38.522 34.056 37.878 32.624" style={{ fill: 'rgb(255,255,255)' }} strokeLinecap="round" />
        </g>
    </svg>
);

const ContactSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    // --- CONTACT FORM CUSTOM VALIDATION ---
    const handleContactInvalid = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.validity.valueMissing) {
            target.setCustomValidity('Acest câmp este obligatoriu.');
        } else if (target.validity.typeMismatch && target.type === 'email') {
            target.setCustomValidity('Te rugăm să introduci o adresă de email validă.');
        } else {
            target.setCustomValidity('');
        }
    };

    const handleContactInputReset = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (e.target as HTMLInputElement).setCustomValidity('');
    };
    // -------------------------------------

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trackEvent('Contact', { type: 'form_submit', location: 'contact_section' });
        // Normally here you would send the data
        alert('Mesaj trimis! (Demo)');
    };

    return (
        <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-16 animate-on-scroll">
                 <SectionTitle section={section} />
                 <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                    Echipa noastră este aici pentru a te ajuta. Dacă ai nevoie de informații suplimentare sau asistență cu înscrierea, nu ezita să ne contactezi!
                 </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Column: Contact Cards */}
                <div className="space-y-6 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    
                    {/* Phone Card */}
                    <div className="bg-violet-50 p-6 rounded-xl border border-violet-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center flex-shrink-0 shadow-md">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.218 5.218l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-brand-dark font-bold text-lg">Telefon</h4>
                            <p className="text-gray-500 text-sm mb-1">Contactează-ne pentru suport rapid.</p>
                            <a href="tel:0772172073" onClick={() => trackEvent('Contact', { type: 'phone', location: 'contact_section' })} className="text-brand-purple font-bold text-lg hover:underline">0772 172 073</a>
                        </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-brand-pink text-white flex items-center justify-center flex-shrink-0 shadow-md">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-brand-dark font-bold text-lg">Email</h4>
                            <p className="text-gray-500 text-sm mb-1">Trimite-ne întrebările tale oricând.</p>
                            <a href="mailto:contact@voiceup-festival.ro" onClick={() => trackEvent('Contact', { type: 'email', location: 'contact_section' })} className="text-brand-purple font-bold text-lg hover:underline">contact@voiceup-festival.ro</a>
                        </div>
                    </div>

                    {/* WhatsApp Card Updated */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                             <WhatsAppIcon className="w-full h-full" />
                        </div>
                        <div>
                            <h4 className="text-brand-dark font-bold text-lg">WhatsApp</h4>
                            <p className="text-gray-500 text-sm mb-1">Scrie-ne direct pe WhatsApp.</p>
                            <a href="https://wa.me/40772172073" onClick={() => trackEvent('Contact', { type: 'whatsapp', location: 'contact_section' })} className="text-brand-purple font-bold text-lg hover:underline">0772 172 073</a>
                        </div>
                    </div>

                </div>

                {/* Right Column: Contact Form */}
                <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                    <form className="space-y-5" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-1">Numele tău</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input required onInvalid={handleContactInvalid} onInput={handleContactInputReset} type="text" placeholder="Ex: Popescu Ion" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-1">Adresa de Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </span>
                                <input required onInvalid={handleContactInvalid} onInput={handleContactInputReset} type="email" placeholder="exemplu@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-1">Subiect</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                </span>
                                <input required onInvalid={handleContactInvalid} onInput={handleContactInputReset} type="text" placeholder="Întrebare despre înscriere" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-1">Mesajul tău</label>
                            <textarea required onInvalid={handleContactInvalid} onInput={handleContactInputReset} rows={4} placeholder="Scrie aici mesajul tău..." className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 resize-none"></textarea>
                        </div>

                        {/* Fake Recaptcha */}
                        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-between w-full max-w-[250px]">
                            <div className="flex items-center gap-3">
                                <input required type="checkbox" className="w-6 h-6 border-gray-300 rounded text-brand-purple focus:ring-brand-purple" />
                                <span className="text-sm text-gray-700">Nu sunt robot</span>
                            </div>
                            <div className="flex flex-col items-center text-[10px] text-gray-500">
                                <svg className="w-8 h-8 text-blue-500 mb-[-4px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.93-2.7 5.09z"/></svg>
                                <span>reCAPTCHA</span>
                                <div className="leading-tight mt-[1px]">
                                    <span className="mr-1">Confidențialitate</span>
                                    <span>Termeni</span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl shadow-lg hover:bg-pink-600 hover:shadow-xl transition-all transform hover:-translate-y-1">Trimite Mesajul</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
