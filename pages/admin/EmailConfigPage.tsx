
import React, { useState, useEffect } from 'react';
import { EmailConfig, LocationConfig, RegistrationData } from '../../types';
import { DEFAULT_EMAIL_CONFIG, DEFAULT_LOCATION_CONFIG } from '../../config';
import { EmojiInput, AdminPageHeader, useNotification } from '../../components/admin';
import { dataService } from '../../services/dataService';

const EmailConfigPage: React.FC = () => {
    const [config, setConfig] = useState<EmailConfig>(DEFAULT_EMAIL_CONFIG);
    const [locationConfig, setLocationConfig] = useState<LocationConfig>(DEFAULT_LOCATION_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [activeTab, setActiveTab] = useState<'welcome' | 'reminder'>('welcome');
    const [isSendingReminder, setIsSendingReminder] = useState(false);
    const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
    const { showNotification } = useNotification();

    useEffect(() => {
        const storedEmail = localStorage.getItem('emailConfig');
        if (storedEmail) {
            try { setConfig({ ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(storedEmail) }); } catch (e) { console.error(e); }
        }
        
        const storedLocation = localStorage.getItem('locationConfig');
        if (storedLocation) {
            try { setLocationConfig(JSON.parse(storedLocation)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('emailConfig', JSON.stringify(config));
        setSaveStatus('Configurație salvată!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('emailConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_EMAIL_CONFIG);
        setIsEditing(false);
    };

    const handleSendBulkReminder = async () => {
        const regs = await dataService.getRegistrations();
        const targets = regs.filter(r => r.status === 'paid');
        
        if (targets.length === 0) {
            showNotification('Nu există participanți cu statusul "Plătit".', 'error');
            return;
        }

        if (!window.confirm(`Ești pe cale să trimiti email de reminder către ${targets.length} participanți. Ești sigur?`)) return;

        setIsSendingReminder(true);
        setSendProgress({ current: 0, total: targets.length });

        let successCount = 0;
        for (let i = 0; i < targets.length; i++) {
            const reg = targets[i];
            const data = {
                to: reg.email,
                subject: config.reminderSubject,
                body: config.reminderBody
                    .replace('{nume}', reg.type === 'individual' ? (reg.name || '') : (reg.groupName || ''))
                    .replace('{data_eveniment}', locationConfig.startDate)
                    .replace('{locatie}', locationConfig.locationName)
                    .replace('{adresa}', locationConfig.address)
                    .replace('{ora_sosire}', '09:30')
                    .replace('{locatie_parcare}', locationConfig.parkingInfo || '')
                    .replace('{link_parcare_maps}', locationConfig.parkingLink || '')
                    .replace('{telefon_contact}', '0772 172 073')
            };

            try {
                const res = await fetch(config.serverEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) successCount++;
            } catch (e) {}
            
            setSendProgress({ current: i + 1, total: targets.length });
        }

        setIsSendingReminder(false);
        showNotification(`Reminder trimis cu succes către ${successCount} persoane!`, 'success');
    };

    const generatePreview = () => {
        const mockData: Record<string, string> = {
            nume: "Maria Popescu",
            data_eveniment: locationConfig.startDate,
            locatie: locationConfig.locationName,
            adresa: locationConfig.address,
            ora_sosire: "09:30",
            locatie_parcare: locationConfig.parkingInfo || "Parcarea Palatul Copiilor",
            link_parcare_maps: locationConfig.parkingLink || "#",
            telefon_contact: "0772 172 073"
        };

        let processedBody = activeTab === 'welcome' ? config.body : config.reminderBody;
        Object.entries(mockData).forEach(([key, value]) => {
            processedBody = processedBody.replace(new RegExp(`{${key}}`, 'g'), value);
        });

        return {
            subject: activeTab === 'welcome' 
                ? config.subject.replace('{nume}', mockData.nume) 
                : config.reminderSubject,
            body: processedBody
        };
    };

    const preview = generatePreview();

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare Email-uri Festival"
                description="Gestionează email-urile automate și trimiterile de reminder."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            <div className="flex gap-4 mb-8 border-b">
                <button 
                    onClick={() => setActiveTab('welcome')} 
                    className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'welcome' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400'}`}
                >
                    Email Confirmare (Bun Venit)
                </button>
                <button 
                    onClick={() => setActiveTab('reminder')} 
                    className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'reminder' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-gray-400'}`}
                >
                    Email Reminder (Înainte de Festival)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {activeTab === 'reminder' && (
                        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-6">
                            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                🚀 Trimitere Masivă de Reminder
                            </h4>
                            <p className="text-xs text-amber-700 mb-4">
                                Această acțiune va trimite un email tuturor participanților confirmați. Recomandăm trimiterea cu 24-48 ore înainte de festival.
                            </p>
                            {isSendingReminder ? (
                                <div className="space-y-2">
                                    <div className="w-full bg-amber-200 rounded-full h-2">
                                        <div 
                                            className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center font-bold text-amber-800 text-xs">Se trimite... {sendProgress.current} / {sendProgress.total}</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleSendBulkReminder}
                                    className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-brand-dark shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                    Trimite Reminder Acum
                                </button>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subiect</label>
                        <EmojiInput
                            value={activeTab === 'welcome' ? config.subject : config.reminderSubject}
                            onChange={(val) => setConfig({ ...config, [activeTab === 'welcome' ? 'subject' : 'reminderSubject']: val })}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                        />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-[10px] text-blue-900">
                        <strong>Placeholder-e Reminder:</strong> {'{nume}, {data_eveniment}, {locatie}, {adresa}, {ora_sosire}, {locatie_parcare}, {link_parcare_maps}, {telefon_contact}'}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Conținut HTML</label>
                        <EmojiInput
                            type="textarea"
                            rows={15}
                            value={activeTab === 'welcome' ? config.body : config.reminderBody}
                            onChange={(val) => setConfig({ ...config, [activeTab === 'welcome' ? 'body' : 'reminderBody']: val })}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs"
                        />
                    </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-full border border-gray-300">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-4">Previzualizare Email</span>
                    <div className="bg-white rounded shadow-sm border border-gray-200 flex-grow p-6 overflow-y-auto">
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">{preview.subject}</h4>
                        <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: preview.body }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfigPage;
