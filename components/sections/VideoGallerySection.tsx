
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { GalleryVideo, SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';

const DEFAULT_VIDEOS: GalleryVideo[] = [
    { id: '2', type: 'portrait', url: 'https://www.youtube.com/embed/LXb3EKWsInQ', title: 'Castigatori' },
    { id: '3', type: 'portrait', url: 'https://www.youtube.com/embed/9bZkp7q19f0', title: 'Juriul VoiceUP' },
    { id: '4', type: 'portrait', url: 'https://www.youtube.com/embed/CevxZvSJLk8', title: 'Moment Artistic' },
    { id: '5', type: 'portrait', url: 'https://www.youtube.com/embed/OpQFFLBMEPI', title: 'Backstage Fun' },
    { id: '6', type: 'portrait', url: 'https://www.youtube.com/embed/3wXYNIIqch0', title: 'Emoții pe Scenă' }, 
    { id: '7', type: 'portrait', url: 'https://www.youtube.com/embed/tgbNymZ7vqY', title: 'Pregătiri' },      
    { id: '1', type: 'portrait', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Aftermovie 2024' }, 
];

const VideoCard: React.FC<{ video: GalleryVideo }> = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const getThumbnail = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) {
            const videoId = url.split('/').pop()?.split('?')[0];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return `https://placehold.co/450x800/1a1a1a/FFF?text=${video.title}`;
    };

    return (
        <div className="w-full h-full relative bg-black rounded-3xl overflow-hidden shadow-none border-2 md:border-4 border-gray-900 group transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
                <h3 className="text-white font-bold text-lg drop-shadow-md truncate">{video.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-gray-300 uppercase tracking-widest font-bold">VoiceUP TV</span>
                </div>
            </div>

            {isPlaying ? (
                <iframe 
                    src={`${video.url}?autoplay=1&modestbranding=1&rel=0&controls=1`} 
                    title={video.title}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            ) : (
                <div 
                    className="w-full h-full relative cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                >
                    <img src={getThumbnail(video.url)} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const VideoGallerySection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<GalleryVideo[]>(DEFAULT_VIDEOS);

    useEffect(() => {
        const stored = localStorage.getItem('galleryConfig_videos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) setVideos(parsed);
            } catch(e) { console.error(e); }
        }
    }, []);

    const loopVideos = useMemo(() => {
        if (videos.length === 0) return [];
        return [...videos, ...videos, ...videos]; 
    }, [videos]);

    return (
        <div className="max-w-screen-2xl mx-auto px-6 overflow-hidden">
            <div className="text-center mb-10">
                <SectionTitle section={section} />
                <p className="mt-4 text-gray-600 animate-on-scroll">Cele mai tari momente, direct în feed-ul tău.</p>
            </div>

            <div className="relative pt-4 px-2 animate-on-scroll">
                <Swiper
                    modules={[Navigation, Pagination, EffectCoverflow]}
                    effect={'coverflow'} centeredSlides={true} loop={true} slidesPerView={'auto'}
                    initialSlide={videos.length}
                    coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
                    navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    breakpoints={{ 320: { slidesPerView: 'auto', spaceBetween: 20 }, 1024: { slidesPerView: 'auto', spaceBetween: 40 } }}
                    className="video-swiper !pb-8"
                >
                    {loopVideos.map((video, index) => (
                        <SwiperSlide key={`${video.id}-${index}`} className="w-[280px] sm:w-[300px] md:w-[320px] aspect-[9/16] !h-auto">
                            <VideoCard video={video} />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-prev-custom absolute top-1/2 left-2 z-30 w-12 h-12 bg-white/80 backdrop-blur text-brand-purple rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all transform -translate-y-1/2 hidden md:flex"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-2 z-30 w-12 h-12 bg-white/80 backdrop-blur text-brand-purple rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all transform -translate-y-1/2 hidden md:flex"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></div>
                </Swiper>
            </div>

            <div className="mt-12 text-center animate-on-scroll">
                <button 
                    onClick={() => navigate('/galerie-video')}
                    className="bg-brand-dark text-white font-black py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                >
                    Vezi toate clipurile
                </button>
            </div>

            <style>{`
                .animate-marquee { animation: marquee 5s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .video-swiper .swiper-pagination { position: absolute !important; bottom: 0px !important; }
                .video-swiper .swiper-pagination-bullet-active { background: #7C3AED; width: 24px; border-radius: 999px; }
            `}</style>
        </div>
    );
};

export default VideoGallerySection;
