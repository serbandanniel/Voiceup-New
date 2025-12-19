
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GalleryVideo } from '../types';
import SEO from '../components/SEO';

const MOCK_VIDEOS: GalleryVideo[] = [
    { id: '1730000000001', title: 'Aftermovie VoiceUP 2024', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', originalUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', type: 'landscape' },
    { id: '1730000000002', title: 'Moment Emoționant - Maria P.', url: 'https://www.youtube.com/embed/LXb3EKWsInQ', originalUrl: 'https://youtube.com/watch?v=LXb3EKWsInQ', type: 'portrait' },
    { id: '1730000000003', title: 'Câștigătorii Ediției de Iarnă', url: 'https://www.tiktok.com/embed/v2/7123456789012345678', originalUrl: 'https://tiktok.com/@voiceup/video/7123456789012345678', type: 'portrait' },
    { id: '1730000000004', title: 'Interviu Juriu - Raluca Iurașcu', url: 'https://www.youtube.com/embed/9bZkp7q19f0', originalUrl: 'https://youtube.com/watch?v=9bZkp7q19f0', type: 'landscape' },
    { id: '1730000000005', title: 'Backstage Fun & Games', url: 'https://www.instagram.com/reels/C_demo_reel/embed', originalUrl: 'https://instagram.com/reels/C_demo_reel/', type: 'portrait' },
    { id: '1730000000006', title: 'Pregătiri în Culise', url: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/10153231339129744/', originalUrl: 'https://facebook.com/watch/?v=10153231339129744', type: 'landscape' },
];

const FullVideoGallery: React.FC = () => {
    const [videos, setVideos] = useState<GalleryVideo[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('galleryConfig_videos');
        if (stored) {
            try { 
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setVideos(parsed);
                } else {
                    setVideos(MOCK_VIDEOS);
                }
            } catch (e) { 
                console.error(e); 
                setVideos(MOCK_VIDEOS);
            }
        } else {
            setVideos(MOCK_VIDEOS);
        }
    }, []);

    const getPlatform = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('tiktok')) return 'tiktok';
        if (url.includes('facebook.com')) return 'facebook';
        if (url.includes('instagram.com')) return 'instagram';
        if (url.includes('drive.google.com')) return 'drive';
        if (url.startsWith('data:video') || url.includes('.mp4')) return 'internal';
        return 'other';
    };

    const PlatformButton = ({ video }: { video: GalleryVideo }) => {
        const platform = getPlatform(video.url);
        const link = video.originalUrl || video.url;

        switch (platform) {
            case 'youtube':
                return (
                    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#FF0000] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-[#CC0000] transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        Youtube
                    </a>
                );
            case 'tiktok':
                return (
                    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/20 hover:bg-gray-900 transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        TikTok
                    </a>
                );
            case 'facebook':
                return (
                    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-[#166fe5] transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                    </a>
                );
            case 'instagram':
                return (
                    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/></svg>
                        Instagram
                    </a>
                );
            default:
                return (
                    <span className="flex items-center gap-2 bg-brand-purple text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm">Intern</span>
                );
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50">
            <SEO title="Galerie Video - VoiceUP Festival" />
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
                    <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight">Galerie Video</h1>
                    <div className="w-32 h-2 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-yellow mx-auto rounded-full mb-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] md:auto-rows-[250px] gap-6">
                    {videos.map((video) => {
                        const platform = getPlatform(video.url);
                        const isPortrait = video.type === 'portrait';
                        return (
                            <div key={video.id} className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${isPortrait ? 'md:row-span-2' : ''}`}>
                                <div className="flex-grow bg-black relative">
                                    {platform === 'internal' ? (
                                        <video src={video.url} className="w-full h-full object-cover" controls playsInline />
                                    ) : (
                                        <iframe src={video.url} title={video.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    )}
                                </div>
                                <div className="p-4 md:p-6 bg-white flex flex-col gap-3">
                                    <h3 className="font-black text-gray-800 truncate text-sm md:text-base">{video.title}</h3>
                                    <div className="flex justify-between items-center mt-auto">
                                        <PlatformButton video={video} />
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${isPortrait ? 'bg-pink-50 text-pink-500 border-pink-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>{video.type}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                            Urmărește-ne pentru a fi la curent cu ultimele noutăți, concursuri și momente exclusive din culisele festivalului VoiceUP. Fii primul care vede cele mai tari prestații!
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
        </div>
    );
};

export default FullVideoGallery;
