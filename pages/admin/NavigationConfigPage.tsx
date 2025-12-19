
import React, { useState, useEffect } from 'react';
import { NavbarConfig, NavLinkItem } from '../../types';
import { DEFAULT_NAVBAR_CONFIG } from '../../config';
import { useNotification, AdminPageHeader } from '../../components/admin';

const NavigationConfigPage: React.FC = () => {
    const [config, setConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [newLink, setNewLink] = useState<Partial<NavLinkItem>>({ label: '', url: '', type: 'internal', visible: true });
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('navbarConfig');
        if (stored) {
            try { 
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_NAVBAR_CONFIG, ...parsed }); 
            } catch(e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('navbarConfig', JSON.stringify(config));
        // Dispatch custom event to update Layout without reload
        window.dispatchEvent(new Event('navbarConfigUpdated'));
        
        showNotification('Configurația meniului a fost salvată!', 'success');
        setIsEditing(false);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('navbarConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setConfig({ ...DEFAULT_NAVBAR_CONFIG, ...parsed });
            } catch(e) {
                setConfig(DEFAULT_NAVBAR_CONFIG);
            }
        } else {
            setConfig(DEFAULT_NAVBAR_CONFIG);
        }
        setIsEditing(false);
    };

    const handleAddLink = () => {
        if (!newLink.label || !newLink.url) return;
        const newItem: NavLinkItem = {
            id: Date.now().toString(),
            label: newLink.label,
            url: newLink.url,
            type: newLink.url.startsWith('http') ? 'external' : 'internal',
            visible: true
        };
        setConfig({ ...config, links: [...config.links, newItem] });
        setNewLink({ label: '', url: '', type: 'internal', visible: true });
    };

    const handleDeleteLink = (id: string) => {
        setConfig({ ...config, links: config.links.filter(l => l.id !== id) });
    };

    const handleMoveLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...config.links];
        if (direction === 'up' && index > 0) {
            [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
        } else if (direction === 'down' && index < newLinks.length - 1) {
            [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
        }
        setConfig({ ...config, links: newLinks });
    };

    const handleToggleLinkVisibility = (id: string) => {
        setConfig({
            ...config,
            links: config.links.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
        });
    };

    const designOptions = [
        { value: 'default', label: 'Default (Alb/Blur, Rotunjit)', desc: 'Stilul clasic, elegant, centrat.' },
        { value: 'modern_pill', label: 'Modern Pill (Flotant)', desc: 'Capsulă compactă, umbră puternică, foarte modern.' },
        { value: 'dark_glass', label: 'Dark Glass (Mov Închis)', desc: 'Fundal închis semi-transparent, text alb.' },
        { value: 'full_width', label: 'Full Width (Bară Completă)', desc: 'Bară albă pe toată lățimea, lipită de sus.' },
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Meniu & Navigare"
                description="Gestionează link-urile, design-ul și butoanele din bara de sus."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">🎨 Design & Stil</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Alege Tema Meniului</label>
                                <div className="space-y-2">
                                    {designOptions.map(opt => (
                                        <label key={opt.value} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${config.design === opt.value ? 'bg-white border-brand-purple ring-1 ring-brand-purple' : 'bg-gray-100 border-gray-200 hover:bg-white'}`}>
                                            <input 
                                                type="radio" 
                                                name="design" 
                                                disabled={!isEditing}
                                                checked={config.design === opt.value} 
                                                onChange={() => setConfig({...config, design: opt.value as any})}
                                                className="mt-1 text-brand-purple focus:ring-brand-purple"
                                            />
                                            <div>
                                                <span className="block font-bold text-sm text-gray-800">{opt.label}</span>
                                                <span className="block text-xs text-gray-500">{opt.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">⚙️ Elemente Vizuale</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Afișează Iconițe Contact (Tel/WhatsApp/Email)</span>
                                <button 
                                    disabled={!isEditing}
                                    onClick={() => setConfig({...config, showContactIcons: !config.showContactIcons})}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors ${config.showContactIcons ? 'bg-brand-purple' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${config.showContactIcons ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-sm font-semibold text-gray-700">Afișează Buton CTA (Înscriere)</span>
                                <button 
                                    disabled={!isEditing}
                                    onClick={() => setConfig({...config, showCtaButton: !config.showCtaButton})}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors ${config.showCtaButton ? 'bg-brand-pink' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${config.showCtaButton ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {config.showCtaButton && (
                                <div className="pl-4 border-l-2 border-brand-pink space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Text Buton</label>
                                        <input 
                                            disabled={!isEditing}
                                            value={config.ctaButtonText}
                                            onChange={(e) => setConfig({...config, ctaButtonText: e.target.value})}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Link Buton</label>
                                        <input 
                                            disabled={!isEditing}
                                            value={config.ctaButtonLink}
                                            onChange={(e) => setConfig({...config, ctaButtonLink: e.target.value})}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Menu Items Manager */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Elemente Meniu</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">{config.links.length} elemente</span>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {config.links.map((link, index) => (
                                <div key={link.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <button disabled={!isEditing || index === 0} onClick={() => handleMoveLink(index, 'up')} className="text-gray-400 hover:text-brand-purple disabled:opacity-30"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg></button>
                                        <button disabled={!isEditing || index === config.links.length - 1} onClick={() => handleMoveLink(index, 'down')} className="text-gray-400 hover:text-brand-purple disabled:opacity-30"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
                                    </div>
                                    
                                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Label</label>
                                            <input 
                                                disabled={!isEditing}
                                                value={link.label}
                                                onChange={(e) => setConfig({...config, links: config.links.map(l => l.id === link.id ? {...l, label: e.target.value} : l)})}
                                                className="w-full font-semibold text-gray-800 bg-transparent border-b border-transparent focus:border-brand-purple outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Link URL / Anchor</label>
                                            <input 
                                                disabled={!isEditing}
                                                value={link.url}
                                                onChange={(e) => setConfig({...config, links: config.links.map(l => l.id === link.id ? {...l, url: e.target.value} : l)})}
                                                className="w-full text-sm text-gray-600 bg-transparent border-b border-transparent focus:border-brand-purple outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={!isEditing}
                                            onClick={() => handleToggleLinkVisibility(link.id)}
                                            className={`p-2 rounded-lg ${link.visible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                            title="Toggle Visibility"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.visible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} /></svg>
                                        </button>
                                        <button 
                                            disabled={!isEditing}
                                            onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Link"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New Link Area */}
                        {isEditing && (
                            <div className="p-4 bg-blue-50 border-t border-blue-100">
                                <h4 className="text-sm font-bold text-blue-800 mb-2">+ Adaugă Element Nou</h4>
                                <div className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1 w-full">
                                        <input 
                                            placeholder="Nume (ex: Contact)"
                                            value={newLink.label}
                                            onChange={(e) => setNewLink({...newLink, label: e.target.value})}
                                            className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input 
                                            placeholder="URL (ex: #contact sau https://...)"
                                            value={newLink.url}
                                            onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                                            className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAddLink}
                                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 shadow-sm"
                                    >
                                        Adaugă
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationConfigPage;
