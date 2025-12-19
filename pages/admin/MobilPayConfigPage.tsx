
import React, { useState, useEffect } from 'react';
import { MobilPayConfig } from '../../types';
import { DEFAULT_MOBILPAY_CONFIG } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const MobilPayConfigPage: React.FC = () => {
    const [config, setConfig] = useState<MobilPayConfig>(DEFAULT_MOBILPAY_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('mobilPayConfig');
        if (stored) {
            try { setConfig({ ...DEFAULT_MOBILPAY_CONFIG, ...JSON.parse(stored) }); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('mobilPayConfig', JSON.stringify(config));
        setSaveStatus('Configurație salvată!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('mobilPayConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_MOBILPAY_CONFIG);
        setIsEditing(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare Netopia MobilPay"
                description="Setări pentru integrarea modernă cu Cheie API."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="space-y-8">
                {/* Integration Mode */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Metodă Conectare</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.integrationMode === 'server_form' ? 'border-brand-purple bg-violet-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                            <input 
                                type="radio" 
                                name="mode" 
                                value="server_form" 
                                disabled={!isEditing}
                                checked={config.integrationMode === 'server_form'} 
                                onChange={() => setConfig({...config, integrationMode: 'server_form'})}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center text-center">
                                <span className="text-2xl mb-2">⚡️</span>
                                <span className="font-bold text-gray-900">API Key Modern (Recomandat)</span>
                                <span className="text-xs text-gray-500 mt-1">Folosește cheia generată în contul Netopia. Nu necesită certificate.</span>
                            </div>
                        </label>
                        
                        <label className="p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-100/50 opacity-60 cursor-not-allowed">
                            <div className="flex flex-col items-center text-center">
                                <span className="text-2xl mb-2">🔗</span>
                                <span className="font-bold text-gray-400">Linkuri Statice (Manual)</span>
                                <span className="text-xs text-gray-400 mt-1">Metodă veche, necesită generarea manuală a linkurilor.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Cheie API (din contul Netopia)</label>
                            <input 
                                type="password"
                                disabled={!isEditing}
                                value={config.signature}
                                onChange={(e) => setConfig({...config, signature: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 font-mono text-xs"
                                placeholder="Copiați cheia din Netopia aici..."
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Este cheia lungă pe care ai generat-o sub numele "Voiceup-Site".</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Cale Script PHP (Server Endpoint)</label>
                            <input 
                                disabled={!isEditing}
                                value={config.serverEndpoint}
                                onChange={(e) => setConfig({...config, serverEndpoint: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none transition-all text-gray-900 font-mono text-sm"
                                placeholder="/payment.php"
                            />
                        </div>
                        
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-700">Mod Test (Sandbox)</span>
                                <button disabled={!isEditing} onClick={() => setConfig({...config, testMode: !config.testMode})} className={`w-12 h-6 rounded-full p-1 transition-colors ${config.testMode ? 'bg-brand-purple' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${config.testMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Setup Server (Fără Certificate!)
                        </h4>
                        <ol className="text-sm text-blue-800 space-y-3 list-decimal pl-4">
                            <li>Urcă fișierul <strong>payment.php</strong> furnizat direct în <code>public_html</code>.</li>
                            <li><strong>Important:</strong> În acest mod REST API, NU mai ai nevoie de folderul <code>certificates</code>.</li>
                            <li>Asigură-te că "Cheia API" de la Netopia este copiată corect în câmpul din stânga.</li>
                            <li>Salvează setările și testează o înscriere.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilPayConfigPage;
