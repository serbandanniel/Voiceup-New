
import React, { useState, useEffect } from 'react';
import { SectionConfig, SeparatorConfig } from '../../types';
import { DEFAULT_SECTIONS_CONFIG } from '../../config';
import SectionSeparator from '../../components/SectionSeparator';
import { AdminPageHeader } from '../../components/admin';
import { toast } from 'sonner';

const ID_MAP: { [key: string]: string } = {
    about: '#despre', 
    categories: '#categorii', 
    location: '#locatie', 
    partners: '#parteneri', 
    jury: '#juriu', 
    prizes: '#premii', 
    fees: '#taxe-inscriere', 
    howto: '#cum-ma-inscriu', 
    register: '#formular-inscriere',
    gallery: '#galerie', 
    video: '#video', 
    reviews: '#recenzii', 
    contact: '#contact', 
    faq: '#faq'
};

const SectionsConfigPage: React.FC = () => {
    const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS_CONFIG);
    const [saveStatus, setSaveStatus] = useState('');
    const [editingStylesId, setEditingStylesId] = useState<string | null>(null);
    const [editingSeparatorId, setEditingSeparatorId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('sectionsConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const merged = DEFAULT_SECTIONS_CONFIG.map(defaultSection => {
                    const savedSection = parsed.find((s: SectionConfig) => s.id === defaultSection.id);
                    return savedSection ? { 
                        ...defaultSection, 
                        ...savedSection, 
                        shadowIntensity: savedSection.shadowIntensity ?? defaultSection.shadowIntensity,
                        titleStyles: { ...defaultSection.titleStyles, ...(savedSection.titleStyles || {}) },
                        separatorBottom: { ...defaultSection.separatorBottom, ...(savedSection.separatorBottom || {}) }
                    } : defaultSection;
                });
                setSections(merged);
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('sectionsConfig', JSON.stringify(sections));
        setSaveStatus('Salvat!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setSections(sections.map(s => {
            if (s.id === id) {
                if (field.startsWith('visibility.')) {
                    const subField = field.split('.')[1] as keyof SectionConfig['visibility'];
                    return { ...s, visibility: { ...s.visibility, [subField]: value }};
                }
                 if (field.startsWith('titleStyles.')) {
                    const subField = field.split('.')[1] as keyof SectionConfig['titleStyles'];
                    return { ...s, titleStyles: { ...s.titleStyles, [subField]: value } };
                }
                if (field.startsWith('separatorBottom.')) {
                    const subField = field.split('.')[1] as keyof SeparatorConfig;
                    return { ...s, separatorBottom: { ...s.separatorBottom!, [subField]: value } };
                }
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Link copiat: ${text}`);
    };
    
    const sectionToEditStyles = sections.find(s => s.id === editingStylesId);
    const sectionToEditSeparator = sections.find(s => s.id === editingSeparatorId);

    const SeparatorPreview = ({ config, bg }: { config: SeparatorConfig, bg: string }) => {
        return (
            <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: bg }}>
                    <div className="flex items-center justify-center h-full opacity-20 font-black text-4xl text-black">CONȚINUT</div>
                </div>
                <SectionSeparator config={config} />
            </div>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Gestionare Secțiuni Pagină Principală"
                description="Reordonează secțiunile și folosește link-urile de tip ancoră pentru butoane."
                isEditing={true}
                onEdit={() => {}}
                onSave={handleSave}
                onCancel={() => {}}
                saveStatus={saveStatus}
            />

            <div className="space-y-4">
                {sections.map((section, index) => {
                    const isSpecialSection = ['hero', 'footer'].includes(section.id);
                    const anchorLink = ID_MAP[section.id];
                    
                    return (
                        <div key={section.id} className={`p-4 rounded-xl border-2 transition-all ${!section.enabled && !isSpecialSection ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100'}`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                {/* Title & Anchor Info */}
                                <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => handleMove(index, 'up')} disabled={index === 0 || isSpecialSection} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => handleMove(index, 'down')} disabled={index === sections.length - 1 || isSpecialSection} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex-grow">
                                        <input 
                                            value={section.title}
                                            disabled={isSpecialSection}
                                            onChange={e => handleUpdate(section.id, 'title', e.target.value)}
                                            className="font-bold text-gray-800 bg-transparent border-b-2 border-transparent focus:border-brand-purple outline-none w-full disabled:cursor-not-allowed"
                                        />
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">ID: {section.id}</span>
                                            {anchorLink && (
                                                <button 
                                                    onClick={() => copyToClipboard(anchorLink)}
                                                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black transition-colors group"
                                                >
                                                    <span className="text-brand-purple">{anchorLink}</span>
                                                    <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Toggles & Styles */}
                                <div className="flex items-center gap-3 md:gap-4 flex-wrap pl-14 md:pl-0">
                                    {!isSpecialSection && (
                                        <button onClick={() => setEditingStylesId(editingStylesId === section.id ? null : section.id)} className={`text-xs font-bold p-2 rounded-lg transition-colors flex items-center gap-2 ${editingStylesId === section.id ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.05 3.57a.75.75 0 00-1.06-1.06L2.57 3.94a.75.75 0 001.06 1.06L5.05 3.57zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM5.05 16.43a.75.75 0 00-1.06 1.06l1.42 1.42a.75.75 0 001.06-1.06L5.05 16.43zM10 18a.75.75 0 01.75-.75v-1.5a.75.75 0 01-1.5 0v1.5A.75.75 0 0110 18zM14.95 16.43a.75.75 0 001.06 1.06l1.42-1.42a.75.75 0 00-1.06-1.06l-1.42 1.42zM18 10a.75.75 0 01.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM14.95 3.57a.75.75 0 001.06-1.06l-1.42-1.42a.75.75 0 00-1.06 1.06l1.42 1.42zM10 5a5 5 0 100 10 5 5 0 000-10z" /></svg>
                                            Stiluri
                                        </button>
                                    )}
                                    
                                    {section.id !== 'footer' && (
                                        <button onClick={() => setEditingSeparatorId(editingSeparatorId === section.id ? null : section.id)} className={`text-xs font-bold p-2 rounded-lg transition-colors flex items-center gap-2 ${editingSeparatorId === section.id ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                            Sep.
                                        </button>
                                    )}

                                    {isSpecialSection && section.id === 'footer' ? (
                                        <div className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-[10px] text-yellow-800 font-black uppercase">Mereu On</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleUpdate(section.id, 'enabled', !section.enabled)} className={`w-10 h-5 rounded-full p-1 transition-colors ${section.enabled ? 'bg-brand-purple' : 'bg-gray-300'}`}>
                                                <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${section.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Separator Editor Modal */}
            {editingSeparatorId && sectionToEditSeparator && sectionToEditSeparator.separatorBottom && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingSeparatorId(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-brand-dark">Separator pentru: <span className="text-brand-pink">{sectionToEditSeparator.title}</span></h3>
                            <button onClick={() => setEditingSeparatorId(null)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stil Separator</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['none', 'tilt', 'wave', 'wave_animated', 'spikes', 'curve_center', 'triangle', 'clouds'] as const).map(style => (
                                            <button 
                                                key={style}
                                                onClick={() => handleUpdate(editingSeparatorId, 'separatorBottom.style', style)}
                                                className={`p-2 text-xs font-bold uppercase rounded border transition-all ${sectionToEditSeparator.separatorBottom?.style === style ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {style.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Înălțime (px): {sectionToEditSeparator.separatorBottom.height}px</label>
                                    <input 
                                        type="range" 
                                        min="20" 
                                        max="200" 
                                        value={sectionToEditSeparator.separatorBottom.height}
                                        onChange={(e) => handleUpdate(editingSeparatorId, 'separatorBottom.height', parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Culoare Umplere</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={sectionToEditSeparator.separatorBottom.color}
                                            onChange={(e) => handleUpdate(editingSeparatorId, 'separatorBottom.color', e.target.value)}
                                            className="w-12 h-12 p-1 border rounded cursor-pointer"
                                        />
                                        <input 
                                            type="text" 
                                            value={sectionToEditSeparator.separatorBottom.color}
                                            onChange={(e) => handleUpdate(editingSeparatorId, 'separatorBottom.color', e.target.value)}
                                            className="flex-grow p-2 border rounded font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={sectionToEditSeparator.separatorBottom.reversed}
                                            onChange={(e) => handleUpdate(editingSeparatorId, 'separatorBottom.reversed', e.target.checked)}
                                            className="w-5 h-5 text-brand-purple rounded focus:ring-brand-purple"
                                        />
                                        <span className="text-sm font-bold text-gray-700">Oglindește Orizontal</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-gray-500 uppercase text-xs mb-4">Previzualizare Live</h4>
                                <SeparatorPreview config={sectionToEditSeparator.separatorBottom} bg={sectionToEditSeparator.bgColor || '#f3f4f6'} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setEditingSeparatorId(null)} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">Închide</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Style Editor Modal */}
            {editingStylesId && sectionToEditStyles && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingStylesId(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg text-brand-dark mb-4">Stiluri pentru: <span className="text-brand-purple">{sectionToEditStyles.title}</span></h3>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Stiluri Secțiune</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1">Culoare Fundal</label>
                                            <input type="color" value={sectionToEditStyles.bgColor} onChange={e => handleUpdate(editingStylesId, 'bgColor', e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1">Culoare Umbră</label>
                                            <input type="color" value={sectionToEditStyles.shadowColor} onChange={e => handleUpdate(editingStylesId, 'shadowColor', e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1">
                                            Adâncime Umbră (Efect 3D): {sectionToEditStyles.shadowIntensity ?? 25}
                                        </label>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={sectionToEditStyles.shadowIntensity ?? 25} 
                                            onChange={e => handleUpdate(editingStylesId, 'shadowIntensity', parseInt(e.target.value))} 
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Stiluri Titlu</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="font-semibold text-gray-700">Gradient pe Text</label>
                                        <button onClick={() => handleUpdate(editingStylesId, 'titleStyles.useGradient', !sectionToEditStyles.titleStyles.useGradient)} className={`w-11 h-6 rounded-full p-1 transition-colors ${sectionToEditStyles.titleStyles.useGradient ? 'bg-brand-purple' : 'bg-gray-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${sectionToEditStyles.titleStyles.useGradient ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    {sectionToEditStyles.titleStyles.useGradient && (
                                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">De la</label>
                                                <input type="color" value={sectionToEditStyles.titleStyles.gradientFrom} onChange={e => handleUpdate(editingStylesId, 'titleStyles.gradientFrom', e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">La</label>
                                                <input type="color" value={sectionToEditStyles.titleStyles.gradientTo} onChange={e => handleUpdate(editingStylesId, 'titleStyles.gradientTo', e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setEditingStylesId(null)} className="mt-6 w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90">Închide</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionsConfigPage;
