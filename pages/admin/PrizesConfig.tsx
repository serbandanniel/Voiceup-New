
import React, { useState, useEffect } from 'react';
import { PrizesConfig, Prize } from '../../types';
import { DEFAULT_PRIZES_CONFIG } from '../../config';

const PrizesConfigPage: React.FC = () => {
    const [config, setConfig] = useState<PrizesConfig>(DEFAULT_PRIZES_CONFIG);
    const [saveStatus, setSaveStatus] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Prize | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('prizesConfig');
        if (stored) {
            try { setConfig(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const saveToStorage = (newConfig: PrizesConfig) => {
        setConfig(newConfig);
        localStorage.setItem('prizesConfig', JSON.stringify(newConfig));
        setSaveStatus('Salvat!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newPrizes = [...config.prizes];
        if (direction === 'up' && index > 0) {
            [newPrizes[index], newPrizes[index - 1]] = [newPrizes[index - 1], newPrizes[index]];
        } else if (direction === 'down' && index < newPrizes.length - 1) {
            [newPrizes[index], newPrizes[index + 1]] = [newPrizes[index + 1], newPrizes[index]];
        }
        saveToStorage({ ...config, prizes: newPrizes });
    };

    const handleDeleteConfirm = (id: string) => {
        const newPrizes = config.prizes.filter(p => p.id !== id);
        saveToStorage({ ...config, prizes: newPrizes });
        setPendingDeleteId(null);
    };

    const startEdit = (prize: Prize) => {
        setPendingDeleteId(null);
        setEditingId(prize.id);
        setEditForm({ ...prize });
    };

    const saveEdit = () => {
        if (!editForm) return;
        const newPrizes = config.prizes.map(p => p.id === editForm.id ? editForm : p);
        saveToStorage({ ...config, prizes: newPrizes });
        setEditingId(null);
        setEditForm(null);
    };

    const addNewPrize = () => {
        const newId = Date.now().toString();
        const newPrize: Prize = { 
            id: newId, 
            title: 'Titlu Nou', 
            desc: 'Descriere premiu...', 
            colorClass: 'bg-brand-purple', 
            textColorClass: 'text-white' 
        };
        const newPrizes = [...config.prizes, newPrize];
        saveToStorage({ ...config, prizes: newPrizes });
        startEdit(newPrize);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Global Trophy Image Config */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Imagine Trofeu Central</h2>
                    {saveStatus && <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm animate-pulse">{saveStatus}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8">
                    <div className="space-y-4">
                         <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-1">URL Imagine Trofeu</label>
                            <input 
                                value={config.trophyImage}
                                onChange={(e) => {
                                    const newConf = { ...config, trophyImage: e.target.value };
                                    setConfig(newConf);
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                <span className="font-bold text-brand-purple">Ideal:</span> 800x800px PNG cu fundal transparent.
                            </p>
                         </div>
                         <button onClick={() => saveToStorage(config)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-colors">Salvează Imaginea</button>
                    </div>
                    <div className="flex justify-center items-center bg-gray-100 rounded-xl p-4">
                        <img src={config.trophyImage} alt="Preview" className="max-h-32 object-contain drop-shadow-lg" />
                    </div>
                </div>
            </div>

            {/* Prizes List */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Lista Premii</h2>
                    <button onClick={addNewPrize} className="bg-brand-pink text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600 shadow-md transition-all flex items-center gap-2">
                        + Adaugă Premiu
                    </button>
                </div>
                
                <div className="space-y-4">
                    {config.prizes.map((prize, index) => {
                        if (pendingDeleteId === prize.id) {
                            return (
                                <div key={prize.id} className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-center animate-fade-in">
                                    <p className="font-bold text-gray-800 mb-2">Confirmare Ștergere</p>
                                    <p className="text-sm text-gray-600 mb-4">Ești sigur că vrei să ștergi premiul <span className="font-bold">"{prize.title}"</span>?</p>
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => setPendingDeleteId(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Anulează</button>
                                        <button onClick={() => handleDeleteConfirm(prize.id)} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">Da, Șterge</button>
                                    </div>
                                </div>
                            );
                        }
                        
                        return (
                            <div key={prize.id} className={`p-4 rounded-xl border-2 transition-all ${editingId === prize.id ? 'border-brand-purple bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                {editingId === prize.id && editForm ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-600 mb-1 block">Titlu</label>
                                                <input className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-600 mb-1 block">Culoare Fundal (ex: bg-blue-500)</label>
                                                <select className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.colorClass} onChange={e => setEditForm({...editForm, colorClass: e.target.value})}>
                                                    <option value="bg-brand-purple">Mov Brand</option>
                                                    <option value="bg-brand-pink">Roz Brand</option>
                                                    <option value="bg-brand-yellow">Galben Brand</option>
                                                    <option value="bg-blue-500">Albastru</option>
                                                    <option value="bg-green-500">Verde</option>
                                                    <option value="bg-red-500">Roșu</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-600 mb-1 block">Culoare Text</label>
                                                <select className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.textColorClass} onChange={e => setEditForm({...editForm, textColorClass: e.target.value})}>
                                                    <option value="text-white">Alb</option>
                                                    <option value="text-brand-dark">Negru / Mov Închis</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-4 flex flex-col">
                                            <div>
                                                <label className="text-xs font-bold text-gray-600 mb-1 block">Descriere</label>
                                                <textarea rows={4} className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-brand-purple outline-none" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} />
                                            </div>
                                            <div className="flex gap-2 pt-4 mt-auto">
                                                <button onClick={saveEdit} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md transition-colors">Salvează</button>
                                                <button onClick={() => { setEditingId(null); setEditForm(null); }} className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Anulează</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${prize.colorClass} ${prize.textColorClass}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{prize.title}</h4>
                                                <p className="text-sm text-gray-600">{prize.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button onClick={() => handleMove(index, 'down')} disabled={index === config.prizes.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                            <div className="w-px h-6 bg-gray-200 mx-2"></div>
                                            <button onClick={() => startEdit(prize)} className="text-brand-purple text-sm font-bold hover:underline">Editează</button>
                                            <button onClick={() => setPendingDeleteId(prize.id)} className="text-red-500 text-sm font-bold hover:underline">Șterge</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default PrizesConfigPage;
