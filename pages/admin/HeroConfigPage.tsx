
import React, { useState, useEffect } from 'react';
import { HeroConfig, DynamicTextSet } from '../../types';
import { DEFAULT_HERO_CONFIG } from '../../config';
import { EmojiInput, AdminPageHeader } from '../../components/admin';

const FONT_OPTIONS = [
    { value: 'Nunito', label: 'Nunito (Default)' }, { value: 'Roboto', label: 'Roboto' }, { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' }, { value: 'Lato', label: 'Lato' }, { value: 'Poppins', label: 'Poppins' },
    { value: 'Alfa Slab One', label: 'Alfa Slab One' }, { value: 'Bebas Neue', label: 'Bebas Neue' }, { value: 'Anton', label: 'Anton' },
    { value: 'Righteous', label: 'Righteous' }, { value: 'Passion One', label: 'Passion One' },
];

const HeroConfigPage: React.FC = () => {
    const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const loadConfig = () => {
        const stored = localStorage.getItem('heroConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_HERO_CONFIG, ...parsed });
            } catch (e) { console.error(e); }
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const handleSave = () => {
        localStorage.setItem('heroConfig', JSON.stringify(config));
        setSaveStatus('Salvat cu succes!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleCancel = () => {
        loadConfig();
        setIsEditing(false);
    };

    const updateField = (path: string, value: any) => {
        const keys = path.split('.');
        setConfig(prev => {
            const next = { ...prev };
            let current: any = next;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const handleUpdateSet = (index: number, field: keyof DynamicTextSet, value: any) => {
        const sets = [...config.changingText.sets];
        sets[index] = { ...sets[index], [field]: value };
        updateField('changingText.sets', sets);
    };

    const handleAddSet = () => {
        const sets = [...(config.changingText.sets || [])];
        sets.push({
            id: Date.now().toString(),
            prefix: "Frază nouă ",
            prefixColor: "#2E1065",
            words: ["Cuvânt 1", "Cuvânt 2"],
            wordsColor: "#F472B6"
        });
        updateField('changingText.sets', sets);
    };

    const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (v: boolean) => void }) => (
        <button disabled={!isEditing} onClick={() => onChange(!enabled)} className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-brand-purple' : 'bg-gray-300'} ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
             <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-12">
            <AdminPageHeader 
                title="Configurare Completă Hero"
                description="Gestionează texte dinamice, fundaluri video/foto și stiluri vizuale."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            {/* 1. TEXTE DINAMICE & FONT SIZE */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-black text-xl text-brand-dark">1. Texte Dinamice & Dimensiuni</h3>
                    <Toggle enabled={config.changingText?.enabled} onChange={v => updateField('changingText.enabled', v)} />
                </div>

                {config.changingText?.enabled && (
                    <div className="grid grid-cols-1 gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-violet-50 p-6 rounded-2xl border border-violet-100">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Font Size Desktop: <span className="text-brand-purple">{config.changingText.fontSizeDesktop}px</span></label>
                                <input type="range" min="20" max="120" disabled={!isEditing} value={config.changingText.fontSizeDesktop} onChange={e => updateField('changingText.fontSizeDesktop', parseInt(e.target.value))} className="w-full accent-brand-purple" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Font Size Mobil: <span className="text-brand-purple">{config.changingText.fontSizeMobile}px</span></label>
                                <input type="range" min="14" max="60" disabled={!isEditing} value={config.changingText.fontSizeMobile} onChange={e => updateField('changingText.fontSizeMobile', parseInt(e.target.value))} className="w-full accent-brand-pink" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {config.changingText.sets.map((set, idx) => (
                                <div key={set.id} className="relative bg-white p-6 rounded-2xl shadow-md border-2 border-violet-100">
                                    <div className="absolute -top-3 -left-3 bg-brand-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">{idx + 1}</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Fraza Fixă (Prefix)</label>
                                            <input disabled={!isEditing} value={set.prefix} onChange={e => handleUpdateSet(idx, 'prefix', e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                                            <input type="color" disabled={!isEditing} value={set.prefixColor} onChange={e => handleUpdateSet(idx, 'prefixColor', e.target.value)} className="w-10 h-10 p-0 border-none cursor-pointer" title="Culoare Prefix" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Cuvinte Dinamice (unul pe rând)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {set.words.map((word, wIdx) => (
                                                    <div key={wIdx} className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                                                        <input disabled={!isEditing} value={word} onChange={e => {
                                                            const newWords = [...set.words];
                                                            newWords[wIdx] = e.target.value;
                                                            handleUpdateSet(idx, 'words', newWords);
                                                        }} className="bg-transparent border-none text-sm font-bold focus:ring-0 w-24" />
                                                        <button disabled={!isEditing} onClick={() => handleUpdateSet(idx, 'words', set.words.filter((_, i) => i !== wIdx))} className="ml-1 text-red-400 text-xs">✕</button>
                                                    </div>
                                                ))}
                                                <button disabled={!isEditing} onClick={() => handleUpdateSet(idx, 'words', [...set.words, "Cuvânt nou"])} className="text-xs font-bold text-brand-purple">+ Adaugă</button>
                                            </div>
                                            <input type="color" disabled={!isEditing} value={set.wordsColor} onChange={e => handleUpdateSet(idx, 'wordsColor', e.target.value)} className="w-10 h-10 p-0 border-none cursor-pointer" title="Culoare Cuvinte" />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <button onClick={() => updateField('changingText.sets', config.changingText.sets.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button disabled={!isEditing} onClick={handleAddSet} className="w-full py-4 border-2 border-dashed border-brand-purple/30 text-brand-purple font-black rounded-2xl hover:bg-brand-purple/5 transition-all">+ Adaugă Set Nou</button>
                        </div>
                    </div>
                )}
            </section>

            {/* 2. CONFIGURARE FUNDAL */}
            <section className="space-y-6">
                <h3 className="font-black text-xl text-brand-dark border-b pb-2">2. Fundal Hero</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {['gradient', 'image', 'video'].map(type => (
                        <button key={type} disabled={!isEditing} onClick={() => updateField('backgroundType', type)} className={`py-3 rounded-xl border-2 font-bold capitalize transition-all ${config.backgroundType === type ? 'bg-brand-purple text-white border-brand-purple shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}>
                            {type}
                        </button>
                    ))}
                </div>

                {config.backgroundType === 'image' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Imagine Desktop (Landscape)</label>
                            <input disabled={!isEditing} value={config.desktopImageUrl} onChange={e => updateField('desktopImageUrl', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Imagine Mobil (Portrait)</label>
                            <input disabled={!isEditing} value={config.mobileImageUrl} onChange={e => updateField('mobileImageUrl', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                    </div>
                )}

                {config.backgroundType === 'video' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Video Desktop (MP4 Landscape)</label>
                            <input disabled={!isEditing} value={config.desktopVideoUrl} onChange={e => updateField('desktopVideoUrl', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Video Mobil (MP4 Portrait)</label>
                            <input disabled={!isEditing} value={config.mobileVideoUrl} onChange={e => updateField('mobileVideoUrl', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                    </div>
                )}
            </section>

            {/* 3. LOGO & DECORATIUNI */}
            <section className="space-y-6">
                <h3 className="font-black text-xl text-brand-dark border-b pb-2">3. Logo & Decorațiuni</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-gray-700">Afișează Logo</label>
                            <Toggle enabled={config.showLogo} onChange={v => updateField('showLogo', v)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Animație Logo</label>
                            <select disabled={!isEditing} value={config.logoAnimation.type} onChange={e => updateField('logoAnimation.type', e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                                <option value="none">Static (Fără Animație)</option>
                                <option value="float">Plutire (Sus-Jos)</option>
                                <option value="pulse">Pulsare (Zoom)</option>
                                <option value="rotate">Rotație Fină</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tip Decorațiune Fundal</label>
                            <select disabled={!isEditing} value={config.decorationType} onChange={e => updateField('decorationType', e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                                <option value="none">Niciuna</option>
                                <option value="notes">Note Muzicale Plutitoare</option>
                                <option value="visualizer">Audio Visualizer (Bări)</option>
                            </select>
                        </div>
                        {config.decorationType === 'notes' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Număr Note: {config.floatingNotesCount}</label>
                                <input type="range" min="10" max="100" disabled={!isEditing} value={config.floatingNotesCount} onChange={e => updateField('floatingNotesCount', parseInt(e.target.value))} className="w-full accent-brand-purple" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. BUTON INSCRIERE */}
            <section className="space-y-6">
                <h3 className="font-black text-xl text-brand-dark border-b pb-2">4. Buton Înscriere</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-gray-700">Afișează Buton</label>
                            <Toggle enabled={config.showButton} onChange={v => updateField('showButton', v)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Text Buton</label>
                            <EmojiInput disabled={!isEditing} value={config.buttonText} onChange={v => updateField('buttonText', v)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Culoare Text</label>
                            <input type="color" disabled={!isEditing} value={config.buttonStyles.textColor} onChange={e => updateField('buttonStyles.textColor', e.target.value)} className="w-full h-10 p-0 border-none cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Culoare Fundal</label>
                            <input type="color" disabled={!isEditing} value={config.buttonStyles.bgColor} onChange={e => updateField('buttonStyles.bgColor', e.target.value)} className="w-full h-10 p-0 border-none cursor-pointer" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TITLU STATIC (FALLBACK) */}
            <section className="space-y-4 opacity-70">
                <h3 className="font-bold text-lg text-gray-400">Titlu Static (Doar dacă textele dinamice sunt OFF)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input disabled={!isEditing} value={config.title} onChange={e => updateField('title', e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Let's VoiceUP together" />
                    <select disabled={!isEditing} value={config.titleStyles.fontFamily} onChange={e => updateField('titleStyles.fontFamily', e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                        {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>
            </section>
        </div>
    );
};

export default HeroConfigPage;
