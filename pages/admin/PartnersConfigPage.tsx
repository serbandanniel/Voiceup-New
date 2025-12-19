
import React, { useState, useEffect } from 'react';
import { Partner } from '../../types';
import { DEFAULT_PARTNERS } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const PartnersConfigPage: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
    const [saveStatus, setSaveStatus] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partner>({ id: '', img: '', link: '' });
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('partnersConfig');
        if (stored) {
            try {
                setPartners(JSON.parse(stored));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const saveToStorage = (newPartners: Partner[]) => {
        setPartners(newPartners);
        localStorage.setItem('partnersConfig', JSON.stringify(newPartners));
        setSaveStatus('Salvat!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newPartners = [...partners];
        if (direction === 'up' && index > 0) {
            [newPartners[index], newPartners[index - 1]] = [newPartners[index - 1], newPartners[index]];
        } else if (direction === 'down' && index < newPartners.length - 1) {
            [newPartners[index], newPartners[index + 1]] = [newPartners[index + 1], newPartners[index]];
        }
        saveToStorage(newPartners);
    };

    const handleDeleteConfirm = (id: string) => {
        const newPartners = partners.filter(p => p.id !== id);
        saveToStorage(newPartners);
        setPendingDeleteId(null);
    };

    const startEdit = (partner: Partner) => {
        setPendingDeleteId(null);
        setEditingId(partner.id);
        setEditForm(partner);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ id: '', img: '', link: '' });
    };

    const saveEdit = () => {
        const newPartners = partners.map(p => p.id === editForm.id ? editForm : p);
        saveToStorage(newPartners);
        setEditingId(null);
    };

    const addNewPartner = () => {
        const newId = Date.now().toString();
        const newPartner: Partner = { id: newId, img: 'https://placehold.co/200x100?text=Logo+Nou', link: '#' };
        const newPartners = [...partners, newPartner];
        saveToStorage(newPartners);
        startEdit(newPartner);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Gestionare Parteneri"
                description="Adaugă, editează sau reordonează partenerii."
                isEditing={true} // Always "editing" enabled since this page is a list
                onEdit={() => {}}
                onSave={() => {}} // Save happens per action
                onCancel={() => {}}
                saveStatus={saveStatus}
            >
                <button onClick={addNewPartner} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Adaugă Partener
                </button>
            </AdminPageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner, index) => {
                     if (pendingDeleteId === partner.id) {
                        return (
                             <div key={partner.id} className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-center animate-fade-in flex flex-col justify-center items-center min-h-[190px]">
                                <p className="font-bold text-gray-800 mb-2">Confirmare</p>
                                <p className="text-sm text-gray-600 mb-4">Ești sigur că vrei să ștergi acest partener?</p>
                                <div className="flex gap-4 justify-center w-full">
                                    <button onClick={() => setPendingDeleteId(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all text-sm">Anulează</button>
                                    <button onClick={() => handleDeleteConfirm(partner.id)} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm">Șterge</button>
                                </div>
                            </div>
                        )
                     }
                
                    return (
                        <div key={partner.id} className={`p-4 rounded-xl border-2 transition-all relative ${editingId === partner.id ? 'border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            {editingId === partner.id ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 mb-1 block">URL Logo (Imagine)</label>
                                        <input 
                                            value={editForm.img}
                                            onChange={e => setEditForm({...editForm, img: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 mb-1 block">Link Website</label>
                                        <input 
                                            value={editForm.link}
                                            onChange={e => setEditForm({...editForm, link: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={saveEdit} className="flex-1 bg-green-600 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:bg-green-700">Salvează</button>
                                        <button onClick={cancelEdit} className="flex-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded text-sm font-bold hover:bg-gray-50">Anulează</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="h-20 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden p-2">
                                        <img src={partner.img} alt="Partner" className="max-h-full max-w-full object-contain" />
                                    </div>
                                    <p className="text-xs text-gray-400 truncate mb-4">{partner.link}</p>
                                    
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => handleMove(index, 'up')} 
                                                disabled={index === 0}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleMove(index, 'down')} 
                                                disabled={index === partners.length - 1}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(partner)} className="text-brand-purple text-sm font-bold hover:underline">Editează</button>
                                            <button onClick={() => setPendingDeleteId(partner.id)} className="text-red-500 text-sm font-bold hover:underline">Șterge</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default PartnersConfigPage;
