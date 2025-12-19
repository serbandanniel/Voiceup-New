
import React, { useState, useEffect } from 'react';
import { FAQ } from '../../types';
import { DEFAULT_FAQS } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const FAQConfigPage: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
    const [saveStatus, setSaveStatus] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<FAQ | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('faqConfig');
        if (stored) {
            try { setFaqs(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const saveToStorage = (newFaqs: FAQ[]) => {
        setFaqs(newFaqs);
        localStorage.setItem('faqConfig', JSON.stringify(newFaqs));
        setSaveStatus('Salvat!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newFaqs = [...faqs];
        if (direction === 'up' && index > 0) {
            [newFaqs[index], newFaqs[index - 1]] = [newFaqs[index - 1], newFaqs[index]];
        } else if (direction === 'down' && index < newFaqs.length - 1) {
            [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
        }
        saveToStorage(newFaqs);
    };
    
    const handleDeleteConfirm = (id: string) => {
        const newFaqs = faqs.filter(f => f.id !== id);
        saveToStorage(newFaqs);
        setPendingDeleteId(null);
    };

    const startEdit = (faq: FAQ) => {
        setPendingDeleteId(null);
        setEditingId(faq.id);
        setEditForm({ ...faq });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const saveEdit = () => {
        if (!editForm) return;
        const newFaqs = faqs.map(f => f.id === editForm.id ? editForm : f);
        saveToStorage(newFaqs);
        setEditingId(null);
        setEditForm(null);
    };

    const addNewFaq = () => {
        const newId = Date.now().toString();
        const newFaq: FAQ = { 
            id: newId, 
            q: 'Întrebare nouă...', 
            a: 'Răspuns nou...',
            iconUrl: 'https://icongr.am/clarity/help-info.svg?size=32&color=7C3AED'
        };
        const newFaqs = [...faqs, newFaq];
        saveToStorage(newFaqs);
        startEdit(newFaq);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Gestionare Întrebări Frecvente (FAQ)"
                description="Adaugă, editează sau reordonează întrebările."
                isEditing={true}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                saveStatus={saveStatus}
            >
                <button onClick={addNewFaq} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                    + Adaugă Întrebare
                </button>
            </AdminPageHeader>
            
            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    if (pendingDeleteId === faq.id) {
                         return (
                            <div key={faq.id} className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-center animate-fade-in">
                                <p className="font-bold text-gray-800 mb-2">Confirmare Ștergere</p>
                                <p className="text-sm text-gray-600 mb-4">Ești sigur că vrei să ștergi întrebarea <span className="font-bold">"{faq.q}"</span>?</p>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={() => setPendingDeleteId(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Anulează</button>
                                    <button onClick={() => handleDeleteConfirm(faq.id)} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">Da, Șterge</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={faq.id} className={`p-4 rounded-xl border-2 transition-all ${editingId === faq.id ? 'border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            {editingId === faq.id && editForm ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 mb-1 block">Întrebare</label>
                                        <textarea rows={2} className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.q} onChange={e => setEditForm({...editForm, q: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 mb-1 block">Răspuns</label>
                                        <textarea rows={4} className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.a} onChange={e => setEditForm({...editForm, a: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 mb-1 block">URL Icon</label>
                                        <input
                                            type="text"
                                            placeholder="https://exmplu.com/icon.svg"
                                            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none"
                                            value={editForm.iconUrl || ''}
                                            onChange={e => setEditForm({...editForm, iconUrl: e.target.value})}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Ideal: 32x32px, PNG/SVG.</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={saveEdit} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md transition-colors">Salvează</button>
                                        <button onClick={cancelEdit} className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Anulează</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between gap-4">
                                    {faq.iconUrl && <img src={faq.iconUrl} alt="icon" className="w-8 h-8 flex-shrink-0 object-contain mt-1" />}
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-800">{faq.q}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="flex flex-col">
                                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button onClick={() => handleMove(index, 'down')} disabled={index === faqs.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200 mx-2"></div>
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => startEdit(faq)} className="text-brand-purple text-sm font-bold hover:underline">Editează</button>
                                            <button onClick={() => setPendingDeleteId(faq.id)} className="text-red-500 text-sm font-bold hover:underline">Șterge</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FAQConfigPage;
