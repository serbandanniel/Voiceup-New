
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GalleryImage } from '../types';
import SEO from '../components/SEO';

const DEFAULT_FULL_IMAGES: GalleryImage[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=800&q=80', caption: 'Emoție pe scenă' },
    { id: '2', url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80', caption: 'Concert Live' },
    { id: '3', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', caption: 'Microfonul magic' },
    { id: '4', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', caption: 'Public entuziast' },
    { id: '5', url: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800&q=80', caption: 'Chitara' },
    { id: '6', url: 'https://images.unsplash.com/photo-1459749411177-0473ef71607b?auto=format&fit=crop&w=800&q=80', caption: 'Moment artistic' },
    { id: '7', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', caption: 'Backstage' },
    { id: '8', url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80', caption: 'Lumina reflectoarelor' },
    { id: '9', url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80', caption: 'Public' },
];

const FullGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('galleryConfig_photos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setImages(parsed);
                } else {
                    setImages(DEFAULT_FULL_IMAGES);
                }
            } catch (e) { 
                console.error('Failed to load gallery images', e); 
                setImages(DEFAULT_FULL_IMAGES);
            }
        } else {
            setImages(DEFAULT_FULL_IMAGES);
        }
    }, []);

    const getMobileClass = (index: number) => {
        const isFullWidth = (index + 1) % 3 === 0;
        return isFullWidth ? 'col-span-2' : 'col-span-1';
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50">
            <SEO title="Galerie Foto Completă - VoiceUP Festival" />
            
            <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span>Înapoi la Pagina Principală</span>
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6">Galerie Foto</h1>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-brand-purple to-brand-pink mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Explorează cele mai frumoase momente de la VoiceUP Festival.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:block md:columns-3 lg:columns-4 md:gap-6">
                    {images.map((img, index) => (
                        <div 
                            key={img.id} 
                            className={`break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 mb-0 md:mb-6 ${getMobileClass(index)}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img.url} alt={img.caption || 'VoiceUP'} className="w-full h-auto object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                                <span className="text-white font-bold text-sm md:text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.caption}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- COMMUNITY CTA BOX --- */}
                <div className="mt-24 text-center p-8 md:p-16 bg-white rounded-[3rem] md:rounded-[5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 max-w-5xl mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Platform Icons (Small top ones) */}
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-50 text-[#FF0000] rounded-2xl flex items-center justify-center shadow-sm transform transition-transform hover:-translate-y-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                            </div>
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-sm transform transition-transform hover:-translate-y-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center shadow-sm transform transition-transform hover:-translate-y-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </div>
                            <div className="w-12 h-12 bg-pink-50 text-[#E4405F] rounded-2xl flex items-center justify-center shadow-sm transform transition-transform hover:-translate-y-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" /></svg>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-4">Hai în comunitatea noastră!</h2>
                        
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-10 font-medium leading-relaxed">
                            Urmărește-ne pentru a vedea cele mai noi momente de pe scenă și din culise! Fii primul care află noutățile despre edițiile viitoare și surprizele pregătite pentru comunitatea VoiceUP.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://www.youtube.com/@VoiceUpFestival" target="_blank" rel="noreferrer" className="bg-[#FF0000] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                YouTube
                            </a>
                            <a href="https://www.tiktok.com/@voiceupfestival" target="_blank" rel="noreferrer" className="bg-black text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                                TikTok
                            </a>
                            <a href="https://www.facebook.com/VoiceupFestival/" target="_blank" rel="noreferrer" className="bg-[#1877F2] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                            </a>
                            <a href="https://www.instagram.com/voiceupfestival/" target="_blank" rel="noreferrer" className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/></svg>
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            {selectedImage && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2 transition-colors"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                    <div className="relative max-w-5xl w-full flex flex-col items-center">
                        <img src={selectedImage.url} alt={selectedImage.caption} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain animate-scale-in" onClick={e => e.stopPropagation()} />
                        {selectedImage.caption && (
                            <div className="mt-6 text-center">
                                <h3 className="text-white text-2xl font-bold">{selectedImage.caption}</h3>
                                <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">VoiceUP Festival Gallery</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullGallery;
