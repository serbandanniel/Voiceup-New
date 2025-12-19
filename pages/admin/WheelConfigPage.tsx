
import React, { useState, useEffect } from 'react';
import { WheelConfig, WheelSegment } from '../../types';
import { DEFAULT_WHEEL_CONFIG } from '../../config';
import WheelOfFortune from '../../components/WheelOfFortune';
import { useNotification, EmojiInput, AdminPageHeader } from '../../components/admin';

// --- MODAL COMPONENT FOR SEGMENT EDITING ---
const SegmentEditModal: React.FC<{ 
    segment: WheelSegment, 
    index: number, 
    onClose: () => void,
    onUpdate: (field: keyof WheelSegment, val: any) => void 
}> = ({ segment, index, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'visual' | 'logic' | 'result'>('visual');

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: segment.color }}></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Editare Segment #{index + 1}</h3>
                            <p className="text-xs text-gray-500 font-mono uppercase">{segment.type}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-100 bg-white px-4 overflow-x-auto">
                    {[
                        { id: 'visual', label: '🎨 Vizual' },
                        { id: 'logic', label: '⚙️ Logică' },
                        { id: 'result', label: '🏆 Mesaj Câștig' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-50/50">
                    {activeTab === 'visual' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Text Afișat pe Roată</label>
                                <EmojiInput 
                                    value={segment.label}
                                    onChange={val => onUpdate('label', val)}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-lg font-bold shadow-sm focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 bg-white"
                                    placeholder="ex: 10% 🎁"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Culoare Felie</label>
                                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                        <input type="color" value={segment.color} onChange={e => onUpdate('color', e.target.value)} className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent" />
                                        <span className="text-sm font-mono text-gray-600">{segment.color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Culoare Text</label>
                                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                        <input type="color" value={segment.textColor} onChange={e => onUpdate('textColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent" />
                                        <span className="text-sm font-mono text-gray-600">{segment.textColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logic' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tip Segment</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { val: 'loss', label: 'Pierdere', activeClass: 'bg-gray-800 text-white border-gray-900 ring-gray-300', inactiveClass: 'bg-white text-gray-600 border-gray-200' },
                                        { val: 'discount', label: 'Reducere', activeClass: 'bg-blue-600 text-white border-blue-700 ring-blue-300', inactiveClass: 'bg-white text-blue-600 border-blue-200' },
                                        { val: 'free', label: 'Gratuit', activeClass: 'bg-yellow-500 text-white border-yellow-600 ring-yellow-300', inactiveClass: 'bg-white text-yellow-600 border-yellow-200' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.val}
                                            onClick={() => onUpdate('type', opt.val)}
                                            className={`p-3 rounded-xl border-2 font-bold text-sm transition-all shadow-sm ${segment.type === opt.val ? `ring-2 ring-offset-1 ${opt.activeClass}` : `hover:bg-gray-50 ${opt.inactiveClass}`}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Probabilitate (Weight)</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range"
                                        min="0" max="100"
                                        value={segment.probabilityWeight}
                                        onChange={e => onUpdate('probabilityWeight', parseInt(e.target.value))}
                                        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                                    />
                                    <input 
                                        type="number"
                                        min="0"
                                        value={segment.probabilityWeight}
                                        onChange={e => onUpdate('probabilityWeight', parseInt(e.target.value))}
                                        className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Valoare mai mare = Șansă mai mare</p>
                            </div>
                            {segment.type !== 'loss' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cod Voucher (Opțional)</label>
                                    <input 
                                        type="text"
                                        value={segment.code || ''}
                                        onChange={e => onUpdate('code', e.target.value.toUpperCase())}
                                        placeholder="Ex: PROMO10"
                                        className="w-full p-3 border border-gray-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'result' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mesaj Principal Câștig/Pierdere</label>
                                <EmojiInput 
                                    value={segment.resultText || ''}
                                    onChange={val => onUpdate('resultText', val)}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-brand-purple outline-none text-gray-900 bg-white"
                                    placeholder={segment.type === 'loss' ? "Mai încearcă!" : "Ai câștigat!"}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Culoare Mesaj</label>
                                    <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                        <input type="color" value={segment.resultColor || '#000000'} onChange={e => onUpdate('resultColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent" />
                                        <span className="text-sm font-mono text-gray-600">{segment.resultColor || '#000000'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stil Text</label>
                                    <label className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
                                        <input 
                                            type="checkbox" 
                                            checked={segment.resultIsBold} 
                                            onChange={e => onUpdate('resultIsBold', e.target.checked)} 
                                            className="w-5 h-5 text-brand-purple focus:ring-brand-purple rounded"
                                        />
                                        <span className="text-sm font-bold text-gray-700">Text Îngroșat (Bold)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-brand-purple text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 transition-all">
                        Salvează Segmentul
                    </button>
                </div>
            </div>
        </div>
    );
};

const WheelConfigPage: React.FC = () => {
    const [config, setConfig] = useState<WheelConfig>(DEFAULT_WHEEL_CONFIG);
    const [isEditing, setIsEditing] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState<'general' | 'segments'>('general');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [editingSegment, setEditingSegment] = useState<{ index: number, data: WheelSegment } | null>(null);
    const { showNotification } = useNotification();
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('wheelConfig');
        if (stored) {
            try { setConfig(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('wheelConfig', JSON.stringify(config));
        showNotification('Setările Roții Norocului au fost salvate!', 'success');
        setSaveStatus('Salvat!');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleCancel = () => {
        const stored = localStorage.getItem('wheelConfig');
        if (stored) setConfig(JSON.parse(stored));
        else setConfig(DEFAULT_WHEEL_CONFIG);
        setIsEditing(false);
    };

    const handleUpdateSegment = (index: number, field: keyof WheelSegment, val: any) => {
        const newSegments = [...config.segments];
        newSegments[index] = { ...newSegments[index], [field]: val };
        setConfig({ ...config, segments: newSegments });
        
        // Update modal state if open
        if (editingSegment && editingSegment.index === index) {
            setEditingSegment({ index, data: newSegments[index] });
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <AdminPageHeader 
                title="Configurare Roata Norocului"
                description="Gestionează premiile, probabilitățile și aspectul roții."
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                saveStatus={saveStatus}
            />

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-1">
                <button 
                    onClick={() => setActiveMainTab('general')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'general' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    ⚙️ General & Preview
                </button>
                <button 
                    onClick={() => setActiveMainTab('segments')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'segments' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    🍰 Segmente Roată ({config.segments.length})
                </button>
            </div>

            {/* TAB CONTENT: GENERAL & PREVIEW */}
            {activeMainTab === 'general' && (
                <div className="space-y-8 animate-fade-in">
                    {/* SETTINGS SECTION (TOP) */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Setări Generale</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                            {/* Activare */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">Activare Modul</label>
                                <button disabled={!isEditing} onClick={() => setConfig({...config, enabled: !config.enabled})} className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Test Mode */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">Mod Test Admin</label>
                                <button disabled={!isEditing} onClick={() => setConfig({...config, adminTestMode: !config.adminTestMode})} className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${config.adminTestMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${config.adminTestMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                                <span className="text-[10px] text-gray-500">Permite rotiri nelimitate</span>
                            </div>

                            {/* Trigger Position */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">Poziție Trigger</label>
                                <div className="flex gap-2">
                                    <button disabled={!isEditing} onClick={() => setConfig({...config, triggerPosition: 'left'})} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${config.triggerPosition === 'left' ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-300'}`}>Stânga</button>
                                    <button disabled={!isEditing} onClick={() => setConfig({...config, triggerPosition: 'right'})} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${config.triggerPosition === 'right' ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-300'}`}>Dreapta</button>
                                </div>
                            </div>

                            {/* Trigger Text */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">Text Buton Trigger</label>
                                <EmojiInput 
                                    disabled={!isEditing} 
                                    value={config.buttonText} 
                                    onChange={val => setConfig({...config, buttonText: val})} 
                                    className="w-full p-2 border rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-brand-purple outline-none text-gray-900" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* PREVIEW SECTION (BOTTOM - FULL WIDTH) */}
                    <div className="relative bg-gray-100 rounded-2xl border-4 border-gray-300 overflow-hidden flex flex-col shadow-inner min-h-[700px]">
                        {/* Preview Toolbar */}
                        <div className="bg-gray-200 border-b border-gray-300 p-2 flex justify-center gap-4 z-20">
                            <button 
                                onClick={() => setPreviewDevice('desktop')}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition-colors ${previewDevice === 'desktop' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Desktop
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('mobile')}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition-colors ${previewDevice === 'mobile' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                Mobil
                            </button>
                        </div>

                        <div className="flex-grow relative flex items-center justify-center bg-gray-200 overflow-hidden">
                            {/* Simulation Container */}
                            <div className={`relative transition-all duration-300 ease-in-out bg-white border border-gray-200 shadow-xl overflow-hidden ${previewDevice === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800' : 'w-full h-full'}`}>
                                {/* Wheel Component in Preview Mode */}
                                <div className="transform origin-center pointer-events-auto h-full w-full">
                                    <WheelOfFortune previewConfig={config} previewMode={previewDevice} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: SEGMENTS */}
            {activeMainTab === 'segments' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {config.segments.map((seg, idx) => (
                            <div key={idx} className="flex flex-col gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:border-brand-pink transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-md flex-shrink-0" style={{ backgroundColor: seg.color, color: seg.textColor }}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-gray-800 truncate text-lg">{seg.label}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                            seg.type === 'loss' ? 'bg-gray-100 text-gray-500 border-gray-200' : 
                                            seg.type === 'free' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                            {seg.type}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                    <div>
                                        <span className="block font-bold">Probabilitate:</span>
                                        {seg.probabilityWeight}%
                                    </div>
                                    <div>
                                        <span className="block font-bold">Cod:</span>
                                        {seg.code || '-'}
                                    </div>
                                </div>

                                <button 
                                    disabled={!isEditing}
                                    onClick={() => setEditingSegment({ index: idx, data: seg })}
                                    className="mt-auto w-full py-2 bg-brand-purple/5 hover:bg-brand-purple hover:text-white text-brand-purple font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    Editează Segment
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Segment Edit Modal */}
            {isEditing && editingSegment && (
                <SegmentEditModal 
                    segment={editingSegment.data} 
                    index={editingSegment.index} 
                    onClose={() => setEditingSegment(null)} 
                    onUpdate={(field, val) => handleUpdateSegment(editingSegment.index, field, val)} 
                />
            )}
        </div>
    );
};

export default WheelConfigPage;
