
import React, { useState, useEffect } from 'react';
import { GalleryVideo } from '../../types';
import { AdminPageHeader, useNotification } from '../../components/admin';

const VideoGalleryConfigPage: React.FC = () => {
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [addMode, setAddMode] = useState<'link' | 'upload'>('link');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [newVideoType, setNewVideoType] = useState<'portrait' | 'landscape'>('landscape');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('galleryConfig_videos');
        if (stored) {
            try { setVideos(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('galleryConfig_videos', JSON.stringify(videos));
        window.dispatchEvent(new Event('galleryVideosUpdated'));
        setSaveStatus('Galerie salvată!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
        showNotification('Galeria video a fost actualizată!', 'success');
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('galleryConfig_videos');
        if (stored) setVideos(JSON.parse(stored));
        else setVideos([]);
        setIsEditing(false);
    };

    const sanitizeVideoUrl = (url: string) => {
        let clean = url.trim();
        let embed = clean;

        if (clean.includes('watch?v=')) embed = clean.replace('watch?v=', 'embed/');
        else if (clean.includes('youtu.be/')) embed = clean.replace('youtu.be/', 'www.youtube.com/embed/');
        else if (clean.includes('drive.google.com/file/d/')) {
            const id = clean.split('/d/')[1]?.split('/')[0];
            if (id) embed = `https://drive.google.com/file/d/${id}/preview`;
        }
        else if (clean.includes('tiktok.com/') && !clean.includes('embed')) {
            const videoId = clean.split('/video/')[1]?.split('?')[0];
            if (videoId) embed = `https://www.tiktok.com/embed/v2/${videoId}`;
        }
        else if (clean.includes('facebook.com/')) {
            embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}`;
        }
        else if (clean.includes('instagram.com/')) {
            const base = clean.split('?')[0];
            embed = base.endsWith('/') ? `${base}embed` : `${base}/embed`;
        }
        
        return { embed, original: clean };
    };

    const addVideo = () => {
        if (!newVideoUrl) return;
        const { embed, original } = sanitizeVideoUrl(newVideoUrl);
        const newVideo: GalleryVideo = {
            id: Date.now().toString(),
            url: embed,
            originalUrl: original,
            title: newVideoTitle || `Video ${videos.length + 1}`,
            type: newVideoType
        };
        setVideos([newVideo, ...videos]);
        setNewVideoUrl('');
        setNewVideoTitle('');
        setIsEditing(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewVideoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sortByNewest = () => {
        const sorted = [...videos].sort((a, b) => b.id.localeCompare(a.id));
        setVideos(sorted);
        setIsEditing(true);
        showNotification('Sortat după noutate!', 'info');
    };

    // --- DRAG AND DROP LOGIC ---
    const handleDragStart = (index: number) => {
        if (!isEditing) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newVideos = [...videos];
        const draggedItem = newVideos[draggedIndex];
        newVideos.splice(draggedIndex, 1);
        newVideos.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setVideos(newVideos);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Ștergi acest video?')) {
            setVideos(videos.filter(v => v.id !== id));
            setIsEditing(true);
        }
    };

    const updateField = (id: string, field: keyof GalleryVideo, value: any) => {
        setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Administrare Galerie Video"
                description="Reordonează clipurile prin drag & drop sau folosește sortarea automată."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            >
                 <button 
                    onClick={sortByNewest}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center gap-2 text-sm border border-gray-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
                    Cele mai noi sus
                </button>
            </AdminPageHeader>

            {isEditing && (
                <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-100 space-y-4">
                    <div className="flex gap-4 border-b border-red-200 pb-4">
                        <button onClick={() => {setAddMode('link'); setNewVideoUrl('');}} className={`px-4 py-2 rounded-lg font-bold text-sm ${addMode === 'link' ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-100'}`}>🔗 Link Video</button>
                        <button onClick={() => {setAddMode('upload'); setNewVideoUrl('');}} className={`px-4 py-2 rounded-lg font-bold text-sm ${addMode === 'upload' ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-100'}`}>📤 Upload MP4</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-grow w-full space-y-3">
                            {addMode === 'link' ? (
                                <div>
                                    <label className="block text-xs font-bold text-red-800 mb-1 uppercase">Link Video</label>
                                    <input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://..." className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white font-bold" />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-red-800 mb-1 uppercase">Selectează fișierul MP4</label>
                                    <input type="file" accept="video/mp4" onChange={handleFileUpload} className="w-full p-2 bg-white border border-red-200 rounded-lg" />
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-red-800 mb-1 uppercase">Titlu Video</label>
                                    <input value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="Ex: Aftermovie Ediția I" className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-red-800 mb-1 uppercase">Format Bento</label>
                                    <select value={newVideoType} onChange={(e) => setNewVideoType(e.target.value as any)} className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white font-bold">
                                        <option value="landscape">Landscape (Ocupă 1 loc)</option>
                                        <option value="portrait">Portrait (Ocupă 2 rânduri vertical)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button onClick={addVideo} disabled={!newVideoUrl} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 shadow-md disabled:opacity-50 whitespace-nowrap h-fit">+ Adaugă Video</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {videos.map((video, index) => (
                    <div 
                        key={video.id} 
                        draggable={isEditing}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex flex-col md:flex-row gap-4 p-4 border-2 rounded-xl transition-all duration-300 items-center ${draggedIndex === index ? 'opacity-40 scale-95 border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-brand-purple/30'} ${isEditing ? 'cursor-move' : ''}`}
                    >
                        {isEditing && (
                            <div className="text-gray-300 flex-shrink-0">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            </div>
                        )}
                        <div className="w-full md:w-32 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 relative group">
                            {video.url.startsWith('data:video') ? (
                                <video src={video.url} className="w-full h-full object-cover" muted />
                            ) : (
                                <iframe src={video.url} className="w-full h-full pointer-events-none" title="preview"></iframe>
                            )}
                        </div>
                        <div className="flex-grow w-full">
                            <input disabled={!isEditing} value={video.title} onChange={(e) => updateField(video.id, 'title', e.target.value)} className="w-full p-2 font-bold text-gray-800 bg-transparent focus:border-b-2 focus:border-brand-purple outline-none" />
                            <div className="flex gap-2 mt-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${video.type === 'portrait' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>{video.type}</span>
                                {isEditing && (
                                    <div className="flex gap-2 ml-auto">
                                        <button onClick={() => handleDelete(video.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {videos.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">Nu există videouri în listă.</p>
                </div>
            )}
        </div>
    );
};

export default VideoGalleryConfigPage;
