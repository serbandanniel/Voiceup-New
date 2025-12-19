
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SectionConfig, Juror } from '../../types';
import { DEFAULT_JURORS } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const JurySection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [jurors, setJurors] = useState<Juror[]>(DEFAULT_JURORS);
    const [selectedJurorId, setSelectedJurorId] = useState<string | null>(null);
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        const stored = localStorage.getItem('jurorsConfig');
        if(stored) {
            try { setJurors(JSON.parse(stored)); } catch(e) { console.error(e); }
        }
    }, []);

    const president = jurors.find(j => j.isPresident) || jurors[0];
    const otherJurors = jurors.filter(j => j.id !== president.id);
    const selectedJuror = jurors.find(j => j.id === selectedJurorId);

    const modalContent = selectedJuror && modalRoot ? ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setSelectedJurorId(null)}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative p-6 md:p-8 transform scale-100 transition-all duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedJurorId(null)} className="absolute top-3 right-3 text-gray-500 hover:text-brand-dark p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div className="text-center">
                    {selectedJuror.isSurprise ? (
                        <div className="w-28 h-28 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center mx-auto mb-4 p-4 shadow-lg">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.43 12.5 13 13.25 13 14h-2c0-.98.39-1.84 1-2.5l1-1c.36-.36.56-.86.56-1.4 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.74-.93 2.37z"/></svg>
                        </div>
                    ) : (
                        <img src={selectedJuror.img} alt={selectedJuror.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4" />
                    )}
                    <h3 className="text-2xl font-bold text-brand-dark">{selectedJuror.name}</h3>
                    <p className="text-lg text-brand-purple font-semibold mt-2">{selectedJuror.role}</p>
                    {selectedJuror.subRole && <p className="text-sm text-brand-yellow font-bold uppercase mt-1">{selectedJuror.subRole}</p>}
                </div>
                <div className="mt-6 text-left space-y-4">
                    <p className="text-base text-gray-700 italic border-l-4 border-brand-pink pl-3">
                        {selectedJuror.quote}
                    </p>
                    <p className="text-sm text-gray-800">
                        {selectedJuror.bio}
                    </p>
                </div>
            </div>
        </div>,
        modalRoot
    ) : null;

    return (
        <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                <SectionTitle section={section} />
                <p className="mt-4 text-lg text-gray-600 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    Faceți cunoștință cu juriul nostru de excepție, format din profesioniști renumiți gata să descopere următorul talent!
                </p>
            </div>
            
            {president && (
                <div className="hidden md:flex justify-center mb-12 md:mb-16 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                    <div className="bg-white shadow-2xl rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 w-full max-w-5xl border-4 border-brand-yellow">
                        <div className="lg:col-span-1 flex items-center justify-center p-6 bg-yellow-50">
                            {president.isSurprise ? (
                                <div className="w-48 h-48 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center shadow-lg">
                                    <svg className="w-24 h-24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.43 12.5 13 13.25 13 14h-2c0-.98.39-1.84 1-2.5l1-1c.36-.36.56-.86.56-1.4 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.74-.93 2.37z"/></svg>
                                </div>
                            ) : (
                                <img src={president.img} alt={president.name} className="w-48 h-48 lg:w-full lg:h-auto object-contain" />
                            )}
                        </div>
                        <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">{president.name}</h3>
                            <p className="text-xl md:text-2xl text-brand-yellow font-bold mt-1 tracking-wide" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.1)'}}>{president.role}</p>
                            <p className="text-lg md:text-xl text-brand-purple font-semibold mt-2">{president.subRole}</p>
                            <p className="text-base mt-4 text-gray-700 italic border-l-4 border-brand-yellow pl-3">
                                {president.quote}
                            </p>
                            <p className="text-sm text-gray-800 mt-4 text-left">
                                {president.bio}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 justify-items-stretch">
                {president && (
                    <div className="md:hidden bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 rounded-xl flex items-center p-4 compact-jury-card animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                        <img src={president.img} alt={president.name} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
                        <div className="ml-4 flex-grow">
                            <h3 className="text-lg font-bold text-brand-dark truncate">{president.name}</h3>
                            <p className="text-sm text-brand-yellow font-semibold">{president.role}</p>
                            <button onClick={() => setSelectedJurorId(president.id)} className="mt-2 bg-brand-pink text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-opacity-90 transition-all duration-300">Detalii</button>
                        </div>
                    </div>
                )}
                
                {otherJurors.map((juror, index) => {
                    const delay = `${0.2 + (index * 0.1)}s`;
                    return (
                        <div key={juror.id} className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 rounded-xl flex items-center p-4 compact-jury-card animate-on-scroll md:flex-col md:p-6 lg:p-8 md:text-center md:justify-center w-full" style={{ transitionDelay: delay }}>
                            {juror.isSurprise ? (
                                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center flex-shrink-0 md:mb-4 p-4 shadow-lg">
                                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.43 12.5 13 13.25 13 14h-2c0-.98.39-1.84 1-2.5l1-1c.36-.36.56-.86.56-1.4 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.74-.93 2.37z"/></svg>
                                </div>
                            ) : (
                                <img src={juror.img} alt={juror.name} className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0 md:mb-4" />
                            )}
                            <div className="ml-4 md:ml-0 flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-brand-dark md:truncate-none">{juror.name}</h3>
                                <p className="text-sm md:text-base text-brand-purple font-semibold">{juror.role}</p>
                                <button onClick={() => setSelectedJurorId(juror.id)} className="mt-2 bg-brand-pink text-white text-xs md:text-sm font-semibold py-1 px-3 md:py-2 md:px-4 rounded-full hover:bg-opacity-90 transition-all duration-300">Detalii</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {modalContent}
        </div>
    );
};

export default JurySection;
