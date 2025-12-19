
import React, { useState, useEffect } from 'react';
import { LocationConfig } from '../../types';
import { DEFAULT_LOCATION_CONFIG } from '../../config';
import { AdminPageHeader } from '../../components/admin';

const LocationConfigPage: React.FC = () => {
    const [config, setConfig] = useState<LocationConfig>(DEFAULT_LOCATION_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const loadConfig = () => {
        const stored = localStorage.getItem('locationConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_LOCATION_CONFIG, ...parsed });
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const handleSave = () => {
        localStorage.setItem('locationConfig', JSON.stringify(config));
        setSaveStatus('Date salvate cu succes!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleCancel = () => {
        loadConfig();
        setIsEditing(false);
    };

    const handleChange = (field: keyof LocationConfig, value: string) => {
        setConfig({ ...config, [field]: value });
    };

    // Helper to extract SRC from iframe tag if user pastes full HTML
    const handleMapUrlChange = (value: string) => {
        let finalUrl = value.trim();

        // 1. Dacă utilizatorul a dat paste la tot codul <iframe>
        if (value.includes('<iframe')) {
            const srcMatch = value.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
                finalUrl = srcMatch[1];
            }
        }

        // 2. Alertă dacă URL-ul nu pare a fi de tip EMBED
        if (finalUrl && !finalUrl.includes('google.com/maps/embed') && !finalUrl.startsWith('data:')) {
            console.warn("URL-ul introdus s-ar putea să nu funcționeze corect. Folosiți butonul 'Share' -> 'Embed a map' din Google Maps.");
        }

        handleChange('mapEmbedUrl', finalUrl);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare Locație & Dată"
                description='Editează detaliile secțiunii "Când? Unde?".'
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nume Locație</label>
                        <input 
                            disabled={!isEditing}
                            value={config.locationName}
                            onChange={(e) => handleChange('locationName', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="Ex: Cafeneaua Actorilor"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Adresă Detaliată</label>
                        <input 
                            disabled={!isEditing}
                            value={config.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="Ex: Parcul Tineretului, București"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dată și Oră Start</label>
                        <input 
                            disabled={!isEditing}
                            value={config.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="Ex: Sâmbătă, 13 Decembrie 2025, ora 10:00"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Text Informații Parcare</label>
                        <textarea 
                            disabled={!isEditing}
                            value={config.parkingInfo || ''}
                            onChange={(e) => handleChange('parkingInfo', e.target.value)}
                            rows={2}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="Ex: Parcarea se poate face în parcarea de la Palatul Copiilor."
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Link Google Maps Parcare (Buton)</label>
                        <input 
                            disabled={!isEditing}
                            value={config.parkingLink || ''}
                            onChange={(e) => handleChange('parkingLink', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-sm font-mono text-gray-900"
                            placeholder="https://maps.app.goo.gl/..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Link Google Maps (Buton Locație)</label>
                        <input 
                            disabled={!isEditing}
                            value={config.googleMapsLink}
                            onChange={(e) => handleChange('googleMapsLink', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-sm font-mono text-gray-900"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Link Waze (Buton Locație)</label>
                        <input 
                            disabled={!isEditing}
                            value={config.wazeLink}
                            onChange={(e) => handleChange('wazeLink', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all text-sm font-mono text-gray-900"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Link Embed Harta (src din iframe)</label>
                        <textarea 
                            rows={3}
                            disabled={!isEditing}
                            value={config.mapEmbedUrl}
                            onChange={(e) => handleMapUrlChange(e.target.value)}
                            className={`w-full p-3 border rounded-lg bg-gray-50 disabled:bg-gray-100 focus:ring-2 focus:ring-brand-purple outline-none transition-all text-xs font-mono text-gray-900 ${config.mapEmbedUrl && !config.mapEmbedUrl.includes('embed') ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            placeholder="https://www.google.com/maps/embed?..."
                        />
                        <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                            <strong>Instrucțiuni:</strong> Pe Google Maps, click pe "Share" &rarr; "Embed a map" &rarr; Copy HTML. Dați Paste la tot codul aici, vom extrage noi link-ul corect.
                        </p>
                        {config.mapEmbedUrl && !config.mapEmbedUrl.includes('embed') && (
                            <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ Atenție: Link-ul nu pare a fi un cod de încorporare (Embed). Harta s-ar putea să nu se încarce.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Previzualizare Hartă</h3>
                <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden relative border-2 border-dashed border-gray-200">
                    <iframe 
                        key={config.mapEmbedUrl}
                        src={config.mapEmbedUrl} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale opacity-80"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default LocationConfigPage;
