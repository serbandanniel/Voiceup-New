
import React, { useState, useEffect } from 'react';
import { FloatingButtonsConfig } from '../../types';
import { DEFAULT_FLOATING_CONFIG } from '../../config';
import { AdminPageHeader, useNotification } from '../../components/admin';

const FloatingButtonsConfigPage: React.FC = () => {
    const [config, setConfig] = useState<FloatingButtonsConfig>(DEFAULT_FLOATING_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('floatingButtonsConfig');
        if (stored) {
            try { setConfig({ ...DEFAULT_FLOATING_CONFIG, ...JSON.parse(stored) }); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('floatingButtonsConfig', JSON.stringify(config));
        window.dispatchEvent(new Event('floatingConfigUpdated'));
        setSaveStatus('Salvat!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
        showNotification('Configurația butoanelor a fost actualizată!', 'success');
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('floatingButtonsConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_FLOATING_CONFIG);
        setIsEditing(false);
    };

    const ToggleRow = ({ label, description, value, onChange }: { label: string, description: string, value: boolean, onChange: (v: boolean) => void }) => (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div>
                <h4 className="font-bold text-gray-800">{label}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button 
                disabled={!isEditing}
                onClick={() => onChange(!value)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 focus:outline-none ${value ? 'bg-brand-purple' : 'bg-gray-300'} ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-8">
            <AdminPageHeader 
                title="Configurare Butoane Plutitoare"
                description="Gestionează vizibilitatea butoanelor de contact și utilitare care plutesc peste conținut."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Vizibilitate</h3>
                    <ToggleRow 
                        label="Buton WhatsApp" 
                        description="Afișat în colțul din stânga jos." 
                        value={config.whatsappEnabled} 
                        onChange={(v) => setConfig({...config, whatsappEnabled: v})} 
                    />
                    <ToggleRow 
                        label="Asistent Chat (Voicy)" 
                        description="Butonul de deschidere a chatbot-ului (dreapta)." 
                        value={config.chatbotEnabled} 
                        onChange={(v) => setConfig({...config, chatbotEnabled: v})} 
                    />
                    <ToggleRow 
                        label="Buton Înapoi Sus" 
                        description="Apare după ce utilizatorul face scroll (dreapta)." 
                        value={config.backToTopEnabled} 
                        onChange={(v) => setConfig({...config, backToTopEnabled: v})} 
                    />
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center">
                    <div className="text-3xl mb-4">💡</div>
                    <h4 className="font-bold text-blue-900 mb-2">Suprapunere Inteligentă</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        Site-ul detectează automat dacă mai multe butoane sunt active pe aceeași parte. 
                        De exemplu, dacă atât Chat-ul cât și "Înapoi sus" sunt active, cel de scroll se va ridica deasupra chat-ului pentru a fi accesibil.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FloatingButtonsConfigPage;
