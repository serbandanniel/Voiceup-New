
import React, { useState, useEffect } from 'react';
import { PopupConfig, PopupAnimation, PopupFrequency, PopupMediaType } from '../../types';
import { DEFAULT_POPUP_CONFIG } from '../../config';
import PopupModal from '../../components/PopupModal';
import { AdminPageHeader } from '../../components/admin';

const PopupConfigPage: React.FC = () => {
    const [config, setConfig] = useState<PopupConfig>(DEFAULT_POPUP_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

    // Load config on mount
    useEffect(() => {
        const stored = localStorage.getItem('popupConfig');
        if (stored) {
            try { setConfig(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('popupConfig', JSON.stringify(config));
        setSaveStatus('Salvat!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('popupConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_POPUP_CONFIG);
        setIsEditing(false);
    };

    const handleChange = (path: string, value: any) => {
        setConfig(prev => {
            const newConfig = { ...prev };
            // Simple deep set for 2 levels
            const parts = path.split('.');
            if (parts.length === 1) {
                (newConfig as any)[parts[0]] = value;
            } else if (parts.length === 2) {
                (newConfig as any)[parts[0]][parts[1]] = value;
            }
            return newConfig;
        });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare Pop-up Promoțional"
                description="Gestionează fereastra modală care apare vizitatorilor."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Controls */}
                <div className="space-y-8 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Status & Timing */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Setări Generale</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-gray-700">Activare Modul</label>
                                <button 
                                    disabled={!isEditing}
                                    onClick={() => handleChange('enabled', !config.enabled)}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Întârziere (secunde)</label>
                                <input 
                                    type="number" 
                                    disabled={!isEditing}
                                    value={config.triggerDelay}
                                    onChange={e => handleChange('triggerDelay', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Frecvență Afișare</label>
                                <select 
                                    disabled={!isEditing}
                                    value={config.frequency}
                                    onChange={e => handleChange('frequency', e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                >
                                    <option value="always">La fiecare refresh (Test)</option>
                                    <option value="once_session">O dată pe sesiune (browser deschis)</option>
                                    <option value="once_day">O dată la 24 ore</option>
                                    <option value="once_forever">O singură dată (cookie permanent)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Efect Animație</label>
                                <select 
                                    disabled={!isEditing}
                                    value={config.animation}
                                    onChange={e => handleChange('animation', e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                >
                                    <option value="fade">Fade In</option>
                                    <option value="zoom-in">Zoom In</option>
                                    <option value="slide-up">Slide Up</option>
                                    <option value="slide-down">Slide Down</option>
                                    <option value="bounce">Bounce</option>
                                    <option value="flip">Flip 3D</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Conținut</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Tip Media</label>
                                <div className="flex gap-2">
                                    {(['none', 'image', 'video'] as const).map(type => (
                                        <button 
                                            key={type}
                                            disabled={!isEditing}
                                            onClick={() => handleChange('content.mediaType', type)}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold capitalize transition-colors ${config.content.mediaType === type ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-300'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {config.content.mediaType !== 'none' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">URL Media (Imagine/Video)</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={config.content.mediaUrl}
                                        onChange={e => handleChange('content.mediaUrl', e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                        placeholder={config.content.mediaType === 'image' ? "https://.../image.jpg" : "https://.../video.mp4"}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Suportă .mp4, YouTube sau link direct imagine.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Titlu (Opțional)</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={config.content.title}
                                    onChange={e => handleChange('content.title', e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Descriere / Text</label>
                                <textarea 
                                    rows={3}
                                    disabled={!isEditing}
                                    value={config.content.description}
                                    onChange={e => handleChange('content.description', e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button & Styling */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Buton & Stiluri</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-gray-700">Afișează Buton CTA</label>
                                <button 
                                    disabled={!isEditing}
                                    onClick={() => handleChange('button.show', !config.button.show)}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.button.show ? 'bg-brand-purple' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.button.show ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {config.button.show && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Text Buton</label>
                                        <input disabled={!isEditing} value={config.button.text} onChange={e => handleChange('button.text', e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Link</label>
                                        <input disabled={!isEditing} value={config.button.link} onChange={e => handleChange('button.link', e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Fundal</label>
                                        <input type="color" disabled={!isEditing} value={config.button.bgColor} onChange={e => handleChange('button.bgColor', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Text</label>
                                        <input type="color" disabled={!isEditing} value={config.button.textColor} onChange={e => handleChange('button.textColor', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-sm font-bold text-gray-600 mb-1">Dimensiune Popup</label>
                                <div className="flex gap-2 mb-4">
                                    {(['small', 'medium', 'large'] as const).map(size => (
                                        <button 
                                            key={size}
                                            disabled={!isEditing}
                                            onClick={() => handleChange('styles.width', size)}
                                            className={`flex-1 py-1 px-2 rounded border text-xs font-bold capitalize ${config.styles.width === size ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Overlay</label>
                                        <div className="flex items-center gap-2">
                                            <input disabled={!isEditing} value={config.styles.overlayColor} onChange={e => handleChange('styles.overlayColor', e.target.value)} className="flex-1 p-2 border rounded text-xs bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Card</label>
                                        <input type="color" disabled={!isEditing} value={config.styles.backgroundColor} onChange={e => handleChange('styles.backgroundColor', e.target.value)} className="w-full h-8 p-0 border rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="relative bg-gray-100 rounded-2xl border-4 border-gray-300 overflow-hidden flex flex-col shadow-inner">
                    <div className="bg-gray-200 border-b border-gray-300 p-2 flex justify-center gap-4">
                        <button 
                            onClick={() => setPreviewDevice('desktop')}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Desktop
                        </button>
                        <button 
                            onClick={() => setPreviewDevice('mobile')}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            Mobil
                        </button>
                    </div>

                    <div className="flex-grow relative flex items-center justify-center bg-[url('https://placehold.co/1920x1080?text=Background+Site')] bg-cover bg-center">
                        {/* Simulation Container */}
                        <div className={`relative transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden ${previewDevice === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl' : 'w-full h-full'}`}>
                            {/* Render the actual Popup Component in Preview Mode */}
                            <PopupModal previewConfig={config} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupConfigPage;
