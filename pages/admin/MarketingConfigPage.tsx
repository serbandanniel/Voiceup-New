import React, { useState, useEffect } from 'react';
import { MarketingConfig } from '../../types';
import { DEFAULT_MARKETING_TRACKING_CONFIG } from '../../config';
import { AdminPageHeader } from '../../components/admin';

interface MarketingConfigPageProps {
    initialTab?: 'google' | 'facebook' | 'tiktok' | 'fomo';
}

const MarketingConfigPage: React.FC<MarketingConfigPageProps> = ({ initialTab = 'google' }) => {
    const [config, setConfig] = useState<MarketingConfig>(DEFAULT_MARKETING_TRACKING_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [activePlatform, setActivePlatform] = useState<string>(initialTab);

    useEffect(() => {
        const stored = localStorage.getItem('marketingConfig');
        if (stored) {
            try { 
                const parsed = JSON.parse(stored);
                // Merge with default to ensure structure integrity
                setConfig({ 
                    ...DEFAULT_MARKETING_TRACKING_CONFIG, 
                    ...parsed,
                    fomo: { ...DEFAULT_MARKETING_TRACKING_CONFIG.fomo, ...(parsed.fomo || {}) }
                }); 
            } catch(e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('marketingConfig', JSON.stringify(config));
        // Dispatch event for Layout to reload scripts if needed (though usually needs refresh)
        window.dispatchEvent(new Event('marketingConfigUpdated'));
        
        setSaveStatus('Setări salvate!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('marketingConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_MARKETING_TRACKING_CONFIG, ...parsed });
            } catch(e) {
                setConfig(DEFAULT_MARKETING_TRACKING_CONFIG);
            }
        } else {
            setConfig(DEFAULT_MARKETING_TRACKING_CONFIG);
        }
        setIsEditing(false);
    };

    const updateConfig = (platform: keyof MarketingConfig, field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: value
            }
        }));
    };

    const tabs = [
        { id: 'google', label: 'Google (GA4 & Ads)', icon: '📈' },
        { id: 'facebook', label: 'Meta Pixel (Facebook)', icon: 'f' },
        { id: 'tiktok', label: 'TikTok Pixel', icon: '🎵' },
        { id: 'fomo', label: 'Live Notifications (FOMO)', icon: '🔥' },
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Marketing & Tracking"
                description="Configurează codurile de urmărire și notificările live."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            {/* TABS */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActivePlatform(tab.id)}
                        className={`px-4 py-2 rounded-t-lg font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activePlatform === tab.id ? 'border-brand-purple text-brand-purple bg-violet-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* GOOGLE */}
            {activePlatform === 'google' && (
                <div className="animate-fade-in space-y-8">
                    {/* GA4 */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-lg text-blue-900 mb-4">Google Analytics 4 (GA4)</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-gray-700">Activare GA4</label>
                                <button disabled={!isEditing} onClick={() => updateConfig('google', 'enabled', !config.google.enabled)} className={`w-12 h-7 rounded-full p-1 transition-colors ${config.google.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${config.google.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Measurement ID</label>
                                <input 
                                    disabled={!isEditing} 
                                    value={config.google.measurementId} 
                                    onChange={(e) => updateConfig('google', 'measurementId', e.target.value)} 
                                    placeholder="G-XXXXXXXXXX"
                                    className="w-full p-3 border border-blue-200 rounded-lg outline-none focus:border-blue-500 bg-white font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Google Ads */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                        <h3 className="font-bold text-lg text-green-900 mb-4">Google Ads Conversion</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-gray-700">Activare Ads Tracking</label>
                                <button disabled={!isEditing} onClick={() => updateConfig('googleAds', 'enabled', !config.googleAds.enabled)} className={`w-12 h-7 rounded-full p-1 transition-colors ${config.googleAds.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${config.googleAds.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Conversion ID</label>
                                    <input 
                                        disabled={!isEditing} 
                                        value={config.googleAds.conversionId} 
                                        onChange={(e) => updateConfig('googleAds', 'conversionId', e.target.value)} 
                                        placeholder="AW-XXXXXXXXX"
                                        className="w-full p-3 border border-green-200 rounded-lg outline-none focus:border-green-500 bg-white font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Conversion Label (Înscriere)</label>
                                    <input 
                                        disabled={!isEditing} 
                                        value={config.googleAds.registrationLabel} 
                                        onChange={(e) => updateConfig('googleAds', 'registrationLabel', e.target.value)} 
                                        placeholder="AbCdEfGhIjKlMnOpQr"
                                        className="w-full p-3 border border-green-200 rounded-lg outline-none focus:border-green-500 bg-white font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FACEBOOK */}
            {activePlatform === 'facebook' && (
                <div className="animate-fade-in bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-lg text-indigo-900 mb-4">Meta Pixel (Facebook/Instagram)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-gray-700">Activare Pixel</label>
                            <button disabled={!isEditing} onClick={() => updateConfig('facebook', 'enabled', !config.facebook.enabled)} className={`w-12 h-7 rounded-full p-1 transition-colors ${config.facebook.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${config.facebook.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Pixel ID</label>
                            <input 
                                disabled={!isEditing} 
                                value={config.facebook.pixelId} 
                                onChange={(e) => updateConfig('facebook', 'pixelId', e.target.value)} 
                                placeholder="123456789012345"
                                className="w-full p-3 border border-indigo-200 rounded-lg outline-none focus:border-indigo-500 bg-white font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TIKTOK */}
            {activePlatform === 'tiktok' && (
                <div className="animate-fade-in bg-gray-100 p-6 rounded-xl border border-gray-300">
                    <h3 className="font-bold text-lg text-black mb-4">TikTok Pixel</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-gray-700">Activare Pixel</label>
                            <button disabled={!isEditing} onClick={() => updateConfig('tiktok', 'enabled', !config.tiktok.enabled)} className={`w-12 h-7 rounded-full p-1 transition-colors ${config.tiktok.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${config.tiktok.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Pixel ID</label>
                            <input 
                                disabled={!isEditing} 
                                value={config.tiktok.pixelId} 
                                onChange={(e) => updateConfig('tiktok', 'pixelId', e.target.value)} 
                                placeholder="C1234567890ABCDEF"
                                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-black bg-white font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* FOMO */}
            {activePlatform === 'fomo' && (
                <div className="animate-fade-in space-y-6">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <h3 className="font-bold text-lg text-red-900 mb-4">🔥 Live Updates (Notificări False)</h3>
                        <div className="flex items-center justify-between mb-6">
                            <label className="font-bold text-gray-700">Activare Notificări</label>
                            <button disabled={!isEditing} onClick={() => updateConfig('fomo', 'enabled', !config.fomo.enabled)} className={`w-12 h-7 rounded-full p-1 transition-colors ${config.fomo.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${config.fomo.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Interval Afișare (sec)</label>
                                <input 
                                    type="number" 
                                    disabled={!isEditing} 
                                    value={config.fomo.intervalSeconds} 
                                    onChange={(e) => updateConfig('fomo', 'intervalSeconds', parseInt(e.target.value))} 
                                    className="w-full p-3 border border-red-200 rounded-lg outline-none focus:border-red-500 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Delay Inițial (sec)</label>
                                <input 
                                    type="number" 
                                    disabled={!isEditing} 
                                    value={config.fomo.minDelay} 
                                    onChange={(e) => updateConfig('fomo', 'minDelay', parseInt(e.target.value))} 
                                    className="w-full p-3 border border-red-200 rounded-lg outline-none focus:border-red-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700">Mesaje (unul pe rând)</label>
                            {config.fomo.messages.map((msg, idx) => (
                                <div key={idx} className="flex gap-2 group">
                                    <input 
                                        disabled={!isEditing}
                                        value={msg} 
                                        onChange={(e) => {
                                            const newMessages = [...config.fomo.messages];
                                            newMessages[idx] = e.target.value;
                                            updateConfig('fomo', 'messages', newMessages);
                                        }}
                                        className="flex-grow p-3 border border-red-200 rounded-lg outline-none focus:border-red-500 text-sm bg-white"
                                    />
                                    <button 
                                        disabled={!isEditing}
                                        onClick={() => {
                                            const newMessages = config.fomo.messages.filter((_, i) => i !== idx);
                                            updateConfig('fomo', 'messages', newMessages);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                            <button 
                                disabled={!isEditing}
                                onClick={() => updateConfig('fomo', 'messages', [...config.fomo.messages, 'Un nou participant s-a înscris! 🚀'])}
                                className="text-sm font-bold text-red-600 hover:text-red-800 flex items-center gap-1 mt-2 disabled:opacity-50 transition-colors py-2 px-3 hover:bg-red-100 rounded-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                Adaugă Mesaj Nou
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketingConfigPage;