
import React, { useState, useEffect } from 'react';
import { FormConfig, FieldRequirements, MusicSection } from '../../types';
import { DEFAULT_FORM_CONFIG } from '../../config';
import { useNotification, AdminPageHeader } from '../../components/admin';

// Helper Component for Toggle
const FieldRequirementToggle: React.FC<{
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    color?: 'purple' | 'pink' | 'blue' | 'gray' | 'green';
}> = ({ label, value, onChange, disabled, color = 'purple' }) => {
    const getColorClass = () => {
        switch(color) {
            case 'pink': return 'bg-brand-pink';
            case 'blue': return 'bg-blue-500';
            case 'green': return 'bg-green-500';
            case 'gray': return 'bg-gray-600';
            default: return 'bg-brand-purple';
        }
    };

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <button 
                disabled={disabled}
                onClick={() => onChange(!value)}
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${value ? getColorClass() : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${value ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
        </div>
    );
};

const FormConfigPage: React.FC = () => {
    const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const stored = localStorage.getItem('formConfig');
        if (stored) {
            try { 
                const parsed = JSON.parse(stored);
                setFormConfig({ 
                    ...DEFAULT_FORM_CONFIG, 
                    ...parsed,
                    fieldRequirements: { ...DEFAULT_FORM_CONFIG.fieldRequirements, ...(parsed.fieldRequirements || {}) }
                }); 
            } catch(e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('formConfig', JSON.stringify(formConfig));
        showNotification('Toate setările formularului au fost salvate!', 'success');
        setIsEditing(false);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('formConfig');
        if (stored) {
            setFormConfig(JSON.parse(stored));
        } else {
            setFormConfig(DEFAULT_FORM_CONFIG);
        }
        setIsEditing(false);
    };

    const updateFieldReq = (field: keyof FieldRequirements, value: boolean) => {
        setFormConfig(prev => ({
            ...prev,
            fieldRequirements: { ...prev.fieldRequirements, [field]: value }
        }));
    };

    const handleUpdateCategory = (type: 'individual' | 'group', index: number, value: string) => {
        const field = type === 'individual' ? 'ageCategoriesIndividual' : 'ageCategoriesGroup';
        const newList = [...formConfig[field]];
        newList[index] = value;
        setFormConfig({ ...formConfig, [field]: newList });
    };

    const handleAddCategory = (type: 'individual' | 'group') => {
        const field = type === 'individual' ? 'ageCategoriesIndividual' : 'ageCategoriesGroup';
        setFormConfig({ ...formConfig, [field]: [...formConfig[field], "Categorie nouă"] });
    };

    const handleRemoveCategory = (type: 'individual' | 'group', index: number) => {
        const field = type === 'individual' ? 'ageCategoriesIndividual' : 'ageCategoriesGroup';
        setFormConfig({ ...formConfig, [field]: formConfig[field].filter((_, i) => i !== index) });
    };

    const handleUpdateSection = (index: number, field: keyof MusicSection, value: any) => {
        const newSections = [...formConfig.musicSections];
        newSections[index] = { ...newSections[index], [field]: value };
        setFormConfig({ ...formConfig, musicSections: newSections });
    };

    const handleAddSection = () => {
        const newSec: MusicSection = {
            id: Date.now().toString(),
            label: "Secțiune nouă",
            availableForGroup: true,
            isInstrument: false,
            requiresFile: true
        };
        setFormConfig({ ...formConfig, musicSections: [...formConfig.musicSections, newSec] });
    };

    const handleRemoveSection = (index: number) => {
        setFormConfig({ ...formConfig, musicSections: formConfig.musicSections.filter((_, i) => i !== index) });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in space-y-12">
            <AdminPageHeader 
                title="Configurare Avansată Formular"
                description="Gestionează câmpurile obligatorii, categoriile de vârstă și secțiunile muzicale."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* SECTION 0: GENERAL & TERMS */}
            <section className="space-y-6">
                <h3 className="font-black text-lg text-brand-dark uppercase tracking-widest border-l-4 border-brand-yellow pl-3">Setări Generale & Termeni</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100 shadow-sm">
                        <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wide border-b border-yellow-200 pb-2">Termeni și Condiții</h4>
                        <div className="space-y-1">
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Bifă Obligatorie" value={formConfig.fieldRequirements.terms_required} onChange={v => updateFieldReq('terms_required', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Bifat Implicit (la încărcare)" value={formConfig.fieldRequirements.terms_default_checked} onChange={v => updateFieldReq('terms_default_checked', v)} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 leading-tight italic">
                            * Dacă "Bifat Implicit" este activ, checkbox-ul va fi deja selectat când utilizatorul ajunge la pasul final.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 1: FIELD REQUIREMENTS */}
            <section className="space-y-6">
                <h3 className="font-black text-lg text-brand-dark uppercase tracking-widest border-l-4 border-brand-purple pl-3">1. Câmpuri Obligatorii</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Individual */}
                    <div className="bg-violet-50/50 p-6 rounded-2xl border border-violet-100 shadow-sm">
                        <h4 className="font-bold text-brand-purple mb-4 text-sm uppercase tracking-wide border-b border-violet-200 pb-2">Individual</h4>
                        <div className="space-y-1">
                            <FieldRequirementToggle disabled={!isEditing} label="Nume & Prenume" value={formConfig.fieldRequirements.individual_name} onChange={v => updateFieldReq('individual_name', v)} />
                            <FieldRequirementToggle disabled={!isEditing} label="Vârstă (Categorie)" value={formConfig.fieldRequirements.individual_age} onChange={v => updateFieldReq('individual_age', v)} />
                            <FieldRequirementToggle disabled={!isEditing} label="Vârstă Exactă (Ani)" value={formConfig.fieldRequirements.individual_exact_age} onChange={v => updateFieldReq('individual_exact_age', v)} />
                            <FieldRequirementToggle disabled={!isEditing} label="Profesor" value={formConfig.fieldRequirements.individual_professor} onChange={v => updateFieldReq('individual_professor', v)} />
                            <FieldRequirementToggle disabled={!isEditing} label="Școală" value={formConfig.fieldRequirements.individual_school} onChange={v => updateFieldReq('individual_school', v)} />
                        </div>
                    </div>

                    {/* Grup */}
                    <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 shadow-sm">
                        <h4 className="font-bold text-brand-pink mb-4 text-sm uppercase tracking-wide border-b border-pink-200 pb-2">Grup</h4>
                        <div className="space-y-1">
                            <FieldRequirementToggle color="pink" disabled={!isEditing} label="Nume Grup" value={formConfig.fieldRequirements.group_name} onChange={v => updateFieldReq('group_name', v)} />
                            <FieldRequirementToggle color="pink" disabled={!isEditing} label="Nr. Membri" value={formConfig.fieldRequirements.group_members} onChange={v => updateFieldReq('group_members', v)} />
                            <FieldRequirementToggle color="pink" disabled={!isEditing} label="Vârstă (Medie/Categorie)" value={formConfig.fieldRequirements.group_age} onChange={v => updateFieldReq('group_age', v)} />
                            <FieldRequirementToggle color="pink" disabled={!isEditing} label="Instituție" value={formConfig.fieldRequirements.group_school} onChange={v => updateFieldReq('group_school', v)} />
                        </div>
                    </div>

                    {/* Contact & Piese */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Contact & Piese</h4>
                        <div className="space-y-1">
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Nume Contact" value={formConfig.fieldRequirements.contact_name} onChange={v => updateFieldReq('contact_name', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Telefon Contact" value={formConfig.fieldRequirements.contact_phone} onChange={v => updateFieldReq('contact_phone', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Email Contact" value={formConfig.fieldRequirements.contact_email} onChange={v => updateFieldReq('contact_email', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Județ" value={formConfig.fieldRequirements.billing_county} onChange={v => updateFieldReq('billing_county', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Localitate/Sector" value={formConfig.fieldRequirements.billing_city} onChange={v => updateFieldReq('billing_city', v)} />
                            <FieldRequirementToggle color="gray" disabled={!isEditing} label="Adresă" value={formConfig.fieldRequirements.billing_address} onChange={v => updateFieldReq('billing_address', v)} />
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <FieldRequirementToggle color="blue" disabled={!isEditing} label="Secțiune Piesă" value={formConfig.fieldRequirements.piece_section} onChange={v => updateFieldReq('piece_section', v)} />
                                <FieldRequirementToggle color="blue" disabled={!isEditing} label="Nume Piesă" value={formConfig.fieldRequirements.piece_name} onChange={v => updateFieldReq('piece_name', v)} />
                                <FieldRequirementToggle color="blue" disabled={!isEditing} label="Artist Original" value={formConfig.fieldRequirements.piece_artist} onChange={v => updateFieldReq('piece_artist', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: AGE CATEGORIES */}
            <section className="space-y-6">
                <h3 className="font-black text-lg text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">2. Categorii de Vârstă</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800">Categorii Individual</h4>
                            <button disabled={!isEditing} onClick={() => handleAddCategory('individual')} className="text-xs font-bold text-brand-purple hover:underline">+ Adaugă Categorie</button>
                        </div>
                        <div className="space-y-2">
                            {formConfig.ageCategoriesIndividual.map((cat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        disabled={!isEditing}
                                        value={cat}
                                        onChange={(e) => handleUpdateCategory('individual', idx, e.target.value)}
                                        className="flex-grow p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-brand-purple outline-none"
                                    />
                                    {isEditing && <button onClick={() => handleRemoveCategory('individual', idx)} className="p-2 text-red-400 hover:text-red-600">✕</button>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800">Categorii Grup</h4>
                            <button disabled={!isEditing} onClick={() => handleAddCategory('group')} className="text-xs font-bold text-brand-pink hover:underline">+ Adaugă Categorie</button>
                        </div>
                        <div className="space-y-2">
                            {formConfig.ageCategoriesGroup.map((cat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        disabled={!isEditing}
                                        value={cat}
                                        onChange={(e) => handleUpdateCategory('group', idx, e.target.value)}
                                        className="flex-grow p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-brand-pink outline-none"
                                    />
                                    {isEditing && <button onClick={() => handleRemoveCategory('group', idx)} className="p-2 text-red-400 hover:text-red-600">✕</button>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: MUSIC SECTIONS */}
            <section className="space-y-6">
                <div className="flex justify-between items-center border-l-4 border-brand-yellow pl-3">
                    <h3 className="font-black text-lg text-brand-dark uppercase tracking-widest">3. Secțiuni Muzicale</h3>
                    <button disabled={!isEditing} onClick={handleAddSection} className="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-black transition-all">
                        + Adaugă Secțiune Nouă
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formConfig.musicSections.map((sec, idx) => (
                        <div key={sec.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 relative group animate-fade-in">
                            {isEditing && (
                                <button onClick={() => handleRemoveSection(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            )}
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nume Secțiune</label>
                                    <input 
                                        disabled={!isEditing}
                                        value={sec.label}
                                        onChange={(e) => handleUpdateSection(idx, 'label', e.target.value)}
                                        className="w-full p-2 font-bold text-gray-800 border-b-2 border-transparent focus:border-brand-purple outline-none bg-transparent"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                                    <button 
                                        disabled={!isEditing}
                                        onClick={() => handleUpdateSection(idx, 'availableForGroup', !sec.availableForGroup)}
                                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${sec.availableForGroup ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                    >
                                        Grupuri {sec.availableForGroup ? 'DA' : 'NU'}
                                    </button>
                                    <button 
                                        disabled={!isEditing}
                                        onClick={() => handleUpdateSection(idx, 'isInstrument', !sec.isInstrument)}
                                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${sec.isInstrument ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                    >
                                        Instrument {sec.isInstrument ? 'DA' : 'NU'}
                                    </button>
                                    <button 
                                        disabled={!isEditing}
                                        onClick={() => handleUpdateSection(idx, 'requiresFile', !sec.requiresFile)}
                                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${sec.requiresFile ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                    >
                                        Negativ {sec.requiresFile ? 'DA' : 'NU'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FormConfigPage;
