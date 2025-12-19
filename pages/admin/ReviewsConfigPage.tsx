
import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { AdminPageHeader } from '../../components/admin';

// Default Reviews Data (Moved here as initial state)
const DEFAULT_REVIEWS: Review[] = [
    { id: '1', author: 'Maria Popescu', role: 'Părinte', stars: 5, text: 'O experiență extraordinară pentru fiica mea! Organizarea a fost impecabilă.', isVisible: true },
    { id: '2', author: 'Andrei Ionescu', role: 'Participant', stars: 5, text: 'Cea mai tare scenă pe care am cântat vreodată. M-am simțit ca un star!', isVisible: true },
    { id: '3', author: 'Elena Dumitrescu', role: 'Profesor Canto', stars: 5, text: 'Recomand acest festival tuturor elevilor mei. Juriul este foarte corect și feedback-ul valoros.', isVisible: true },
    { id: '4', author: 'George Radu', role: 'Părinte', stars: 4, text: 'Atmosferă superbă, sunet bun. Ne vom întoarce cu siguranță la anul.', isVisible: true },
    { id: '5', author: 'Ioana Stan', role: 'Participant', stars: 5, text: 'Am câștigat premiul II și sunt foarte mândră! Mulțumesc VoiceUP!', isVisible: true },
];

const ReviewsConfigPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Review | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('reviewsConfig');
        if (stored) {
            try { setReviews(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('reviewsConfig', JSON.stringify(reviews));
        // Dispatch event for frontend updates
        window.dispatchEvent(new Event('reviewsUpdated'));
        setSaveStatus('Recenziile au fost salvate!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('reviewsConfig');
        if (stored) setReviews(JSON.parse(stored));
        else setReviews(DEFAULT_REVIEWS);
        setIsEditing(false);
        setEditingId(null);
    };

    const startEdit = (review: Review) => {
        setEditingId(review.id);
        setEditForm({ ...review });
        setIsEditing(true);
    };

    const saveEdit = () => {
        if (!editForm) return;
        const updatedReviews = reviews.map(r => r.id === editForm.id ? editForm : r);
        setReviews(updatedReviews);
        setEditingId(null);
        setEditForm(null);
    };

    const addNewReview = () => {
        const newReview: Review = {
            id: Date.now().toString(),
            author: 'Nume Nou',
            role: 'Participant',
            stars: 5,
            text: 'Scrie recenzia aici...',
            isVisible: true
        };
        setReviews([newReview, ...reviews]);
        startEdit(newReview);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Sigur vrei să ștergi această recenzie?')) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newReviews = [...reviews];
        if (direction === 'up' && index > 0) {
            [newReviews[index], newReviews[index - 1]] = [newReviews[index - 1], newReviews[index]];
        } else if (direction === 'down' && index < newReviews.length - 1) {
            [newReviews[index], newReviews[index + 1]] = [newReviews[index + 1], newReviews[index]];
        }
        setReviews(newReviews);
    };

    const toggleVisibility = (id: string) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, isVisible: !r.isVisible } : r));
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Administrare Recenzii"
                description="Adaugă, editează și gestionează părerile participanților."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            >
                {!isEditing && (
                    <button onClick={addNewReview} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                        + Adaugă Recenzie
                    </button>
                )}
            </AdminPageHeader>

            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <div key={review.id} className={`p-4 rounded-xl border-2 transition-all ${editingId === review.id ? 'border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'} ${!review.isVisible && editingId !== review.id ? 'opacity-60 bg-gray-50' : ''}`}>
                        {editingId === review.id && editForm ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nume Autor</label>
                                        <input 
                                            value={editForm.author}
                                            onChange={e => setEditForm({...editForm, author: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Rol (ex: Părinte)</label>
                                            <input 
                                                value={editForm.role}
                                                onChange={e => setEditForm({...editForm, role: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stele (1-5)</label>
                                            <input 
                                                type="number" min="1" max="5"
                                                value={editForm.stars}
                                                onChange={e => setEditForm({...editForm, stars: parseInt(e.target.value)})}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-200 shadow-sm">
                                            <input 
                                                type="checkbox" 
                                                checked={editForm.isVisible !== false} 
                                                onChange={(e) => setEditForm({...editForm, isVisible: e.target.checked})}
                                                className="w-4 h-4 text-brand-purple rounded focus:ring-brand-purple"
                                            />
                                            <span className={`text-xs font-bold ${editForm.isVisible !== false ? 'text-green-600' : 'text-gray-400'}`}>
                                                {editForm.isVisible !== false ? 'VISIBLE PE SITE' : 'ASCUNS'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Text Recenzie</label>
                                        <textarea 
                                            rows={4}
                                            value={editForm.text}
                                            onChange={e => setEditForm({...editForm, text: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-auto pt-2">
                                        <button onClick={saveEdit} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">Salvează Modificări</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-800 text-lg">{review.author}</h4>
                                        <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded font-bold uppercase">{review.role}</span>
                                        {!review.isVisible && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">Ascuns</span>}
                                    </div>
                                    <div className="flex text-yellow-400 mb-2 text-sm">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>{i < review.stars ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                                </div>
                                
                                {isEditing && (
                                    <div className="flex flex-col gap-2 min-w-[100px] items-end">
                                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:bg-white hover:shadow-sm rounded disabled:opacity-30">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                                            </button>
                                            <button onClick={() => handleMove(index, 'down')} disabled={index === reviews.length - 1} className="p-1 text-gray-500 hover:bg-white hover:shadow-sm rounded disabled:opacity-30">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleVisibility(review.id)} className={`p-2 rounded-lg transition-colors ${review.isVisible ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`} title="Vizibilitate">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={review.isVisible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} /></svg>
                                            </button>
                                            <button onClick={() => startEdit(review)} className="p-2 text-brand-purple bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors" title="Editează">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                            </button>
                                            <button onClick={() => handleDelete(review.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Șterge">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsConfigPage;
