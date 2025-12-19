
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryImage, SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';

// Default Fallback
const DEFAULT_PREVIEW_IMAGES: GalleryImage[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80', caption: 'Emoție pe scenă' }, 
    { id: '2', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', caption: 'Backstage' }, 
    { id: '3', url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80', caption: 'Live Performance' }, 
    { id: '4', url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80', caption: 'Lumina reflectoarelor' }, 
    { id: '5', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80', caption: 'Public' }, 
    { id: '6', url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80', caption: 'Atmosferă' }, 
];

const PhotoGallerySection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const navigate = useNavigate();
    const [images, setImages] = useState<GalleryImage[]>(DEFAULT_PREVIEW_IMAGES);

    const loadImages = () => {
        const stored = localStorage.getItem('galleryConfig_photos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Use up to 6 images for preview
                    setImages(parsed.slice(0, 6));
                } else {
                    // Fallback if empty array stored
                    setImages(DEFAULT_PREVIEW_IMAGES);
                }
            } catch(e) { 
                console.error(e);
                setImages(DEFAULT_PREVIEW_IMAGES);
            }
        }
    };

    useEffect(() => {
        loadImages();
        const handleUpdate = () => loadImages();
        window.addEventListener('galleryPhotosUpdated', handleUpdate);
        return () => window.removeEventListener('galleryPhotosUpdated', handleUpdate);
    }, []);

    const getGridClass = (index: number) => {
        const count = images.length;
        if (count === 1) return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
        if (count === 2) return 'col-span-1 row-span-2 md:col-span-2 md:row-span-2';
        
        switch(index) {
            case 0: return 'col-span-1 row-span-1 md:col-span-2 md:row-span-2'; 
            case 1: return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'; 
            case 2: return 'col-span-2 row-span-1 md:col-span-1 md:row-span-2'; 
            case 3: return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'; 
            case 4: return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'; 
            case 5: return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; 
            default: return 'col-span-1 row-span-1';
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
            <div className="text-center mb-10">
                <SectionTitle section={section} />
                <p className="mt-4 text-gray-600 animate-on-scroll">Amintiri de neuitat de la edițiile anterioare.</p>
            </div>

            {/* BENTO GRID - Responsive rows */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-min md:auto-rows-[180px] w-full animate-on-scroll">
                
                {images.map((img, index) => (
                    <div 
                        key={img.id} 
                        className={`relative group rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer w-full h-[160px] md:h-full ${getGridClass(index)}`}
                        onClick={() => navigate('/galerie')}
                    >
                        <img 
                            src={img.url} 
                            alt={img.caption || 'VoiceUP'} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <span className="text-white font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">{img.caption}</span>
                        </div>
                    </div>
                ))}

                {/* REDUCED HEIGHT "See More" Card for Mobile */}
                <div 
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg cursor-pointer group col-span-2 row-span-1 md:col-span-1 md:row-span-1 w-full h-[90px] md:h-full transition-all duration-300"
                    onClick={() => navigate('/galerie')}
                >
                    <div className="absolute inset-0">
                        <img 
                            src="https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800&q=80" 
                            alt="More" 
                            className="w-full h-full object-cover blur-sm opacity-50 scale-110"
                        />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/90 to-brand-pink/90 group-hover:from-brand-purple/80 group-hover:to-brand-pink/80 transition-all duration-300 flex flex-col items-center justify-center text-white p-2 text-center">
                        <span className="text-2xl md:text-4xl font-black drop-shadow-md group-hover:scale-110 transition-transform duration-300 leading-none">+</span>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest mt-1 opacity-95 border-b border-white/30 pb-0.5">Vezi Toată Galeria</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoGallerySection;
