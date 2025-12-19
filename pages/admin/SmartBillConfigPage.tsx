
import React, { useState, useEffect } from 'react';
import { SmartBillConfig } from '../../types';
import { DEFAULT_SMARTBILL_CONFIG } from '../../config';
import { useNotification, AdminPageHeader } from '../../components/admin';

const SmartBillConfigPage: React.FC = () => {
    const [config, setConfig] = useState<SmartBillConfig>(DEFAULT_SMARTBILL_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('smartBillConfig');
        if (stored) {
            try { setConfig({ ...DEFAULT_SMARTBILL_CONFIG, ...JSON.parse(stored) }); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('smartBillConfig', JSON.stringify(config));
        showNotification('Configurație SmartBill salvată cu succes!', 'success');
        setIsEditing(false);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('smartBillConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_SMARTBILL_CONFIG);
        setIsEditing(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare SmartBill Cloud"
                description="Automatizează emiterea facturilor prin integrare API."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <div className="space-y-8">
                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                        <h3 className="font-bold text-gray-800">Activare Facturare Automată</h3>
                        <p className="text-xs text-gray-500">Dacă este activ, facturile vor fi generate automat la finalizarea înscrierii.</p>
                    </div>
                    <button 
                        disabled={!isEditing}
                        onClick={() => setConfig({...config, enabled: !config.enabled})}
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.enabled ? 'bg-green-500' : 'bg-gray-300'} ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* API Credentials */}
                    <div className="space-y-4 lg:col-span-1">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">Credențiale API</h4>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CIF Firmă</label>
                            <input 
                                disabled={!isEditing}
                                value={config.cif}
                                onChange={(e) => setConfig({...config, cif: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900"
                                placeholder="RO12345678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Utilizator (Email)</label>
                            <input 
                                disabled={!isEditing}
                                value={config.username}
                                onChange={(e) => setConfig({...config, username: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Token API</label>
                            <input 
                                type="password"
                                disabled={!isEditing}
                                value={config.token}
                                onChange={(e) => setConfig({...config, token: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="space-y-4 lg:col-span-1">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">Detalii Serie & TVA</h4>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Serie Factură</label>
                            <input 
                                disabled={!isEditing}
                                value={config.seriesName}
                                onChange={(e) => setConfig({...config, seriesName: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900"
                            />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="flex items-center gap-3 cursor-pointer mb-2">
                                <input type="checkbox" disabled={!isEditing} checked={config.isVatPayer} onChange={(e) => setConfig({...config, isVatPayer: e.target.checked, defaultVatPercent: e.target.checked ? 19 : 0})} className="w-5 h-5 text-brand-purple rounded" />
                                <span className="text-sm font-bold text-gray-700">Plătitor de TVA</span>
                            </label>
                            <input type="number" disabled={!isEditing || !config.isVatPayer} value={config.defaultVatPercent} onChange={(e) => setConfig({...config, defaultVatPercent: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg bg-white" placeholder="19" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Endpoint (Cale PHP)</label>
                            <input disabled={!isEditing} value={config.serverEndpoint} onChange={(e) => setConfig({...config, serverEndpoint: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-mono text-sm" placeholder="/smartbill.php" />
                        </div>
                    </div>

                    {/* Server Instructions */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 h-full">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Setup Server
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-4 list-disc pl-4">
                                <li>Urcă fișierul <strong>smartbill.php</strong> în folderul principal al site-ului pe CPanel.</li>
                                <li>Asigură-te că extensia <strong>PHP cURL</strong> este activată în CPanel (este activă implicit la majoritatea hosturilor).</li>
                                <li>Datele introduse în stânga vor fi securizate prin transmiterea lor de la server către SmartBill.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartBillConfigPage;
