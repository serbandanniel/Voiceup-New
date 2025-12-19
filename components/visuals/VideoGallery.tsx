
import React, { useState, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { GalleryVideo } from '../../types';

const DEFAULT_VIDEOS: GalleryVideo[] = [
    { id: '1', type: 'portrait', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Aftermovie 2024' },
    { id: '2', type: 'portrait', url: 'https://www.youtube.com/embed/LXb3EKWsInQ', title: 'Castigatori' },
    { id: '3', type: 'portrait', url: 'https://www.youtube.com/embed/9bZkp7q19f0', title: 'Juriul VoiceUP' },
    { id: '4', type: 'portrait', url: 'https://www.youtube.com/embed/CevxZvSJLk8', title: 'Moment Artistic' },
    { id: '5', type: 'portrait', url: 'https://www.youtube.com/embed/OpQFFLBMEPI', title: 'Backstage Fun' },
];

const VideoCard: React.FC<{ video: GalleryVideo }> = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper to get high-res thumbnail from YouTube if possible
    const getThumbnail = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) {
            const videoId = url.split('/').pop()?.split('?')[0];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return `https://placehold.co/450x800/1a1a1a/FFF?text=${video.title}`;
    };

    return (
        <div className="w-full h-full relative bg-black rounded-3xl overflow-hidden shadow-none border-2 md:border-4 border-gray-900 group transition-transform duration-300 hover:scale-[1.02]">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
                <h3 className="text-white font-bold text-lg drop-shadow-md truncate">{video.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-gray-300 uppercase tracking-widest font-bold">VoiceUP TV</span>
                </div>
            </div>

            {/* Video Content */}
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
                    <img 
                        src={getThumbnail(video.url)} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>

                    {/* Social UI Mockup (Right Side) */}
                    <div className="absolute bottom-20 right-2 flex flex-col gap-4 items-center z-20 pointer-events-none">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </div>
                            <span className="text-xs text-white font-bold text-shadow">Like</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                            </div>
                            <span className="text-xs text-white font-bold text-shadow">Com</span>
                        </div>
                    </div>

                    {/* Music Ticker Mockup (Bottom) */}
                    <div className="absolute bottom-4 left-4 right-16 z-20 pointer-events-none">
                        <div className="flex items-center gap-2 text-white/90">
                            <svg className="w-4 h-4 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            <div className="overflow-hidden w-full h-5">
                                <p className="text-xs whitespace-nowrap animate-marquee">VoiceUP Festival Official Sound • Original Audio</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const VideoGallery: React.FC = () => {
    const [videos, setVideos] = useState<GalleryVideo[]>(DEFAULT_VIDEOS);

    const loadVideos = () => {
        const stored = localStorage.getItem('galleryConfig_videos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setVideos(parsed);
                } else {
                    setVideos(DEFAULT_VIDEOS);
                }
            } catch(e) { console.error(e); }
        }
    };

    useEffect(() => {
        loadVideos();
        const handleUpdate = () => loadVideos();
        window.addEventListener('galleryVideosUpdated', handleUpdate);
        return () => window.removeEventListener('galleryVideosUpdated', handleUpdate);
    }, []);

    // FIX: Tripling the video list to ensure we have enough slides for Swiper Loop mode
    const loopVideos = useMemo(() => {
        if (videos.length === 0) return [];
        if (videos.length > 10) return videos; 
        return [...videos, ...videos, ...videos]; 
    }, [videos]);

    return (
        <div className="max-w-screen-2xl mx-auto px-6 overflow-hidden">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                    Video & Media
                </h2>
                <div className="w-24 h-1 bg-brand-purple mx-auto rounded-full"></div>
                <p className="mt-4 text-gray-600">Cele mai tari momente, direct în feed-ul tău.</p>
            </div>

            <div className="relative pt-4 px-2">
                <Swiper
                    modules={[Navigation, Pagination, EffectCoverflow]}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    // Using 'auto' allows proper centering based on strict widths defined in SwiperSlide
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    pagination={{ 
                        clickable: true, 
                        dynamicBullets: true 
                    }}
                    breakpoints={{
                        320: { slidesPerView: 'auto', spaceBetween: 20 },
                        640: { slidesPerView: 'auto', spaceBetween: 30 },
                        1024: { slidesPerView: 'auto', spaceBetween: 40 },
                        1400: { slidesPerView: 'auto', spaceBetween: 50 }
                    }}
                    className="video-swiper !pb-8"
                >
                    {loopVideos.map((video, index) => (
                        <SwiperSlide key={`${video.id}-${index}`} className="w-[280px] sm:w-[300px] md:w-[320px] aspect-[9/14] md:aspect-[9/16] !h-auto">
                            <VideoCard video={video} />
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev-custom absolute top-1/2 left-2 z-30 w-12 h-12 bg-white/80 backdrop-blur text-brand-purple rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all transform -translate-y-1/2 hover:scale-110 hidden md:flex">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    </div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-2 z-30 w-12 h-12 bg-white/80 backdrop-blur text-brand-purple rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all transform -translate-y-1/2 hover:scale-110 hidden md:flex">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </div>
                </Swiper>
            </div>

            <style>{`
                .text-shadow { text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
                .animate-spin-slow { animation: spin 4s linear infinite; }
                .animate-marquee { animation: marquee 5s linear infinite; }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .video-swiper .swiper-pagination {
                    position: absolute !important;
                    bottom: 0px !important;
                    left: 0; 
                    right: 0;
                    margin-top: 0px !important;
                }
                .video-swiper .swiper-pagination-bullet { 
                    background: #E5E7EB; 
                    opacity: 1; 
                    width: 10px; 
                    height: 10px; 
                    transition: all 0.3s ease;
                }
                .video-swiper .swiper-pagination-bullet-active { 
                    background: #7C3AED; 
                    width: 24px; 
                    border-radius: 999px; 
                }
                
                .video-swiper .swiper-wrapper {
                    align-items: flex-start;
                    height: auto !important;
                }
            `}</style>
        </div>
    );
};

export default VideoGallery;
