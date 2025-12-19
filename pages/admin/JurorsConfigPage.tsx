
import React, { useState, useEffect } from 'react';
import { Juror } from '../../types';
import { DEFAULT_JURORS } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const JurorsConfigPage: React.FC = () => {
    const [jurors, setJurors] = useState<Juror[]>(DEFAULT_JURORS);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Juror | null>(null);
    const [saveStatus, setSaveStatus] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('jurorsConfig');
        if (stored) {
            try { setJurors(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const saveToStorage = (data: Juror[]) => {
        setJurors(data);
        localStorage.setItem('jurorsConfig', JSON.stringify(data));
        setSaveStatus('Salvat!');
        setTimeout(() => setSaveStatus(''), 2000);
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newData = [...jurors];
        if (direction === 'up' && index > 0) {
            [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
        } else if (direction === 'down' && index < newData.length - 1) {
            [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
        }
        saveToStorage(newData);
    };

    const handleDeleteConfirm = (id: string) => {
        const newData = jurors.filter(j => j.id !== id);
        saveToStorage(newData);
        if (editingId === id) {
            setEditingId(null);
            setEditForm(null);
        }
        setPendingDeleteId(null);
    };

    const startEdit = (juror: Juror) => {
        setPendingDeleteId(null); // Cancel any pending delete
        setEditingId(juror.id);
        setEditForm({ ...juror });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const saveEdit = () => {
        if (!editForm) return;
        let newData = jurors.map(j => j.id === editForm.id ? editForm : j);
        
        if (editForm.isPresident) {
             newData = newData.map(j => ({...j, isPresident: j.id === editForm.id}));
             newData.sort((a, b) => (a.isPresident === b.isPresident) ? 0 : a.isPresident ? -1 : 1);
        }

        saveToStorage(newData);
        setEditingId(null);
        setEditForm(null);
    };

    const addNewJuror = () => {
        const newId = Date.now().toString();
        const newJuror: Juror = {
            id: newId,
            name: 'Nume Jurat',
            role: 'Rol Jurat',
            subRole: '',
            quote: 'Citat...',
            bio: 'Biografie...',
            img: 'https://placehold.co/200x200',
            isPresident: false,
            isSurprise: false
        };
        const newData = [...jurors, newJuror];
        saveToStorage(newData);
        startEdit(newJuror);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Gestionare Juriu"
                description="Adaugă, editează și setează Președintele Juriului."
                isEditing={true}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                saveStatus={saveStatus}
            >
                <button onClick={addNewJuror} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Adaugă Jurat
                </button>
            </AdminPageHeader>

            <div className="grid grid-cols-1 gap-6">
                {jurors.map((juror, index) => {
                    if (pendingDeleteId === juror.id) {
                        return (
                            <div key={juror.id} className="p-6 rounded-xl border-2 border-red-300 bg-red-50 text-center animate-fade-in">
                                <p className="font-bold text-gray-800 mb-2">Confirmare Ștergere</p>
                                <p className="text-sm text-gray-600 mb-4">Ești sigur că vrei să ștergi juratul <span className="font-bold">"{juror.name}"</span>? Acțiunea este ireversibilă.</p>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={() => setPendingDeleteId(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Anulează</button>
                                    <button onClick={() => handleDeleteConfirm(juror.id)} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">Da, Șterge</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={juror.id} className={`p-6 rounded-xl border-2 transition-all relative ${editingId === juror.id ? 'border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'} ${juror.isPresident ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
                            {editingId === juror.id && editForm ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">Nume</label>
                                            <input className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">Rol Principal</label>
                                            <input className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">Sub-rol / Funcție (Opțional)</label>
                                            <input className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.subRole || ''} onChange={e => setEditForm({...editForm, subRole: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">URL Imagine</label>
                                            <input className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.img} onChange={e => setEditForm({...editForm, img: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-2 mt-2 bg-white p-3 rounded-lg border border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={editForm.isPresident} onChange={e => setEditForm({...editForm, isPresident: e.target.checked})} className="w-4 h-4 text-brand-purple" />
                                                <span className="text-sm font-bold text-gray-900">Președinte Juriu</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={editForm.isSurprise} onChange={e => setEditForm({...editForm, isSurprise: e.target.checked})} className="w-4 h-4 text-brand-purple" />
                                                <span className="text-sm font-bold text-gray-900">Jurat Surpriză</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex flex-col h-full">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">Citat</label>
                                            <textarea rows={3} className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.quote} onChange={e => setEditForm({...editForm, quote: e.target.value})} />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="text-xs font-bold text-gray-600 mb-1 block">Biografie</label>
                                            <textarea rows={6} className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                                        </div>
                                        <div className="flex gap-2 pt-4 mt-4 md:mt-auto relative z-20">
                                            <button onClick={saveEdit} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md transition-colors">Salvează</button>
                                            <button onClick={cancelEdit} className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Anulează</button>
                                            <button onClick={() => setPendingDeleteId(editForm.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 shadow-md transition-colors" title="Șterge Jurat">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        {juror.isSurprise ? (
                                            <div className="w-full h-full bg-brand-yellow flex items-center justify-center text-brand-dark font-bold text-xs">?</div>
                                        ) : (
                                            <img src={juror.img} alt={juror.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-lg text-brand-dark">{juror.name}</h3>
                                            {juror.isPresident && <span className="bg-brand-yellow text-brand-dark text-xs px-2 py-1 rounded-full font-bold shadow-sm">PREȘEDINTE</span>}
                                            {juror.isSurprise && <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">SURPRIZĂ</span>}
                                        </div>
                                        <p className="text-brand-purple font-semibold text-sm">{juror.role}</p>
                                        {juror.subRole && <p className="text-gray-500 text-xs">{juror.subRole}</p>}
                                        <p className="text-gray-600 text-sm mt-2 italic line-clamp-2">"{juror.quote}"</p>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[100px] items-end relative z-10">
                                        <div className="flex gap-1">
                                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button onClick={() => handleMove(index, 'down')} disabled={index === jurors.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(juror)} className="text-brand-purple text-sm font-bold hover:underline">Editează</button>
                                            <button onClick={() => setPendingDeleteId(juror.id)} className="text-red-500 text-sm font-bold hover:underline">Șterge</button>
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

export default JurorsConfigPage;
