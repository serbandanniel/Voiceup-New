
import React, { useState, useEffect } from 'react';
import { SectionConfig, LocationConfig } from '../../types';
import { DEFAULT_LOCATION_CONFIG } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const LocationSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [locConfig, setLocConfig] = useState<LocationConfig>(DEFAULT_LOCATION_CONFIG);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('locationConfig');
        if(stored) {
            try { 
                const parsed = JSON.parse(stored);
                setLocConfig({ ...DEFAULT_LOCATION_CONFIG, ...parsed }); 
            } catch(e) { console.error(e); }
        }
    }, []);

    // Verificăm dacă URL-ul este de tip Embed. Dacă nu, încercăm să-l formatăm minimal.
    const getSafeMapUrl = (url: string) => {
        if (!url) return "";
        // Dacă e deja un link de embed, e ok
        if (url.includes('google.com/maps/embed')) return url;
        // Dacă e un link de tip share (maps.app.goo.gl sau google.com/maps/place), 
        // din păcate Google nu permite transformarea directă simplă în iframe fără API Key,
        // deci încurajăm folosirea codului de tip "Embed" din Google Maps.
        return url;
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                 {/* Text Content */}
                 <div className="animate-on-scroll text-center lg:text-left" style={{ transitionDelay: '0.1s' }}>
                     <div className="flex justify-center lg:justify-start mb-6 md:mb-8">
                        <SectionTitle section={section} />
                     </div>
                     
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-6">
                        {/* Location Item */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                            <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink flex-shrink-0">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Locație</h4>
                                <p className="text-brand-dark text-lg md:text-xl font-bold leading-tight">{locConfig.locationName}</p>
                                <p className="text-gray-500 text-sm mt-1 leading-snug">{locConfig.address}</p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100"></div>

                        {/* Date Item */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                             <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple flex-shrink-0">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dată și Oră</h4>
                                <p className="text-brand-dark text-lg md:text-xl font-bold leading-tight">{locConfig.startDate}</p>
                             </div>
                        </div>

                        {/* Parking Info Item */}
                        {locConfig.parkingInfo && (
                            <>
                                <div className="w-full h-px bg-gray-100"></div>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                     <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow flex-shrink-0">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.806H8.044a2.056 2.056 0 00-1.58.806 17.901 17.901 0 00-3.213 9.193c-.039.62.469 1.124 1.09 1.124H16.5m1.5-4.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM6 14.25h12" /></svg>
                                     </div>
                                     <div className="flex-grow">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Informații Parcare</h4>
                                        <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed mb-3">{locConfig.parkingInfo}</p>
                                        {locConfig.parkingLink && (
                                            <a 
                                                href={locConfig.parkingLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-black text-brand-purple bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full border border-violet-200 transition-all shadow-sm"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                                Locație Parcare
                                            </a>
                                        )}
                                     </div>
                                </div>
                            </>
                        )}
                     </div>

                     {/* Action Buttons */}
                     <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
                        <a href={locConfig.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all shadow-md hover:shadow-lg text-sm md:text-base">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                             Google Maps
                        </a>
                        <a href={locConfig.wazeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#33ccff] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#2db5e2] transition-all shadow-md hover:shadow-lg text-sm md:text-base">
                             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.6 7.7C17.3 5.3 14.8 3.8 12 3.8c-4.4 0-8 3.6-8 8 0 2.9 1.6 5.5 4 6.9L7.3 21c-.1.3 0 .6.3.7.1 0 .2.1.3.1.2 0 .4-.1.5-.2l2.3-1.8c.5.1 1.1.2 1.6.2 3.6 0 6.6-2.4 7.6-5.8.1-.4-.1-.8-.5-.9-.4-.1-.8.1-.9.5-.8 2.6-3.2 4.4-6 4.4-.5 0-1-.1-1.4-.2l-2 1.6.5-1.8c.1-.4-.1-.8-.5-1-.2-.1-.4-.1-.5 0-1.8-1-3-3-3-5.2 0-3.3 2.7-6 6-6 2.1 0 4 1.1 5 2.9.2.3.6.4 1 .2.3-.2.4-.6.2-1z"/><circle cx="9.5" cy="11.5" r="1.5"/><circle cx="14.5" cy="11.5" r="1.5"/></svg>
                             Waze
                        </a>
                     </div>
                 </div>
                 
                 {/* Map Container with Robust Fallback */}
                 <div className="w-full h-full animate-on-scroll relative mt-6 lg:mt-0" style={{ transitionDelay: '0.2s' }}>
                     <div className="overflow-hidden rounded-3xl shadow-xl h-full min-h-[300px] md:min-h-[450px] relative border-4 border-white bg-gray-100 group">
                         
                         {/* Placeholder while loading or if frame fails */}
                         {!mapLoaded && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-purple mb-4"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Se încarcă harta...</p>
                            </div>
                         )}

                         {/* Fallback info button in case Google blocks the frame */}
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
                            <a href={locConfig.googleMapsLink} target="_blank" rel="noreferrer" className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-gray-600 shadow-md border border-gray-100 flex items-center gap-2">
                                🗺️ Hartă inaccesibilă? Click aici
                            </a>
                         </div>

                         {/* Actual Iframe */}
                         <iframe 
                            src={getSafeMapUrl(locConfig.mapEmbedUrl)} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            onLoad={() => setMapLoaded(true)}
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade" 
                            className={`w-full h-full absolute inset-0 transition-opacity duration-500 z-10 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
                         ></iframe>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default LocationSection;
