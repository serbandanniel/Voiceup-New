
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';

const HowToRegisterSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const location = useLocation();

    const handleScrollToId = (e: React.MouseEvent, id: string) => {
        if (location.pathname === '/' && id.startsWith('#')) {
            e.preventDefault();
            const target = document.getElementById(id.replace('#', ''));
            if (target) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const steps = [
        {
            step: '1',
            title: 'Completează Formularul',
            subtitle: 'FORMULAR ONLINE',
            description: 'Primul pas obligatoriu. Alege tipul de înscriere (individual/grup) și completează toate datele.',
            linkText: 'Mergi la formular',
            linkHref: '#formular-inscriere',
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            ),
            color: 'bg-brand-purple'
        },
        {
            step: '2',
            title: 'Achită Taxa',
            subtitle: 'PLATĂ ONLINE SAU TRANSFER',
            description: 'Poți plăti online cu cardul (vei fi redirecționat) sau prin transfer bancar. Taxa trebuie achitată pentru a valida locul.',
            linkText: 'Vezi taxele',
            linkHref: '#taxe-inscriere',
            icon: (
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            ),
            color: 'bg-brand-pink'
        },
        {
            step: '3',
            title: 'Trimite Documentele',
            subtitle: 'E-MAIL SAU WHATSAPP',
            description: 'Trimite un singur e-mail cu copie CI, certificat de naștere și dovada plății (dacă e cazul).',
            linkText: 'Înscrie-te Acum',
            linkHref: '#formular-inscriere',
            icon: (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            ),
            color: 'bg-brand-yellow'
        }
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                 <SectionTitle section={section} />
                 <p className="mt-4 text-lg text-gray-600">
                    Procesul de înscriere simplificat. Urmează acești 3 pași esențiali.
                 </p>
            </div>

            <div className="relative">
                {/* Connecting Line - Desktop */}
                <div className="hidden md:block absolute top-12 left-0 right-0 mx-auto w-2/3 h-0.5 bg-gray-200"></div>
                {/* Connecting Line - Mobile */}
                <div className="block md:hidden absolute top-0 left-8 w-0.5 h-full bg-gray-200 z-0"></div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {steps.map((step) => (
                        <div key={step.step} className="relative z-10 flex flex-row items-start md:flex-col md:items-center text-left md:text-center">
                            
                            {/* Icon and Step Number */}
                            <div className="relative md:mb-6 flex-shrink-0">
                                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg border-4 border-white md:border-gray-50`}>
                                    <div className="w-8 h-8 md:w-10 md:h-10 text-white">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-brand-dark shadow-sm">
                                    {step.step}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="ml-6 md:ml-0 flex-grow md:flex md:flex-col md:bg-white/60 md:backdrop-blur-sm md:p-8 md:rounded-2xl md:shadow-lg md:border md:border-gray-100 w-full">
                                <h4 className="text-lg md:text-xl font-bold text-brand-dark">{step.title}</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">{step.subtitle}</p>
                                <p className="text-gray-600 text-sm flex-grow mb-4 md:mb-6">{step.description}</p>
                                <a 
                                    href={step.linkHref} 
                                    onClick={(e) => handleScrollToId(e, step.linkHref)}
                                    className="mt-auto font-bold text-brand-purple hover:underline text-sm flex items-center justify-start md:justify-center gap-2 group"
                                >
                                    {step.linkText}
                                    <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowToRegisterSection;
