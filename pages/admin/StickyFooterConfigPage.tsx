
import React, { useState, useEffect } from 'react';
import { StickyFooterConfig } from '../../types';
import { DEFAULT_STICKY_FOOTER_CONFIG } from '../../config';
import StickyFooter from '../../components/StickyFooter';
import { AdminPageHeader } from '../../components/admin';

const StickyFooterConfigPage: React.FC = () => {
    const [config, setConfig] = useState<StickyFooterConfig>(DEFAULT_STICKY_FOOTER_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        const stored = localStorage.getItem('stickyFooterConfig');
        if (stored) {
            try { setConfig(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('stickyFooterConfig', JSON.stringify(config));
        setSaveStatus('Salvat!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('stickyFooterConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_STICKY_FOOTER_CONFIG);
        setIsEditing(false);
    };

    const handleChange = (path: string, value: any) => {
        setConfig(prev => {
            const newConfig = { ...prev };
            // Simple deep set
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
                title="Configurare Sticky Footer"
                description="Bara fixă din partea de jos a ecranului."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SETTINGS */}
                <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* General */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">General</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-gray-700">Activare Footer</label>
                                <button 
                                    disabled={!isEditing}
                                    onClick={() => handleChange('enabled', !config.enabled)}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Tip Afișare</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['text_only', 'text_button', 'countdown', 'image_button'] as const).map(t => (
                                        <button 
                                            key={t}
                                            disabled={!isEditing}
                                            onClick={() => handleChange('type', t)}
                                            className={`py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-colors ${config.type === t ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-300'}`}
                                        >
                                            {t === 'countdown' ? '⏰ Countdown' : t.replace('_', ' + ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Efect Animație</label>
                                <select 
                                    disabled={!isEditing}
                                    value={config.effect}
                                    onChange={e => handleChange('effect', e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                >
                                    <option value="none">Fără Efect</option>
                                    <option value="slide-up">Slide Up (Intrare)</option>
                                    <option value="shake">Shake (Scuturare)</option>
                                    <option value="vibe">Vibe (Vibrație)</option>
                                    <option value="pulse">Pulse (Pulsare)</option>
                                    <option value="glow">Glow (Strălucire)</option>
                                    <option value="marquee">Marquee (Text Rulant)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content - Text & Button & Countdown */}
                    {config.type !== 'image_button' && (
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Conținut</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Mesaj Text</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        value={config.text}
                                        onChange={e => handleChange('text', e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                    />
                                </div>

                                {config.type === 'countdown' && (
                                    <div className="bg-violet-100 p-4 rounded-lg border border-violet-200">
                                        <label className="block text-sm font-bold text-brand-purple mb-1">Dată Expirare (Target Date)</label>
                                        <input 
                                            type="datetime-local"
                                            disabled={!isEditing}
                                            value={config.countdownDate || ''}
                                            onChange={e => handleChange('countdownDate', e.target.value)}
                                            onClick={(e) => {
                                                if(!isEditing) return;
                                                try { if ('showPicker' in e.currentTarget) (e.currentTarget as any).showPicker(); } catch(err) {}
                                            }}
                                            className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none cursor-pointer"
                                            style={{ colorScheme: 'light' }}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Cifrele vor apărea automat în dreapta textului.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Fundal</label>
                                        <input type="color" disabled={!isEditing} value={config.colors.background} onChange={e => handleChange('colors.background', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Text</label>
                                        <input type="color" disabled={!isEditing} value={config.colors.text} onChange={e => handleChange('colors.text', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content - Image */}
                    {config.type === 'image_button' && (
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Imagini</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">URL Banner Desktop</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={config.images.desktop}
                                        onChange={e => handleChange('images.desktop', e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Recomandat: <span className="font-bold">1920 x 120 px</span></p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">URL Banner Mobil</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={config.images.mobile}
                                        onChange={e => handleChange('images.mobile', e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none"
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Recomandat: <span className="font-bold">750 x 150 px</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Button Settings (Shared) */}
                    {(config.type === 'text_button' || config.type === 'image_button' || config.type === 'countdown') && (
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Setări Buton</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Text Buton</label>
                                        <input disabled={!isEditing} value={config.buttonText} onChange={e => handleChange('buttonText', e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Link Buton</label>
                                        <input disabled={!isEditing} value={config.buttonLink} onChange={e => handleChange('buttonLink', e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-brand-purple outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Fundal Buton</label>
                                        <input type="color" disabled={!isEditing} value={config.colors.buttonBg} onChange={e => handleChange('colors.buttonBg', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Culoare Text Buton</label>
                                        <input type="color" disabled={!isEditing} value={config.colors.buttonText} onChange={e => handleChange('colors.buttonText', e.target.value)} className="w-full h-8 p-0 border rounded cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PREVIEW */}
                <div className="relative bg-gray-100 rounded-2xl border-4 border-gray-300 overflow-hidden flex flex-col shadow-inner min-h-[500px]">
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

                    <div className="flex-grow relative flex items-center justify-center bg-[url('https://placehold.co/1920x1080?text=Site+Background')] bg-cover bg-center">
                        {/* Simulation Container */}
                        <div className={`relative transition-all duration-300 ease-in-out bg-white overflow-hidden shadow-2xl ${previewDevice === 'mobile' ? 'w-[375px] h-[600px] rounded-3xl border-8 border-gray-800' : 'w-full h-full'}`}>
                            
                            <div className="w-full h-full overflow-y-auto relative">
                                {/* Dummy Content */}
                                <div className="p-8 space-y-8">
                                    <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-32 bg-gray-100 rounded-lg"></div>
                                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                                </div>

                                {/* THE FOOTER COMPONENT IN PREVIEW MODE */}
                                <div className="absolute bottom-0 w-full">
                                    <StickyFooter previewConfig={config} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyFooterConfigPage;
