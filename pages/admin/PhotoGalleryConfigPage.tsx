
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { AdminPageHeader, useNotification } from '../../components/admin';

const PhotoGalleryConfigPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [addMode, setAddMode] = useState<'link' | 'upload'>('link');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageCaption, setNewImageCaption] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('galleryConfig_photos');
        if (stored) {
            try { setImages(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('galleryConfig_photos', JSON.stringify(images));
        window.dispatchEvent(new Event('galleryPhotosUpdated'));
        setSaveStatus('Galerie salvată!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
        showNotification('Galeria foto a fost actualizată!', 'success');
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('galleryConfig_photos');
        if (stored) setImages(JSON.parse(stored));
        else setImages([]);
        setIsEditing(false);
    };

    const sanitizeUrl = (url: string) => {
        let clean = url.trim();
        if (clean.includes('drive.google.com/file/d/')) {
            const id = clean.split('/d/')[1]?.split('/')[0];
            if (id) clean = `https://drive.google.com/uc?export=view&id=${id}`;
        }
        return clean;
    };

    const handleAddImage = () => {
        if (!newImageUrl) return;
        const newImage: GalleryImage = {
            id: Date.now().toString(),
            url: sanitizeUrl(newImageUrl),
            caption: newImageCaption || 'VoiceUP'
        };
        // Insert at the beginning to respect "newest first" logic by default
        setImages([newImage, ...images]);
        setNewImageUrl('');
        setNewImageCaption('');
        setIsEditing(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sortByNewest = () => {
        const sorted = [...images].sort((a, b) => b.id.localeCompare(a.id));
        setImages(sorted);
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

        const newImages = [...images];
        const draggedItem = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setImages(newImages);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Ștergi această poză?')) {
            setImages(images.filter(img => img.id !== id));
            setIsEditing(true);
        }
    };

    const updateField = (id: string, field: keyof GalleryImage, value: any) => {
        setImages(images.map(img => img.id === id ? { ...img, [field]: value } : img));
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Administrare Galerie Foto"
                description="Gestionează ordinea pozelor prin drag & drop sau sortare automată."
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
                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-4">
                    <div className="flex gap-4 border-b border-blue-200 pb-4">
                        <button onClick={() => {setAddMode('link'); setNewImageUrl('');}} className={`px-4 py-2 rounded-lg font-bold text-sm ${addMode === 'link' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}>🔗 Link Extern</button>
                        <button onClick={() => {setAddMode('upload'); setNewImageUrl('');}} className={`px-4 py-2 rounded-lg font-bold text-sm ${addMode === 'upload' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}>📤 Upload Fișier</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-grow w-full space-y-3">
                            {addMode === 'link' ? (
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Link Imagine</label>
                                    <input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://..." className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Selectează Poza</label>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full p-2 bg-white border border-blue-200 rounded-lg" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Titlu Poză</label>
                                <input value={newImageCaption} onChange={(e) => setNewImageCaption(e.target.value)} placeholder="Ex: Emoție pe scenă" className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <button onClick={handleAddImage} disabled={!newImageUrl} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md disabled:opacity-50 h-fit whitespace-nowrap">+ Adaugă în Galerie</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, index) => (
                    <div 
                        key={img.id} 
                        draggable={isEditing}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative group bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${draggedIndex === index ? 'opacity-40 scale-95 border-brand-purple' : 'border-gray-100 hover:border-brand-purple/50'} ${isEditing ? 'cursor-move' : ''}`}
                    >
                        {isEditing && (
                            <div className="absolute top-2 left-2 z-10 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9h4V5h3l-5-5-5 5h3v4zm0 6h4v4h3l-5 5-5-5h3v-4zM7 10v4H3v3l-5-5 5-5v3h4zm14 0v4h-4v3l-5-5 5-5v3h4z"/></svg>
                            </div>
                        )}
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                            {isEditing && (
                                <button 
                                    onClick={() => handleDelete(img.id)} 
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            )}
                        </div>
                        <div className="p-3">
                            <input 
                                disabled={!isEditing} 
                                value={img.caption} 
                                onChange={(e) => updateField(img.id, 'caption', e.target.value)} 
                                className="w-full text-sm font-bold text-gray-700 bg-transparent focus:border-b-2 focus:border-brand-purple outline-none" 
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {images.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">Galeria este goală. Adaugă primele poze!</p>
                </div>
            )}
        </div>
    );
};

export default PhotoGalleryConfigPage;
